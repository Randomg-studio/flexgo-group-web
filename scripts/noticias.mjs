// Noticias del día para flexgogroup.com/noticias.html.
// Lo corre GitHub Actions cada mañana (.github/workflows/noticias.yml):
//   1. Lee fuentes RSS confiables de tecnología, innovación, finanzas y educación.
//   2. Gemini escribe un título y un resumen propios y cortos (nunca copia el artículo) y sugiere qué servicio de FlexGo encaja.
//   3. Guarda datos/noticias.json; la página lo lee.
//   4. Si hay clave de Brevo, envía al correo del equipo un texto listo para pegar en el canal de WhatsApp.
// Claves (secretos de GitHub, nunca en el código): GEMINI_API_KEY y, opcional, BREVO_API_KEY.
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const ARCHIVO = new URL('../datos/noticias.json', import.meta.url);
const MODELO = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const POR_CATEGORIA = Number(process.env.NOTICIAS_POR_CATEGORIA || 2);
const MAXIMO = 90; // noticias que se conservan en la página
const HORAS = 48; // solo noticias recientes

const FUENTES = [
  { cat: 'tecnologia', fuente: 'Xataka', url: 'https://feeds.weblogssl.com/xataka2' },
  { cat: 'tecnologia', fuente: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/tecnologia/portada' },
  { cat: 'tecnologia', fuente: 'El Comercio', url: 'https://elcomercio.pe/arcio/rss/category/tecnologia/' },
  { cat: 'innovacion', fuente: 'Wired en español', url: 'https://es.wired.com/feed/rss' },
  { cat: 'innovacion', fuente: 'Hipertextual', url: 'https://hipertextual.com/feed' },
  { cat: 'finanzas', fuente: 'Gestión', url: 'https://gestion.pe/arcio/rss/category/economia/' },
  { cat: 'finanzas', fuente: 'El Comercio', url: 'https://elcomercio.pe/arcio/rss/category/economia/' },
  { cat: 'finanzas', fuente: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/economia/portada' },
  { cat: 'educacion', fuente: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/educacion/portada' },
  { cat: 'educacion', fuente: 'Noticias ONU', url: 'https://news.un.org/feed/subscribe/es/news/topic/culture-and-education/feed/rss.xml' },
];
const NOMBRE_CAT = { tecnologia: 'Tecnología', innovacion: 'Innovación', finanzas: 'Finanzas', educacion: 'Educación' };

const entidades = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const texto = (s = '') =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) =>
      e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : entidades[e.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
const campo = (item, nombre) => {
  const m = item.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`, 'i'));
  return m ? m[1] : '';
};

async function leerFuente(f) {
  try {
    const r = await fetch(f.url, { headers: { 'User-Agent': 'FlexGoNoticias/1.0 (+https://flexgogroup.com/noticias.html)' }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const xml = await r.text();
    return [...xml.matchAll(/<item[\s>][\s\S]*?<\/item>/gi)].map(([item]) => {
      const enlace = texto(campo(item, 'link')) || (item.match(/<guid[^>]*>(https?:[^<]+)<\/guid>/i) || [])[1] || '';
      const fecha = new Date(texto(campo(item, 'pubDate')) || texto(campo(item, 'dc:date')) || Date.now());
      return { ...f, titulo: texto(campo(item, 'title')), extracto: texto(campo(item, 'description')).slice(0, 1200), enlace: enlace.trim(), fecha };
    }).filter((n) => n.titulo && /^https:\/\//.test(n.enlace) && !Number.isNaN(n.fecha.getTime()));
  } catch (e) {
    console.warn(`No se pudo leer ${f.fuente} (${f.cat}): ${e.message}`);
    return [];
  }
}

const ESQUEMA = {
  type: 'OBJECT',
  properties: {
    apta: { type: 'BOOLEAN' },
    titulo: { type: 'STRING' },
    resumen: { type: 'STRING' },
    servicio: { type: 'STRING', enum: ['kivo', 'logrin', 'creago', 'webs', 'ninguno'] },
  },
  required: ['apta', 'titulo', 'resumen', 'servicio'],
};

let sinCuota = false;
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
// Gemini gratis acepta pocas llamadas por minuto: pausa entre llamadas y reintenta si está saturado (429/503).
async function llamarGemini(opciones) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`;
  let r;
  for (const pausa of [0, 20000, 45000, 90000]) {
    if (pausa) await esperar(pausa);
    r = await fetch(url, { ...opciones, signal: AbortSignal.timeout(60000) });
    if (r.status !== 429 && r.status !== 503) break;
    if (/quota/i.test(await r.clone().text())) { sinCuota = true; throw new Error('Gemini sin cuota: el proyecto de la clave no tiene saldo o facturación activa.'); }
  }
  await esperar(Number(process.env.GEMINI_PAUSA_MS || 7000));
  return r;
}

async function resumir(n) {
  const pedido = `Eres editor de la sección de noticias de FlexGo Group, empresa peruana de tecnología e IA para negocios.
Con la información de abajo, escribe en español neutro y claro, para dueños de pequeños y medianos negocios del Perú:
- "titulo": un título propio de máximo 12 palabras. No copies el título original.
- "resumen": 2 o 3 frases propias (máximo 55 palabras) que expliquen qué pasó y por qué le importa a un negocio. No copies frases del original, no inventes datos ni cifras que no estén abajo, no opines de política.
- "servicio": el servicio de FlexGo que más se relaciona, solo si encaja de verdad: "kivo" (agentes de IA que atienden clientes por WhatsApp y web), "logrin" (sistema de ventas, inventario y cobros), "creago" (contenido para redes con IA), "webs" (páginas web) o "ninguno".
- "apta": false si la noticia es violenta, de crimen, de política partidaria, de farándula, una lista de ofertas o descuentos de tiendas (Black Friday, chollos) o no sirve para un público de negocios; si no, true.

Fuente: ${n.fuente}
Título original: ${n.titulo}
Extracto: ${n.extracto}`;
  const r = await llamarGemini({
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: pedido }] }],
      generationConfig: { temperature: 0.4, responseMimeType: 'application/json', responseSchema: ESQUEMA },
    }),
  });
  if (!r.ok) throw new Error(`Gemini HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const d = await r.json();
  const json = d.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '{}';
  return JSON.parse(json);
}

const limpiar = (s, max) => texto(String(s || '')).slice(0, max);

async function main() {
  if (process.argv.includes('--probar')) { // revisa las fuentes sin usar Gemini ni guardar nada
    const desde = Date.now() - HORAS * 3600 * 1000;
    for (const f of FUENTES) {
      const l = await leerFuente(f);
      const recientes = l.filter((n) => n.fecha.getTime() >= desde);
      console.log(`${f.cat.padEnd(11)} ${f.fuente.padEnd(17)} ${String(l.length).padStart(3)} en total, ${String(recientes.length).padStart(3)} recientes · ${recientes[0]?.titulo.slice(0, 70) || '-'}`);
    }
    return;
  }
  if (!process.env.GEMINI_API_KEY) {
    console.log('Falta el secreto GEMINI_API_KEY en GitHub: hoy no se publican noticias.');
    return;
  }
  let datos = { actualizado: null, noticias: [] };
  try { datos = JSON.parse(await readFile(ARCHIVO, 'utf8')); } catch {}
  const vistas = new Set(datos.noticias.map((n) => n.enlace));
  const desde = Date.now() - HORAS * 3600 * 1000;

  const todas = (await Promise.all(FUENTES.map(leerFuente))).flat()
    .filter((n) => n.fecha.getTime() >= desde && !vistas.has(n.enlace))
    .sort((a, b) => b.fecha - a.fecha);

  const nuevas = [];
  for (const cat of Object.keys(NOMBRE_CAT)) {
    const usadas = new Set();
    for (const n of todas.filter((x) => x.cat === cat)) {
      if (sinCuota || nuevas.filter((x) => x.categoria === cat).length >= POR_CATEGORIA) break;
      if (usadas.has(n.fuente) && todas.some((x) => x.cat === cat && !usadas.has(x.fuente))) continue; // variar fuentes
      try {
        const g = await resumir(n);
        if (!g.apta) continue;
        const titulo = limpiar(g.titulo, 140);
        const resumen = limpiar(g.resumen, 480);
        if (titulo.length < 10 || resumen.length < 40) continue;
        nuevas.push({
          id: `${n.fecha.toISOString().slice(0, 10)}-${Buffer.from(n.enlace).toString('base64url').slice(-10)}`,
          categoria: cat,
          titulo,
          resumen,
          servicio: ['kivo', 'logrin', 'creago', 'webs'].includes(g.servicio) ? g.servicio : 'ninguno',
          fuente: n.fuente,
          enlace: n.enlace,
          fecha: n.fecha.toISOString(),
        });
        usadas.add(n.fuente);
      } catch (e) {
        console.warn(`Sin resumen para «${n.titulo}»: ${e.message}`);
      }
    }
  }

  console.log(`Noticias nuevas: ${nuevas.length}`);
  if (sinCuota) process.exitCode = 1; // que GitHub marque el error y avise
  if (!nuevas.length) return;
  datos = { actualizado: new Date().toISOString(), noticias: [...nuevas, ...datos.noticias].slice(0, MAXIMO) };
  await mkdir(new URL('../datos/', import.meta.url), { recursive: true });
  await writeFile(ARCHIVO, JSON.stringify(datos, null, 1) + '\n');
  await enviarCorreo(nuevas);
}

// Texto listo para pegar en el canal de WhatsApp (que no permite publicar de forma automática).
async function enviarCorreo(nuevas) {
  const fecha = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Lima' });
  const lineas = [`📰 *Novedades FlexGo · ${fecha}*`, ''];
  for (const n of nuevas) lineas.push(`*${NOMBRE_CAT[n.categoria]}:* ${n.titulo}`, n.resumen, `Fuente: ${n.fuente} · ${n.enlace}`, '');
  lineas.push('Más noticias en https://flexgogroup.com/noticias.html');
  const mensaje = lineas.join('\n');
  console.log('\n----- Texto para el canal de WhatsApp -----\n' + mensaje);

  const destino = process.env.NOTICIAS_CORREO;
  if (!process.env.BREVO_API_KEY || !destino) { console.log('Sin BREVO_API_KEY o sin correo de destino: el texto queda solo en este registro.'); return; }
  const html = `<p>Hola, este es el texto de hoy para pegar en el canal de WhatsApp de FlexGo:</p><pre style="white-space:pre-wrap;font-family:inherit;font-size:15px;background:#f3f6fa;padding:16px;border-radius:10px">${mensaje.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])}</pre>`;
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'FlexGo Noticias', email: 'noreply@flexgogroup.com' },
      to: [{ email: destino }],
      subject: `Noticias de hoy para el canal de WhatsApp (${nuevas.length})`,
      htmlContent: html,
      textContent: mensaje,
    }),
  });
  console.log(r.ok ? `Correo enviado a ${destino}.` : `No se pudo enviar el correo: HTTP ${r.status}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
