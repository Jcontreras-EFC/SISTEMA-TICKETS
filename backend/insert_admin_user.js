const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tickets.db');

const usuario = 'Jcontreras';
const clave = '74847429';
const permisos = JSON.stringify(["tickets","base","dashboard","usuarios"]);

const createUsersTable = `
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  permisos TEXT NOT NULL
);
`;

db.serialize(() => {
  db.run(createUsersTable, (err) => {
    if (err) return console.error('Error creando tabla:', err.message);
    db.get('SELECT id FROM usuarios WHERE usuario = ?', [usuario], (err, row) => {
      if (row) {
        db.run('UPDATE usuarios SET clave = ?, permisos = ? WHERE id = ?', [clave, permisos, row.id], function(err) {
          if (err) return console.error('Error actualizando:', err.message);
          console.log('Usuario actualizado:', usuario);
          db.close();
        });
      } else {
        db.run('INSERT INTO usuarios (usuario, clave, permisos) VALUES (?, ?, ?)', [usuario, clave, permisos], function(err) {
          if (err) return console.error('Error insertando:', err.message);
          console.log('Usuario insertado:', usuario);
          db.close();
        });
      }
    });
  });
}); 