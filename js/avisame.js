// "Avísame cuando salga": guarda el correo o WhatsApp en el sistema de atención de Logrin,
// el mismo que recibe los chats de Kivo, para que el equipo avise cuando salga el servicio.
(() => {
  const D = window.FLEXGO;
  const form = document.getElementById('avisame');
  if (!form || !D || !D.kivo) return;
  const estado = form.querySelector('.avisame-estado');
  const campo = form.elements.contacto;
  const boton = form.querySelector('button[type="submit"]');

  const limpiar = (v) => v.trim().replace(/\s+/g, ' ');
  const valido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^(\+?51)?\s?9\d{2}\s?\d{3}\s?\d{3}$/.test(v);

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
    const contacto = limpiar(campo.value);
    if (!valido(contacto)) {
      estado.textContent = 'Escribe un correo o un celular de 9 dígitos.';
      campo.focus();
      return;
    }
    if (!form.elements.acepto.checked) {
      estado.textContent = 'Marca la casilla para aceptar que te avisemos.';
      return;
    }
    boton.disabled = true;
    estado.textContent = 'Guardando…';
    try {
      const conv = await rpc('chat_visitante_abrir', { p_nombre: 'Lista de espera', p_contacto: contacto, p_origen: 'flexgo' });
      await rpc('chat_enviar', { p_conv: conv.id, p_texto: `Lista de espera · Asistente de investigación y tareas con IA. Contacto: ${contacto}. Aceptó que le avisemos (Ley 29733).`, p_token: conv.token });
      form.reset();
      estado.textContent = '¡Listo! Te avisaremos cuando salga.';
    } catch {
      const a = document.createElement('a');
      a.href = `https://wa.me/${D.whatsapp}?text=${encodeURIComponent('Hola, avísenme cuando salga el Asistente de investigación y tareas con IA.')}`;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'escríbenos por WhatsApp';
      estado.replaceChildren('No pudimos guardarlo. Por favor, ', a, '.');
    } finally {
      boton.disabled = false;
    }
  });
})();
