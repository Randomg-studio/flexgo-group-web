// Formulario de contacto: guarda el mensaje en la bandeja de atención de Logrin (la misma de los chats de Kivo).
// Si no se puede guardar, abre WhatsApp con todos los datos ya escritos. Nunca se envía en silencio.
(() => {
  'use strict';
  const D = window.FLEXGO;
  const form = document.getElementById('form-contacto');
  if (!form || !D) return;
  const estado = form.querySelector('.estado');
  const boton = form.querySelector('.enviar');
  const f = form.elements;
  const ESPERA = 60 * 1000;
  const CLAVE = 'contacto-enviado';

  const limpio = (v) => (v || '').trim().replace(/\s+/g, ' ');
  const correoOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const celOk = (v) => /^(\+?51)?\s?9\d{2}\s?\d{3}\s?\d{3}$/.test(v);

  const marcar = (campo, mal) => campo.setAttribute('aria-invalid', mal ? 'true' : 'false');
  const decir = (texto, tipo, enlace) => {
    estado.className = `estado ${tipo || ''}`;
    estado.replaceChildren(texto);
    if (enlace) estado.append(' ', enlace, '.');
  };
  const linkWa = (texto, etiqueta) => {
    const a = document.createElement('a');
    a.href = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(texto)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = etiqueta;
    return a;
  };
  const resumen = (d) => [
    'Hola, les escribo desde la página de contacto de FlexGo.',
    `Nombre: ${d.nombre}`,
    d.correo && `Correo: ${d.correo}`,
    d.whatsapp && `WhatsApp: ${d.whatsapp}`,
    d.empresa && `Empresa: ${d.empresa}`,
    `Me interesa: ${d.servicio}`,
    `Mensaje: ${d.mensaje}`,
  ].filter(Boolean).join('\n');

  const rpc = async (fn, args) => {
    const r = await fetch(`${D.kivo.url}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: D.kivo.clave, Authorization: `Bearer ${D.kivo.clave}` },
      body: JSON.stringify(args),
    });
    if (!r.ok) throw new Error(fn);
    return r.json();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = {
      nombre: limpio(f.nombre.value),
      correo: limpio(f.correo.value),
      whatsapp: limpio(f.whatsapp.value),
      empresa: limpio(f.empresa.value),
      servicio: f.servicio.value,
      mensaje: limpio(f.mensaje.value),
    };

    // Trampa para robots: si la llenan, se finge éxito y no se envía nada.
    if (f.web.value) { form.reset(); decir('¡Gracias! Te responderemos pronto.', 'ok'); return; }

    let primero = null;
    const revisar = (campo, mal) => { marcar(campo, mal); if (mal && !primero) primero = campo; };
    revisar(f.nombre, d.nombre.length < 2);
    revisar(f.correo, !!d.correo && !correoOk(d.correo));
    revisar(f.whatsapp, !!d.whatsapp && !celOk(d.whatsapp));
    revisar(f.servicio, !d.servicio);
    revisar(f.mensaje, d.mensaje.length < 10);
    if (primero) { decir('Revisa los campos marcados: nombre, servicio y un mensaje de al menos 10 letras.', 'error'); primero.focus(); return; }
    if (!d.correo && !d.whatsapp) { revisar(f.correo, true); decir('Déjanos un correo o un WhatsApp para poder responderte.', 'error'); f.correo.focus(); return; }
    if (!f.acepto.checked) { decir('Marca la casilla para aceptar la política de privacidad.', 'error'); f.acepto.focus(); return; }

    let ultimo = 0;
    try { ultimo = Number(localStorage.getItem(CLAVE)) || 0; } catch {}
    if (Date.now() - ultimo < ESPERA) { decir('Ya recibimos tu mensaje. Si quieres agregar algo,', 'ok', linkWa(resumen(d), 'escríbenos por WhatsApp')); return; }

    boton.disabled = true;
    decir('Enviando…');
    try {
      if (!D.kivo || !D.kivo.clave) throw new Error('sin conexión');
      const conv = await rpc('chat_visitante_abrir', { p_nombre: d.nombre.slice(0, 80), p_contacto: (d.whatsapp || d.correo).slice(0, 120), p_origen: 'flexgo' });
      const texto = `Formulario de contacto · flexgogroup.com\n${resumen(d).split('\n').slice(1).join('\n')}\nAceptó la política de privacidad (Ley 29733).`;
      await rpc('chat_enviar', { p_conv: conv.id, p_texto: texto.slice(0, 1900), p_token: conv.token });
      try { localStorage.setItem(CLAVE, String(Date.now())); } catch {}
      form.reset();
      decir('¡Listo! Recibimos tu mensaje y te responderemos pronto. Si es urgente,', 'ok', linkWa(resumen(d), 'escríbenos por WhatsApp'));
    } catch {
      decir('No pudimos enviarlo por aquí. Para que no se pierda,', 'error', linkWa(resumen(d), 'envíalo por WhatsApp con tus datos ya escritos'));
    } finally {
      boton.disabled = false;
    }
  });
})();
