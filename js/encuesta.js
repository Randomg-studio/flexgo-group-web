// Encuesta corta de las páginas de servicios. Las respuestas van a Logrin por la función encuesta_web_enviar.
// Sale una sola vez (al leer la mitad de la página o a los 30 s), se puede cerrar y no vuelve en 60 días.
// Uso: <script src="js/encuesta.js?v=1" data-pagina="kivo"></script>
(() => {
  'use strict';
  const D = window.FLEXGO;
  const PAGINA = document.currentScript?.dataset.pagina || '';
  const POLITICA = '2026-11-26';
  const DIAS = 60;
  const CLAVE = `encuesta-${PAGINA}`;

  const RUBROS = [
    ['tienda', 'Bodega o tienda'], ['comida', 'Restaurante o comida'], ['salud_belleza', 'Salud o belleza'],
    ['educacion', 'Educación'], ['servicios', 'Servicios profesionales'], ['sin_negocio', 'Todavía no tengo negocio'], ['otro', 'Otro'],
  ];
  const NECESIDAD = {
    kivo: [['whatsapp_rapido', 'Responder más rápido por WhatsApp'], ['fuera_horario', 'Atender fuera de horario'], ['quien_compra', 'Saber quién está listo para comprar'], ['pedidos_citas', 'Tomar pedidos o citas'], ['seguimiento', 'Hacer seguimiento a clientes']],
    logrin: [['ventas_caja', 'Controlar ventas y caja'], ['inventario', 'Llevar el inventario'], ['cuanto_gano', 'Saber cuánto gano'], ['equipo', 'Ordenar a mi equipo'], ['dejar_cuaderno', 'Dejar el cuaderno o el Excel']],
    creago: [['publicar_seguido', 'Publicar más seguido'], ['disenos_pro', 'Diseños que se vean profesionales'], ['ideas', 'Ideas de qué publicar'], ['programar', 'Programar publicaciones'], ['ahorrar_disenador', 'Ahorrar en diseñador']],
    webs: [['primera_web', 'Tener mi primera web'], ['renovar', 'Renovar mi web'], ['vender_online', 'Vender por internet'], ['google', 'Aparecer en Google'], ['pedidos_citas', 'Recibir pedidos o citas']],
    elio: [['estudiar', 'Estudiar o hacer tareas'], ['trabajo', 'Trabajo y redacción'], ['ideas_negocio', 'Ideas para mi negocio'], ['pdf_imagenes', 'Leer PDF e imágenes'], ['curiosidad', 'Solo tengo curiosidad']],
    eleva: [['ia_trabajo', 'Aprender IA para mi trabajo'], ['vender_redes', 'Aprender a vender por redes'], ['herramientas', 'Usar herramientas digitales'], ['formar_equipo', 'Formar a mi equipo'], ['certificarme', 'Certificarme']],
  };
  const FRENOS = [['precio', 'El precio'], ['no_se_si_sirve', 'No sé si me sirve'], ['tiempo', 'No tengo tiempo para aprender'], ['hablar_persona', 'Prefiero hablar con alguien'], ['nada', 'Nada, quiero empezar']];
  if (!NECESIDAD[PAGINA] || !D?.kivo?.clave) return;

  const leer = () => { try { return Number(localStorage.getItem(CLAVE)) || 0; } catch { return Date.now(); } };
  const marcar = () => { try { localStorage.setItem(CLAVE, String(Date.now())); } catch { /* sin almacenamiento */ } };
  if (Date.now() - leer() < DIAS * 864e5) return;

  const el = (tag, props = {}, ...hijos) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...hijos);
    return n;
  };

  const r = { rubro: '', necesidad: '', freno: '' };
  const pasos = [
    { campo: 'rubro', titulo: '¿A qué se dedica tu negocio?', opciones: RUBROS },
    { campo: 'necesidad', titulo: '¿Qué te gustaría resolver?', opciones: NECESIDAD[PAGINA] },
    { campo: 'freno', titulo: '¿Qué te frena para empezar?', opciones: FRENOS },
  ];
  let paso = 0;
  let tarjeta = null;

  const cerrar = () => {
    marcar();
    tarjeta?.remove();
    tarjeta = null;
  };

  const barra = () => el('div', { className: 'enc-avance', role: 'progressbar', ariaValueMin: '1', ariaValueMax: '4', ariaValueNow: String(paso + 1), ariaLabel: `Paso ${paso + 1} de 4` },
    el('span'));

  const cuerpo = () => tarjeta.querySelector('.enc-cuerpo');
  const pintar = () => {
    const c = cuerpo();
    c.replaceChildren();
    const b = barra();
    b.firstChild.className = `enc-lleno p${paso + 1}`;
    c.append(b);
    if (paso < pasos.length) {
      const p = pasos[paso];
      const lista = el('div', { className: 'enc-opciones', role: 'group' });
      const h = el('p', { className: 'enc-pregunta', id: `enc-q${paso}` }, p.titulo);
      lista.setAttribute('aria-labelledby', h.id);
      p.opciones.forEach(([valor, texto]) => {
        const o = el('button', { type: 'button', className: 'enc-opcion' }, texto);
        if (r[p.campo] === valor) o.classList.add('elegida');
        o.addEventListener('click', () => { r[p.campo] = valor; paso += 1; pintar(); });
        lista.append(o);
      });
      c.append(h, lista);
      if (paso > 0) {
        const atras = el('button', { type: 'button', className: 'enc-atras' }, '← Atrás');
        atras.addEventListener('click', () => { paso -= 1; pintar(); });
        c.append(atras);
      }
      lista.querySelector('button')?.focus({ preventScroll: true });
      return;
    }
    // Último paso: comentario y contacto, ambos opcionales.
    const form = el('form', { className: 'enc-final', noValidate: true });
    const coment = el('textarea', { id: 'enc-coment', maxLength: 300, rows: 2, placeholder: 'Opcional' });
    const contacto = el('input', { id: 'enc-contacto', type: 'text', maxLength: 120, placeholder: 'Opcional', autocomplete: 'off' });
    const acepto = el('input', { id: 'enc-acepto', type: 'checkbox' });
    const trampa = el('input', { type: 'text', name: 'web', tabIndex: -1, autocomplete: 'off', className: 'enc-trampa', ariaHidden: 'true' });
    const enlace = el('a', { href: 'legal/privacidad.html', target: '_blank', rel: 'noopener' }, 'política de privacidad');
    const estado = el('p', { className: 'enc-estado', role: 'status' });
    const enviar = el('button', { type: 'submit', className: 'enc-enviar' }, 'Enviar');
    const atras = el('button', { type: 'button', className: 'enc-atras' }, '← Atrás');
    atras.addEventListener('click', () => { paso -= 1; pintar(); });
    form.append(
      el('label', { htmlFor: 'enc-coment', className: 'enc-pregunta' }, '¿Algo más que quieras contarnos?'), coment,
      el('label', { htmlFor: 'enc-contacto', className: 'enc-etiqueta' }, '¿Quieres que te escribamos? Deja tu WhatsApp o correo'), contacto,
      el('label', { className: 'enc-acepto' }, acepto, el('span', {}, 'Acepto la ', enlace, ' para que me contacten.')),
      trampa, estado, el('div', { className: 'enc-botones' }, atras, enviar),
    );
    c.append(form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const dato = contacto.value.trim().replace(/\s+/g, ' ');
      if (dato && !acepto.checked) { estado.className = 'enc-estado error'; estado.textContent = 'Para dejar tu contacto, marca la casilla de privacidad. O bórralo y envía sin contacto.'; acepto.focus(); return; }
      enviar.disabled = true;
      estado.className = 'enc-estado';
      estado.textContent = 'Enviando…';
      try {
        const resp = await fetch(`${D.kivo.url}/rest/v1/rpc/encuesta_web_enviar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: D.kivo.clave, Authorization: `Bearer ${D.kivo.clave}` },
          body: JSON.stringify({ p: {
            pagina: PAGINA, ...r,
            comentario: coment.value.trim().slice(0, 300),
            contacto: dato && acepto.checked ? dato.slice(0, 120) : '',
            acepta: Boolean(dato && acepto.checked),
            politica: POLITICA,
            trampa: trampa.value,
          } }),
        });
        if (resp.status === 400) {
          const j = await resp.json().catch(() => ({}));
          throw new Error(j.message || '');
        }
        if (!resp.ok) throw new Error('');
        tarjeta.querySelector('.enc-ahora-no')?.remove();
        marcar();
        c.replaceChildren(el('p', { className: 'enc-gracias' }, '¡Gracias! 💙'), el('p', { className: 'enc-sub' }, dato ? 'Leeremos tu respuesta y te escribiremos pronto.' : 'Tu respuesta nos ayuda a mejorar.'));
        setTimeout(() => { tarjeta?.remove(); tarjeta = null; }, 4000);
      } catch (err) {
        estado.className = 'enc-estado error';
        estado.textContent = err.message || 'No pudimos enviar tu respuesta. Inténtalo de nuevo en un momento.';
        enviar.disabled = false;
      }
    });
  };

  const mostrar = () => {
    if (tarjeta || Date.now() - leer() < DIAS * 864e5) return;
    const chat = document.getElementById('chat');
    if (chat && !chat.hidden) { setTimeout(mostrar, 20000); return; }
    const x = el('button', { type: 'button', className: 'enc-x', ariaLabel: 'Cerrar la encuesta' }, '×');
    const ahoraNo = el('button', { type: 'button', className: 'enc-ahora-no' }, 'Ahora no');
    x.addEventListener('click', cerrar);
    ahoraNo.addEventListener('click', cerrar);
    tarjeta = el('aside', { className: 'encuesta', ariaLabel: 'Encuesta de 1 minuto' },
      el('div', { className: 'enc-cabeza' }, el('p', { className: 'enc-titulo' }, 'Ayúdanos a mejorar · 1 minuto'), x),
      el('div', { className: 'enc-cuerpo' }),
      ahoraNo);
    document.body.append(tarjeta);
    pintar();
  };

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && tarjeta) cerrar(); });

  // Aparece al leer la mitad de la página o a los 30 segundos, lo que pase primero.
  let listo = false;
  const disparar = () => { if (listo) return; listo = true; window.removeEventListener('scroll', alBajar); clearTimeout(reloj); mostrar(); };
  const alBajar = () => {
    const h = document.documentElement;
    if ((h.scrollTop + innerHeight) / h.scrollHeight >= 0.5) disparar();
  };
  window.addEventListener('scroll', alBajar, { passive: true });
  const reloj = setTimeout(disparar, 30000);
})();
