(() => {
  'use strict';
  const D = window.FLEXGO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const suave = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
  const tramo = (v, a, b) => clamp((v - a) / (b - a));
  const wa = (texto) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(texto)}`;
  const cine = matchMedia('(min-width: 851px) and (prefers-reduced-motion: no-preference)');
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)');
  const cursorFino = matchMedia('(pointer: fine)');

  $$('[data-wa]').forEach((a) => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });
  $('#anio').textContent = new Date().getFullYear();
  $('#contacto-correo').href = `mailto:${D.correo}`;

  /* Menú */
  const nav = $('#primary-nav');
  const menu = $('.menu-toggle');
  const header = $('.site-header');
  const abrirMenu = (si) => {
    nav.classList.toggle('is-open', si);
    menu.setAttribute('aria-expanded', String(si));
    menu.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
  };
  menu.addEventListener('click', () => abrirMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => abrirMenu(false)));
  document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.site-header')) abrirMenu(false); });
  const enlaces = $$('.nav-links a').map((link) => ({ link, destino: $(link.hash) }));

  /* Preguntas frecuentes: la misma lista que usa el chat */
  const lista = $('#faq-lista');
  window.FLEXGO_FAQ.forEach(({ p, r }, i) => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    const h = document.createElement('h3');
    const b = document.createElement('button');
    b.type = 'button';
    b.id = `faq-p-${i}`;
    b.setAttribute('aria-controls', `faq-r-${i}`);
    const t = document.createElement('span');
    t.textContent = p;
    b.append(t, document.createElement('i'));
    h.append(b);
    const resp = document.createElement('div');
    resp.className = 'faq-resp';
    resp.id = `faq-r-${i}`;
    resp.setAttribute('role', 'region');
    resp.setAttribute('aria-labelledby', b.id);
    const dentro = document.createElement('div');
    const texto = document.createElement('p');
    texto.textContent = r;
    dentro.append(texto);
    resp.append(dentro);
    item.append(h, resp);
    lista.append(item);
    const poner = (si) => { item.classList.toggle('abierta', si); b.setAttribute('aria-expanded', String(si)); };
    poner(i === 0);
    b.addEventListener('click', () => poner(!item.classList.contains('abierta')));
  });

  /* Detalle de productos y servicios */
  const WA_MEDIDA = 'Hola, quiero conversar con FlexGo sobre ';
  const DETALLES = {
    web: { cat: 'Páginas web y landing pages', titulo: 'Webs que presentan tu mejor versión.', img: 'servicio-paginas-web.jpg', resumen: 'Diseños claros, modernos y enfocados en tus objetivos.', datos: [['Qué resuelve', 'Explica qué ofreces y facilita que tus clientes te contacten.'], ['Para quién', 'Negocios y marcas que necesitan presentarse bien en internet.'], ['Cómo funciona', 'Escuchamos tu caso, proponemos el alcance, la activamos con tu marca y te acompañamos.']], wa: WA_MEDIDA + 'una página web.' },
    chatbots: { cat: 'Chatbots', titulo: 'Atención que acompaña.', img: 'servicio-chatbots.jpg', resumen: 'Chatbots para web y WhatsApp que orientan, resuelven consultas y derivan a tu equipo.', datos: [['Qué resuelve', 'Las preguntas que se repiten dejan de quitarle tiempo a tu equipo.'], ['Para quién', 'Negocios que reciben muchas consultas por web o WhatsApp.'], ['Cómo funciona', 'Definimos contigo qué responde el chatbot y cuándo pasa la conversación a una persona.']], wa: WA_MEDIDA + 'un chatbot para mi negocio.' },
    automatizaciones: { cat: 'Automatizaciones', titulo: 'Menos repetición. Más tiempo.', img: 'servicio-automatizaciones.jpg', resumen: 'Automatizaciones diseñadas alrededor de las tareas y procesos de tu negocio.', datos: [['Qué resuelve', 'Tareas repetitivas que hoy haces a mano.'], ['Para quién', 'Equipos que quieren dedicar su tiempo a lo importante.'], ['Cómo funciona', 'Revisamos tu proceso, proponemos qué automatizar y lo ponemos en marcha contigo.']], wa: WA_MEDIDA + 'automatizar tareas de mi negocio.' },
    acompanamiento: { cat: 'Acompañamiento', titulo: 'Un equipo para seguir avanzando.', img: 'servicio-mantenimiento.jpg', resumen: 'Acompañamiento y mantenimiento para que tus soluciones sigan funcionando y mejorando.', datos: [['Qué resuelve', 'Dudas, ajustes y mejoras después de la puesta en marcha.'], ['Para quién', 'Negocios que ya trabajan con una solución de FlexGo.'], ['Cómo funciona', 'Resolvemos dudas y ajustamos lo necesario a medida que tu negocio avanza.']], wa: WA_MEDIDA + 'acompañamiento y mantenimiento.' },
    logrin: { cat: 'Gestión', titulo: 'Logrin Negocio', resumen: 'Un sistema en la nube para manejar tu negocio desde el celular o la computadora.', datos: [['Qué incluye', 'Ventas, inventario, clientes, finanzas, marketing y metas en un solo lugar.'], ['Para quién', 'Tiendas, restaurantes, servicios y otros negocios.'], ['Cómo empezar', 'Tiene una prueba gratis de 7 días, sin tarjeta.']], url: 'https://logrin.flexgogroup.com/?prueba', boton: 'Probar 7 días gratis' },
    creago: { cat: 'Contenido', titulo: 'CreaGo', resumen: 'Planifica contenido y crea imágenes y textos con la voz de tu marca.', datos: [['Qué resuelve', 'Tener contenido listo para tus redes sin empezar de cero cada vez.'], ['Para quién', 'Negocios y marcas que publican en redes sociales.'], ['Cómo empezar', 'Crea tu cuenta en la página de CreaGo.']], url: 'https://creago.flexgogroup.com/', boton: 'Entrar a CreaGo' },
    kivo: { cat: 'Agente de IA', titulo: 'Kivo', img: 'kivo-portada.jpg', resumen: 'El asistente de IA de FlexGo. Conversa, orienta y pasa la atención a una persona cuando hace falta.', datos: [['Dónde está hoy', 'Atiende en esta web y en Logrin Negocio.'], ['Para tu negocio', 'Los agentes de IA para clientes están en preparación. Escríbenos si te interesa.']], chat: true, wa: 'Hola, quiero saber más sobre los Agentes de IA de FlexGo.' },
    mercadito: { cat: 'Tiendas', titulo: 'Mi Mercadito', resumen: 'Un lugar en línea que reúne las tiendas de los negocios que usan Logrin Negocio.', datos: [['Para quién compra', 'Descubre productos y haz pedidos a las tiendas.'], ['Para quién vende', 'Tu tienda aparece ahí al usar Logrin Negocio.']], url: 'https://logrin.flexgogroup.com/?mercadito', boton: 'Visitar Mi Mercadito' },
  };
  const dialogo = $('#detalle');
  let origen = null;
  const enlaceBoton = (texto, href, clase) => {
    const a = document.createElement('a');
    a.className = `button ${clase}`;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = texto;
    return a;
  };
  $$('[data-detalle]').forEach((b) => b.addEventListener('click', () => {
    const d = DETALLES[b.dataset.detalle];
    origen = b;
    dialogo.classList.toggle('sin-imagen', !d.img);
    if (d.img) $('#detalle-imagen').src = `assets/imagenes/${d.img}`;
    $('#detalle-categoria').textContent = d.cat;
    $('#detalle-titulo').textContent = d.titulo;
    $('#detalle-resumen').textContent = d.resumen;
    const datos = $('#detalle-datos');
    datos.textContent = '';
    d.datos.forEach(([k, v]) => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      datos.append(dt, dd);
    });
    const acciones = $('#detalle-acciones');
    acciones.textContent = '';
    if (d.url) acciones.append(enlaceBoton(d.boton, d.url, 'button--primary'));
    if (d.chat) {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'button button--primary';
      c.textContent = 'Conversar con Kivo';
      c.addEventListener('click', () => { dialogo.close(); $('#chat-boton').click(); });
      acciones.append(c);
    }
    if (d.wa) acciones.append(enlaceBoton('Escribir por WhatsApp', wa(d.wa), d.url || d.chat ? 'button--outline' : 'button--primary'));
    dialogo.showModal();
  }));
  $('[data-cerrar-detalle]').addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  dialogo.addEventListener('close', () => origen?.focus({ preventScroll: true }));
  $$('[data-open-chat]').forEach((b) => b.addEventListener('click', () => $('#chat-boton').click()));

  /* Cómo trabajamos */
  const PASOS = {
    listen: 'Entendemos qué haces, qué te frena y qué quieres mejorar.',
    plan: 'Definimos contigo la solución, su alcance y los pasos para implementarla.',
    activate: 'Ponemos en marcha la solución con tu marca y te orientamos para usarla.',
    help: 'Resolvemos dudas y ajustamos lo necesario a medida que tu negocio avanza.',
  };
  const pasos = $$('[data-step]');
  pasos.forEach((b) => b.addEventListener('click', () => {
    pasos.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#proceso-detalle').textContent = PASOS[b.dataset.step];
  }));
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { e.target.classList.add('visto'); o.disconnect(); } }, { threshold: 0.2 }).observe($('.proceso'));

  /* Kivo: mirada y parpadeo */
  const hero = $('.hero');
  const arte = $('.hero-art');
  let heroVisible = true;
  let cuadro = 0;
  let px = 0, py = 0, gx = 0, gy = 0;
  let siguiendo = false;
  let parpadeo = 0;
  const haciaPunto = (cx, cy) => {
    const r = hero.getBoundingClientRect();
    px = clamp(((cx - r.left) / r.width) * 2 - 1, -1, 1);
    py = clamp(((cy - r.top) / r.height) * 2 - 1, -1, 1);
  };
  const animarKivo = (t) => {
    cuadro = 0;
    if (!heroVisible || sinMovimiento.matches || document.hidden) return;
    const activo = siguiendo;
    const tx = activo ? px : Math.sin(t / 2350) * 0.34;
    const ty = activo ? py : Math.sin(t / 1800) * 0.2;
    gx += (tx - gx) * 0.09;
    gy += (ty - gy) * 0.09;
    arte.style.setProperty('--robot-x', `${(gx * 12).toFixed(2)}px`);
    arte.style.setProperty('--robot-y', `${(gy * 8).toFixed(2)}px`);
    arte.style.setProperty('--gaze-x', `${(gx * 8).toFixed(2)}px`);
    arte.style.setProperty('--gaze-y', `${(gy * 4).toFixed(2)}px`);
    arte.style.setProperty('--aura-x', `${(gx * -23).toFixed(2)}px`);
    arte.style.setProperty('--aura-y', `${(gy * -18).toFixed(2)}px`);
    if (!parpadeo) parpadeo = t + 3150;
    const b = (t - parpadeo) / 190;
    arte.style.setProperty('--blink', (b >= 0 && b < 1 ? Math.max(0.09, Math.abs(b * 2 - 1)) : 1).toFixed(3));
    if (b >= 1) parpadeo = t + 3400 + Math.random() * 2300;
    cuadro = requestAnimationFrame(animarKivo);
  };
  const iniciarKivo = () => { if (!cuadro && heroVisible && !sinMovimiento.matches && !document.hidden) cuadro = requestAnimationFrame(animarKivo); };
  hero.addEventListener('pointermove', (e) => {
    if (!cursorFino.matches || e.pointerType === 'touch') return;
    haciaPunto(e.clientX, e.clientY);
    siguiendo = true;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { siguiendo = false; });
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; iniciarKivo(); }).observe(hero);
  document.addEventListener('visibilitychange', iniciarKivo);

  /* Recorrido con scroll */
  const peli = matchMedia('(prefers-reduced-motion: no-preference)');
  const vertical = matchMedia('(max-aspect-ratio: 1/1)');
  const palabras = (el) => {
    const texto = el.textContent.trim().split(' ');
    el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = '';
    return texto.map((p, i) => {
      const s = document.createElement('span');
      s.className = 'pal';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p + (i < texto.length - 1 ? ' ' : '');
      el.append(s);
      return s;
    });
  };
  const eco = $('.eco');
  const pista = $('.eco-pista');
  const slides = $$('.eco-slide');
  const contador = $('.contador-actual');
  const ROMANOS = ['I', 'II', 'III', 'IV'];
  const ecoPin = $('.eco-pin');
  const salida = $('.eco-salida');
  const mision = $('.mision');
  const textoMision = $('.mision-texto');
  const velo = $('.mision-pin');
  const frase1 = palabras($('.frase-1'));
  const frase2 = palabras($('.frase-2'));
  const astro = $('.astro');
  const pinAstro = $('.astro-pin');
  const textoAstro = $('.astro-texto');
  const marco = $('.pantalla-marco');
  const servicios = $$('.servicio');
  const puntos = $$('.pantalla-puntos li');
  const reloj = $('.reloj');
  const pinReloj = $('.reloj-pin');
  const rejilla = $('.reloj-grid');
  const pasosReloj = [2, 3, 4].map((n) => $$(`.r-${n}`));
  const proceso = $('.proceso');
  const pinProceso = $('.proceso-pin');
  const pantallaProceso = $('.proceso-pantalla');
  const detalleProceso = $('#proceso-detalle');
  const lienzo = {
    eco: $('.eco-salida .peli'),
    mision: $('.mision-pin .peli'),
    astro: $('.astro-pin .peli'),
    reloj: $('.reloj-pin .peli'),
  };

  /* Película: los fotogramas de cada video se dibujan según el avance del scroll.
     Los videos van en cadena (el último cuadro de uno es el primero del siguiente). */
  const CUADROS = 80;
  // Pantallas de laptop dentro del último cuadro, en proporción del cuadro
  const PANTALLA = {
    'V4-H': { x: 0.026, y: 0.042, w: 0.948, h: 0.915 },
    'V4-V': { x: 0.017, y: 0.322, w: 0.966, h: 0.326 },
    'V6-H': { x: 0.296, y: 0.423, w: 0.406, h: 0.394 },
    'V6-V': { x: 0.166, y: 0.384, w: 0.67, h: 0.202 },
  };
  const orient = () => (vertical.matches ? 'V' : 'H');
  const proporcion = () => (vertical.matches ? 9 / 16 : 16 / 9);
  // Primero el inicio y el final; luego se va rellenando, para poder mostrar algo cercano mientras carga
  const ORDEN = (() => {
    const o = [0, CUADROS - 1];
    for (let paso = 16; paso >= 1; paso /= 2) for (let i = 0; i < CUADROS; i += paso) if (!o.includes(i)) o.push(i);
    return o;
  })();
  const secuencias = {};
  const secuencia = (v) => {
    const k = `${v}-${orient()}`;
    if (!secuencias[k]) secuencias[k] = { k, imgs: new Array(CUADROS), cola: null, listos: 0 };
    return secuencias[k];
  };
  let cargando = 0;
  const esperando = [];
  const bajar = () => {
    while (cargando < 6 && esperando.length) {
      const [s, i] = esperando.shift();
      cargando++;
      const img = new Image();
      img.decoding = 'async';
      img.src = `assets/peli/${s.k}/${String(i + 1).padStart(3, '0')}.webp`;
      img.decode().then(() => { s.imgs[i] = img; s.listos++; pedir(); }, () => {}).finally(() => { cargando--; bajar(); });
    }
  };
  const cargar = (...vs) => vs.forEach((v) => {
    const s = secuencia(v);
    if (s.cola) return;
    s.cola = true;
    ORDEN.forEach((i) => esperando.push([s, i]));
    bajar();
  });
  const cercano = (s, i) => {
    for (let d = 0; d < CUADROS; d++) {
      if (s.imgs[i - d]) return s.imgs[i - d];
      if (s.imgs[i + d]) return s.imgs[i + d];
    }
    return null;
  };
  // Cómo queda un cuadro que cubre una caja (igual que object-fit: cover)
  const cubrir = (W, H, r) => {
    const k = Math.max(W / r, H);
    return { w: r * k, h: k, x: (W - r * k) / 2, y: (H - k) / 2 };
  };
  const enCaja = (W, H, zona) => {
    const c = cubrir(W, H, proporcion());
    return { x: c.x + zona.x * c.w, y: c.y + zona.y * c.h, w: zona.w * c.w, h: zona.h * c.h };
  };
  const dibujado = new WeakMap();
  const dibujar = (cv, v, t) => {
    const s = secuencia(v);
    cargar(v);
    const x = clamp(t) * (CUADROS - 1);
    const i = Math.floor(x);
    const f = x - i;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const W = cv.clientWidth;
    const H = cv.clientHeight;
    if (!W || !H) return;
    const clave = `${s.k}|${i}|${f.toFixed(2)}|${s.listos}|${W}x${H}`;
    if (dibujado.get(cv) === clave) return;
    const a = s.imgs[i] || cercano(s, i);
    if (!a) return;
    dibujado.set(cv, clave);
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
    }
    const ctx = cv.getContext('2d');
    const c = cubrir(cv.width, cv.height, a.naturalWidth / a.naturalHeight);
    ctx.globalAlpha = 1;
    ctx.drawImage(a, c.x, c.y, c.w, c.h);
    // Mezcla con el cuadro siguiente para que el avance se vea continuo
    const b = s.imgs[i + 1];
    if (b && a === s.imgs[i] && f > 0.04) {
      ctx.globalAlpha = f;
      ctx.drawImage(b, c.x, c.y, c.w, c.h);
      ctx.globalAlpha = 1;
    }
  };
  const cerca = (el, alto, margen = 1.5) => {
    const r = el.getBoundingClientRect();
    return r.bottom > -alto * margen && r.top < alto * (1 + margen);
  };
  const enVista = (el, alto) => {
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < alto;
  };

  // Una escena que se superpone a la anterior se muestra recién cuando se fija, para que no se vea subir.
  const fijada = (sec, pin, cab) => {
    const si = sec.getBoundingClientRect().top <= cab + 1;
    pin.style.setProperty('--visible', si ? '1' : '0');
    return si;
  };
  // Avance de una sección con escena fija: 0 al fijarse, 1 al soltarse. `resto` descuenta lo que tapa la siguiente.
  const avance = (el, alto, cab, resto = 0) => {
    const r = el.getBoundingClientRect();
    return clamp((cab - r.top) / Math.max(1, r.height - (alto - cab) - resto));
  };
  // Posición entre varias paradas, con pausa en cada una. Devuelve la posición y cuánto va del cambio.
  const paradas = (p, n) => {
    const q = p * (n - 1);
    const i = Math.min(n - 2, Math.floor(q));
    const m = tramo(q - i, 0.28, 0.72);
    return { pos: i + suave(m), cambio: Math.sin(Math.PI * m) };
  };
  const ponPx = (el, nombre, v) => el.style.setProperty(nombre, `${v.toFixed(1)}px`);

  const pintar = () => {
    const alto = innerHeight;
    const cab = header.offsetHeight;
    const ancha = cine.matches;

    let actual = enlaces[0].link;
    let cercaTop = -Infinity;
    enlaces.forEach(({ link, destino }) => {
      const top = destino.getBoundingClientRect().top;
      if (top <= cab + 120 && top >= cercaTop) { cercaTop = top; actual = link; }
    });
    enlaces.forEach(({ link }) => (link === actual ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current')));

    if (!peli.matches) return;

    // Precarga: los videos de una escena empiezan a bajar cuando la escena se acerca
    if (cerca(eco, alto)) cargar('V1');
    if (cerca(mision, alto)) cargar('V1', 'V2');
    if (cerca(astro, alto)) cargar('V3', 'V4');
    if (cerca(reloj, alto, 2.5)) cargar('V5', 'V6');

    if (ancha) { // Ecosistema: el producto se encoge a tarjeta y pasa al siguiente; al final, el video 1 lleva al cohete
      const p = avance(eco, alto, cab);
      const { pos, cambio } = paradas(tramo(p, 0, 0.72), slides.length);
      const ancho = pista.clientWidth;
      slides.forEach((s, i) => {
        const d = i - pos;
        s.style.setProperty('--x', `${(d * ancho * (1 - 0.3 * cambio)).toFixed(1)}px`);
        s.style.setProperty('--s', (1 - 0.36 * cambio).toFixed(4));
        s.style.setProperty('--r', `${(28 + cambio * 22).toFixed(1)}px`);
        s.style.setProperty('--o', clamp(1 - cambio * 2.4).toFixed(3));
        s.inert = Math.abs(d) > 0.5 || p > 0.76;
      });
      contador.textContent = ROMANOS[Math.round(pos)];
      const z = suave(tramo(p, 0.74, 0.84));
      ecoPin.style.setProperty('--ez', (1 - z * 0.12).toFixed(4));
      ecoPin.style.setProperty('--eo', (1 - z).toFixed(3));
      salida.style.setProperty('--so', tramo(p, 0.75, 0.82).toFixed(3));
      if (enVista(eco, alto) && p > 0.7) dibujar(lienzo.eco, 'V1', tramo(p, 0.8, 1));
    }

    { // Misión: la frase junto al astronauta y, al final, el video 2 entra a su casco
      const visible = ancha ? fijada(mision, velo, cab) : true;
      if (!ancha) velo.style.setProperty('--visible', '1');
      const bruto = ancha ? avance(mision, alto, cab, alto - cab) : avance(mision, alto, cab, alto - cab);
      // En celular el video 1 ocurre aquí mismo, antes de la frase
      const inicio = ancha ? 0 : 0.26;
      const p = tramo(bruto, inicio, 1);
      const d = tramo(p, 0.62, 1);
      if (visible && cerca(mision, alto, 0.2)) {
        if (!ancha && bruto < inicio) dibujar(lienzo.mision, 'V1', tramo(bruto, 0, inicio * 0.92));
        else dibujar(lienzo.mision, 'V2', d);
      }
      velo.style.setProperty('--mv', (tramo(p, 0.02, 0.18) * (1 - tramo(d, 0, 0.3))).toFixed(3));
      textoMision.style.setProperty('--tf', (1 - tramo(p, 0.56, 0.62)).toFixed(3));
      frase1.forEach((s, i) => s.style.setProperty('--po', tramo(p, 0.03 + i * 0.025, 0.09 + i * 0.025).toFixed(2)));
      frase2.forEach((s, i) => {
        s.style.setProperty('--po', tramo(p, 0.22 + i * 0.022, 0.28 + i * 0.022).toFixed(2));
        s.style.setProperty('--pc', `${(tramo(p, 0.3 + i * 0.024, 0.4 + i * 0.024) * 100).toFixed(0)}%`);
      });
    }

    { // Astronauta: el video 3 sale de su casco, aparece el texto y el video 4 entra a la pantalla de la laptop
      const visible = fijada(astro, pinAstro, cab);
      const p = avance(astro, alto, cab, alto - cab);
      const a = clamp(p / 0.46);
      if (visible && cerca(astro, alto, 0.2)) {
        if (a < 0.5) dibujar(lienzo.astro, 'V3', tramo(a, 0, 0.36));
        else dibujar(lienzo.astro, 'V4', tramo(a, 0.6, 0.93));
      }
      textoAstro.style.setProperty('--to', (suave(tramo(a, 0.37, 0.45)) * (1 - tramo(a, 0.54, 0.6))).toFixed(3));

      // Los servicios se encienden sobre la pantalla del último cuadro
      const W = pinAstro.clientWidth;
      const H = pinAstro.clientHeight;
      const z = enCaja(W, H, PANTALLA[`V4-${orient()}`]);
      const e = ancha ? 0 : suave(tramo(a, 0.95, 1));
      const borde = 10;
      const x0 = Math.max(borde, z.x);
      const x1 = Math.min(W - borde, z.x + z.w);
      ponPx(marco, '--ml', lerp(x0, borde, e));
      ponPx(marco, '--mt', lerp(z.y, borde, e));
      ponPx(marco, '--mw', lerp(x1 - x0, W - borde * 2, e));
      ponPx(marco, '--mh', lerp(z.h, H - borde * 2, e));
      const m = tramo(a, 0.93, 0.99);
      marco.style.setProperty('--mo', m.toFixed(3));
      marco.classList.toggle('apagada', m === 0);

      const { pos } = paradas(tramo(p, 0.5, 1), servicios.length);
      servicios.forEach((s, i) => {
        const d = i - pos;
        s.style.setProperty('--so', clamp(1 - Math.abs(d) * 1.9).toFixed(3));
        s.style.setProperty('--ax', `${(d * -110).toFixed(1)}px`);
        s.style.setProperty('--as', (1 - Math.min(1, Math.abs(d)) * 0.14).toFixed(4));
        s.style.setProperty('--cx', `${(d * 70).toFixed(1)}px`);
        const activo = Math.abs(d) < 0.5 && m > 0.98;
        s.classList.toggle('activo', activo);
        s.inert = !activo;
        puntos[i].classList.toggle('activo', Math.abs(d) < 0.5);
      });
    }

    { // Reloj: aparece al irse las preguntas (video 5), muestra el mensaje y el video 6 lleva a "Cómo trabajamos"
      const visible = fijada(reloj, pinReloj, cab);
      const p = avance(reloj, alto, cab);
      // Mientras se van las preguntas se ve la misma pantalla que taparon; luego corre el video 5
      const ida = Math.min(0.35, (alto - cab) / Math.max(1, reloj.offsetHeight - (alto - cab)));
      if (visible && cerca(reloj, alto, 0.2)) {
        if (p < 0.6) dibujar(lienzo.reloj, 'V5', tramo(p, ida, ida + 0.24));
        else dibujar(lienzo.reloj, 'V6', tramo(p, 0.76, 1));
      }
      pasosReloj.forEach((grupo, i) => grupo.forEach((el) => el.style.setProperty('--o', suave(tramo(p, ida + 0.25 + i * 0.05, ida + 0.32 + i * 0.05)).toFixed(3))));
      rejilla.style.setProperty('--eo', (1 - suave(tramo(p, 0.7, 0.76))).toFixed(3));
      rejilla.inert = p > 0.73;
    }

    { // Cómo trabajamos: la misma imagen con la que termina el video 6, con los botones sobre la pantalla
      if (fijada(proceso, pinProceso, cab)) proceso.classList.add('visto');
      const W = pinProceso.clientWidth;
      const H = pinProceso.clientHeight;
      const z = enCaja(W, H, PANTALLA[`V6-${orient()}`]);
      ponPx(pantallaProceso, '--pl', z.x);
      ponPx(pantallaProceso, '--pt', z.y);
      ponPx(pantallaProceso, '--pw', z.w);
      ponPx(pantallaProceso, '--ph', z.h);
      ponPx(detalleProceso, '--pl', z.x);
      ponPx(detalleProceso, '--pt', z.y);
      ponPx(detalleProceso, '--pw', z.w);
      ponPx(detalleProceso, '--ph', z.h);
    }
  };

  let pendiente = 0;
  const pedir = () => { if (!pendiente) pendiente = requestAnimationFrame(() => { pendiente = 0; pintar(); }); };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir, { passive: true });
  const reiniciar = () => {
    $$('[inert]').forEach((el) => { el.inert = false; });
    pedir();
  };
  cine.addEventListener('change', reiniciar);
  peli.addEventListener('change', reiniciar);
  vertical.addEventListener('change', pedir);
  pintar();
})();
