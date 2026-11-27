// Reseñas reales de los productos de FlexGo (componente único, 27-nov; reemplaza a elio-resenas.js).
// Cada producto declara en FLEXGO_SERVICIOS de dónde lee sus reseñas aprobadas dentro de su app:
//   resenas: { proyecto: 'elio', rpc: 'elio_resenas_publicas' }   (proyecto = clave de window.FLEXGO con url y clave pública)
// La función pública responde SIEMPRE con el mismo formato:
//   { total, promedio, resenas: [{ estrellas, texto, nombre, plan, fecha }] }
// Reglas (Indecopi): solo reseñas reales y aprobadas; nada de ejemplo; el promedio y el AggregateRating
// solo con 3 o más reseñas; las negativas también se muestran (el filtro de insultos y datos personales lo hace la app).
//
// Uso en una página de producto: <section data-resenas="elio" hidden> con .rs-lead, .rs-lista y .rs-dejar dentro.
//   Si el producto aún no tiene función de reseñas, la sección queda oculta. Si la tiene y no hay reseñas,
//   se muestra el texto «Sé de los primeros…» con el botón para dejarla en la app.
// Uso en la portada: <section data-resenas-franja hidden> con .rs-lista: la reseña más reciente de cada producto;
//   solo aparece si hay al menos una reseña real.
(() => {
  'use strict';
  const D = window.FLEXGO || {};
  const S = window.FLEXGO_SERVICIOS || [];
  const MIN_PROMEDIO = 3;

  const el = (tag, props = {}, ...hijos) => { const n = Object.assign(document.createElement(tag), props); n.append(...hijos); return n; };
  const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  const fecha = (f) => {
    const d = new Date(`${String(f).slice(0, 10)}T12:00:00`);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const coma = (n) => n.toFixed(1).replace('.', ',');

  const cache = {};
  const traer = (s) => {
    const r = s.resenas;
    const p = D[r?.proyecto];
    if (!r?.rpc || !p?.url || !p?.clave) return Promise.resolve(null);
    cache[s.id] ??= fetch(`${p.url}/rest/v1/rpc/${r.rpc}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: p.clave, Authorization: `Bearer ${p.clave}` },
      body: JSON.stringify(r.cuerpo || {}),
    }).then((x) => (x.ok ? x.json() : null)).then((d) => {
      const lista = (Array.isArray(d?.resenas) ? d.resenas : [])
        .filter((x) => x && String(x.texto || '').trim() && Number(x.estrellas) >= 1 && Number(x.estrellas) <= 5);
      const total = Math.max(Number(d?.total) || 0, lista.length);
      const promedio = Number(d?.promedio);
      return { total, promedio: Number.isFinite(promedio) ? promedio : null, lista };
    }).catch(() => null);
    return cache[s.id];
  };

  const tarjeta = (s, x, conProducto = false) => {
    const n = Math.round(Number(x.estrellas));
    const quien = String(x.nombre || '').trim().slice(0, 40) || `Usuario de ${s.nombre}`;
    const pie = [quien, x.plan ? `plan ${String(x.plan).slice(0, 20)}` : '', fecha(x.fecha)].filter(Boolean).join(' · ');
    return el('article', { className: 'rs-resena' },
      conProducto ? el('p', { className: 'rs-producto' }, s.nombre) : '',
      el('p', { className: 'rs-estrellas', role: 'img', ariaLabel: `${n} de 5 estrellas` }, estrellas(n)),
      el('p', { className: 'rs-texto' }, `«${String(x.texto).trim().slice(0, 400)}»`),
      el('p', { className: 'rs-autor' }, pie));
  };
  const tarjetaFranja = (s, x) => { const t = tarjeta(s, x, true); t.dataset.sv = s.id; return t; };

  // Datos estructurados: solo con reseñas reales y desde 3 reseñas.
  const datosEstructurados = (s, d) => {
    if (d.total < MIN_PROMEDIO || d.promedio === null) return;
    if (document.head.querySelector(`script[data-resenas="${s.id}"]`)) return; // una sola vez por producto
    const ld = el('script', { type: 'application/ld+json' });
    ld.dataset.resenas = s.id;
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: s.nombre, applicationCategory: 'BusinessApplication',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: Number(d.promedio.toFixed(1)), reviewCount: d.total, bestRating: 5, worstRating: 1 },
    });
    document.head.append(ld);
  };

  // Botón «Dejar mi reseña» en las tarjetas de «Ver todos los servicios» (27-nov): lleva al producto, donde la persona
  // entra con su correo y escribe la reseña. La web no guarda reseñas. Solo en productos con su función de reseñas.
  document.querySelectorAll('.sv-card[data-servicio]').forEach((card) => {
    const s = S.find((x) => x.id === card.dataset.servicio);
    const url = s?.resenas && (s.resenas.dejar || s.acceso?.url);
    const acciones = card.querySelector('.sv-acciones');
    if (!url || !acciones || acciones.querySelector('.sv-resena')) return;
    acciones.append(el('a', { className: 'sv-resena', href: url, target: '_blank', rel: 'noopener' }, '★ Dejar mi reseña'));
  });

  // Secciones de cada producto
  document.querySelectorAll('section[data-resenas]').forEach(async (sec) => {
    const s = S.find((x) => x.id === sec.dataset.resenas);
    if (!s?.resenas) return; // todavía sin función de reseñas: la sección no se muestra
    const lead = sec.querySelector('.rs-lead');
    const caja = sec.querySelector('.rs-lista');
    const dejar = sec.querySelector('.rs-dejar');
    if (dejar && s.acceso?.url) dejar.href = s.acceso.url;
    sec.hidden = false;
    const d = await traer(s);
    if (!d?.total || !d.lista.length) return; // queda «Sé de los primeros…»
    const cuantas = `${d.total} ${d.total === 1 ? 'reseña' : 'reseñas'}`;
    lead.textContent = d.total >= MIN_PROMEDIO && d.promedio !== null
      ? `${coma(d.promedio)} de 5 · ${cuantas} de usuarios reales, aprobadas en la app de ${s.nombre}.`
      : `${cuantas[0].toUpperCase()}${cuantas.slice(1)} de usuarios reales, aprobadas en la app de ${s.nombre}.`;
    caja.replaceChildren(...d.lista.slice(0, 6).map((x) => tarjeta(s, x)));
    caja.hidden = false;
    datosEstructurados(s, d);
  });

  // Franja de la portada: la reseña más reciente de cada producto (no «la mejor»), solo si hay reseñas reales.
  const franja = document.querySelector('section[data-resenas-franja]');
  if (franja) {
    // Respeta los interruptores de la consola (js/visibles.js): un servicio apagado no sale en la franja.
    (window.FLEXGO_VISIBLES || Promise.resolve(new Map())).then((vis) => {
    const conResenas = S.filter((s) => s.resenas && vis.get(s.id)?.visible !== false);
    return Promise.all(conResenas.map((s) => traer(s).then((d) => ({ s, d })))).then((todos) => {
      const cards = todos.filter(({ d }) => d?.lista.length).map(({ s, d }) => {
        const x = [...d.lista].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))[0];
        return tarjetaFranja(s, x);
      });
      if (!cards.length) return;
      franja.querySelector('.rs-lista').replaceChildren(...cards);
      franja.hidden = false;
    });
    });
  }
})();
