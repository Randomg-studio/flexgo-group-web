// Interruptores de servicios (27-nov): la consola madre enciende o apaga cada servicio y la web obedece.
// Lee la función pública de Logrin servicios_visibles() → [{ id, visible, etiqueta }] (etiqueta: null | "beta" | "muy_pronto"),
// con los mismos id de FLEXGO_SERVICIOS. Se guarda 5 minutos en sessionStorage («flexgo-visibles»).
// Lo apagado se oculta en todos lados con una regla de estilo sobre [data-sv] y [data-servicio]:
// menú, círculo, tarjetas, pie, lista «Iniciar sesión» y franja de reseñas. En la página propia de un servicio apagado
// sale un aviso amable. Si la función falla, la web queda tal como está en FLEXGO_SERVICIOS: nunca en blanco.
// Va en el <head> (sin defer) para ocultar antes de pintar cuando ya hay datos guardados.
(() => {
  'use strict';
  // En pausa hasta que exista servicios_visibles() en Logrin (R-179): así no hay pedidos que fallen. Para encenderlo, poner true.
  const ACTIVO = false;
  const CLAVE = 'flexgo-visibles';
  const VIDA = 5 * 60 * 1000;
  const ID = /^[a-z0-9-]{1,40}$/;

  const leer = () => { try { return JSON.parse(sessionStorage.getItem(CLAVE) || 'null'); } catch { return null; } };
  const guardar = (datos) => { try { sessionStorage.setItem(CLAVE, JSON.stringify({ t: Date.now(), datos })); } catch { /* sin almacenamiento */ } };
  const limpiar = (lista) => (Array.isArray(lista) ? lista : [])
    .filter((x) => x && ID.test(String(x.id)))
    .map((x) => ({ id: String(x.id), visible: x.visible !== false, etiqueta: ['beta', 'muy_pronto'].includes(x.etiqueta) ? x.etiqueta : null }));

  // 1) Ocultar de inmediato con lo guardado (sin esperar a la red).
  // La CSP del sitio no deja crear <style> en línea: se usa una hoja construida (CSSOM), que sí está permitida.
  let hoja = null;
  try { hoja = new CSSStyleSheet(); document.adoptedStyleSheets = [...document.adoptedStyleSheets, hoja]; } catch { hoja = null; }
  let fueraAntes = [];
  const ocultar = (datos) => {
    const fuera = datos.filter((x) => !x.visible).map((x) => x.id);
    const regla = fuera.length ? `${fuera.map((id) => `[data-sv="${id}"],[data-servicio="${id}"]`).join(',')}{display:none!important}` : '';
    if (hoja) { hoja.replaceSync(regla); return; }
    // Navegadores antiguos: se oculta elemento por elemento cuando ya existe la página.
    const aplicar = () => {
      document.querySelectorAll(fueraAntes.map((id) => `[data-sv="${id}"],[data-servicio="${id}"]`).join(',') || 'x-ninguno').forEach((e) => e.style.removeProperty('display'));
      document.querySelectorAll(fuera.map((id) => `[data-sv="${id}"],[data-servicio="${id}"]`).join(',') || 'x-ninguno').forEach((e) => e.style.setProperty('display', 'none', 'important'));
      fueraAntes = fuera;
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', aplicar, { once: true }); else aplicar();
  };
  const guardado = ACTIVO ? leer() : null;
  if (guardado?.datos) ocultar(guardado.datos);

  // 2) Pedir lo último a Logrin (cuando ya cargó datos.js) y aplicar etiquetas y avisos.
  const traer = () => new Promise((listo) => {
    if (!ACTIVO) { listo([]); return; }
    if (guardado && Date.now() - guardado.t < VIDA) { listo(guardado.datos); return; }
    const L = window.FLEXGO?.kivo;
    if (!L?.url || !L?.clave) { listo(guardado?.datos || []); return; }
    const corte = new AbortController();
    const reloj = setTimeout(() => corte.abort(), 4000);
    fetch(`${L.url}/rest/v1/rpc/servicios_visibles`, {
      method: 'POST', signal: corte.signal,
      headers: { 'Content-Type': 'application/json', apikey: L.clave, Authorization: `Bearer ${L.clave}` },
      body: '{}',
    }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => { const datos = limpiar(d); guardar(datos); listo(datos); })
      .catch(() => listo(guardado?.datos || [])) // falla: queda como está en el código
      .finally(() => clearTimeout(reloj));
  });

  const TEXTO = { beta: 'Beta', muy_pronto: 'Muy pronto' };
  const etiquetar = (x) => {
    const t = x.etiqueta ? TEXTO[x.etiqueta] : '';
    document.querySelectorAll(`.ms-item[data-sv="${x.id}"] strong`).forEach((s) => {
      s.querySelector('.ms-beta')?.remove();
      if (s.lastChild?.nodeType === 3) s.lastChild.textContent = s.lastChild.textContent.trimEnd();
      if (t) s.append(' ', Object.assign(document.createElement('em'), { className: 'ms-beta', textContent: t }));
    });
    document.querySelectorAll(`.eco-item[data-sv="${x.id}"]`).forEach((li) => {
      li.querySelector('.eco-pronto')?.remove();
      li.classList.toggle('es-pronto', x.etiqueta === 'muy_pronto');
      if (t) li.querySelector('.eco-txt')?.append(Object.assign(document.createElement('em'), { className: `eco-pronto${x.etiqueta === 'beta' ? ' eco-beta' : ''}`, textContent: t }));
    });
    document.querySelectorAll(`[data-servicio="${x.id}"] .sv-tag`).forEach((p) => {
      const base = p.textContent.replace(/\s*·\s*(Beta|Próximamente|Muy pronto)\s*$/i, '');
      p.textContent = t ? `${base} · ${t}` : base;
    });
  };

  const avisoPagina = (S, datos) => {
    let pagina = location.pathname.split('/').pop() || 'index.html';
    if (!pagina.includes('.')) pagina += '.html'; // flexgogroup.com/kivo también abre kivo.html
    const s = S.find((y) => y.href === pagina);
    const x = s && datos.find((y) => y.id === s.id);
    if (!x || x.visible) return;
    const main = document.querySelector('main');
    if (!main) return;
    const aviso = document.createElement('section');
    aviso.className = 'sv-apagado';
    aviso.setAttribute('role', 'status');
    const h = document.createElement('h1');
    h.textContent = 'Este servicio no está disponible por ahora';
    const p = document.createElement('p');
    p.textContent = `${s.nombre} volverá pronto. Mientras tanto, mira los servicios que sí puedes usar hoy.`;
    const a = Object.assign(document.createElement('a'), { href: 'index.html#servicios', className: 'sv-apagado-btn', textContent: 'Ver los servicios disponibles' });
    aviso.append(h, p, a);
    main.prepend(aviso);
    document.documentElement.classList.add('servicio-apagado');
  };

  window.FLEXGO_VISIBLES = new Promise((resolver) => {
    const empezar = () => traer().then((datos) => {
      ocultar(datos);
      const S = window.FLEXGO_SERVICIOS || [];
      datos.forEach((x) => { if (x.visible) etiquetar(x); });
      avisoPagina(S, datos);
      resolver(new Map(datos.map((x) => [x.id, x])));
    });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', empezar, { once: true });
    else empezar();
  });
})();
