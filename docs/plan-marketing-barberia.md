# Plan: Google + marketing digital para la barbería

## Contexto
- **Cliente:** barbería en CABA/GBA. **Dueños: Miguel y Mateo.** La web la hacés vos aparte; acá solo entran los requisitos de SEO local que tiene que cumplir.
- **Hoy tiene:** ficha en Google Maps (no sabemos quién la administra), Instagram activo y WhatsApp común. Los turnos se toman con la web app que les hiciste (tiene link; por lo que marcaste, no guarda contacto ni manda mensajes). El contenido lo hacen los barberos y unos amigos que saben. Pauta: nada por ahora. Tu rol todavía no está definido, así que el plan incluye cómo paquetizarlo.
- **Objetivo:** que la barbería salga arriba en Maps cuando alguien busca en su barrio, que esas visitas terminen en un turno en tu app y que los clientes vuelvan. Todo medido por canal.
- **Tesis:** sin pauta y en una zona competitiva, lo que mueve la aguja es (1) una ficha de Google impecable, (2) un flujo constante de reseñas, (3) contenido regular y (4) tu app como centro: registra de dónde viene cada turno y automatiza reseñas y re-turnos. Esto último es una ventaja que la competencia no tiene.

```
DESCUBRIMIENTO            CONVERSIÓN                 POST-VISITA
Google Maps / Búsqueda ─┐                          ┌─ pedido de reseña ───→ mejor posición en Maps
Instagram / TikTok     ─┼─→ "Reservar" → TU APP ──┼─ recordatorio de re-turno → retención
QR / boca en boca      ─┘   (link con UTM)         └─ origen de cada turno ──→ reporte mensual
```

## Fase 0 — Kickoff y accesos (semana 1)
- **Brief:** nombre exacto (como figura en el cartel), dirección, WhatsApp, horarios y feriados, servicios con precio y duración, barberos, medios de pago, diferenciales, barrio principal y 2-3 vecinos a los que apuntar, y 3-5 competidores que hoy salen arriba en Maps.
- **Cuentas a nombre del cliente:** la cuenta de Google de la barbería es la propietaria de la ficha y el portfolio de Meta Business es de ellos; vos entrás como administrador. Nunca las crees en tu cuenta personal.
- **Ficha existente: no se crea una nueva, se traspasa.** Crear otra para el mismo local genera un duplicado: Google lo fusiona o suspende, el posicionamiento se parte y se pierden reseñas, fotos y antigüedad.
  - **Situación actual:** la ficha la creó Miguel con su cuenta personal de Google. Ya se tiene acceso.
  - **Decisión:** la propiedad principal pasa a una **cuenta de Google neutral de la barbería**, que no es de ninguno de los dos dueños ni de la agencia.
  1. **Crear la cuenta de la barbería** (ej. `barberia.nombre@gmail.com`), con celular y email de recuperación de uno de los dueños. Miguel y Mateo tienen la contraseña.
  2. **Desde la cuenta de Miguel:** en la ficha, ⋮ → Personas y acceso → Agregar → la cuenta de la barbería como **Propietario**. Desde la cuenta nueva, aceptar la invitación.
  3. **Transferir la propiedad principal** desde la cuenta de Miguel a la de la barbería. Si la opción aparece deshabilitada, Google puede exigir que la cuenta nueva lleve unos días como propietaria: esperar y reintentar.
  4. **Estructura final de permisos:**

     | Cuenta | Rol |
     |---|---|
     | Barbería (neutral) | Propietario principal |
     | Miguel y Mateo (personales) | Propietarios |
     | Agencia (KingsAI Studio) | Administrador |

     Se saca a cualquier otro usuario que nadie reconozca.
  5. **Revisión completa:** cargar todos los datos de nuevo con el Kit de Google, y buscar y reportar duplicados.
  - **Cuenta de la agencia:** `kingsaistudio@gmail.com` se borró (era una cuenta supervisada colgada de la de Miguel) y Google no permite volver a usar una dirección de Gmail borrada. Se crea una cuenta nueva de la agencia, idealmente con un email del dominio propio (ej. `hola@kingsaistudio.com`), independiente de cualquier cliente.
  - **Lo que no se borra ni siendo dueño:** las reseñas y las fotos que subió el público; solo se pueden responder o reportar si violan las políticas.
- **Línea base,** para poder mostrar resultados:
  - reseñas: cantidad y promedio;
  - métricas de la ficha de los últimos 6 meses, con los términos de búsqueda;
  - seguidores y alcance de Instagram;
  - turnos por mes en la app;
  - posición en Maps para 8-10 búsquedas ("barbería [barrio]", "barbería cerca", "corte hombre [barrio]", "fade [barrio]"…), medida desde el local y desde 2-3 puntos del barrio.
- Si el WhatsApp del local es el celular personal del dueño, conviene evaluar una línea dedicada.

## Fase 1 — Google → entregable 1: **Kit de Google**
**Ficha (Google Business Profile)**
- Nombre real, sin palabras clave agregadas (es causa de suspensión). Categoría principal "Barbería"; agregá secundarias solo si aplican de verdad.
- Descripción de hasta 750 caracteres, escrita natural: barrio, servicios y diferenciales. Cargá los servicios con descripción y precio, y los productos si venden (ceras, pomadas).
- Atributos (pagos, accesibilidad, wifi), horarios y horarios especiales de feriados.
- Links con UTM: sitio web, link de turnos (botón "Reservar" → tu app) e Instagram/TikTok. WhatsApp va como botón de chat si Google lo habilita en Argentina (hoy está solo en algunas regiones); si no, como red social.
- Fotos: logo, portada, fachada reconocible desde la vereda, interior, equipo y trabajos. Subí 2-3 por semana; las recientes ganan visibilidad. Sumá una novedad (post) por semana.
- **Q&A ya no cuenta:** Google lo viene retirando desde fines de 2025. Ahora "Ask Maps" (Gemini) responde preguntas con la descripción, los servicios, los atributos, las fotos y las reseñas. Por eso la info práctica (pagos, si atienden sin turno, estacionamiento, chicos) tiene que estar ahí y en la web.
- Si al reclamar o editar pide verificación, Google indica el método. Si es por video: mostrar el cartel, el interior, las herramientas y algo que pruebe que administran el local.

**Motor de reseñas** (sin pauta, es lo que más empuja el ranking)
- Link corto oficial (desde "Pedir reseñas" en la ficha) y un QR en el mostrador, los espejos y una tarjeta.
- Se pide en persona al cobrar y con un mensaje después del turno desde la app (Fase 2).
- **Reglas de Google** (actualizadas en abril de 2026):
  - pedirle a todos, no solo a los contentos;
  - sin descuentos ni premios a cambio;
  - sin cuotas, concursos ni bonos por barbero;
  - no pedir que nombren al barbero ni que mencionen algo puntual;
  - que la dejen desde su propio celular, no en una tablet del local;
  - nada de reseñas de amigos que no fueron.
- Responder todas en 24-48 h. Plantillas por tipo (5★, 3-4★, 1-2★), siempre personalizadas.
- Apuntar a un ritmo semanal constante: la recencia pesa más que un pico.

**Consistencia y prominencia**
- Mismo nombre, dirección y teléfono en Google, Instagram, Facebook, Bing Places (importa desde Google), Apple Business Connect (si está disponible en Argentina) y Waze.
- Menciones y links desde el barrio: guías, blogs barriales, un club o equipo que patrocinen, negocios aliados.

**Requisitos de SEO local para la web**
- Mismo nombre, dirección y teléfono en el footer, y mapa embebido.
- JSON-LD `HairSalon` con dirección, geo, horarios, `sameAs` y `priceRange`.
- Title tipo "Barbería en [Barrio] | [Nombre]" y una página por servicio.
- FAQ con la info práctica y botón Reservar siempre visible.
- GA4 y Search Console; que cargue rápido en el celular.

**Contenido del kit:** checklist de auditoría y optimización, y textos listos:
- descripción y servicios;
- 4 novedades iniciales;
- plantillas de respuesta a reseñas;
- guion y mensajes para pedir reseñas;
- tabla de links con UTM (`gbp_web`, `gbp_reservar`, `ig_bio`, `ig_historias`, `qr_local`, `wa_auto`…);
- tarjeta/cartel con QR imprimible;
- rutina semanal y mensual;
- planilla de línea base y seguimiento.

## Fase 2 — App de turnos → entregable 2: **Automatizaciones**
Antes de definir los cambios concretos, reviso el repo de la app (stack, base de datos, hosting).

**v1 (semanas 2-4)**
- Al reservar: nombre y WhatsApp obligatorios (+54 9…), email opcional y casilla de consentimiento para recordatorios y novedades.
- Atribución: guardar `utm_source/medium/campaign` y el referrer de cada turno, y preguntar "¿Cómo nos conociste?" en el primer turno.
- Confirmación y recordatorio (el día anterior y/o 2-3 h antes), con link para cancelar o reprogramar. Baja las ausencias.
- Pedido de reseña 2-3 h después del turno: a todos, una sola vez por cliente (queda registrada la fecha), con el link oficial y un texto neutro.
- Evento GA4 de turno confirmado, listo para conectarlo al Pixel de Meta o a Google Ads cuando haya pauta.
- Panel: turnos por origen, nuevos vs. recurrentes, ausentismo y reseñas pedidas.

**Canal de envío, en dos pasos**
1. **Arranque sin costo:** la app arma cada mensaje y el panel muestra la cola del día. Cada botón abre WhatsApp con el texto precargado (`wa.me`) y alguien del local toca enviar; son unos 2 minutos por día.
2. **Automático:** WhatsApp Cloud API con plantillas aprobadas por Meta.
   - Los recordatorios y el pedido de reseña, si están ligados al turno, entran como "utilidad": centavos de dólar por mensaje, y gratis si el cliente escribió en las últimas 24 h.
   - El re-turno y la reactivación entran como "marketing" y salen más caros.
   - Se puede usar el mismo número del local (coexistencia con WhatsApp Business) o uno dedicado solo a notificaciones.
   - Desde la v1 el "enviador" queda intercambiable, así el paso 2 es solo cambiar el transporte.

**v2 (meses 2-3)**
- Re-turno según el intervalo habitual de cada cliente (o por servicio).
- Reactivación a los 60-90 días sin venir, solo con consentimiento.
- Código de referidos y fidelidad digital, sin atarla a reseñas.

**Privacidad:** aviso, consentimiento y baja fácil (responder "BAJA"), según la Ley 25.326. Evaluar si corresponde inscribir la base de datos en la AAIP.

## Fase 3 — WhatsApp Business + Instagram
**WhatsApp Business app** (gratis; además la coexistencia futura lo exige)
- Migrar el número conservando los chats y completar el perfil: dirección, horario y link de turnos.
- Catálogo de servicios con precios y mensajes de bienvenida y de ausencia con el link de turnos.
- Respuestas rápidas (/turno, /precios, /ubicacion) y etiquetas.
- Las difusiones gratis ahora tienen límites, así que la reactivación masiva va por la app.

**Perfil de Instagram**
- Cuenta profesional con categoría Barbería. En el campo Nombre, algo que se pueda buscar: "[Nombre] · Barbería en [Barrio]".
- Bio con propuesta, barrio y llamado a reservar; link a la app con UTM; dirección visible y botón de WhatsApp.
- Destacadas: Turnos, Precios, Trabajos, Reseñas, Equipo, Cómo llegar.
- Dejar activada la aparición en buscadores (desde julio de 2025 Google indexa posts de cuentas profesionales). Usar palabras del barrio y del servicio en los textos.

**Sistema de contenido** (lo producen los barberos y los amigos; vos lo dirigís)
- Pilares: transformaciones antes/después, técnica (fade, diseño, barba), equipo y detrás de escena, prueba social (reacciones, reseñas de Google como placa), tips (cómo pedir tu corte, cuidado de barba), novedades del local y del barrio.
- Ritmo: 3-4 posteos por semana (la mayoría reels) e historias diarias con sticker de link a turnos.
- Guía de grabación para barberos: tomas de antes, proceso, después y reacción, con buena luz, en vertical y cuidando el audio. Pedir permiso al cliente antes de publicarlo.
- Calendario mensual, banco de ideas y guiones. El material se reutiliza en TikTok (opcional) y en la ficha de Google.
- Colaboraciones: negocios del barrio (gimnasios, cafés, tatuadores), un club o equipo amateur, micro-influencers barriales por canje, siempre marcadas como colaboración.
- Página de Facebook básica con datos consistentes; hace falta para pautar más adelante.

## Fase 4 — Pauta (cuando haya presupuesto, no antes del mes 3)
- Antes de arrancar tiene que estar todo esto: la ficha optimizada, una buena base de reseñas, reels que ya funcionaron orgánicos y la medición por origen andando.
- **Primero Meta Ads:** radio de 2-3 km, con mensajes a WhatsApp o tráfico a la app con UTM, usando los mejores reels. Prueba de ~USD 5/día durante 4 semanas.
- **Después Google Ads:** búsquedas locales en radio acotado, con la ficha vinculada para aparecer en Maps.
- La inversión la paga el cliente directo con su tarjeta; tu gestión se cobra aparte.

## Medición y reporte mensual
| Canal | KPIs |
|---|---|
| Google | vistas de la ficha, llamadas, "cómo llegar", clics a web y a Reservar, reseñas (cantidad, promedio, ritmo), posición en Maps |
| Instagram | alcance, visitas al perfil, clics al link, seguidores, mensajes |
| App | turnos por origen, nuevos vs. recurrentes, ausentismo, re-turno, reseñas pedidas vs. obtenidas |

Reporte de una página y 30 minutos de reunión. Expectativa: las reseñas y la ficha se notan en semanas; la posición en Maps, en 2-3 meses.

## Cronograma (12 semanas)
| Cuándo | Qué |
|---|---|
| Semana 1 | Kickoff, accesos, línea base, reclamo o acceso a la ficha, WhatsApp Business |
| Semanas 1-2 | Kit de Google aplicado, perfil de IG, QR de reseñas en el local, capacitación (cómo pedir reseñas, cómo grabar) |
| Semanas 2-4 | App v1, web con SEO local, directorios |
| Mes 2 | Calendario de contenido en marcha, novedades semanales en Google, colaboraciones, primer reporte |
| Mes 3 | App v2, comparación con la línea base, decisión sobre la prueba de pauta |

## Cómo paquetizar tu servicio (propuesta)
| Paquete | Incluye | Horas aprox. |
|---|---|---|
| Setup (pago único) | Fases 0 y 1, WhatsApp Business, perfil de IG, guía de contenido, UTMs, capacitación | 25-35 h |
| Automatizaciones (único) | App v1 (la v2 se cotiza aparte) | 15-30 h según el stack |
| Abono "Presencia local" | Google mes a mes (novedades, fotos, respuestas, control de ediciones sugeridas), mantenimiento de app y mensajes, reporte y reunión | 6-8 h/mes |
| Abono "+ Contenido" | Lo anterior más calendario, guiones, edición y publicación del material, colaboraciones | +10-12 h/mes |
| Pauta (add-on) | Gestión de campañas; la inversión va aparte | a definir |

- **Recomendación:** Setup + "Presencia local", con "+ Contenido" como upgrade y mínimo de 3 meses (el SEO local tarda).
- El precio sale de horas × tu tarifa, en USD o en pesos con ajuste trimestral. Los costos de terceros (hosting, mensajes de la API de WhatsApp) los paga el cliente.

## Ejecución al aprobar
0. **Actualizar el plan en el repo:** copiar este plan a `docs/plan-marketing-barberia.md`, commit y push a `main` (https://github.com/faculuna1097/kingsai-studio-web).
1. **Kit de Google** (su primera sección es el paso a paso del reclamo de Fase 0) → `C:\Users\facul\kingsai-studio-web\clientes\barberia\kit-google.md` y `tarjeta-qr.html` imprimible. Lo que falte del brief queda marcado `[COMPLETAR]`.
2. **Automatizaciones:**
   - pedir acceso a la carpeta del repo de la app;
   - relevar stack y modelo de datos;
   - escribir la especificación en `clientes\barberia\automatizaciones-app.md` (flujos, datos, textos, reglas);
   - implementar la v1 en el repo de la app.

## Verificación
- **Ficha:** buscar la barbería desde un celular sin sesión, en Maps y en el buscador. Revisar datos, botones (Reservar, sitio, WhatsApp), servicios y fotos. El QR tiene que abrir el formulario de reseña y los clics con UTM tienen que aparecer como origen en la app y en GA4.
- **App:** con una reserva de prueba que lleve `?utm_source=google&utm_campaign=gbp_reservar`, chequear:
  - que el origen quede guardado;
  - que el recordatorio y el pedido de reseña salgan a horario con un número de prueba;
  - que el mismo cliente no reciba dos pedidos de reseña;
  - que la baja funcione.
- **Mensual:** comparar los KPIs con la línea base de la semana 1.

## Fuentes (verificadas en oct-2026)
- Q&A retirado / Ask Maps: https://ppc.land/google-quietly-kills-q-a-for-an-ai-button-most-wont-use/ · https://www.footbridgemedia.com/marketing-tips/google-shutting-down-gbp-q-a
- Política de reseñas, abril 2026: https://ppc.land/google-tightens-maps-review-policy-staff-names-and-quotas-now-banned/
- Chat por WhatsApp en la ficha: https://support.google.com/business/answer/15013580
- Precios de WhatsApp Business Platform: https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- Categorías de plantillas: https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization
- Coexistencia App + API: https://kapso.ai/blog/whatsapp-business-app-coexistence-cloud-api
- Instagram indexado en Google: https://www.searchengineworld.com/its-live-instagram-posts-are-ranking-and-showing-in-google-and-bing-seo-meets-social
- Límites de difusiones: https://techcrunch.com/2025/03/18/whatsapp-will-soon-limit-number-of-broadcast-messages-users-and-businesses-can-send/
