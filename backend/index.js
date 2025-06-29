const express = require('express');
const cors = require('cors');
const ExcelJS = require('exceljs');
const multer = require('multer');
const { Pool } = require('pg');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Tickets',
  password: '123456', // Contraseña actualizada
  port: 5432,
});

// Endpoint para registrar un ticket
app.post('/api/tickets', async (req, res) => {
  const { fecha, hora, sede, categoria, usuario, asunto, agente, descripcion, prioridad, estado } = req.body;
  const estadoFinal = (estado || 'abierto').toLowerCase();
  const sql = `INSERT INTO tickets (fecha, hora, sede, categoria, usuario, asunto, agente, descripcion, prioridad, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`;
  try {
    const result = await pool.query(sql, [fecha, hora, sede, categoria, usuario, asunto, agente, descripcion, prioridad, estadoFinal]);
    res.json({ mensaje: 'Ticket registrado con éxito.', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar el ticket.' });
  }
});

// Endpoint para obtener todos los tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickets');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener los tickets.' });
  }
});

// Endpoint para eliminar un ticket
app.delete('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tickets WHERE id = $1', [id]);
    res.json({ mensaje: 'Ticket eliminado con éxito.' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar el ticket.' });
  }
});

// Endpoint para editar un ticket
app.put('/api/tickets/:id', async (req, res) => {
  const { id } = req.params;
  const { fecha, hora, sede, categoria, usuario, asunto, agente, descripcion, prioridad, estado } = req.body;
  const estadoFinal = (estado || 'abierto').toLowerCase();
  const sql = `UPDATE tickets SET fecha = $1, hora = $2, sede = $3, categoria = $4, usuario = $5, asunto = $6, agente = $7, descripcion = $8, prioridad = $9, estado = $10 WHERE id = $11`;
  try {
    await pool.query(sql, [fecha, hora, sede, categoria, usuario, asunto, agente, descripcion, prioridad, estadoFinal, id]);
    res.json({ mensaje: 'Ticket editado con éxito.' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al editar el ticket.' });
  }
});

// Endpoint para obtener el próximo id autoincremental de tickets
app.get('/api/tickets/next-id', async (req, res) => {
  try {
    const result = await pool.query("SELECT nextval('tickets_id_seq') as next_id");
    res.json({ next_id: result.rows[0].next_id });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el próximo id.' });
  }
});

// Endpoint para obtener el próximo número de ticket consecutivo
app.get('/api/tickets/next-numero', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) + 1 AS next_ticket FROM tickets');
    res.json({ next_ticket: result.rows[0].next_ticket });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el próximo número de ticket.' });
  }
});

// Endpoint para exportar tickets a Excel con formato
app.get('/api/tickets/excel', async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;
  let sql = 'SELECT * FROM tickets';
  let params = [];
  if (fechaInicio && fechaFin) {
    sql += ' WHERE fecha >= $1 AND fecha <= $2';
    params = [fechaInicio, fechaFin];
  }
  try {
    const result = await pool.query(sql, params);
    console.log('Tickets encontrados:', result.rows.length, result.rows);
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tickets');

    // Insertar filas vacías para asegurar espacio para logo y título
    worksheet.spliceRows(1, 0, [], [], [], [], [], []); // Inserta 6 filas vacías al inicio
    // Borro explícitamente el contenido de A1 y B1
    worksheet.getCell('A1').value = '';
    worksheet.getCell('B1').value = '';

    // Agregar imagen del logo con logs de depuración
    try {
      const logoPath = path.resolve(__dirname, '../frontend/public/logo.png');
      console.log('Intentando leer el logo en:', logoPath);
      const fs = require('fs');
      if (fs.existsSync(logoPath)) {
        console.log('Logo encontrado, insertando en el Excel...');
        const imageId = workbook.addImage({
          filename: logoPath,
          extension: 'png',
        });
        worksheet.addImage(imageId, {
          tl: { col: 0, row: 0 },
          br: { col: 2, row: 6 }, // Ocupa de A1 a B6
          editAs: 'oneCell'
        });
        console.log('Logo insertado correctamente.');
      } else {
        console.log('Logo NO encontrado en la ruta:', logoPath);
      }
    } catch (imgErr) {
      console.log('Error al agregar el logo al Excel:', imgErr.message);
    }

    // Agregar título centrado en C1:K6
    const titulo = 'REPORTE DE TICKETS';
    worksheet.mergeCells('C1:K6');
    worksheet.getCell('C1').value = titulo;
    worksheet.getCell('C1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('C1').font = { size: 20, bold: true };

    // Definir los encabezados manualmente en la fila 7 (A7:K7)
    const headers = ['ID', 'FECHA', 'HORA', 'SEDE', 'CATEGORIA', 'USUARIO', 'ASUNTO', 'AGENTE', 'DESCRIPCION', 'PRIORIDAD', 'ESTADO'];
    headers.forEach((header, idx) => {
      if (idx < 11) { // Solo hasta la columna K
        const cell = worksheet.getCell(7, idx + 1); // A7 es 1, B7 es 2, ..., K7 es 11
        cell.value = header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF16A34A' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });
    worksheet.autoFilter = 'A7:K7';
    // Insertar los datos a partir de la fila 8 (A8:K...)
    let rowIndex = 8;
    result.rows.forEach(row => {
      const fila = [
        row.id,
        row.fecha?.toLowerCase?.() || '',
        row.hora?.toLowerCase?.() || '',
        row.sede?.toLowerCase?.() || '',
        row.categoria?.toLowerCase?.() || '',
        row.usuario?.toLowerCase?.() || '',
        row.asunto?.toLowerCase?.() || '',
        row.agente?.toLowerCase?.() || '',
        row.descripcion?.toLowerCase?.() || '',
        row.prioridad?.toLowerCase?.() || '',
        row.estado?.toLowerCase?.() || '',
      ];
      fila.forEach((val, idx) => {
        if (idx < 11) { // Solo hasta la columna K
          const cell = worksheet.getCell(rowIndex, idx + 1); // A es 1
          cell.value = val;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        }
      });
      rowIndex++;
    });
    // Eliminar columnas extra después de la K (varias veces por seguridad)
    for (let i = 0; i < 3; i++) {
      if (worksheet.columnCount > 11) {
        worksheet.spliceColumns(12, worksheet.columnCount - 11);
      }
    }
    // Limpiar celdas L1:L100 por si alguna vez se escribió algo
    for (let i = 1; i <= 100; i++) {
      worksheet.getCell(`L${i}`).value = '';
    }
    // --- LIMPIEZA FINAL ---
    // Elimino cualquier ocultación de columnas o manipulación fuera de A:K
    // Solo dejo la lógica original de logo, título, encabezados y datos
    // El área de impresión se mantiene en A:K
    worksheet.pageSetup.printArea = 'A1:K100';

    // Autoajustar el ancho de las columnas A:K según el contenido más largo, con margen mayor y ancho mínimo para columnas críticas
    for (let col = 1; col <= 11; col++) {
      let maxLength = 0;
      // Revisar encabezado
      const header = worksheet.getCell(7, col).value;
      if (header && header.toString().length > maxLength) {
        maxLength = header.toString().length;
      }
      // Revisar datos
      for (let row = 8; row < rowIndex; row++) {
        const cellValue = worksheet.getCell(row, col).value;
        if (cellValue && cellValue.toString().length > maxLength) {
          maxLength = cellValue.toString().length;
        }
      }
      let width = maxLength + 5; // margen mayor
      // Forzar ancho mínimo para USUARIO, AGENTE y DESCRIPCIÓN
      if ([6, 8, 9].includes(col) && width < 18) width = 18;
      worksheet.getColumn(col).width = width;
    }

    // Centrar el contenido de todas las celdas de la tabla (A7:K...)
    for (let row = 7; row < rowIndex; row++) {
      for (let col = 1; col <= 11; col++) {
        worksheet.getCell(row, col).alignment = { vertical: 'middle', horizontal: 'center' };
      }
    }

    try {
      console.log('Iniciando generación del archivo Excel...');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="tickets.xlsx"');
      res.setHeader('Cache-Control', 'no-store');
      await workbook.xlsx.write(res);
      console.log('Archivo Excel generado y enviado exitosamente');
      res.end();
    } catch (error) {
      console.log('Error generando o enviando el archivo Excel:', error);
      res.status(500).json({ mensaje: 'Error generando el archivo Excel.' });
    }
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener los tickets.' });
  }
});

// --- USUARIOS Y PERMISOS ---
// Crear tabla de usuarios si no existe
const createUsersTable = `
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  permisos TEXT NOT NULL -- JSON.stringify de array de permisos
);
`;

// Endpoint: obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  pool.query('SELECT id, usuario, permisos FROM usuarios', [], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener usuarios.' });
    // Parsear permisos
    const rows = result.rows.map(u => ({ ...u, permisos: JSON.parse(u.permisos) }));
    res.json(rows);
  });
});
// Endpoint: crear usuario
app.post('/api/usuarios', (req, res) => {
  const { usuario, clave, permisos } = req.body;
  if (!usuario || !clave || !Array.isArray(permisos)) return res.status(400).json({ mensaje: 'Datos incompletos.' });
  pool.query('INSERT INTO usuarios (usuario, clave, permisos) VALUES ($1, $2, $3) RETURNING id', [usuario, clave, JSON.stringify(permisos)], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al crear usuario.' });
    res.json({ mensaje: 'Usuario creado', id: result.rows[0].id });
  });
});
// Endpoint: editar usuario
app.put('/api/usuarios/:id', (req, res) => {
  const { usuario, clave, permisos } = req.body;
  if (!usuario || !Array.isArray(permisos)) return res.status(400).json({ mensaje: 'Datos incompletos.' });
  const params = [usuario, JSON.stringify(permisos)];
  let sql = 'UPDATE usuarios SET usuario = $1, permisos = $2';
  if (clave) { sql += ', clave = $3'; params.push(clave); }
  sql += ' WHERE id = $4';
  params.push(req.params.id);
  pool.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al editar usuario.' });
    res.json({ mensaje: 'Usuario editado' });
  });
});
// Endpoint: eliminar usuario
app.delete('/api/usuarios/:id', (req, res) => {
  pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ mensaje: 'Error al eliminar usuario.' });
    res.json({ mensaje: 'Usuario eliminado' });
  });
});
// Endpoint: login de usuario
app.post('/api/login', (req, res) => {
  let { usuario, clave } = req.body;
  usuario = (usuario || '').trim();
  clave = (clave || '').trim();
  console.log('Intento de login:', { usuario, clave });
  pool.query('SELECT * FROM usuarios WHERE LOWER(usuario) = LOWER($1) AND clave = $2', [usuario, clave], (err, result) => {
    if (err) {
      console.error('Error en login SQL:', err.message);
      return res.status(500).json({ mensaje: 'Error en login.' });
    }
    if (!result.rows.length) {
      console.log('Login fallido para:', usuario, 'con clave:', clave);
      return res.status(401).json({ mensaje: 'Usuario o clave incorrectos.' });
    }
    console.log('Login exitoso para:', usuario, 'Permisos:', result.rows[0].permisos);
    res.json({ usuario: result.rows[0].usuario, permisos: JSON.parse(result.rows[0].permisos), id: result.rows[0].id });
  });
});

// Configuración de multer para guardar en public/Usuarios
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../frontend/public/Usuarios'));
  },
  filename: function (req, file, cb) {
    // Guardar como nombreusuario.png
    const usuario = req.body.usuario ? req.body.usuario.toLowerCase() : 'default';
    cb(null, usuario + '.png');
  }
});
const upload = multer({ storage });

// Endpoint para subir foto de usuario
app.post('/api/usuarios/foto', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se subió ninguna imagen.' });
  }
  res.json({ mensaje: 'Imagen subida correctamente.' });
});
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://0.0.0.0:${PORT}`);
});
