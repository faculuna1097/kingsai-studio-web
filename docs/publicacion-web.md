# Publicación de la web: pendientes

Pasos que quedan para cuando la web se suba al hosting (Netlify o Vercel). Hasta entonces la web se compila a mano con `npx astro build`.

## Estado actual (oct-2026)

- La web lee servicios y barberos de la base de la app de turnos (Supabase) **al compilar**. Ver `src/lib/data.ts`.
- En Supabase ya existen las vistas `public.web_servicios` (nombre, precio) y `public.web_barberos` (nombre). Están filtradas por la barbería de Kingsai (`tenant_id = a1b2c3d4-0000-0000-0000-000000000001`) y por `activo`. El rol `anon` solo tiene SELECT sobre esas dos vistas. Las tablas siguen cerradas: tienen RLS activado y ninguna política.
- **Falta:** que la web se vuelva a publicar sola cuando cambian los datos (paso 3).

## 1. Variables de entorno en el hosting

En el panel del hosting (Netlify: Site configuration → Environment variables; Vercel: Settings → Environment Variables) cargar:

| Variable | Qué va |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase (Project Settings → API) |
| `SUPABASE_ANON_KEY` | La **anon / publishable** key. **Nunca** la `service_role`. |

Si falta una de las dos, el build falla a propósito. Sin ninguna, la web sale con los datos provisorios.

## 2. Primer deploy

Publicar y revisar que aparezcan los precios y los barberos reales. Si el build falla con `Supabase (web_servicios)` o `Supabase (web_barberos)`, revisar las variables y que las vistas existan.

## 3. Actualización automática (SQL 2)

Con esto la web se vuelve a publicar sola cuando, en la app de turnos:

- **Servicios:** cambia un precio, se agrega o borra un servicio, se activa o desactiva, o cambia de nombre.
- **Barberos:** se agrega o borra uno, se activa o desactiva, o cambia de nombre.

Los cambios de PIN, comisión, turnos y los de otras barberías **no** disparan nada.

### 3.1 Crear el deploy hook

- **Netlify:** Site configuration → Build & deploy → Build hooks → Add build hook.
- **Vercel:** Settings → Git → Deploy Hooks.

Te da una URL. Tratala como secreta: cualquiera que la tenga puede disparar deploys. No la pegues en el repo ni en el chat.

### 3.2 Activar pg_net

Supabase → Database → Extensions → `pg_net` → Enable.

### 3.3 Guardar la URL en Vault

En el SQL Editor, reemplazar el texto entre comillas por la URL y correr solo esto:

```sql
select vault.create_secret('PEGÁ_ACÁ_LA_URL_DEL_DEPLOY_HOOK', 'kingsai_deploy_hook');
```

### 3.4 Función y triggers

```sql
-- Llama al deploy hook solo si el cambio es de Kingsai
create or replace function public.web_disparar_deploy()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_tenant uuid := case when tg_op = 'DELETE' then old.tenant_id else new.tenant_id end;
begin
  if v_tenant = 'a1b2c3d4-0000-0000-0000-000000000001'::uuid then
    perform net.http_post(
      url  := (select decrypted_secret from vault.decrypted_secrets where name = 'kingsai_deploy_hook'),
      body := '{}'::jsonb
    );
  end if;
  return null;
end;
$$;

revoke all on function public.web_disparar_deploy() from public, anon, authenticated;

-- Servicios: alta, baja, y cambio de precio, nombre o activo
create trigger web_deploy_servicio_alta_baja
after insert or delete on public.servicio
for each row execute function public.web_disparar_deploy();

create trigger web_deploy_servicio_cambio
after update of precio, nombre, activo on public.servicio
for each row
when (old.precio is distinct from new.precio
   or old.nombre is distinct from new.nombre
   or old.activo is distinct from new.activo)
execute function public.web_disparar_deploy();

-- Barberos: alta, baja, y cambio de nombre o activo
create trigger web_deploy_barbero_alta_baja
after insert or delete on public.barbero
for each row execute function public.web_disparar_deploy();

create trigger web_deploy_barbero_cambio
after update of nombre, activo on public.barbero
for each row
when (old.nombre is distinct from new.nombre
   or old.activo is distinct from new.activo)
execute function public.web_disparar_deploy();
```

- **La función** la ejecutan solo los triggers. Nadie puede llamarla desde la API. Lee la URL de Vault y no devuelve nada.
- **`pg_net`** hace el POST en segundo plano: si el hosting tarda o falla, no traba el guardado en la app de turnos.
- **Si cambian varios precios juntos**, se dispara un deploy por cada servicio. El hosting los pone en cola y el último publica todo.

### 3.5 Probar

1. Cambiar un precio desde la app de turnos.
2. Verificar que aparezca un deploy nuevo en el hosting y, al terminar, el precio nuevo en la web.
3. Si no aparece, ver la respuesta de la llamada en el SQL Editor:

   ```sql
   select id, status_code, error_msg, created from net._http_response order by created desc limit 5;
   ```

### Para deshacerlo

```sql
drop trigger web_deploy_servicio_alta_baja on public.servicio;
drop trigger web_deploy_servicio_cambio on public.servicio;
drop trigger web_deploy_barbero_alta_baja on public.barbero;
drop trigger web_deploy_barbero_cambio on public.barbero;
drop function public.web_disparar_deploy();
```
