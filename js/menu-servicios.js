// Menú desplegable «Servicios»: se abre al pasar el cursor, al hacer clic o con el teclado.
(() => {
  'use strict';
  const ms = document.querySelector('.ms');
  if (!ms) return;
  const boton = ms.querySelector('.ms-boton');
  const panel = ms.querySelector('.ms-panel');
  const corte = Number(ms.dataset.corte) || 850;
  const conCursor = matchMedia('(hover: hover) and (pointer: fine)');
  let espera = null;

  const movil = () => window.innerWidth <= corte;
  const marcar = () => ms.classList.toggle('ms-movil', movil());
  const abrir = (si) => {
    clearTimeout(espera);
    ms.classList.toggle('abierto', si);
    boton.setAttribute('aria-expanded', String(si));
    panel.style.left = '';
    if (si && !movil()) {
      // Si el panel se sale por la derecha, se corre hacia la izquierda.
      const r = panel.getBoundingClientRect();
      const sobra = r.right - (document.documentElement.clientWidth - 12);
      if (sobra > 0) panel.style.left = `${-14 - sobra}px`;
    }
  };

  marcar();
  window.addEventListener('resize', marcar);

  boton.addEventListener('click', () => abrir(!ms.classList.contains('abierto')));
  ms.addEventListener('mouseenter', () => { if (conCursor.matches && !movil()) abrir(true); });
  ms.addEventListener('mouseleave', () => {
    if (conCursor.matches && !movil()) espera = setTimeout(() => abrir(false), 180);
  });
  ms.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ms.classList.contains('abierto')) {
      abrir(false);
      boton.focus();
    }
  });
  ms.addEventListener('focusout', (e) => { if (!movil() && !ms.contains(e.relatedTarget)) abrir(false); });
  document.addEventListener('pointerdown', (e) => { if (!ms.contains(e.target) && !movil()) abrir(false); });
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => abrir(false)));
})();
