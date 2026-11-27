// Barra de navegación común: abre y cierra el menú del celular y la lista «Iniciar sesión».
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
  // Lista «Iniciar sesión»: se cierra al tocar fuera o con Escape.
  const acc = barra.querySelector('details.acc');
  const cerrarAcc = () => { if (acc?.open) acc.open = false; };
  document.addEventListener('pointerdown', (e) => {
    if (!barra.contains(e.target)) abrir(false);
    if (acc && !acc.contains(e.target)) cerrarAcc();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && acc?.open) { cerrarAcc(); acc.querySelector('summary').focus(); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && barra.classList.contains('abierta')) { abrir(false); boton.focus(); } });
})();
