// Escribe en el HTML el menú «Servicios», la columna Productos del pie y el círculo de la portada
// a partir de la lista única window.FLEXGO_SERVICIOS de js/datos.js.
// Uso: node scripts/servicios-estatico.mjs   (después corre: node scripts/revisar-servicios.mjs)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
export const cargarServicios = () => {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(join(RAIZ, 'js/datos.js'), 'utf8'), ctx);
  return ctx.window.FLEXGO_SERVICIOS;
};
export const paginas = () => [
  ...readdirSync(RAIZ).filter((f) => f.endsWith('.html')),
  ...readdirSync(join(RAIZ, 'legal')).filter((f) => f.endsWith('.html')).map((f) => `legal/${f}`),
];

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const externo = (h) => /^https?:/.test(h);
// Prefijo de rutas según la página: raíz «», legal «../», 404 «/».
const prefijo = (f) => (f === '404.html' ? '/' : f.startsWith('legal/') ? '../' : '');
const ruta = (h, f) => {
  if (externo(h)) return h;
  if (f === 'index.html' && h.startsWith('index.html#')) return h.slice('index.html'.length);
  return prefijo(f) + h;
};
const SVG_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const SVG_ECO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const img = (s, f, tam, clase = '') => `<img${clase ? ` class="${clase}"` : ''} src="${prefijo(f)}assets/imagenes/logos/${s.logo}" width="${tam}" height="${tam}" alt="" loading="lazy" decoding="async">`;

export const htmlMenu = (S, f) => S.filter((s) => s.menu).map((s) => {
  const ico = s.logo
    ? `<span class="ms-ico ms-ico--logo" aria-hidden="true">${img(s, f, 32)}</span>`
    : `<span class="ms-ico" aria-hidden="true">${SVG_MENU}${s.icono}</svg></span>`;
  const actual = s.href === f ? ' aria-current="page"' : '';
  return `<a class="ms-item" data-sv="${s.id}" href="${esc(ruta(s.href, f))}"${actual}>${ico}<span><strong>${esc(s.nombre)}${s.beta ? ' <em class="ms-beta">Beta</em>' : ''}</strong><small>${esc(s.menu.desc)}</small></span></a>`;
}).join('');

const BOLSA = '<svg class="pie-logo pie-logo--ico" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
export const htmlPie = (S, f) => S.filter((s) => s.pie).map((s) => {
  const extra = s.pieNueva ? ' target="_blank" rel="noopener noreferrer"' : '';
  const ico = s.logo ? img(s, f, 20, 'pie-logo') : `${BOLSA}${s.icono}</svg>`;
  return `<a data-sv="${s.id}" href="${esc(ruta(s.href, f))}"${extra}>${ico}${esc(s.nombre)}</a>`;
}).join('');

const itemEco = (s) => {
  const e = s.eco;
  const nombre = e.nombre || s.nombre;
  const href = e.href || s.href;
  const ico = s.logo
    ? `<span class="eco-ico eco-ico--logo"><img src="assets/imagenes/logos/${s.logo}" width="34" height="34" alt="" loading="lazy" decoding="async"></span>`
    : `<span class="eco-ico">${SVG_ECO}${s.ecoIcono || s.icono}</svg></span>`;
  const nueva = e.nueva || externo(href) ? ' target="_blank" rel="noopener"' : '';
  const pronto = s.pronto ? `<em class="eco-pronto">${esc(s.prontoTexto || 'Próximamente')}</em>` : s.beta ? '<em class="eco-pronto eco-beta">Beta</em>' : '';
  return `<li class="eco-item${s.pronto ? ' es-pronto' : ''}" data-sv="${s.id}">${ico}<span class="eco-txt"><strong>${esc(nombre)}</strong><small>${esc(e.desc)}</small>${pronto}</span><a class="eco-mas" href="${esc(ruta(href, 'index.html'))}"${nueva} aria-label="${esc(e.aria || `Ver ${nombre}`)}"><span aria-hidden="true">+</span></a></li>`;
};
export const htmlEco = (S) => {
  // Izquierda: productos propios (los que van en el pie); derecha: servicios y soluciones.
  const lista = S.filter((s) => s.eco);
  return [lista.filter((s) => s.pie).map(itemEco).join(''), lista.filter((s) => !s.pie).map(itemEco).join('')];
};

// «Iniciar sesión» en la barra (27-nov): en la página propia de un producto, un enlace a SU pantalla de ingreso;
// en las demás páginas, una lista corta con todos los productos que tienen acceso.
const ICO_ENTRAR = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/></svg>';
export const htmlAcceso = (S, f) => {
  const propio = S.find((s) => s.acceso && s.href === f);
  if (propio?.acceso.url) {
    return `<a class="barra-acceso" data-sv="${propio.id}" href="${esc(propio.acceso.url)}" title="Iniciar sesión en ${esc(propio.nombre)}">${ICO_ENTRAR}<span class="barra-acceso-txt">Iniciar sesión <span class="barra-acceso-en">en ${esc(propio.nombre)}</span></span></a>`;
  }
  if (propio?.acceso.pronto) {
    return `<span class="barra-acceso es-pronto" data-sv="${propio.id}" title="Iniciar sesión en ${esc(propio.nombre)}: muy pronto">${ICO_ENTRAR}<span class="barra-acceso-txt">Iniciar sesión <span class="barra-acceso-en">en ${esc(propio.nombre)}</span> · Muy pronto</span></span>`;
  }
  const lista = S.filter((s) => s.acceso?.url).map((s) => {
    const ico = s.logo ? img(s, f, 28) : `${SVG_MENU}${s.icono}</svg>`;
    const nota = s.acceso.nota ? `<small>${esc(s.acceso.nota)}</small>` : '';
    return `<a class="acc-item" data-sv="${s.id}" href="${esc(s.acceso.url)}"><span class="acc-ico" aria-hidden="true">${ico}</span><span><strong>${esc(s.nombre)}</strong>${nota}</span></a>`;
  }).join('');
  return `<details class="acc"><summary class="barra-acceso" title="Iniciar sesión">${ICO_ENTRAR}<span class="barra-acceso-txt">Iniciar sesión</span></summary><div class="acc-panel"><p class="acc-titulo">Entra a tu cuenta de</p>${lista}</div></details>`;
};
const ACC_INI = '<!--acceso-->';
const ACC_FIN = '<!--/acceso-->';

const reemplazar = (s, ini, fin, nuevo, f, que) => {
  const i = s.indexOf(ini);
  if (i < 0) return s;
  const j = s.indexOf(fin, i + ini.length);
  if (j < 0) throw new Error(`${f}: no encontré el final de ${que}`);
  return s.slice(0, i + ini.length) + nuevo + s.slice(j);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const S = cargarServicios();
  let cambios = 0;
  for (const f of paginas()) {
    const p = join(RAIZ, f);
    const antes = readFileSync(p, 'utf8');
    let s = antes;
    s = reemplazar(s, '<div class="ms-panel" id="ms-panel">', '<a class="ms-todos"', htmlMenu(S, f), f, 'el menú');
    s = s.replace(/<a class="ms-todos" href="[^"]*">/, `<a class="ms-todos" href="${ruta('index.html#servicios', f)}">`);
    s = reemplazar(s, '<h2>Productos</h2>', '</div>', htmlPie(S, f), f, 'el pie');
    if (s.includes('id="barra-nav"')) {
      if (!s.includes(ACC_INI)) {
        const n = s.indexOf('id="barra-nav"');
        const fin = s.indexOf('</nav>', n);
        s = `${s.slice(0, fin)}${ACC_INI}${ACC_FIN}${s.slice(fin)}`;
      }
      s = reemplazar(s, ACC_INI, ACC_FIN, htmlAcceso(S, f), f, 'el acceso');
    }
    if (f === 'index.html') {
      const [izq, der] = htmlEco(S);
      s = reemplazar(s, '<ul class="eco-lista eco-izq">', '</ul>', izq, f, 'el círculo (izquierda)');
      s = reemplazar(s, '<ul class="eco-lista eco-der">', '</ul>', der, f, 'el círculo (derecha)');
    }
    if (s !== antes) { writeFileSync(p, s); cambios += 1; console.log(`actualizado: ${f}`); }
  }
  console.log(`Listo: ${cambios} página(s) actualizada(s) desde FLEXGO_SERVICIOS.`);
}
