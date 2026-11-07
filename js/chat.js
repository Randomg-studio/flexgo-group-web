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
  let pendiente = null;
  let pidiendoNombre = false;
  let consulta = null;
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

  const pinta = (t, { yo = false, autor = '' } = {}) => {
    const p = document.createElement('p');
    if (yo) p.className = 'yo';
    if (autor && autor !== 'Kivo') {
      const b = document.createElement('b');
      b.className = 'autor';
      b.textContent = autor;
      p.append(b);
    }
    p.append(t);
    mensajes.append(p);
    mensajes.scrollTop = mensajes.scrollHeight;
    return p;
  };

  const pintaAsesor = (texto) => {
    const p = pinta('No pude responderte por aquí. Un asesor puede ayudarte: ');
    const a = document.createElement('a');
    a.href = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(`Hola, tengo esta consulta: ${texto}`)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'escribir por WhatsApp';
    p.append(a, '.');
  };

  const mostrarEscribiendo = (si) => {
    if (si && !escribiendo) {
      escribiendo = pinta('Kivo está escribiendo…');
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

    if (pidiendoNombre) {
      const nombre = t.trim().slice(0, 80);
      if (nombre.length < 2) {
        pinta('¿Me dices tu nombre? Con eso empiezo.');
        return;
      }
      pidiendoNombre = false;
      consulta = { nombre };
      pinta(`Gracias, ${nombre.split(' ')[0]}. Déjame ver…`);
      enviarAKivo(pendiente);
      pendiente = null;
      return;
    }

    if (conv) {
      enviarAKivo(t);
      return;
    }

    if (!D.kivo?.clave) {
      responderSinKivo(t);
      return;
    }
    pendiente = t;
    pidiendoNombre = true;
    pinta('Para ayudarte mejor, ¿cómo te llamas? 🙂');
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

  const abrir = (si) => {
    chat.hidden = !si;
    boton.hidden = si;
    boton.setAttribute('aria-expanded', String(si));
    if (si) {
      if (!saludado) {
        saludado = true;
        pinta('¡Hola! 👋 Soy Kivo, el asistente de IA de FlexGo. ¿Qué te gustaría resolver en tu negocio?');
        if (conv) leer().catch(() => {});
      }
      programar();
      texto.focus();
    } else {
      clearTimeout(temporizador);
      boton.focus();
    }
  };

  boton.addEventListener('click', () => abrir(true));
  $('#chat-cerrar').addEventListener('click', () => abrir(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chat.hidden) abrir(false);
  });
  $('#chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const t = texto.value.trim();
    if (!t) return;
    texto.value = '';
    responder(t);
  });
})();
