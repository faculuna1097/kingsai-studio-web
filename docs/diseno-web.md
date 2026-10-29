# Diseño de la web

La dirección de marca, el público y los principios están en `PRODUCT.md`. Este documento registra cómo está armada la página y qué queda pendiente.

## Estructura de la home (oct-2026)

El header tiene el logo (que lleva al inicio) y los links Nosotros · Servicios · Barberos · Contacto. "Reservar" aparece en el header solo en la compu; en el celular va la barra fija de abajo. Al bajar, el link de la sección visible se enciende con un tubo de 1 px.

1. **Inicio:** video del local, nombre, Instagram (@ sacado de `SITE.instagram`), estado Abierta/Cerrada y botón Reservar. En la compu, el video nítido ocupa todo el alto y el mismo video, desenfocado, llena el fondo (copiado cuadro a cuadro en un `canvas`). Sin botón de pausa, por decisión tomada (ver `PRODUCT.md`).
2. **Nosotros:**
   - **El oficio** (`src/components/Oficio.astro`): el título "Fade. / Tijera. / Navaja.", la línea "Así se trabaja en Kingsai." y el link a Servicios. Al lado van dos videos verticales en cuadros de 1 px, a distinta altura, cada uno con su leyenda.
   - **Rotación:** hay 3 videos para 2 cuadros. Cada vez que la sección sale del todo de la pantalla, un cuadro (se turnan) cambia por el video que esperaba. Al volver, ese cuadro entra desenfocado y se aclara.
   - **Carga:** los videos se descargan recién cerca de la pantalla, corren solo mientras se ven y se pausan al salir. Sin botón de pausa (ver `PRODUCT.md`). Con movimiento reducido o ahorro de datos queda el póster.
   - **Archivos:** están en `public/media/oficio-*.mp4` con su póster `.jpg` (primer cuadro). Los originales del dueño están en `videos-originales/` y no se suben al repo.
   - **Cómo llegar:** la dirección "Manuel Alberti - Pilar" y el mapa propio.
3. **Servicios:** lista con precios desde la base.
4. **Barberos ("Quién te corta"):** cuadros flash con marco doble y dos destellos rojos. Sin foto, se ve la inicial; con foto, la foto entra en el marco. En el celular van 2 por fila (si queda uno solo, va centrado); en la compu, 3.
5. **Preguntas:** respuestas confirmadas por la barbería.
6. **Contacto:** estado, horarios, Reservar, Instagram, WhatsApp (cuando se cargue) y la dirección.

La dirección que se muestra en Cómo llegar es la forma de decirla en el barrio. La dirección exacta, con código postal, sigue en `src/config.ts` y es la que va a Google (datos estructurados): tiene que coincidir con la ficha de Google Maps.

## Pendientes

- **4.º video del dueño:** falta recibirlo. Cuando llegue, se comprime igual que los otros (H.264, sin audio, 30 fps, unos 0,7 MB) y se suma a la lista de `Oficio.astro`; la rotación lo toma sola.
- **Foto del local:** `src/assets/local.webp` quedó sin uso al salir la frase de Nosotros.
- **Fotos de los barberos:** conseguirlas y conectarlas (ver `docs/publicacion-web.md`, "Qué hace la web con esos datos").
- **Trabajos:** sección de cortes con fotos y videos. Se decide dónde va cuando haya material; nunca con fotos de stock.
- **Logo sin fondo:** `src/assets/logo-sin-fondo.png` (recortado del original, todavía sin usar). Las letras KINGSAI son casi negras y no se leen sobre el grafito: sirve para la figura central, no para el logo completo.
