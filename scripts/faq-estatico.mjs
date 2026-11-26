// Copia las preguntas de js/datos.js dentro de index.html como HTML real y como schema FAQPage.
// Así los robots de Google, ChatGPT, Perplexity y Claude las leen aunque no ejecuten JavaScript.
// Uso: node scripts/faq-estatico.mjs   (córrelo cada vez que cambies las preguntas en datos.js)
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const raiz = new URL('..', import.meta.url);
const ctx = { window: {} };
vm.runInNewContext(readFileSync(new URL('js/datos.js', raiz), 'utf8'), ctx);
const faq = ctx.window.FLEXGO_FAQ;
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const html = faq.map(({ p, r }, i) => `<div class="faq-item${i === 0 ? ' abierta' : ''}"><h3><button type="button" id="faq-p-${i}" aria-controls="faq-r-${i}" aria-expanded="${i === 0}"><span>${esc(p)}</span><i></i></button></h3><div class="faq-resp" id="faq-r-${i}" role="region" aria-labelledby="faq-p-${i}"><div><p>${esc(r)}</p></div></div></div>`).join('');
const schema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://flexgogroup.com/#preguntas',
  mainEntity: faq.map(({ p, r }) => ({ '@type': 'Question', name: p, acceptedAnswer: { '@type': 'Answer', text: r } })),
}).replace(/</g, '\\u003c');

const archivo = new URL('index.html', raiz);
let s = readFileSync(archivo, 'utf8');
const poner = (texto, ini, fin, nuevo) => {
  const a = texto.indexOf(ini), b = texto.indexOf(fin);
  if (a < 0 || b < a) throw new Error(`No encontré las marcas ${ini}`);
  return texto.slice(0, a + ini.length) + nuevo + texto.slice(b);
};
s = poner(s, '<!--faq:inicio-->', '<!--faq:fin-->', html);
s = poner(s, '<!--faq-schema:inicio-->', '<!--faq-schema:fin-->', `<script type="application/ld+json">${schema}</script>`);
writeFileSync(archivo, s);
console.log(`Listo: ${faq.length} preguntas copiadas en index.html`);
