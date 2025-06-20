const fetch = require('node-fetch');

(async () => {
  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: 'Jcontreras', clave: '74847429' })
  });
  const data = await res.json();
  console.log('Respuesta del backend:', data);
})(); 