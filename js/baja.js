// Baja de los correos de seguimiento de CreaGo: el enlace trae un token que solo sirve para esto.
(() => {
  const estado = document.getElementById('baja-estado');
  const token = new URLSearchParams(location.search).get('t') || '';
  const decir = (t) => { estado.textContent = t; };
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    decir('El enlace no está completo. Ábrelo de nuevo desde el correo o escríbenos para darte de baja.');
    return;
  }
  const clave = 'sb_publishable_BETDUSfuMo9w77BQk18eog_HRMMQPFo'; // clave pública de CreaGo, la misma que usa la app
  fetch('https://dojbyklwgzbefbfknhks.supabase.co/rest/v1/rpc/email_unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: clave, Authorization: 'Bearer ' + clave },
    body: JSON.stringify({ p_token: token }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((ok) => decir(ok
      ? 'Listo. Ya no te enviaremos correos de seguimiento de CreaGo. Los avisos de tu cuenta, como recuperar tu contraseña, siguen llegando.'
      : 'No encontramos ese enlace. Escríbenos y te damos de baja a mano.'))
    .catch(() => decir('No pudimos completar la baja ahora. Inténtalo en unos minutos o escríbenos.'));
})();
