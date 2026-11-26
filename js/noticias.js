// Noticias: lee datos/noticias.json (lo escribe cada mañana el robot de GitHub) y la suscripción «Recibe las novedades».
(() => {
  'use strict';
  const D = window.FLEXGO;
  const $ = (s, r = document) => r.querySelector(s);
  const lista = $('#nt-lista');
  const filtros = $('#nt-filtros');
  const NOMBRE = { tecnologia: 'Tecnología', innovacion: 'Innovación', finanzas: 'Finanzas', educacion: 'Educación' };
  const INVITA = {
    kivo: ['¿Quieres atender a tus clientes a toda hora?', 'Conoce Kivo', 'kivo.html'],
    logrin: ['¿Tus ventas e inventario siguen en cuaderno?', 'Conoce Logrin', 'https://logrin.flexgogroup.com/'],
    creago: ['¿Te falta tiempo para tus redes?', 'Conoce CreaGo', 'creago.html'],
    webs: ['¿Tu negocio aún no tiene web?', 'Ver planes de web', 'paginas-web.html'],
  };
  let todas = [];
  let actual = 'todas';

  const el = (tag, clase, txt) => {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (txt != null) e.textContent = txt;
    return e;
  };
  const fecha = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const seguro = (u) => (/^https:\/\//.test(u) ? u : '#');

  const tarjeta = (n) => {
    const art = el('article', `vidrio nt-card nt-${n.categoria}`);
    const meta = el('p', 'nt-meta');
    meta.append(el('span', 'nt-cat', NOMBRE[n.categoria] || 'Noticias'), el('time', '', fecha(n.fecha)));
    meta.lastChild.dateTime = n.fecha;
    const h = el('h3', '', n.titulo);
    const p = el('p', 'nt-resumen', n.resumen);
    const fuente = el('a', 'nt-fuente', `Leer la nota completa en ${n.fuente} ↗`);
    fuente.href = seguro(n.enlace);
    fuente.target = '_blank';
    fuente.rel = 'noopener nofollow';
    art.append(meta, h, p, fuente);
    const inv = INVITA[n.servicio];
    if (inv) {
      const c = el('p', 'nt-invita', `${inv[0]} `);
      const a = el('a', '', `${inv[1]} →`);
      a.href = inv[2];
      c.append(a);
      art.append(c);
    }
    return art;
  };

  const pintar = () => {
    const ver = actual === 'todas' ? todas : todas.filter((n) => n.categoria === actual);
    lista.replaceChildren(...ver.map(tarjeta));
    if (!ver.length) lista.append(el('p', 'vidrio nt-vacio', todas.length ? 'Todavía no hay noticias de este tema. Vuelve mañana.' : 'Muy pronto: estamos preparando las primeras noticias. Déjanos tu contacto abajo y te avisamos cuando salgan.'));
    filtros.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === actual)));
  };

  filtros.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (!b) return;
    actual = b.dataset.cat;
    pintar();
  });

  fetch(`datos/noticias.json?d=${new Date().toISOString().slice(0, 13)}`)
    .then((r) => (r.ok ? r.json() : { noticias: [] }))
    .catch(() => ({ noticias: [] }))
    .then((d) => {
      todas = (d.noticias || []).filter((n) => n && n.titulo && n.resumen);
      const act = $('#nt-actualizado');
      if (act && d.actualizado) act.textContent = `Actualizado el ${fecha(d.actualizado)}.`;
      pintar();
    });

  // Suscripción: entra a la bandeja de interesados de la consola (R-132), con el servicio «Boletín de noticias».
  const form = $('#nt-form');
  if (!form || !D?.kivo?.clave) return;
  const estado = $('.estado', form);
  const f = form.elements;
  const decir = (t, tipo) => { estado.className = `estado ${tipo || ''}`; estado.textContent = t; };
  const limpio = (v) => (v || '').trim().replace(/\s+/g, ' ');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (f.web.value) { form.reset(); decir('¡Listo! Te enviaremos las novedades.', 'ok'); return; }
    const contacto = limpio(f.contacto.value);
    const esCorreo = contacto.includes('@');
    const d = {
      nombre: limpio(f.nombre.value),
      correo: esCorreo ? contacto : '',
      whatsapp: esCorreo ? '' : contacto,
      empresa: '',
      servicio: 'Boletín de noticias',
      mensaje: `Quiero recibir las novedades de FlexGo por ${esCorreo ? 'correo' : 'WhatsApp'}.`,
      sitio: '',
    };
    if (d.nombre.length < 2) { decir('Escribe tu nombre.', 'error'); f.nombre.focus(); return; }
    if (!contacto) { decir('Déjanos tu WhatsApp o tu correo.', 'error'); f.contacto.focus(); return; }
    if (!f.acepto.checked) { decir('Marca la casilla para aceptar la política de privacidad.', 'error'); f.acepto.focus(); return; }
    const boton = $('button[type="submit"]', form);
    boton.disabled = true;
    decir('Enviando…');
    try {
      const r = await fetch(`${D.kivo.url}/rest/v1/rpc/contacto_web_enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: D.kivo.clave, Authorization: `Bearer ${D.kivo.clave}` },
        body: JSON.stringify({ p: d }),
      });
      if (r.status === 400) {
        const j = await r.json().catch(() => ({}));
        decir(j.message || 'Revisa tus datos.', 'error');
      } else if (!r.ok) {
        throw new Error(String(r.status));
      } else {
        form.reset();
        decir('¡Listo! Te enviaremos las novedades.', 'ok');
      }
    } catch {
      decir('No pudimos guardar tus datos. Escríbenos «novedades» al WhatsApp 917 952 528.', 'error');
    } finally {
      boton.disabled = false;
    }
  });
})();
