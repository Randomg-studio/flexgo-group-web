// Datos que cambian con el tiempo. Lo que quede vacío no aparece en la página.
window.FLEXGO = {
  whatsapp: '51919446978',
  whatsappVisible: '+51 919 446 978',
  correo: 'contacto@flexgogroup.com',
  horario: 'Lunes a viernes, de 9 a. m. a 7 p. m. Sábados, de 9 a. m. a 1 p. m.',
  ubicacion: 'Tarapoto, San Martín, Perú',
  redes: {
    facebook: 'https://web.facebook.com/flexgo.pe/',
    instagram: '',
    tiktok: '',
  },
  enlaces: {
    logrin: 'https://logrin.flexgogroup.com/',
    mercadito: 'https://logrin.flexgogroup.com/?mercadito',
    content: '',
    agentes: '',
  },
  // Agrega cada aliado así: { nombre: 'Nombre', logo: 'assets/aliados/logo.svg', web: 'https://...' }
  aliados: [],
  // Kivo conversa con el mismo sistema de Logrin: los chats llegan a Atención al cliente de la consola.
  // La clave es la pública de la página de Logrin; vacía, el chat usa solo las respuestas preparadas.
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
    r: 'Hoy puedes usar Logrin Negocio y Mi Mercadito. CreaGo y Agentes de IA están en preparación. También conversamos sobre webs, chatbots y automatizaciones a medida.',
    c: ['servicios', 'ofrecen', 'productos', 'que tienen', 'soluciones'],
  },
  {
    p: '¿Qué es Logrin Negocio?',
    r: 'Es un sistema en la nube para manejar tu negocio: ventas, inventario, clientes, finanzas, marketing y metas en un solo lugar, desde el celular o la computadora.',
    c: ['logrin', 'sistema de ventas', 'punto de venta', 'inventario', 'stock', 'caja', 'gestion'],
  },
  {
    p: '¿Puedo probar Logrin Negocio gratis?',
    r: 'Sí. Logrin Negocio tiene una prueba gratis de 7 días, sin tarjeta. Puedes pedirla desde su página.',
    c: ['prueba', 'gratis', 'probar', 'demo', 'sin costo'],
  },
  {
    p: '¿Qué es Mi Mercadito?',
    r: 'Es un lugar en línea que reúne las tiendas de los negocios que usan Logrin Negocio, para que las personas descubran sus productos y les hagan pedidos.',
    c: ['mercadito', 'marketplace', 'tiendas', 'vender en linea', 'tienda online'],
  },
  {
    p: '¿Qué es CreaGo?',
    r: 'Es nuestro servicio para crear imágenes, textos y planificación de contenido para tu marca. Está en preparación. Escríbenos si quieres ser de los primeros en usarlo.',
    c: ['creago', 'crea go', 'content', 'contenido', 'publicaciones', 'imagenes', 'copy', 'redes sociales', 'planificacion', 'calendario'],
  },
  {
    p: '¿Qué son los Agentes de IA?',
    r: 'Son asistentes con inteligencia artificial que pueden conversar con tus clientes y apoyar tareas de tu negocio, siempre con la opción de pasar con una persona. Este servicio está en preparación.',
    c: ['agente', 'agentes', 'chatbot', 'chatbots', 'bot', 'inteligencia artificial', ' ia ', 'whatsapp automatico', 'automatizar'],
  },
  {
    p: '¿Hacen páginas web o soluciones a medida?',
    r: 'Sí, podemos conversar sobre páginas web, chatbots, automatizaciones y mantenimiento. Cuéntanos tu caso por WhatsApp y vemos si podemos ayudarte.',
    c: ['pagina web', 'web', 'landing', 'a medida', 'desarrollo', 'personalizado', 'automatizacion', 'mantenimiento'],
  },
  {
    p: '¿Cuánto cuestan sus servicios?',
    r: 'Los planes de Logrin Negocio se publican en su página. Las soluciones a medida se cotizan según lo que necesites. Escríbenos y te orientamos sin compromiso.',
    c: ['precio', 'precios', 'costo', 'cuesta', 'cuanto', 'planes', 'cotizar', 'cotizacion', 'tarifa'],
  },
  {
    p: '¿Cómo cuidan mis datos?',
    r: 'Tratamos tus datos conforme a la Ley N.° 29733 y solo para responderte o darte el servicio que pediste. No pidas ni compartas contraseñas o tarjetas por el chat. Puedes leer nuestra Política de privacidad.',
    c: ['datos', 'privacidad', 'seguridad', 'seguro', 'proteccion', 'confidencial'],
  },
  {
    p: '¿Cómo puedo ser aliado de FlexGo?',
    r: 'Buscamos personas y empresas que quieran trabajar con nosotros. Escríbenos por WhatsApp o correo, cuéntanos qué haces y vemos juntos cómo colaborar.',
    c: ['aliado', 'aliados', 'alianza', 'socio', 'colaborar', 'trabajar con ustedes', 'referido'],
  },
  {
    p: '¿Cómo los contacto y cuál es su horario?',
    r: 'Puedes escribirnos por WhatsApp al +51 919 446 978 o a contacto@flexgogroup.com. Atendemos de lunes a viernes, de 9 a. m. a 7 p. m., y los sábados, de 9 a. m. a 1 p. m.',
    c: ['contacto', 'contactar', 'telefono', 'numero', 'su whatsapp', 'por whatsapp', 'correo', 'horario', 'atienden', 'donde estan', 'ubicacion', 'asesor', 'persona', 'hablar'],
  },
];
