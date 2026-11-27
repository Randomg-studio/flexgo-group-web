// Reseñas reales de Elio (aprobadas en la app). Lee la función pública elio_resenas_publicas.
// Si no hay reseñas o no responde, queda el texto «Sé de los primeros…». Nunca se inventan reseñas.
(() => {
  'use strict';
  const D = window.FLEXGO?.elio;
  const caja = document.getElementById('resenas-lista');
  const lead = document.getElementById('resenas-lead');
  if (!D?.clave || !caja) return;
  const el = (tag, props = {}, ...hijos) => { const n = Object.assign(document.createElement(tag), props); n.append(...hijos); return n; };
  const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  const fecha = (f) => {
    const d = new Date(`${f}T12:00:00`);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  fetch(`${D.url}/rest/v1/rpc/elio_resenas_publicas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: D.clave, Authorization: `Bearer ${D.clave}` },
    body: '{}',
  }).then((r) => (r.ok ? r.json() : null)).then((d) => {
    const lista = Array.isArray(d?.resenas) ? d.resenas.filter((x) => x && x.texto && Number(x.estrellas) >= 1 && Number(x.estrellas) <= 5) : [];
    if (!Number(d?.total) || !lista.length) return;
    const prom = Number(d.promedio);
    lead.textContent = `${Number.isFinite(prom) ? `${prom.toFixed(1).replace('.', ',')} de 5 · ` : ''}${d.total} ${d.total === 1 ? 'reseña' : 'reseñas'} de usuarios reales, aprobadas en la app de Elio.`;
    caja.replaceChildren(...lista.slice(0, 6).map((x) => {
      const n = Math.round(Number(x.estrellas));
      return el('article', { className: 'el-resena' },
        el('p', { className: 'el-estrellas', ariaLabel: `${n} de 5 estrellas` }, estrellas(n)),
        el('p', { className: 'el-resena-texto' }, `«${String(x.texto).slice(0, 400)}»`),
        el('p', { className: 'el-resena-autor' }, [String(x.nombre || 'Usuario de Elio').slice(0, 40), x.plan ? `plan ${String(x.plan).slice(0, 20)}` : '', fecha(x.fecha)].filter(Boolean).join(' · ')));
    }));
    caja.hidden = false;
  }).catch(() => { /* sin reseñas: queda el texto por defecto */ });
})();
