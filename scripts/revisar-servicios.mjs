// Revisor de servicios de flexgogroup.com.
// Compara el menú «Servicios», el pie (Productos), el círculo de la portada y las tarjetas de «Ver todos los servicios»
// con la lista única FLEXGO_SERVICIOS de js/datos.js; revisa que los logos existan y que los enlaces respondan 200.
// Opcional: compara con lo que sabe Kivo (tabla kivo_ecosistema exportada a JSON).
//
// Uso:
//   node scripts/revisar-servicios.mjs                 revisa los archivos de esta carpeta (antes de publicar)
//   node scripts/revisar-servicios.mjs --en-vivo       revisa lo publicado en https://flexgogroup.com (resumen diario)
//   node scripts/revisar-servicios.mjs --sin-red       sin revisar enlaces por internet
//   node scripts/revisar-servicios.mjs --kivo ruta.json   además compara con kivo_ecosistema exportada
// Sale con código 1 si encuentra errores (sirve para frenar una publicación o avisar en el resumen).
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cargarServicios, paginas, htmlMenu, htmlPie, htmlEco } from './servicios-estatico.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = 'https://flexgogroup.com/';
const args = process.argv.slice(2);
const EN_VIVO = args.includes('--en-vivo');
const SIN_RED = args.includes('--sin-red');
const KIVO = args.includes('--kivo') ? args[args.indexOf('--kivo') + 1] : '';

const errores = [];
const avisos = [];
const mal = (t) => errores.push(t);
const ojo = (t) => avisos.push(t);
const S = cargarServicios();

const leer = async (f) => {
  if (!EN_VIVO) return readFileSync(join(RAIZ, f), 'utf8');
  const r = await fetch(`${SITIO}${f}?revision=${Date.now()}`);
  if (!r.ok) { mal(`${f}: la página responde ${r.status}`); return ''; }
  return r.text();
};
const tramo = (s, ini, fin) => {
  const i = s.indexOf(ini);
  if (i < 0) return null;
  return s.slice(i + ini.length, s.indexOf(fin, i + ini.length));
};
const nombres = (h, re) => [...h.matchAll(re)].map((m) => m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim());
const orden = (a, b) => (a.join(' › ') === b.join(' › ') ? '' : `\n     hay:      ${a.join(' › ') || '(nada)'}\n     debe ser: ${b.join(' › ')}`);

const enlaces = new Set();
const html = {};
for (const f of paginas()) {
  if (f === 'logrin.html') continue; // solo redirige a logrin.flexgogroup.com
  const s = await leer(f);
  html[f] = s;
  if (!s) continue;
  const menu = tramo(s, '<div class="ms-panel" id="ms-panel">', '<a class="ms-todos"');
  if (menu === null) mal(`${f}: no tiene el menú «Servicios»`);
  else if (menu !== htmlMenu(S, f)) {
    const d = orden(nombres(menu, /<strong>(.*?)<\/strong>/g), S.filter((x) => x.menu).map((x) => x.nombre));
    mal(`${f}: el menú «Servicios» no coincide con la lista única${d || ' (cambió un enlace, un texto o un logo)'}`);
  }
  const pie = tramo(s, '<h2>Productos</h2>', '</div>');
  if (pie === null) mal(`${f}: no tiene la columna Productos en el pie`);
  else if (pie !== htmlPie(S, f)) {
    const d = orden(nombres(pie, /<a [^>]*>(.*?)<\/a>/g), S.filter((x) => x.pie).map((x) => x.nombre));
    mal(`${f}: el pie (Productos) no coincide con la lista única${d || ' (cambió un enlace o un logo)'}`);
  }
}

// Portada: círculo y tarjetas de «Ver todos los servicios»
const portada = html['index.html'] || '';
const [izq, der] = htmlEco(S);
if (tramo(portada, '<ul class="eco-lista eco-izq">', '</ul>') !== izq || tramo(portada, '<ul class="eco-lista eco-der">', '</ul>') !== der) {
  const hay = ['eco-izq', 'eco-der'].flatMap((l) => nombres(tramo(portada, `<ul class="eco-lista ${l}">`, '</ul>') || '', /<strong>(.*?)<\/strong>/g));
  mal(`index.html: el círculo de servicios no coincide con la lista única${orden(hay, S.filter((x) => x.eco).map((x) => x.eco.nombre || x.nombre))}`);
}
const seccion = tramo(portada, 'id="servicios"', '</section>') || '';
const tarjetas = [...seccion.matchAll(/data-servicio="([^"]+)"/g)].map((m) => m[1]);
const esperadas = S.filter((x) => x.tarjeta).map((x) => x.id);
const faltan = esperadas.filter((id) => !tarjetas.includes(id));
const sobran = tarjetas.filter((id) => !esperadas.includes(id));
if (faltan.length) mal(`index.html: en «Ver todos los servicios» faltan tarjetas: ${faltan.join(', ')}`);
if (sobran.length) mal(`index.html: hay tarjetas que no están en la lista única: ${sobran.join(', ')}`);
if (!faltan.length && !sobran.length && orden(tarjetas, esperadas)) mal(`index.html: las tarjetas de «Ver todos los servicios» no siguen el orden${orden(tarjetas, esperadas)}`);

// Logos y enlaces
for (const x of S) {
  if (x.logo && !existsSync(join(RAIZ, 'assets/imagenes/logos', x.logo))) mal(`Falta el logo de ${x.nombre}: assets/imagenes/logos/${x.logo}`);
  for (const h of [x.href, x.eco?.href].filter(Boolean)) enlaces.add(h);
}
for (const h of enlaces) {
  if (/^https:\/\/wa\.me\/\d+/.test(h)) continue; // WhatsApp no deja revisar por robot; el formato es correcto
  const [archivo, ancla] = h.split('#');
  if (!/^https?:/.test(h)) {
    if (!EN_VIVO && !existsSync(join(RAIZ, archivo))) mal(`Enlace roto: ${h} (no existe ${archivo})`);
    const pag = html[archivo] ?? (EN_VIVO ? '' : (existsSync(join(RAIZ, archivo)) ? readFileSync(join(RAIZ, archivo), 'utf8') : ''));
    if (ancla && pag && !pag.includes(`id="${ancla}"`)) mal(`Enlace roto: ${h} (no existe la sección #${ancla})`);
  }
  if (SIN_RED) continue;
  const url = /^https?:/.test(h) ? h : SITIO + archivo;
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'revisor-flexgo/1.0' } });
    if (r.status !== 200) mal(`Enlace que no responde 200: ${url} → ${r.status}`);
  } catch (e) {
    mal(`Enlace que no abre: ${url} (${e.cause?.code || e.message})`);
  }
}

// Lo que sabe Kivo (kivo_ecosistema exportada a JSON)
if (KIVO) {
  const filas = JSON.parse(readFileSync(KIVO, 'utf8'));
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  for (const x of S.filter((y) => y.menu && y.pie)) {
    const clave = norm(x.nombre.split(' ')[x.nombre.startsWith('Mi ') ? 1 : 0]);
    const fila = filas.find((f) => norm(f.nombre).includes(clave) || norm(f.id).includes(clave));
    if (!fila) { mal(`Kivo no conoce ${x.nombre}: falta su fila en kivo_ecosistema`); continue; }
    const pronto = ['muy_pronto', 'en_pausa'].includes(fila.estado);
    if (Boolean(x.pronto) !== pronto) ojo(`${x.nombre}: en la web está «${x.pronto ? 'Próximamente' : 'disponible'}» y en Kivo «${fila.estado}»`);
  }
} else {
  ojo('No comparé con Kivo: kivo_ecosistema no es pública. Pasa una copia con --kivo ruta.json para revisarla.');
}

const donde = EN_VIVO ? 'flexgogroup.com (en vivo)' : 'los archivos locales';
console.log(`Revisión de servicios en ${donde}: ${S.length} servicios, ${Object.keys(html).length} páginas, ${enlaces.size} enlaces.`);
for (const a of avisos) console.log(`  ⚠ ${a}`);
if (errores.length) {
  for (const e of errores) console.log(`  ✖ ${e}`);
  console.log(`Resultado: ${errores.length} error(es). Web: corrige js/datos.js y corre node scripts/servicios-estatico.mjs. Kivo: actualiza kivo_ecosistema con la plantilla de R-161.`);
  process.exit(1);
}
console.log('Resultado: todo en orden ✔');
