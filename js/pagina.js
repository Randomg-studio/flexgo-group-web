// Páginas sencillas (sin recorrido con scroll): menú, enlaces de WhatsApp, año y botón de Kivo.
(() => {
  'use strict';
  const D = window.FLEXGO;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  $$('[data-wa]').forEach((a) => {
    a.href = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(a.dataset.wa)}`;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $('#anio').textContent = new Date().getFullYear();
  const nav = $('#primary-nav');
  const menu = $('.menu-toggle');
  const abrir = (si) => {
    nav.classList.toggle('is-open', si);
    menu.setAttribute('aria-expanded', String(si));
    menu.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
  };
  menu.addEventListener('click', () => abrir(!nav.classList.contains('is-open')));
  document.addEventListener('pointerdown', (e) => { if (!e.target.closest('.site-header')) abrir(false); });
  $$('[data-open-chat]').forEach((b) => b.addEventListener('click', () => $('#chat-boton').click()));
})();
