import { createClient } from '@supabase/supabase-js';

// Servicios y barberos salen de la base de la app de turnos (Supabase).
// Se leen al compilar: cuando cambian los datos hay que volver a publicar
// (deploy hook disparado por un webhook de Supabase).
// Sin variables de entorno, la web usa los datos provisorios de abajo.
//
// La web no lee las tablas `servicio` y `barbero` (tienen PIN, email y
// comisiones). Lee dos vistas que exponen solo columnas públicas, ya
// filtradas por la barbería de Kingsai y por `activo`:
//   web_servicios (nombre, precio en pesos)
//   web_barberos  (nombre)

export interface Servicio {
  slug: string;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
}

export interface Barbero {
  nombre: string;
  rol: string | null;
  fotoUrl: string | null;
  instagram: string | null;
}

const VISTAS = {
  servicios: 'web_servicios',
  barberos: 'web_barberos',
};

// La app no guarda descripciones: se completan acá por slug del nombre.
const DESCRIPCIONES: Record<string, string> = {
  corte: 'Tijera o máquina, lavado y peinado.',
  fade: 'Degradado a piel, bajo, medio o alto.',
  'corte-y-barba': 'Corte completo y perfilado de barba con navaja.',
  'corte-barba': 'Corte completo y perfilado de barba con navaja.',
  barba: 'Perfilado, rebaje y toalla caliente.',
};

const FALLBACK_SERVICIOS: Servicio[] = [
  { slug: 'corte', nombre: 'Corte', descripcion: DESCRIPCIONES.corte, precio: null },
  { slug: 'fade', nombre: 'Fade', descripcion: DESCRIPCIONES.fade, precio: null },
  { slug: 'corte-y-barba', nombre: 'Corte y barba', descripcion: DESCRIPCIONES['corte-y-barba'], precio: null },
  { slug: 'barba', nombre: 'Barba', descripcion: DESCRIPCIONES.barba, precio: null },
];

const FALLBACK_BARBEROS: Barbero[] = [
  { nombre: 'Miguel', rol: null, fotoUrl: null, instagram: null },
  { nombre: 'Mateo', rol: null, fotoUrl: null, instagram: null },
];

function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cliente() {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY;
  if (!url && !key) return null;
  if (!url || !key) {
    throw new Error('Supabase: falta SUPABASE_URL o SUPABASE_ANON_KEY. Cargá las dos o ninguna (sin ninguna se usan los datos provisorios).');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Nunca incluye la clave: solo el mensaje de Supabase y una pista.
function falla(vista: string, detalle: string): never {
  throw new Error(
    `Supabase (${vista}): ${detalle}. Revisá que la vista exista y que el rol anon tenga SELECT sobre ella.`,
  );
}

let cacheServicios: Promise<Servicio[]> | undefined;
let cacheBarberos: Promise<Barbero[]> | undefined;

export function getServicios(): Promise<Servicio[]> {
  cacheServicios ??= (async () => {
    const db = cliente();
    if (!db) return FALLBACK_SERVICIOS;
    const { data, error } = await db
      .from(VISTAS.servicios)
      .select('nombre, precio')
      .order('precio')
      .order('nombre');
    if (error) falla(VISTAS.servicios, error.message);
    if (!data?.length) falla(VISTAS.servicios, 'no devolvió ningún servicio');
    return data.map((s) => {
      const slug = slugify(s.nombre);
      return {
        slug,
        nombre: s.nombre,
        descripcion: DESCRIPCIONES[slug] ?? null,
        precio: s.precio == null ? null : Number(s.precio),
      };
    });
  })();
  return cacheServicios;
}

export function getBarberos(): Promise<Barbero[]> {
  cacheBarberos ??= (async () => {
    const db = cliente();
    if (!db) return FALLBACK_BARBEROS;
    const { data, error } = await db.from(VISTAS.barberos).select('nombre').order('nombre');
    if (error) falla(VISTAS.barberos, error.message);
    if (!data?.length) falla(VISTAS.barberos, 'no devolvió ningún barbero');
    // La app no guarda rol, foto ni Instagram de los barberos.
    return data.map((b) => ({ nombre: b.nombre, rol: null, fotoUrl: null, instagram: null }));
  })();
  return cacheBarberos;
}

const ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export function formatPrecio(precio: number | null): string {
  return precio == null ? 'Consultar' : ARS.format(precio);
}
