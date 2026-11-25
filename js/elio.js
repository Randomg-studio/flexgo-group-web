// Elio · lista de espera: entra a la bandeja de interesados de la consola (R-132) con el servicio «Elio · lista de espera».
(() => {
  'use strict';
  const D = window.FLEXGO;
  const form = document.getElementById('el-form');
  if (!form || !D?.kivo?.clave) return;
  const estado = form.querySelector('.estado');
  const boton = form.querySelector('button[type="submit"]');
  const f = form.elements;
  const decir = (t, tipo) => { estado.className = `estado ${tipo || ''}`; estado.textContent = t; };
  const limpio = (v) => (v || '').trim().replace(/\s+/g, ' ');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (f.web.value) { form.reset(); decir('¡Gracias! Te avisaremos cuando Elio esté listo.', 'ok'); return; }
    const contacto = limpio(f.contacto.value);
    const esCorreo = contacto.includes('@');
    const interes = limpio(f.interes.value);
    const d = {
      nombre: limpio(f.nombre.value),
      correo: esCorreo ? contacto : '',
      whatsapp: esCorreo ? '' : contacto,
      empresa: '',
      servicio: 'Elio · lista de espera',
      mensaje: `Quiero probar Elio.${interes ? ` Lo usaría para: ${interes}` : ''}`,
      sitio: '',
    };
    if (d.nombre.length < 2) { decir('Escribe tu nombre.', 'error'); f.nombre.focus(); return; }
    if (!contacto) { decir('Déjanos tu WhatsApp o tu correo.', 'error'); f.contacto.focus(); return; }
    if (!f.acepto.checked) { decir('Marca la casilla para aceptar la política de privacidad.', 'error'); f.acepto.focus(); return; }
    boton.disabled = true;
    decir('Enviando…');
    try {
      const r = await fetch(`${D.kivo.url}/rest/v1/rpc/contacto_web_enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: D.kivo.clave, Authorization: `Bearer ${D.kivo.clave}` },
        body: JSON.stringify({ p: d }),
      });
      if (r.status === 400) {
        const j = await r.json().catch(() => ({}));
        decir(j.message || 'Revisa tus datos.', 'error');
      } else if (!r.ok) {
        throw new Error(String(r.status));
      } else {
        form.reset();
        decir('¡Gracias! Te avisaremos cuando Elio esté listo.', 'ok');
      }
    } catch {
      decir('No pudimos guardar tus datos. Escríbenos «Elio» al WhatsApp 917 952 528.', 'error');
    } finally {
      boton.disabled = false;
    }
  });
})();
