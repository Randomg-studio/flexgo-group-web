// Aviso y consentimiento de cookies de FlexGo (26-nov-2026). Reutilizable en todos los sitios del ecosistema.
//
// MODO «aviso» (hoy): el sitio solo usa almacenamiento necesario. Barra pequeña abajo, una sola vez,
//   con «Más información» y «Entendido». Guarda localStorage flexgo-aviso-cookies = "v1".
// MODO «consentimiento» (APAGADO): solo se enciende si un día se agrega analítica o un píxel.
//   Tres botones iguales: Aceptar, Rechazar y Configurar. Guarda flexgo-consentimiento =
//   {"v":1,"fecha":"…","analitica":false,"publicidad":false}. Los scripts opcionales se escriben así:
//   <script type="text/plain" data-consent="analitica" data-src="https://…"></script>
//   y solo se cargan después de aceptar esa categoría. Los enlaces con data-cookies-panel vuelven a abrir el panel.
//
// Uso: <link rel="stylesheet" href="css/cookies.css?v=1">
//      <script src="js/cookies.js?v=1" data-politica="legal/cookies.html"></script>
//      Para encender el consentimiento: data-modo="consentimiento" en la etiqueta del script.
(() => {
  'use strict';
  // ÚNICO lugar del texto del aviso. Cada sitio lo cambia aquí, o con data-texto en la etiqueta del script.
  const AVISO_TEXTO = 'Usamos solo el almacenamiento necesario para que esta página funcione (tu conversación con Kivo y tus preferencias). No usamos cookies de publicidad ni de analítica.';
  const S = document.currentScript;
  const TEXTO = document.currentScript?.dataset.texto || AVISO_TEXTO;
  const POLITICA = S?.dataset.politica || 'legal/cookies.html';
  const MODO = S?.dataset.modo === 'consentimiento' ? 'consentimiento' : 'aviso';
  const AVISO = 'flexgo-aviso-cookies';
  const CONS = 'flexgo-consentimiento';

  const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };
  const el = (tag, props = {}, ...hijos) => { const n = Object.assign(document.createElement(tag), props); n.append(...hijos); return n; };
  const boton = (texto, fn, clase = 'ck-btn') => { const b = el('button', { type: 'button', className: clase }, texto); b.addEventListener('click', fn); return b; };

  let barra = null;
  const quitar = () => { barra?.remove(); barra = null; };

  // ---------- Modo aviso ----------
  const aviso = () => {
    if (leer(AVISO) === 'v1') return;
    barra = el('div', { className: 'ck-barra', role: 'region', ariaLabel: 'Aviso de cookies' },
      el('p', { className: 'ck-texto' }, TEXTO),
      el('div', { className: 'ck-botones' },
        el('a', { className: 'ck-btn ck-sec', href: POLITICA }, 'Más información'),
        boton('Entendido', () => { guardar(AVISO, 'v1'); quitar(); })));
    document.body.append(barra);
  };

  // ---------- Modo consentimiento (apagado) ----------
  const consentimiento = () => { try { return JSON.parse(leer(CONS) || 'null'); } catch { return null; } };
  const activar = (c) => {
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach((s) => {
      if (!c?.[s.dataset.consent] || s.dataset.activado) return;
      s.dataset.activado = '1';
      const n = document.createElement('script');
      if (s.dataset.src) n.src = s.dataset.src; else n.textContent = s.textContent;
      document.head.append(n);
    });
  };
  const decidir = (analitica, publicidad) => {
    const c = { v: 1, fecha: new Date().toISOString(), analitica, publicidad };
    guardar(CONS, JSON.stringify(c));
    quitar();
    activar(c);
  };
  const panel = (configurar = false) => {
    quitar();
    const previo = consentimiento() || { analitica: false, publicidad: false };
    const casilla = (id, nombre, desc, marcado, fijo) => el('label', { className: 'ck-cat', htmlFor: id },
      el('input', { type: 'checkbox', id, checked: marcado, disabled: fijo }),
      el('span', {}, el('b', {}, nombre), ` ${desc}`));
    const cats = el('div', { className: 'ck-cats', hidden: !configurar },
      casilla('ck-nec', 'Necesarias.', 'Siempre activas: hacen que la página funcione.', true, true),
      casilla('ck-ana', 'Analítica.', 'Nos ayudan a saber qué partes de la página se usan.', Boolean(previo.analitica), false),
      casilla('ck-pub', 'Publicidad.', 'Miden y personalizan anuncios.', Boolean(previo.publicidad), false));
    const guardarConf = boton('Guardar mi elección', () => decidir(cats.querySelector('#ck-ana').checked, cats.querySelector('#ck-pub').checked));
    guardarConf.hidden = !configurar;
    barra = el('div', { className: 'ck-barra ck-consent', role: 'dialog', ariaLabel: 'Tus preferencias de cookies' },
      el('p', { className: 'ck-texto' }, 'Usamos cookies necesarias y, si nos das permiso, de analítica y publicidad. ', el('a', { href: POLITICA }, 'Más información')),
      cats,
      el('div', { className: 'ck-botones ck-iguales' },
        boton('Aceptar', () => decidir(true, true)),
        boton('Rechazar', () => decidir(false, false)),
        boton('Configurar', () => { cats.hidden = false; guardarConf.hidden = false; }),
        guardarConf));
    document.body.append(barra);
  };

  const iniciar = () => {
    if (MODO === 'aviso') { aviso(); return; }
    const c = consentimiento();
    if (c) activar(c); else panel();
    document.querySelectorAll('[data-cookies-panel]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); panel(true); }));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
