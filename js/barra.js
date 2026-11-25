// Barra de navegación común: abre y cierra el menú del celular.
(() => {
  'use strict';
  const barra = document.querySelector('.barra');
  if (!barra) return;
  const boton = barra.querySelector('.barra-menu');
  const nav = barra.querySelector('.barra-nav');
  const abrir = (si) => {
    barra.classList.toggle('abierta', si);
    boton.setAttribute('aria-expanded', String(si));
    boton.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
  };
  boton.addEventListener('click', () => abrir(!barra.classList.contains('abierta')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => abrir(false)));
  document.addEventListener('pointerdown', (e) => { if (!barra.contains(e.target)) abrir(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && barra.classList.contains('abierta')) { abrir(false); boton.focus(); } });
})();
