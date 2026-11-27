// Datos que cambian con el tiempo. Lo que quede vacío no aparece en la página.
window.FLEXGO = {
  whatsapp: '51917952528',
  whatsappVisible: '+51 917 952 528',
  correo: 'contacto@flexgogroup.com',
  horario: 'Lunes a viernes, de 9 a. m. a 6 p. m. Sábados, de 9 a. m. a 1 p. m. Domingos, cerrado (Kivo responde las 24 horas).',
  ubicacion: 'Tarapoto, San Martín, Perú',
  redes: {
    facebook: 'https://web.facebook.com/flexgo.pe/',
    instagram: 'https://www.instagram.com/flexgo.group/',
    tiktok: '',
  },
  enlaces: {
    logrin: 'https://logrin.flexgogroup.com/',
    mercadito: 'https://logrin.flexgogroup.com/?mercadito',
    content: 'https://creago.flexgogroup.com/',
    agentes: '',
  },
  // Agrega cada aliado así: { nombre: 'Nombre', logo: 'assets/aliados/logo.svg', web: 'https://...' }
  aliados: [],
  // Kivo conversa con el mismo sistema de Logrin: los chats llegan a Atención al cliente de la consola.
  // La clave es la pública de la página de Logrin; vacía, el chat usa solo las respuestas preparadas.
  // Elio (proyecto propio): solo para leer las reseñas aprobadas. Clave pública (publishable).
  elio: { url: 'https://dpipmmocrooizngopayz.supabase.co', clave: 'sb_publishable_sN1BFTi0lGSGaQO4aw5UGg_KddEbewg' },
  // NormaGo (proyecto chat-ia-legal): solo URL y clave pública (publishable), para leer sus reseñas aprobadas.
  normago: { url: 'https://venygswvufoanerexlnk.supabase.co', clave: 'sb_publishable_a6haAJD2Nree6OFJqkTMqQ_MWDxTPFz' },
  // CreaGo: solo URL y clave pública (publishable), para leer sus reseñas aprobadas.
  creago: { url: 'https://dojbyklwgzbefbfknhks.supabase.co', clave: 'sb_publishable_BETDUSfuMo9w77BQk18eog_HRMMQPFo' },
  kivo: { url: 'https://owtweebqlmoarbsvtiau.supabase.co', clave: 'sb_publishable_YvFAhbXHG1UxlXDnUny5Uw_sRVWE0Wv' },
};

// El chat y la sección de preguntas leen esta misma lista: así nunca se contradicen.
window.FLEXGO_FAQ = [
  {
    p: '¿Qué es FlexGo Group?',
    r: 'Es una empresa de tecnología que reúne servicios digitales para negocios: gestión de ventas, tiendas en línea, contenido e inteligencia artificial. Nuestro objetivo es que la tecnología sea clara y útil para ti.',
    c: ['flexgo', 'empresa', 'quienes son', 'que hacen', 'que es flexgo', 'grupo', 'a que se dedican'],
  },
  {
    p: '¿Qué servicios ofrecen?',
    r: 'Hoy puedes usar Kivo Agentes (agentes de IA que atienden a tus clientes), Logrin Negocio, CreaGo, Mi Mercadito y Elio, nuestro asistente de IA para conversar (pruébalo gratis en https://elio.flexgogroup.com/). Y estamos preparando Eleva, nuestra marca educativa. También hacemos páginas web, chatbots y automatizaciones a medida.',
    c: ['servicios', 'ofrecen', 'productos', 'que tienen', 'soluciones'],
  },
  {
    p: '¿Qué es Logrin Negocio?',
    r: 'Es un sistema en la nube para manejar tu negocio: ventas, inventario, clientes, finanzas, marketing y metas en un solo lugar, desde el celular o la computadora.',
    c: ['logrin', 'sistema de ventas', 'punto de venta', 'inventario', 'stock', 'caja', 'gestion'],
  },
  {
    p: '¿Puedo probar Logrin Negocio gratis?',
    r: 'Sí. Logrin Negocio tiene una prueba gratis de 7 días, sin tarjeta. Empieza aquí: https://logrin.flexgogroup.com/?prueba',
    c: ['prueba', 'gratis', 'probar', 'demo', 'sin costo'],
  },
  {
    p: '¿Qué es Mi Mercadito?',
    r: 'Es tu tienda en línea, con un enlace para compartir en tus redes y por WhatsApp, dentro de un mercado que reúne a los negocios que usan Logrin. Precio de lanzamiento: S/ 14.99 al mes (antes S/ 47), solo para las primeras 20 tiendas y durante 6 meses; después pasa a S/ 47 al mes (plan Solo tienda). Empieza aquí: https://logrin.flexgogroup.com/?prueba=tienda&lanzamiento=mm',
    c: ['mercadito', 'marketplace', 'tiendas', 'vender en linea', 'tienda online'],
  },
  {
    p: '¿Qué es Eleva?',
    r: 'Eleva by FlexGo Group es nuestra marca educativa: cursos y acompañamiento para aprender tecnología e IA a tu ritmo. Está en preparación; todavía no tiene precios ni fecha de inicio. Puedes unirte a la lista de espera en https://flexgogroup.com/eleva.html',
    c: ['eleva', 'educacion', 'educativo', 'cursos', 'curso', 'aprender', 'capacitacion', 'formacion', 'clases', 'academia'],
  },
  {
    p: '¿Qué es Elio?',
    r: 'Elio by FlexGo Group es nuestro asistente de inteligencia artificial para conversar: explorar ideas, aprender y avanzar en tus tareas. Ya está disponible: pruébalo gratis en https://elio.flexgogroup.com/ (4 preguntas sin cuenta y luego te registras gratis). Tiene 4 motores que gastan créditos por mensaje: Chispa 1, Pulso 2, Órbita 10 y Cumbre 25. Planes con IGV incluido: Libre S/ 0 (Chispa y 3 mensajes con Órbita a la semana, 10 créditos cada 5 horas y 40 por semana, hasta 2 dispositivos), Impulso S/ 56.99 al mes (Chispa, Pulso y Órbita, 60 créditos cada 5 horas y 340 por semana, PDF e imágenes, 1 persona y hasta 3 dispositivos) y Ultra S/ 159.99 al mes para 2 personas, cada una con su cuenta (los 4 motores con Cumbre, 150 créditos cada 5 horas y 780 por semana, o 75 y 390 por persona si lo compartes, hasta 4 dispositivos). Si es tu primera vez, puedes probar Impulso 3 días gratis, una sola vez y sin tarjeta. Incluye Trabajos académicos (citas y referencias en APA 7, Vancouver e ISO 690 con DOI, y esquemas de tesis según guías oficiales de universidades peruanas verificadas: USMP, UPAO y UCV; Elio no inventa referencias), Mi día (recordatorios: escríbele «Recuérdame…»), Mi Biblioteca (guarda documentos y responde citando la fuente) y Trae tu historial de ChatGPT, Claude o Gemini, con guía en https://elio.flexgogroup.com/trae-tu-historial.html. Se paga por Yape dentro de la app; si prefieres Plin, o pagar en dólares con PayPal, escríbenos por WhatsApp.',
    c: ['elio', 'chatgpt', 'chat gpt', 'asistente de ia', 'asistente personal', 'chat de ia', 'conversar con ia', 'preguntarle a la ia'],
  },
  {
    p: '¿Qué es CreaGo?',
    r: 'Es nuestro servicio para crear imágenes, textos y planificación de contenido para tu marca. Puedes crear tu cuenta en https://creago.flexgogroup.com',
    c: ['creago', 'crea go', 'content', 'contenido', 'publicaciones', 'imagenes', 'copy', 'redes sociales', 'planificacion', 'calendario'],
  },
  {
    p: '¿Qué son los Agentes de IA?',
    r: 'Es Kivo Agentes: agentes con la tecnología neuronal de Kivo que atienden a tus clientes en tu web o con su propio enlace, toma pedidos y citas y califica a cada interesado, siempre con la opción de pasar con una persona. Planes desde S/ 149 al mes. Para que atienda también en WhatsApp, Messenger o Instagram, cada red se suma con Red extra (S/ 69 al mes por red) y puedes probarlo gratis con los datos de tu negocio. Mira los detalles en https://flexgogroup.com/kivo.html',
    c: ['agente', 'agentes', 'chatbot', 'chatbots', 'bot', 'inteligencia artificial', ' ia ', 'whatsapp automatico', 'automatizar'],
  },
  {
    p: '¿Qué es la tecnología neuronal de Kivo?',
    r: 'Kivo funciona con modelos de inteligencia artificial basados en redes neuronales, configurados por FlexGo con la información de tu negocio. Entiende los mensajes como los escriben tus clientes y responde solo con lo que tu negocio le enseñó. Si no sabe algo, no lo inventa: te avisa para que atiendas tú. Como toda IA, puede equivocarse, y por eso siempre puedes revisar y tomar la conversación.',
    c: ['tecnologia neuronal', 'neuronal', 'redes neuronales', 'como funciona kivo', 'modelo de ia', 'se equivoca'],
  },
  {
    p: '¿Hacen páginas web o soluciones a medida?',
    r: 'Sí. Hacemos webs en tres planes: landing para negocio pequeño a S/ 250 (precio de lanzamiento, antes S/ 300), web Pro a S/ 850 y web Ultra para empresas desde S/ 1.500. El dominio y el hosting van aparte, y el mantenimiento opcional cuesta S/ 39 al mes. Mira los detalles en https://flexgogroup.com/paginas-web.html. También hacemos chatbots y automatizaciones a medida.',
    c: ['pagina web', 'web', 'landing', 'a medida', 'desarrollo', 'personalizado', 'automatizacion', 'mantenimiento'],
  },
  {
    p: '¿Cuánto cuestan sus servicios?',
    r: 'Elio: plan Libre gratis, Impulso S/ 56.99 al mes y Ultra S/ 159.99 al mes para 2 personas, con IGV incluido. Kivo Agentes: desde S/ 149 al mes (cada red social, con Red extra a S/ 69 al mes). Mi Mercadito: S/ 14.99 al mes de lanzamiento (antes S/ 47). Páginas web: desde S/ 250, pago único. Logrin Negocio y CreaGo tienen sus planes en su página, y Logrin se prueba 7 días gratis. Las soluciones a medida se cotizan según lo que necesites. Puedes pagar en soles con Yape o Plin, o en dólares con PayPal (consúltanos por WhatsApp). Escríbenos y te orientamos sin compromiso.',
    c: ['precio', 'precios', 'costo', 'cuesta', 'cuanto', 'planes', 'cotizar', 'cotizacion', 'tarifa'],
  },
  {
    p: '¿Cómo cuidan mis datos?',
    r: 'Tratamos tus datos conforme a la Ley N.° 29733 y solo para responderte o darte el servicio que pediste. No pidas ni compartas contraseñas o tarjetas por el chat. Puedes leer nuestra Política de privacidad.',
    c: ['datos', 'privacidad', 'seguridad', 'seguro', 'proteccion', 'confidencial'],
  },
  {
    p: '¿Cómo puedo ser aliado de FlexGo?',
    r: 'Si tienes una empresa, buscamos aliados estratégicos, no proveedores: puedes referir o revender nuestros servicios, integrar tus sistemas con Kivo y Logrin, hacer co-marketing o crear una alianza para tu rubro. Propón tu alianza en https://flexgogroup.com/aliados.html o escríbenos por WhatsApp.',
    c: ['aliado', 'aliados', 'alianza', 'socio', 'colaborar', 'trabajar con ustedes', 'referido'],
  },
  {
    p: '¿Cómo los contacto y cuál es su horario?',
    r: 'Puedes escribirnos por WhatsApp al +51 917 952 528 o a contacto@flexgogroup.com. Atendemos de lunes a viernes, de 9 a. m. a 6 p. m., y los sábados, de 9 a. m. a 1 p. m.',
    c: ['contacto', 'contactar', 'telefono', 'numero', 'su whatsapp', 'por whatsapp', 'correo', 'horario', 'atienden', 'donde estan', 'ubicacion', 'asesor', 'persona', 'hablar'],
  },
];

// LISTA ÚNICA DE SERVICIOS (desde el 26-nov). El menú «Servicios», el pie (Productos) y el círculo de la portada
// se generan de aquí con `node scripts/servicios-estatico.mjs`, y `node scripts/revisar-servicios.mjs` comprueba
// que todas las páginas coincidan. Para agregar o mover un servicio, cámbialo SOLO aquí y corre los dos scripts.
// Campos: menu/eco/pie = dónde aparece; tarjeta = debe tener su tarjeta en «Ver todos los servicios» (#servicios);
// logo = archivo en assets/imagenes/logos/ (si no hay, se usa icono); pronto = muestra «Próximamente» (o el texto de prontoTexto); beta = muestra la etiqueta «Beta».
// acceso = { url } lleva a la pantalla de iniciar sesión del producto (comprobada en vivo); { pronto: true } = «Muy pronto», sin enlace.
//   En su propia página sale «Iniciar sesión en <nombre>» en la barra; en las demás, la lista «Iniciar sesión» con todos los que tienen url.
// resenas = { proyecto, rpc } función pública de reseñas aprobadas en la app (proyecto = clave de window.FLEXGO con url y clave pública).
//   Responde { total, promedio, resenas: [{ estrellas, texto, nombre, plan, fecha }] }. Lo usa js/resenas.js; sin este campo, la sección no se muestra.
//   dejar = enlace directo al formulario de reseña del producto (si no hay, el botón lleva a su acceso).
window.FLEXGO_SERVICIOS = [
  { id: 'elio', nombre: 'Elio', href: 'elio.html', logo: 'elio.webp', tarjeta: true,
    acceso: { url: 'https://elio.flexgogroup.com/' },
    resenas: { proyecto: 'elio', rpc: 'elio_resenas_publicas', dejar: 'https://elio.flexgogroup.com/?resena' },
    menu: { desc: 'Tu asistente de IA para estudiar, investigar y trabajar' },
    eco: { desc: 'Para estudiar, investigar y trabajar', aria: 'Conoce Elio, asistente de IA de FlexGo Group' }, pie: true },
  { id: 'eleva', nombre: 'Eleva', href: 'eleva.html', logo: 'eleva.svg', pronto: true, tarjeta: true,
    acceso: { pronto: true },
    menu: { desc: 'Educación en tecnología e IA (próximamente)' },
    eco: { desc: 'Aprende tecnología e IA', aria: 'Conoce Eleva, educación de FlexGo Group' }, pie: true },
  { id: 'kivo', nombre: 'Kivo Agentes', href: 'kivo.html', logo: 'kivo.webp', tarjeta: true,
    resenas: { proyecto: 'kivo', rpc: 'kivo_resenas_publicas' }, // función de Logrin (R-178)
    acceso: { url: 'https://logrin.flexgogroup.com/', nota: 'Toca «Soy cliente»' },
    menu: { desc: 'Agentes con tecnología neuronal que atienden a tus clientes a toda hora' },
    eco: { desc: 'Tecnología neuronal que atiende por ti' }, pie: true },
  { id: 'logrin', nombre: 'Logrin Negocio', href: 'https://logrin.flexgogroup.com/', logo: 'logrin.webp', tarjeta: true,
    resenas: { proyecto: 'kivo', rpc: 'logrin_resenas_publicas' }, // función de Logrin (R-178)
    acceso: { url: 'https://logrin.flexgogroup.com/', nota: 'Toca «Soy cliente»' },
    menu: { desc: 'Ventas, inventario, clientes y cobros en un solo lugar' },
    eco: { desc: 'Gestión integral de tu negocio', nueva: true }, pie: true },
  { id: 'creago', nombre: 'CreaGo', href: 'creago.html', logo: 'creago.webp', tarjeta: true,
    acceso: { url: 'https://creago.flexgogroup.com/login' },
    resenas: { proyecto: 'creago', rpc: 'creago_resenas_publicas' },
    menu: { desc: 'Contenido para redes con IA y la voz de tu marca' },
    eco: { desc: 'Contenido con IA para tu marca' }, pie: true },
  // NormaGo (antes «Chat IA Legal»): isotipo oficial en todos los lugares, como Elio, Kivo y Logrin (pedido del usuario, 27-nov).
  { id: 'normago', nombre: 'NormaGo', href: 'https://normago.flexgogroup.com/', logo: 'normago.webp', beta: true, tarjeta: true,
    acceso: { url: 'https://normago.flexgogroup.com/chat.html' },
    resenas: { proyecto: 'normago', rpc: 'normago_resenas_publicas' },
    menu: { desc: 'Inteligencia artificial jurídica: investiga y analiza el derecho peruano con fuentes oficiales' },
    eco: { desc: 'Inteligencia artificial jurídica', aria: 'Conoce NormaGo, la inteligencia artificial jurídica de FlexGo Group' }, pie: true, pieNueva: true },
  // KipuGo (27-nov, chat «Finanzas Chat IA»): simulador gratis de créditos; no tiene cuentas, por eso no lleva acceso.
  { id: 'kipugo', nombre: 'KipuGo', href: 'https://kipugo.flexgogroup.com/', logo: 'kipugo.svg', beta: true, tarjeta: true,
    menu: { desc: 'Finanzas claras: simula tu crédito con la TCEA real antes de firmar' },
    eco: { desc: 'Simula tu crédito con la TCEA real', aria: 'Conoce KipuGo, finanzas claras de FlexGo Group' }, pie: true, pieNueva: true },
  { id: 'mercadito', nombre: 'Mi Mercadito', href: 'https://logrin.flexgogroup.com/?mercadito', tarjeta: true,
    resenas: { proyecto: 'kivo', rpc: 'mercadito_resenas_publicas' }, // función de Logrin (R-178)
    acceso: { url: 'https://logrin.flexgogroup.com/', nota: 'Toca «Soy cliente»' },
    icono: '<path d="M5 8h14l-1.2 12H6.2Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: { desc: 'Tu tienda en línea para compartir por WhatsApp' },
    eco: { desc: 'Tu tienda en línea desde S/ 14.99', href: 'https://logrin.flexgogroup.com/?mercadito&vender', nueva: true }, pie: true, pieNueva: true },
  { id: 'webs', nombre: 'Páginas web', href: 'paginas-web.html', tarjeta: true,
    icono: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4M3 8h18"/>',
    ecoIcono: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M6 6.5h.01M9 6.5h.01"/>',
    menu: { desc: 'Webs y landing pages listas para Google' },
    eco: { desc: 'Sitios y landing pages a medida' } },
  { id: 'multimedia', nombre: 'Creación multimedia', href: 'index.html#servicios', tarjeta: true,
    icono: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
    menu: { desc: 'Flyers, manual de marca y videos' },
    eco: { desc: 'Flyers, manual de marca y video', href: 'https://wa.me/51917952528?text=Hola%2C%20quiero%20cotizar%20creaci%C3%B3n%20multimedia%20%28flyers%2C%20manual%20de%20marca%20o%20video%29.', nueva: true } },
  { id: 'redes', nombre: 'Gestión de redes sociales', href: 'index.html#servicios', tarjeta: true,
    icono: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4m-6.8 7 6.8 4"/>',
    menu: { desc: 'Planificamos y publicamos por ti' },
    eco: { nombre: 'Gestión de redes', desc: 'Planificamos y publicamos por ti', href: 'https://wa.me/51917952528?text=Hola%2C%20quiero%20que%20gestionen%20las%20redes%20sociales%20de%20mi%20negocio.', nueva: true } },
  { id: 'asesoria', nombre: 'Asesoría', href: 'index.html#servicios', tarjeta: true,
    icono: '<path d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"/>',
    ecoIcono: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="6" rx="2"/><rect x="17" y="13" width="4" height="6" rx="2"/>',
    menu: { desc: 'Comunicación, marca y campañas' },
    eco: { desc: 'Comunicación, marca y campañas', href: 'https://wa.me/51917952528?text=Hola%2C%20quiero%20una%20asesor%C3%ADa%20de%20comunicaci%C3%B3n%20y%20marca.', nueva: true } },
  { id: 'integraciones', nombre: 'Integraciones', href: 'kivo.html#planes',
    icono: '<path d="M9 7H6a3 3 0 0 0 0 6h3M15 7h3a3 3 0 0 1 0 6h-3M8 10h8"/><path d="M12 17v4M8 21h8"/>',
    eco: { desc: 'Conecta tu web y tus redes con Kivo' } },
  { id: 'soluciones', nombre: 'Soluciones a medida', href: 'index.html#soluciones', tarjeta: true,
    icono: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3h7Z"/>',
    ecoIcono: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
    menu: { desc: 'Chatbots, automatizaciones y sistemas con integraciones' },
    eco: { desc: 'Chatbots y automatizaciones' } },
];
