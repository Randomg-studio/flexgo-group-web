(() => {
  const D = window.FLEXGO;
  const FAQ = window.FLEXGO_FAQ;
  const $ = (s) => document.querySelector(s);
  const chat = $('#chat');
  const boton = $('#chat-boton');
  const mensajes = $('#chat-mensajes');
  const rapidas = $('#chat-rapidas');
  const texto = $('#chat-texto');
  const GUARDADO = 'kivo-chat';
  let saludado = false;
  let consulta = null;

  // R-139: el nombre sale del mismo mensaje si la persona lo dice, aunque tenga faltas
  // («mi nombre ed Ana», «me yamo Ana», «hola soy Ana Ruiz»). Si no lo dice, Kivo responde igual y lo pide solo si hace falta.
  const NO_NOMBRE = /^(de|del|la|el|los|las|un|una|y|e|o|q|que|quiero|quisiera|tengo|busco|necesito|para|con|por|me|te|mi|tu|su|nuevo|nueva|dueñ[oa]|cliente|estudiante|emprendedor[a]?|interesad[oa]|alguien|yo|aqui|aquí|acá|aca|hola)$/i;
  const nombreDe = (t) => {
    const m = String(t).match(/(?:^|[\s,.!¡¿?])(?:me\s+llamo|me\s+yamo|mi\s+nombre\s+(?:es|ed|e|s)|mi\s+nombre|soy|habla|te\s+escribe)\s*[:,-]?\s+([\p{L}'-]+(?:\s+[\p{L}'-]+)?)/iu);
    if (!m) return '';
    const p = m[1].split(/\s+/);
    const ok = [];
    for (const w of p) { if (NO_NOMBRE.test(w) || w.length < 2) break; ok.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()); }
    return ok.join(' ').slice(0, 60);
  };
  let desde = 0;
  let escribiendo = null;

  const normal = (t) =>
    ` ${t
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()} `;

  // Gana la pregunta con la clave más larga: "prueba gratis" pesa más que una palabra suelta.
  const buscar = (pregunta) => {
    const q = normal(pregunta);
    let mejor = null;
    let puntos = 0;
    FAQ.forEach((f) => {
      const p = f.c.reduce((suma, clave) => {
        const c = normal(clave);
        return q.includes(c) ? suma + c.trim().length : suma;
      }, 0);
      if (p > puntos) {
        puntos = p;
        mejor = f;
      }
    });
    return mejor;
  };

  // Las direcciones de las respuestas se vuelven enlaces clicables.
  // Seguro: el texto nunca se trata como HTML (solo textContent) y solo se aceptan
  // http(s), wa.me y tel:. Nada de javascript: ni data:.
  const LINK = /\bhttps?:\/\/[^\s<>"']+|\bwa\.me\/[^\s<>"']+|\btel:\+?[\d-]{6,}/gi;
  const recorta = (u) => {
    // Quita la puntuación del final («visita x.com/.» → x.com/) y un «)» que no abrió.
    for (;;) {
      const antes = u;
      u = u.replace(/[.,;:!?¡¿»"'”’…]+$/, '');
      if (u.endsWith(')') && (u.match(/\(/g) || []).length < (u.match(/\)/g) || []).length) u = u.slice(0, -1);
      if (u === antes) return u;
    }
  };
  const destino = (u) => {
    const href = /^wa\.me\//i.test(u) ? `https://${u}` : u;
    try {
      const x = new URL(href);
      if (x.protocol === 'tel:') return href;
      if ((x.protocol === 'https:' || x.protocol === 'http:') && x.hostname.includes('.')) return x.href;
    } catch { /* no es una dirección válida */ }
    return '';
  };
  const conLinks = (p, t) => {
    let i = 0;
    for (const m of t.matchAll(LINK)) {
      const texto = recorta(m[0]);
      const href = destino(texto);
      if (!href) continue;
      const a = document.createElement('a');
      a.href = href;
      if (!href.startsWith('tel:')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      a.textContent = texto.replace(/^tel:/i, '');
      p.append(t.slice(i, m.index), a);
      i = m.index + texto.length;
    }
    p.append(t.slice(i));
  };

  // La conversación se guarda en esta pestaña (sessionStorage): sigue igual al recargar o
  // al cambiar de página, y empieza de nuevo solo al cerrar la pestaña.
  const LOG = 'kivo-chat-log';
  const TOPE = 80;
  let registro = [];
  let restaurando = false;
  const guardarLog = () => {
    try {
      if (registro.length > TOPE) registro = registro.slice(-TOPE);
      let s = JSON.stringify({ desde, abierto: !chat.hidden, m: registro });
      while (s.length > 60000 && registro.length > 1) {
        registro = registro.slice(Math.ceil(registro.length / 4));
        s = JSON.stringify({ desde, abierto: !chat.hidden, m: registro });
      }
      sessionStorage.setItem(LOG, s);
    } catch {
      /* sin almacenamiento, la conversación dura mientras la página siga abierta */
    }
  };
  const leerLog = () => {
    try {
      const v = JSON.parse(sessionStorage.getItem(LOG) || 'null');
      return v && Array.isArray(v.m) ? v : null;
    } catch {
      return null;
    }
  };

  const pinta = (t, { yo = false, autor = '', guarda = true } = {}) => {
    if (guarda && !restaurando) {
      registro.push(yo ? { t: String(t), yo: true } : { t: String(t), autor });
      guardarLog();
    }
    const p = document.createElement('p');
    if (yo) p.className = 'yo';
    if (autor && autor !== 'Kivo') {
      const b = document.createElement('b');
      b.className = 'autor';
      b.textContent = autor;
      p.append(b);
    }
    if (yo) p.append(t);
    else conLinks(p, t);
    mensajes.append(p);
    mensajes.scrollTop = mensajes.scrollHeight;
    return p;
  };

  const pintaAsesor = (texto) => {
    const p = pinta('No pude responderte por aquí. Un asesor puede ayudarte: ', { guarda: false });
    if (!restaurando) {
      registro.push({ asesor: String(texto) });
      guardarLog();
    }
    const a = document.createElement('a');
    a.href = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(`Hola, tengo esta consulta: ${texto}`)}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = 'escribir por WhatsApp';
    p.append(a, '.');
  };

  const mostrarEscribiendo = (si) => {
    if (si && !escribiendo) {
      escribiendo = pinta('Kivo está escribiendo…', { guarda: false });
      escribiendo.classList.add('escribe');
    } else if (!si && escribiendo) {
      escribiendo.remove();
      escribiendo = null;
    }
  };

  // Kivo responde desde el sistema de Logrin, que guarda la conversación para el equipo.
  const rpc = async (fn, args) => {
    const r = await fetch(`${D.kivo.url}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: D.kivo.clave, Authorization: `Bearer ${D.kivo.clave}` },
      body: JSON.stringify(args),
    });
    if (!r.ok) throw new Error(fn);
    return r.json();
  };

  const leerGuardado = () => {
    try {
      return JSON.parse(sessionStorage.getItem(GUARDADO) || 'null');
    } catch {
      return null;
    }
  };
  const guardar = (v) => {
    try {
      if (v) sessionStorage.setItem(GUARDADO, JSON.stringify(v));
      else sessionStorage.removeItem(GUARDADO);
    } catch {
      /* sin almacenamiento, la conversación dura mientras la página siga abierta */
    }
  };
  let conv = leerGuardado();

  const leer = async () => {
    if (!conv) return;
    const d = await rpc('chat_leer', { p_conv: conv.id, p_desde: desde, p_token: conv.token });
    (d.mensajes || []).forEach((m) => {
      desde = Math.max(desde, m.id);
      if (m.de === 'cliente') return;
      mostrarEscribiendo(false);
      pinta(m.texto, { autor: m.autor });
    });
    mostrarEscribiendo(Boolean(d.pensando));
    if (d.estado === 'cerrada' || d.terminada) {
      conv = null;
      guardar(null);
    }
  };

  // Mientras el chat está abierto se revisa seguido; si nadie escribe, cada vez menos.
  let espera = 1500;
  let temporizador = null;
  const programar = () => {
    clearTimeout(temporizador);
    if (!conv || chat.hidden) return;
    temporizador = setTimeout(async () => {
      try {
        const antes = desde;
        await leer();
        espera = desde !== antes || escribiendo ? 1500 : Math.min(espera * 1.5, 12000);
      } catch {
        espera = 12000;
      }
      programar();
    }, espera);
  };

  const enviarAKivo = async (t) => {
    mostrarEscribiendo(true);
    try {
      if (!conv) {
        conv = await rpc('chat_visitante_abrir', { p_nombre: consulta.nombre, p_contacto: '', p_origen: 'flexgo' });
        guardar(conv);
      }
      await rpc('chat_enviar', { p_conv: conv.id, p_texto: t, p_token: conv.token });
      espera = 1500;
      await leer();
      programar();
    } catch {
      mostrarEscribiendo(false);
      responderSinKivo(t);
    }
  };

  // Sin conexión con Kivo quedan las preguntas frecuentes y, si no hay, WhatsApp.
  const responderSinKivo = (t) => {
    const encontrada = buscar(t);
    if (encontrada) pinta(encontrada.r);
    else pintaAsesor(t);
  };

  const responder = async (t) => {
    pinta(t, { yo: true });

    if (conv) {
      enviarAKivo(t);
      return;
    }

    if (!D.kivo?.clave) {
      responderSinKivo(t);
      return;
    }
    // R-139: no se frena la pregunta para pedir el nombre: Kivo responde primero.
    consulta = { nombre: nombreDe(t) || 'Visitante' };
    enviarAKivo(t);
  };

  ['¿Qué servicios ofrecen?', '¿Puedo probar Logrin Negocio gratis?', '¿Cuánto cuestan sus servicios?', '¿Cómo los contacto y cuál es su horario?'].forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = t.replace(/^¿|\?$/g, '');
    // Los botones responden al instante con la lista de preguntas frecuentes.
    b.addEventListener('click', () => {
      pinta(t, { yo: true });
      responderSinKivo(t);
    });
    rapidas.append(b);
  });

  const saludar = () => {
    saludado = true;
    pinta('¡Hola! 👋 Soy Kivo, el asistente de IA de FlexGo. ¿Qué te gustaría resolver en tu negocio?');
  };

  // En el celular el chat ocupa toda la pantalla: el botón «atrás» lo minimiza.
  const enCelular = () => window.matchMedia('(max-width: 720px)').matches;
  const abrir = (si, { foco = true } = {}) => {
    chat.hidden = !si;
    boton.hidden = si;
    boton.setAttribute('aria-expanded', String(si));
    document.documentElement.classList.toggle('chat-abierto', si);
    if (si) {
      if (enCelular() && !history.state?.kivoChat) {
        try { history.pushState({ ...(history.state || {}), kivoChat: true }, ''); } catch { /* sin historial */ }
      }
      if (!saludado) {
        saludar();
        if (conv) leer().catch(() => {});
      }
      mensajes.parentElement.scrollTop = mensajes.parentElement.scrollHeight;
      programar();
      if (foco) texto.focus();
    } else {
      clearTimeout(temporizador);
      if (foco) boton.focus();
    }
    guardarLog();
  };
  const minimizar = () => {
    if (history.state?.kivoChat) history.back();
    else abrir(false);
  };
  window.addEventListener('popstate', () => {
    if (!chat.hidden && !history.state?.kivoChat) abrir(false);
  });

  // Encabezado: «Nuevo chat» y el botón para minimizar, siempre a la vista.
  const cerrarBtn = $('#chat-cerrar');
  cerrarBtn.setAttribute('aria-label', 'Minimizar el chat de Kivo');
  cerrarBtn.title = 'Minimizar';
  const acciones = document.createElement('div');
  acciones.className = 'chat-acciones';
  const nuevo = document.createElement('button');
  nuevo.type = 'button';
  nuevo.className = 'chat-nuevo';
  nuevo.textContent = 'Nuevo chat';
  nuevo.setAttribute('aria-label', 'Empezar una conversación nueva');
  cerrarBtn.replaceWith(acciones);
  acciones.append(nuevo, cerrarBtn);
  nuevo.addEventListener('click', () => {
    clearTimeout(temporizador);
    conv = null;
    guardar(null);
    desde = 0;
    registro = [];
    mostrarEscribiendo(false);
    mensajes.replaceChildren();
    saludar();
    texto.focus();
  });

  boton.addEventListener('click', () => abrir(true));
  cerrarBtn.addEventListener('click', minimizar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chat.hidden) minimizar();
  });

  // Al recargar o cambiar de página se repinta la conversación tal como estaba.
  const previo = leerLog();
  if (previo && previo.m.length) {
    restaurando = true;
    registro = previo.m.slice(-TOPE);
    desde = Number(previo.desde) || 0;
    registro.forEach((m) => {
      if (m.asesor) pintaAsesor(m.asesor);
      else pinta(m.t, { yo: Boolean(m.yo), autor: m.autor || '' });
    });
    restaurando = false;
    saludado = true;
    if (previo.abierto) abrir(true, { foco: false });
  }
  $('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = texto.value.trim();
    if (!t) return;
    texto.value = '';
    responder(t);
  });
})();
