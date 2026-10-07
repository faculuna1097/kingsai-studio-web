# Publicación de la web

La web está publicada en **Vercel** (`vercel.json`: framework Astro, salida `dist`). Lee servicios y barberos de la base de la app de turnos (Supabase) **al compilar**, así que cada cambio de datos necesita un deploy nuevo. Ver `src/lib/data.ts`.

## Estado actual (oct-2026)

- **Supabase:**
  - Las vistas `public.web_servicios` (nombre, precio) y `public.web_barberos` (nombre) están filtradas por la barbería de Kingsai (`tenant_id = a1b2c3d4-0000-0000-0000-000000000001`) y por `activo`.
  - El rol `anon` solo tiene SELECT sobre esas dos vistas. Las tablas siguen cerradas: tienen RLS activado y ninguna política.
- **Vercel:** las variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` ya están cargadas y el build lee las vistas.
- **Actualización automática:** se configura con la sección 2.

## 1. Variables de entorno en Vercel

Settings → Environment Variables:

| Variable | Qué va |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase (Project Settings → API) |
| `SUPABASE_ANON_KEY` | La **anon / publishable** key. **Nunca** la `service_role`. |

Si falta una de las dos, el build falla a propósito. Sin ninguna, la web sale con los datos provisorios. Si el build falla con `Supabase (web_servicios)` o `Supabase (web_barberos)`, revisar las variables y que las vistas existan.

## 2. Actualización automática

Supabase llama al deploy hook de Vercel cuando, **en Kingsai**, cambia algo que la web muestra:

- **`servicio`:** alta, baja, o cambio de `nombre`, `precio` o `activo`.
- **`barbero`:** alta, baja, o cambio de `nombre` o `activo`.

No dispara con:
- cambios de PIN, email, comisión, `token_version` ni otras columnas;
- cambios de otras barberías;
- cambios de servicios o barberos que están y siguen inactivos, porque no se ven en la web.

### Cómo funciona

- **Triggers por sentencia** (`for each statement`) con tablas de transición. Si una misma sentencia toca muchas filas (por ejemplo, subir todos los precios con un solo `update`), sale **un** solo deploy.
- **Una función** (`public.web_deploy_kingsai`) mira las filas afectadas y llama al hook solo si cambió algo visible de Kingsai.
- **La URL del hook vive en Vault** (`kingsai_deploy_hook`). No está en el SQL ni en el repo, y la función la lee de `vault.decrypted_secrets`.
- **La función es `SECURITY DEFINER`** con `search_path` vacío: corre con los permisos de su dueño y no la afecta el `search_path` de quien escribe. `anon` y `authenticated` no tienen EXECUTE sobre ella. Los triggers la ejecutan igual, porque Postgres no pide EXECUTE a quien dispara un trigger.
- **`pg_net` es asíncrono:** `net.http_post` solo encola el pedido y el POST sale después, fuera de la transacción. Si Vercel falla o tarda, la operación de la app de turnos no se entera. Si falta el secreto o `pg_net` da un error, la función solo deja un `warning` y la escritura sigue normal.

**Por qué no hay más anti-rebote.** Si la app guarda cada servicio con una sentencia distinta, cada guardado dispara su deploy. Juntar esos cambios en uno requeriría `pg_cron`, una tabla de pendientes y un job que corra cada minuto, para cambios de precio que pasan pocas veces al año. Los deploys de más son inofensivos: cada uno lee la base al compilar y el último siempre publica los datos finales. Lo único que cuestan son minutos de build.

> Los triggers por sentencia con tablas de transición no admiten `update of <columnas>` ni varios eventos en el mismo trigger. Por eso son tres triggers por tabla (insert, update, delete) y el filtro de columnas está dentro de la función.

### 2.1 Crear el deploy hook en Vercel

1. Proyecto → **Settings → Git → Deploy Hooks**.
2. Nombre: `supabase-datos`. Rama: `main`. **Create Hook**.
3. Copiar la URL. **Es secreta:** cualquiera que la tenga puede disparar deploys. No va en el chat, en el repo ni en archivos. Se usa solo en el paso 2.3.

Si alguna vez se filtra: borrar el hook en esa misma pantalla, crear otro y actualizar el secreto (paso 2.3).

### 2.2 Habilitar pg_net

Por el panel: **Database → Extensions → `pg_net` → Enable**. O en el SQL Editor:

```sql
create extension if not exists pg_net;

-- Verificación: tienen que aparecer pg_net y supabase_vault
select extname, extversion from pg_extension where extname in ('pg_net', 'supabase_vault');
```

### 2.3 Guardar la URL del hook en Vault

**Opción recomendada, por el panel:** Supabase → **Integrations → Vault** → **Add new secret**. En proyectos más viejos está en Project Settings → Vault.
- Name: `kingsai_deploy_hook`
- Secret: la URL del deploy hook
- Description: `Deploy hook de Vercel para la web de Kingsai`

Así la URL no queda en el historial del SQL Editor.

**Opción por SQL:** reemplazar el placeholder en el SQL Editor, correrlo y **no guardar el snippet**. Después borrarlo del historial si quedó guardado.

```sql
select vault.create_secret(
  'PEGÁ_ACÁ_LA_URL_DEL_DEPLOY_HOOK',               -- se reemplaza en Supabase, nunca en el repo
  'kingsai_deploy_hook',
  'Deploy hook de Vercel para la web de Kingsai'
);
```

Para verificar que quedó cargado sin ver la URL:

```sql
select name, created_at, updated_at from vault.secrets where name = 'kingsai_deploy_hook';
```

Para cambiar la URL más adelante (por ejemplo, si se rota el hook):

```sql
select vault.update_secret(
  (select id from vault.secrets where name = 'kingsai_deploy_hook'),
  'PEGÁ_ACÁ_LA_URL_NUEVA'
);
```

### 2.4 Función y triggers

```sql
-- ============================================================
-- Función: decide si el cambio afecta la web y, si es así,
-- encola un POST al deploy hook de Vercel (asíncrono, pg_net).
-- ============================================================
create or replace function public.web_deploy_kingsai()
returns trigger
language plpgsql
security definer          -- corre como su dueño: puede leer Vault y usar pg_net
set search_path = ''      -- todo va calificado con su esquema; nada depende del search_path
as $$
declare
  c_tenant constant uuid := 'a1b2c3d4-0000-0000-0000-000000000001';  -- Kingsai
  v_cambio boolean := false;
  v_url    text;
begin
  -- filas_nuevas / filas_viejas son las tablas de transición de la sentencia
  if tg_op = 'INSERT' then
    -- Alta de un servicio o barbero activo de Kingsai
    select exists (
      select 1 from filas_nuevas n
      where n.tenant_id = c_tenant and n.activo is true
    ) into v_cambio;

  elsif tg_op = 'DELETE' then
    -- Baja de un servicio o barbero que se veía en la web
    select exists (
      select 1 from filas_viejas o
      where o.tenant_id = c_tenant and o.activo is true
    ) into v_cambio;

  elsif tg_table_name = 'servicio' then
    -- Update de servicio: solo importan nombre, precio y activo
    select exists (
      select 1
      from filas_viejas o
      join filas_nuevas n on n.id = o.id
      where c_tenant in (o.tenant_id, n.tenant_id)
        and (o.activo is true or n.activo is true)
        and (o.nombre is distinct from n.nombre
          or o.precio is distinct from n.precio
          or o.activo is distinct from n.activo)
    ) into v_cambio;

  elsif tg_table_name = 'barbero' then
    -- Update de barbero: solo importan nombre y activo (no PIN, email, comisión, token_version)
    select exists (
      select 1
      from filas_viejas o
      join filas_nuevas n on n.id = o.id
      where c_tenant in (o.tenant_id, n.tenant_id)
        and (o.activo is true or n.activo is true)
        and (o.nombre is distinct from n.nombre
          or o.activo is distinct from n.activo)
    ) into v_cambio;
  end if;

  if not v_cambio then
    return null;
  end if;

  select ds.decrypted_secret into v_url
  from vault.decrypted_secrets ds
  where ds.name = 'kingsai_deploy_hook';

  if v_url is null then
    raise warning 'web_deploy_kingsai: falta el secreto kingsai_deploy_hook en Vault';
    return null;
  end if;

  -- Solo encola el pedido: el POST sale después, fuera de esta transacción.
  -- Cualquier error acá se reduce a un warning y no frena la escritura de la app.
  begin
    -- Vercel tarda más de 5 s (el default de pg_net) en responder al hook
    perform net.http_post(url := v_url, body := '{}'::jsonb, timeout_milliseconds := 30000);
  exception when others then
    raise warning 'web_deploy_kingsai: no se pudo encolar el deploy (%)', sqlerrm;
  end;

  return null;
end;
$$;

-- Nadie la puede llamar desde la API; los triggers la ejecutan igual.
revoke execute on function public.web_deploy_kingsai() from public, anon, authenticated;

-- ============================================================
-- Triggers por sentencia: uno por evento y por tabla.
-- ============================================================

-- servicio
create trigger web_deploy_servicio_insert
after insert on public.servicio
referencing new table as filas_nuevas
for each statement execute function public.web_deploy_kingsai();

create trigger web_deploy_servicio_update
after update on public.servicio
referencing old table as filas_viejas new table as filas_nuevas
for each statement execute function public.web_deploy_kingsai();

create trigger web_deploy_servicio_delete
after delete on public.servicio
referencing old table as filas_viejas
for each statement execute function public.web_deploy_kingsai();

-- barbero
create trigger web_deploy_barbero_insert
after insert on public.barbero
referencing new table as filas_nuevas
for each statement execute function public.web_deploy_kingsai();

create trigger web_deploy_barbero_update
after update on public.barbero
referencing old table as filas_viejas new table as filas_nuevas
for each statement execute function public.web_deploy_kingsai();

create trigger web_deploy_barbero_delete
after delete on public.barbero
referencing old table as filas_viejas
for each statement execute function public.web_deploy_kingsai();

-- Verificación: tienen que aparecer los 6 triggers
select event_object_table as tabla, trigger_name, event_manipulation as evento
from information_schema.triggers
where trigger_name like 'web_deploy_%'
order by 1, 2;
```

### 2.5 Probar

1. **En la app de turnos:** cambiar el precio de un servicio de Kingsai. Conviene usar un cambio real que haya que hacer igual; si no, cambiarlo y volverlo al original, lo que dispara dos deploys.
2. **En Supabase (SQL Editor):** ver la respuesta de Vercel. Las respuestas se guardan unas 6 horas.

   ```sql
   select id, created, status_code, timed_out, error_msg, left(content, 200) as respuesta
   from net._http_response
   order by created desc
   limit 5;
   ```

   - **Bien:** `status_code` 201 (o 200) y en `respuesta` un JSON con `"job"` y `"state":"PENDING"`.
   - **`error_msg` "Timeout of … ms reached" con el deploy creado igual:** Vercel recibió el pedido, pero respondió después del límite de pg_net. La función usa 30 s por eso; si vuelve a pasar, subir `timeout_milliseconds`.
   - **`status_code` 404:** el hook no existe o la URL está mal. Revisar el secreto.
   - **Sin filas nuevas:** el trigger no disparó. Revisar que el servicio sea de Kingsai y esté activo, y los warnings en Supabase (Logs → Postgres).
3. **En Vercel:** pestaña **Deployments**. Tiene que aparecer un deploy nuevo de `main` que diga que vino del deploy hook `supabase-datos`. Cuando termine, el precio nuevo tiene que estar en la web.
4. **Prueba negativa (opcional):** cambiar algo que no se ve, como el email o la comisión de un barbero. **No** tiene que aparecer una fila nueva en `net._http_response`.

### 2.6 Desactivar o revertir

**Apagarlo ya, sin tocar la base:** en Vercel, Settings → Git → Deploy Hooks → borrar `supabase-datos`. Los triggers siguen corriendo, pero Vercel responde 404 y no hay deploys. No afecta a la app.

**Pausarlo** (los triggers quedan creados):

```sql
alter table public.servicio disable trigger web_deploy_servicio_insert;
alter table public.servicio disable trigger web_deploy_servicio_update;
alter table public.servicio disable trigger web_deploy_servicio_delete;
alter table public.barbero  disable trigger web_deploy_barbero_insert;
alter table public.barbero  disable trigger web_deploy_barbero_update;
alter table public.barbero  disable trigger web_deploy_barbero_delete;
-- Para reactivarlo: lo mismo con "enable trigger".
```

**Revertir todo:**

```sql
drop trigger if exists web_deploy_servicio_insert on public.servicio;
drop trigger if exists web_deploy_servicio_update on public.servicio;
drop trigger if exists web_deploy_servicio_delete on public.servicio;
drop trigger if exists web_deploy_barbero_insert  on public.barbero;
drop trigger if exists web_deploy_barbero_update  on public.barbero;
drop trigger if exists web_deploy_barbero_delete  on public.barbero;
drop function if exists public.web_deploy_kingsai();
delete from vault.secrets where name = 'kingsai_deploy_hook';
-- pg_net puede quedar habilitado; si nada más lo usa: drop extension pg_net;
```

Las vistas `web_*` y los permisos de `anon` no se tocan en ninguno de estos pasos.
