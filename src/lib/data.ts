import { createClient } from '@supabase/supabase-js';

// Servicios, barberos y horarios salen de la base de la app de turnos (Supabase).
// Se leen al compilar: cuando cambian los datos, un trigger de Supabase
// llama al deploy hook de Vercel (ver docs/publicacion-web.md).
// Sin variables de entorno, la web usa los datos provisorios de abajo.
//
// La web no lee las tablas `servicio` y `barbero` (tienen PIN, email y
// comisiones). Lee vistas que exponen solo columnas públicas, ya
// filtradas por la barbería de Kingsai (y por `activo` donde existe):
//   web_servicios (nombre, precio en pesos)
//   web_barberos  (nombre)
//   web_horarios  (dia_semana 0-6 con 0 = domingo, hora_inicio, hora_fin)

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

/** Una franja de atención, en el formato de schema.org OpeningHoursSpecification. */
export interface Horario {
  days: string[];
  label: string;
  opens: string;
  closes: string;
}

const VISTAS = {
  servicios: 'web_servicios',
  barberos: 'web_barberos',
  horarios: 'web_horarios',
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

// Semana de lunes a domingo. `dow` es el dia_semana de la app (0 = domingo;
// se acepta también 7 = domingo).
const DIAS = [
  { dow: 1, schema: 'Monday', nombre: 'lunes', plural: 'lunes' },
  { dow: 2, schema: 'Tuesday', nombre: 'martes', plural: 'martes' },
  { dow: 3, schema: 'Wednesday', nombre: 'miércoles', plural: 'miércoles' },
  { dow: 4, schema: 'Thursday', nombre: 'jueves', plural: 'jueves' },
  { dow: 5, schema: 'Friday', nombre: 'viernes', plural: 'viernes' },
  { dow: 6, schema: 'Saturday', nombre: 'sábado', plural: 'sábados' },
  { dow: 0, schema: 'Sunday', nombre: 'domingo', plural: 'domingos' },
];

const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** "Sábados", "Lunes y martes", "Lunes a viernes". */
function etiquetaDias(dias: typeof DIAS): string {
  const primero = dias[0];
  const ultimo = dias[dias.length - 1];
  if (dias.length === 1) return mayuscula(primero.plural);
  if (dias.length === 2) return `${mayuscula(primero.nombre)} y ${ultimo.nombre}`;
  return `${mayuscula(primero.nombre)} a ${ultimo.nombre}`;
}

type Franja = { opens: string; closes: string };

/** Agrupa días seguidos con las mismas franjas; los días cerrados no se listan. */
function agruparHorarios(filas: { dia: number; opens: string; closes: string }[]): Horario[] {
  const porDia = DIAS.map((d) => ({
    dia: d,
    franjas: filas
      .filter((f) => f.dia % 7 === d.dow)
      .map(({ opens, closes }): Franja => ({ opens, closes }))
      .sort((a, b) => a.opens.localeCompare(b.opens)),
  }));
  const clave = (franjas: Franja[]) => franjas.map((f) => `${f.opens}-${f.closes}`).join(',');

  const grupos: { dias: typeof DIAS; franjas: Franja[] }[] = [];
  for (const { dia, franjas } of porDia) {
    const anterior = grupos[grupos.length - 1];
    const seguido = anterior && anterior.dias[anterior.dias.length - 1] === DIAS[DIAS.indexOf(dia) - 1];
    if (!franjas.length) continue;
    if (seguido && clave(anterior.franjas) === clave(franjas)) anterior.dias.push(dia);
    else grupos.push({ dias: [dia], franjas });
  }

  return grupos.flatMap(({ dias, franjas }) =>
    franjas.map((f) => ({ days: dias.map((d) => d.schema), label: etiquetaDias(dias), ...f })),
  );
}

let cacheHorarios: Promise<Horario[]> | undefined;

/** Horario de atención del local. Sin variables de entorno: lista vacía (la web no muestra horarios). */
export function getHorarios(): Promise<Horario[]> {
  cacheHorarios ??= (async () => {
    const db = cliente();
    if (!db) return [];
    const { data, error } = await db.from(VISTAS.horarios).select('dia_semana, hora_inicio, hora_fin');
    if (error) falla(VISTAS.horarios, error.message);
    // Una lista vacía es válida: la barbería todavía no cargó horarios.
    return agruparHorarios(
      (data ?? []).map((h) => ({
        dia: h.dia_semana,
        opens: String(h.hora_inicio).slice(0, 5),
        closes: String(h.hora_fin).slice(0, 5),
      })),
    );
  })();
  return cacheHorarios;
}

const ARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

export function formatPrecio(precio: number | null): string {
  return precio == null ? 'Consultar' : ARS.format(precio);
}
