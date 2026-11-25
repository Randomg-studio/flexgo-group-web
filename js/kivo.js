// Página de Kivo Agentes: menú del celular y año del pie.
(() => {
  'use strict';
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = new Date().getFullYear();

  const boton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('navlinks');
  const abrir = (si) => {
    menu.classList.toggle('open', si);
    boton.setAttribute('aria-expanded', String(si));
    boton.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
    boton.textContent = si ? '×' : '☰';
  };
  boton.addEventListener('click', () => abrir(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => abrir(false)));
})();
