// Datos fijos de la barbería. Nombre, dirección y teléfono tienen que coincidir
// exactamente con la ficha de Google (SEO local).

const BOOKING_BASE = 'https://kingsaistudio.setmore.com/';
// Cuando la app propia esté lista:
// const BOOKING_BASE = 'https://kingsaistudio.barbermanager.app/turnos';

/** Link de reserva con UTM, para saber desde qué parte de la web vino cada turno. */
export function bookingUrl(campaign: string): string {
  const url = new URL(BOOKING_BASE);
  url.searchParams.set('utm_source', 'web');
  url.searchParams.set('utm_medium', 'boton');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

export const SITE = {
  name: 'Kingsai Studio',
  tagline: 'Barbería en Pilar',
  address: {
    street: 'Golf Club Necochea 3061',
    postalCode: 'B1669',
    locality: 'Pilar',
    region: 'Provincia de Buenos Aires',
    country: 'AR',
  },
  // [COMPLETAR] coordenadas exactas desde la ficha de Google.
  geo: null as { lat: number; lng: number } | null,
  // Sin WhatsApp por ahora. Formato internacional sin espacios, ej. 5491123456789.
  whatsapp: null as string | null,
  instagram: 'https://www.instagram.com/kingsai.studio/' as string | null,
  // [COMPLETAR] link corto de la ficha ("Pedir reseñas" / "Compartir").
  googleMaps: 'https://www.google.com/maps/search/?api=1&query=Kingsai+Studio+Golf+Club+Necochea+3061+Pilar',
  // [COMPLETAR] Días en formato schema.org y horario 24 h.
  hours: [] as { days: string; label: string; opens: string; closes: string }[],
};

export const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.locality}, ${SITE.address.region}`;
