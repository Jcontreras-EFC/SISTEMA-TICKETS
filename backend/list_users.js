const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tickets.db');

db.all('SELECT * FROM usuarios', [], (err, rows) => {
  if (err) return console.error('Error:', err.message);
  if (!rows.length) return console.log('No hay usuarios en la tabla.');
  rows.forEach(u => {
    console.log(`ID: ${u.id}, Usuario: ${u.usuario}, Clave: ${u.clave}, Permisos: ${u.permisos}`);
  });
  db.close();
}); 