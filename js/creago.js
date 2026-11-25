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
