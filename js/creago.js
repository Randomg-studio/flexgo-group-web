// Página de CreaGo: menú, galería de ejemplos y ventana con la publicación completa.
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();

  const modal = $('#modal');
  const titulo = $('#modal-title');
  const cuerpo = $('#modal-body');
  const abrirModal = (t, nodo) => {
    titulo.textContent = t;
    cuerpo.replaceChildren(nodo);
    modal.showModal();
  };
  $('.close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  $$('[data-original]').forEach((b) => b.addEventListener('click', () => {
    const im = new Image(720, 720);
    im.src = b.dataset.original;
    im.alt = 'Publicación completa: ' + b.dataset.nombre;
    abrirModal(b.dataset.nombre, im);
  }));

  const galeria = $('.examples');
  const prev = $('.arrow.prev');
  const next = $('.arrow.next');
  const actualizar = () => {
    prev.disabled = galeria.scrollLeft < 2;
    next.disabled = galeria.scrollLeft + galeria.clientWidth >= galeria.scrollWidth - 2;
  };
  prev.addEventListener('click', () => galeria.scrollBy({ left: -galeria.clientWidth * 0.7, behavior: 'smooth' }));
  next.addEventListener('click', () => galeria.scrollBy({ left: galeria.clientWidth * 0.7, behavior: 'smooth' }));
  galeria.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();

  const boton = $('.menu-toggle');
  const menu = $('#menu');
  const abrirMenu = (si) => {
    menu.classList.toggle('open', si);
    boton.setAttribute('aria-expanded', String(si));
    boton.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
    boton.textContent = si ? '×' : '☰';
  };
  boton.addEventListener('click', () => abrirMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach((a) => a.addEventListener('click', () => abrirMenu(false)));
})();

// Pantalla de la laptop: se ajusta en perspectiva a las 4 esquinas medidas en el dibujo (912 × 610).
(() => {
  const p = document.querySelector('.pantalla');
  if (!p) return;
  const esq = p.dataset.esquinas.split(' ').map((s) => s.split(',').map(Number));
  const adj = (m) => [m[4]*m[8]-m[5]*m[7], m[2]*m[7]-m[1]*m[8], m[1]*m[5]-m[2]*m[4], m[5]*m[6]-m[3]*m[8], m[0]*m[8]-m[2]*m[6], m[2]*m[3]-m[0]*m[5], m[3]*m[7]-m[4]*m[6], m[1]*m[6]-m[0]*m[7], m[0]*m[4]-m[1]*m[3]];
  const mm = (a, b) => { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[3*i+k]*b[3*k+j]; c.push(s); } return c; };
  const mv = (m, v) => [m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];
  const base = (q) => { const m = [q[0][0], q[1][0], q[2][0], q[0][1], q[1][1], q[2][1], 1, 1, 1]; const v = mv(adj(m), [q[3][0], q[3][1], 1]); return mm(m, [v[0],0,0, 0,v[1],0, 0,0,v[2]]); };
  const ajustar = () => {
    const k = p.parentElement.clientWidth / 912;
    const w = p.offsetWidth, h = p.offsetHeight;
    const src = [[0,0],[w,0],[0,h],[w,h]];
    const dst = [esq[0], esq[1], esq[3], esq[2]].map(([x, y]) => [x*k, y*k]);
    const t = mm(base(dst), adj(base(src))).map((v, _, a) => v / a[8]);
    p.style.transform = `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`;
  };
  ajustar();
  window.addEventListener('resize', ajustar);
  if ('ResizeObserver' in window) new ResizeObserver(ajustar).observe(p.parentElement);
})();
