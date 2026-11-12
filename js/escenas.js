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
  const salidaFoto = $('.eco-salida .mision-foto');
  const mision = $('.mision');
  const casco = $('.mision-casco');
  const textoMision = $('.mision-texto');
  const foto = $('.mision-pin .mision-foto');
  const velo = $('.mision-pin');
  const frase1 = palabras($('.frase-1'));
  const frase2 = palabras($('.frase-2'));
  const astro = $('.astro');
  const pinAstro = $('.astro-pin');
  const figura = $('.astro-figura');
  const oscuro = $('.astro-oscuro');
  const textoAstro = $('.astro-texto');
  const marco = $('.pantalla-marco');
  const servicios = $$('.servicio');
  const puntos = $$('.pantalla-puntos li');
  const reloj = $('.reloj');
  const rejilla = $('.reloj-grid');
  const pasosReloj = [1, 2, 3, 4].map((n) => $$(`.r-${n}`));
  const arteReloj = $('.reloj-arte');
  // Pantalla de la laptop dentro de la imagen del astronauta, en proporción de la imagen
  const PANT = { x: 0.2985, y: 0.4348, w: 0.5283, h: 0.2993 };
  // Una escena que se superpone a la anterior se muestra recién cuando se fija, para que no se vea subir.
  const fijada = (sec, pin, cab) => pin.style.setProperty('--visible', sec.getBoundingClientRect().top <= cab + 1 ? '1' : '0');

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

  const pintar = () => {
    const alto = innerHeight;
    const cab = header.offsetHeight;

    let actual = enlaces[0].link;
    let cerca = -Infinity;
    enlaces.forEach(({ link, destino }) => {
      const top = destino.getBoundingClientRect().top;
      if (top <= cab + 120 && top >= cerca) { cerca = top; actual = link; }
    });
    enlaces.forEach(({ link }) => (link === actual ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current')));

    if (!cine.matches) return;

    { // Ecosistema: el producto se encoge a tarjeta y pasa al siguiente; al final, zoom hacia la escena del cohete
      const p = avance(eco, alto, cab);
      const { pos, cambio } = paradas(tramo(p, 0, 0.74), slides.length);
      const ancho = pista.clientWidth;
      slides.forEach((s, i) => {
        const d = i - pos;
        s.style.setProperty('--x', `${(d * ancho * (1 - 0.3 * cambio)).toFixed(1)}px`);
        s.style.setProperty('--s', (1 - 0.36 * cambio).toFixed(4));
        s.style.setProperty('--r', `${(28 + cambio * 22).toFixed(1)}px`);
        s.style.setProperty('--o', clamp(1 - cambio * 2.4).toFixed(3));
        s.inert = Math.abs(d) > 0.5 || p > 0.78;
      });
      contador.textContent = ROMANOS[Math.round(pos)];
      const z = suave(tramo(p, 0.76, 0.92));
      ecoPin.style.setProperty('--ez', (1 + z * 0.9).toFixed(4));
      ecoPin.style.setProperty('--eo', (1 - tramo(z, 0.25, 0.85)).toFixed(3));
      // La escena del cohete llega desde lejos y queda igual a como empieza la sección siguiente
      const f = suave(tramo(p, 0.8, 1));
      salida.style.setProperty('--so', tramo(p, 0.78, 0.86).toFixed(3));
      salidaFoto.style.setProperty('--mz', lerp(2.4, 1.04, f).toFixed(4));
      salidaFoto.style.setProperty('--mx', '-80px');
    }

    { // Misión: la frase al costado del astronauta y, al final, zoom dentro de su casco
      fijada(mision, velo, cab);
      const p = avance(mision, alto, cab, alto - cab);
      const d = suave(tramo(p, 0.62, 1));
      foto.style.setProperty('--mx', '-80px');
      foto.style.setProperty('--mz', (1.04 + suave(tramo(p, 0, 0.55)) * 0.06 + d * d * 5.5).toFixed(4));
      foto.style.transformOrigin = d > 0 ? '34% 22%' : '30% 45%';
      velo.style.setProperty('--mv', (tramo(p, 0.02, 0.18) * (1 - d)).toFixed(3));
      casco.style.setProperty('--co', tramo(d, 0.72, 1).toFixed(3));
      textoMision.style.setProperty('--tf', (1 - tramo(p, 0.56, 0.64)).toFixed(3));
      frase1.forEach((s, i) => s.style.setProperty('--po', tramo(p, 0.03 + i * 0.025, 0.09 + i * 0.025).toFixed(2)));
      frase2.forEach((s, i) => {
        s.style.setProperty('--po', tramo(p, 0.22 + i * 0.022, 0.28 + i * 0.022).toFixed(2));
        s.style.setProperty('--pc', `${(tramo(p, 0.3 + i * 0.024, 0.4 + i * 0.024) * 100).toFixed(0)}%`);
      });
    }

    { // Astronauta: sale desde su casco, aparece el texto y la cámara entra a la pantalla de la laptop
      fijada(astro, pinAstro, cab);
      const p = avance(astro, alto, cab, alto - cab);
      const a = clamp(p / 0.46);
      const fw = figura.offsetWidth;
      const fh = figura.offsetHeight;
      const L = figura.offsetLeft;
      const T = figura.offsetTop;
      oscuro.style.setProperty('--co', (1 - suave(tramo(a, 0, 0.07))).toFixed(3));
      const t = suave(tramo(a, 0.66, 1));
      const mL = marco.offsetLeft;
      const mT = marco.offsetTop;
      const mW = marco.offsetWidth;
      const mH = marco.offsetHeight;
      let sc;
      let ox = 0.5;
      let oy = 0.23;
      let tx = 0;
      let ty = 0;
      if (a < 0.66) {
        sc = lerp(3.6, 1, suave(tramo(a, 0, 0.42)));
      } else {
        ox = PANT.x + PANT.w / 2;
        oy = PANT.y + PANT.h / 2;
        sc = lerp(1, mW / (fw * PANT.w), t);
        tx = (mL + mW / 2 - (L + ox * fw)) * t;
        ty = (mT + mH / 2 - (T + oy * fh)) * t;
      }
      figura.style.setProperty('--ox', `${(ox * 100).toFixed(2)}%`);
      figura.style.setProperty('--oy', `${(oy * 100).toFixed(2)}%`);
      figura.style.setProperty('--sc', sc.toFixed(4));
      figura.style.setProperty('--tx', `${tx.toFixed(1)}px`);
      figura.style.setProperty('--ty', `${ty.toFixed(1)}px`);
      figura.style.setProperty('--fo', (1 - tramo(t, 0.88, 1)).toFixed(3));
      textoAstro.style.setProperty('--to', (suave(tramo(a, 0.4, 0.52)) * (1 - tramo(a, 0.6, 0.68))).toFixed(3));

      // La pantalla nítida se coloca sobre la de la imagen y crece con ella: así el zoom no se pixela
      const Ox = L + ox * fw;
      const Oy = T + oy * fh;
      const px = Ox + (L + PANT.x * fw - Ox) * sc + tx;
      const py = Oy + (T + PANT.y * fh - Oy) * sc + ty;
      const pw = PANT.w * fw * sc;
      const ph = PANT.h * fh * sc;
      const k = Math.min(1, pw / mW);
      const recorte = Math.max(0, (mH - ph / k) / 2);
      marco.style.setProperty('--mk', k.toFixed(5));
      marco.style.setProperty('--mx', `${(px - mL).toFixed(1)}px`);
      marco.style.setProperty('--my', `${(py - mT - recorte * k).toFixed(1)}px`);
      marco.style.setProperty('--mi', `${recorte.toFixed(1)}px`);
      const m = a < 0.66 ? 0 : tramo(t, 0.04, 0.2);
      marco.style.setProperty('--mo', m.toFixed(3));
      marco.classList.toggle('apagada', m === 0);

      const { pos } = paradas(tramo(p, 0.5, 1), servicios.length);
      servicios.forEach((s, i) => {
        const d = i - pos;
        s.style.setProperty('--so', clamp(1 - Math.abs(d) * 1.9).toFixed(3));
        s.style.setProperty('--ax', `${(d * -110).toFixed(1)}px`);
        s.style.setProperty('--as', (1 - Math.min(1, Math.abs(d)) * 0.14).toFixed(4));
        s.style.setProperty('--cx', `${(d * 70).toFixed(1)}px`);
        const activo = Math.abs(d) < 0.5 && t > 0.98;
        s.classList.toggle('activo', activo);
        s.inert = !activo;
        puntos[i].classList.toggle('activo', Math.abs(d) < 0.5);
      });
    }

    { // Reloj: entra por etapas y sale hacia un lado
      const r = reloj.getBoundingClientRect();
      const p = clamp((alto * 0.55 - r.top) / Math.max(1, r.height - (alto - cab) + alto * 0.55));
      pasosReloj.forEach((grupo, i) => grupo.forEach((el) => el.style.setProperty('--o', suave(tramo(p, 0.06 + i * 0.1, 0.2 + i * 0.1)).toFixed(3))));
      arteReloj.style.setProperty('--rz', (1.08 - suave(tramo(p, 0, 0.4)) * 0.08).toFixed(4));
      const salida = suave(tramo(p, 0.72, 1));
      [rejilla, arteReloj].forEach((el) => {
        el.style.setProperty('--ex', `${(-salida * innerWidth * 0.9).toFixed(1)}px`);
        el.style.setProperty('--eo', (1 - salida).toFixed(3));
      });
    }
  };

  let pendiente = 0;
  const pedir = () => { if (!pendiente) pendiente = requestAnimationFrame(() => { pendiente = 0; pintar(); }); };
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir, { passive: true });
  cine.addEventListener('change', () => {
    $$('[inert]').forEach((el) => { el.inert = false; });
    pedir();
  });
  pintar();
})();
