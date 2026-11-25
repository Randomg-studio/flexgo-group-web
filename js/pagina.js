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
  const anio = $('#anio');
  if (anio) anio.textContent = new Date().getFullYear();
  // El menú lo maneja js/barra.js (barra común de todo el sitio).
  $$('[data-open-chat]').forEach((b) => b.addEventListener('click', () => $('#chat-boton')?.click()));
})();
