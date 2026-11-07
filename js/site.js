(() => {
  const D = window.FLEXGO;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const wa = (texto) => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(texto)}`;

  $$('[data-wa]').forEach((a) => {
    a.href = wa(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Un servicio con enlace propio manda ahí; si no, se queda con su acción por defecto.
  $$('[data-enlace]').forEach((a) => {
    const url = D.enlaces[a.dataset.enlace];
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  $('#contacto-correo').href = `mailto:${D.correo}`;
  $('#contacto-correo').textContent = D.correo;
  $('#dato-horario').textContent = D.horario;
  $('#dato-ubicacion').textContent = D.ubicacion;
  $('#anio').textContent = new Date().getFullYear();

  const redes = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok' };
  $('#redes').append(
    ...Object.entries(redes)
      .filter(([k]) => D.redes[k])
      .map(([k, nombre]) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = D.redes[k];
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = nombre;
        li.append(a);
        return li;
      })
  );

  if (D.aliados.length) {
    const lista = $('#aliados-lista');
    lista.hidden = false;
    D.aliados.forEach(({ nombre, logo, web }) => {
      const li = document.createElement('li');
      const a = document.createElement(web ? 'a' : 'div');
      if (web) {
        a.href = web;
        a.target = '_blank';
        a.rel = 'noopener';
      }
      if (logo) {
        const img = document.createElement('img');
        img.src = logo;
        img.alt = nombre;
        img.loading = 'lazy';
        a.append(img);
      } else {
        a.textContent = nombre;
      }
      li.append(a);
      lista.append(li);
    });
  }

  const faq = $('#faq');
  window.FLEXGO_FAQ.forEach(({ p, r }) => {
    const det = document.createElement('details');
    det.className = 'revela';
    const sum = document.createElement('summary');
    sum.textContent = p;
    const txt = document.createElement('p');
    txt.textContent = r;
    det.append(sum, txt);
    faq.append(det);
  });

  const nav = $('#nav');
  const menu = $('#nav-menu');
  const enlaces = $('#nav-enlaces');
  const cerrarMenu = () => {
    enlaces.classList.remove('abierto');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  };
  menu.addEventListener('click', () => {
    const abrir = menu.getAttribute('aria-expanded') !== 'true';
    enlaces.classList.toggle('abierto', abrir);
    menu.setAttribute('aria-expanded', String(abrir));
    menu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = abrir ? 'hidden' : '';
  });
  enlaces.addEventListener('click', (e) => {
    if (e.target.closest('a')) cerrarMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && enlaces.classList.contains('abierto')) {
      cerrarMenu();
      menu.focus();
    }
  });

  const revelar = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visto');
          revelar.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  $$('.revela').forEach((el) => revelar.observe(el));

  const manifiesto = $('#manifiesto');
  const palabras = manifiesto.textContent.trim().split(' ');
  manifiesto.setAttribute('aria-label', manifiesto.textContent);
  manifiesto.textContent = '';
  const spans = palabras.map((p, i) => {
    const s = document.createElement('span');
    s.className = 'pal';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = p + (i < palabras.length - 1 ? ' ' : '');
    manifiesto.append(s);
    return s;
  });

  const alMover = () => {
    nav.classList.toggle('fija', scrollY > 24);
    const r = manifiesto.getBoundingClientRect();
    const avance = (innerHeight * 0.9 - r.top) / (r.height + innerHeight * 0.45);
    const n = Math.round(Math.min(1, Math.max(0, avance)) * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  let pendiente = false;
  addEventListener(
    'scroll',
    () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        alMover();
        pendiente = false;
      });
    },
    { passive: true }
  );
  addEventListener('resize', alMover, { passive: true });
  alMover();
})();
