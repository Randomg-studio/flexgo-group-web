// Botones «Elegir [plan]» de las tarjetas de precio (27-nov).
// Cada botón es <a data-elegir="kivo" data-plan="Pro" data-precio="S/ 299 al mes">, con un enlace de WhatsApp ya escrito
// en el HTML (así funciona aunque falle el JavaScript). Este archivo lo recalcula con window.FLEXGO_PAGO (js/datos.js):
// para pasar a Culqi basta con cambiar FLEXGO_PAGO, sin tocar cada página.
// Los botones de productos con pago dentro de su app (Elio, CreaGo) llevan data-app y no se tocan.
(() => {
  'use strict';
  const P = window.FLEXGO_PAGO;
  if (!P?.enlace) return;
  document.querySelectorAll('a[data-elegir]:not([data-app])').forEach((a) => {
    const d = a.dataset;
    const url = P.enlace({ producto: d.elegir, plan: d.plan || '', precio: d.precio || '', tipo: d.tipo || 'plan' });
    if (!url) return;
    a.href = url;
    if (/^https?:/.test(url)) { a.target = '_blank'; a.rel = 'noopener'; }
  });
})();
