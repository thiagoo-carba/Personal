// server.js
// -----------------------------------------------------------------------
// Este es el "backend": un servidor que expone una API para que el
// frontend (HTML/CSS/JS) pueda leer y escribir datos en la base de datos.
//
// Flujo general:
//   Frontend (fetch) --> Backend (Express, este archivo) --> Base de datos (SQLite)
// -----------------------------------------------------------------------

const express = require('express');
const cors = require('cors');
const db = require('./database'); // nuestra conexión a la base de datos

const app = express();
const PUERTO = 3000;

// MIDDLEWARES
// -----------------------------------------------------------------------
// cors(): permite que el frontend (que corre en otro origen/puerto)
//         pueda hacer peticiones a este backend sin que el navegador las bloquee.
app.use(cors());
// express.json(): permite que el servidor entienda el body de las peticiones
//                 cuando viene en formato JSON (por ejemplo al crear una nota).
app.use(express.json());


// RUTAS DE LA API
// -----------------------------------------------------------------------
// Cada ruta representa una acción sobre el recurso "notas".
// Método HTTP + URL = qué se quiere hacer.

// GET /api/notas -> devolver todas las notas
app.get('/api/notas', (req, res) => {
  const notas = db.prepare('SELECT * FROM notas ORDER BY id DESC').all();
  res.json(notas);
});

// GET /api/notas/:id -> devolver una nota puntual
app.get('/api/notas/:id', (req, res) => {
  const nota = db.prepare('SELECT * FROM notas WHERE id = ?').get(req.params.id);
  if (!nota) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }
  res.json(nota);
});

// POST /api/notas -> crear una nota nueva
app.post('/api/notas', (req, res) => {
  const { titulo, contenido } = req.body;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'Falta título o contenido' });
  }

  const resultado = db
    .prepare('INSERT INTO notas (titulo, contenido) VALUES (?, ?)')
    .run(titulo, contenido);

  const notaCreada = db
    .prepare('SELECT * FROM notas WHERE id = ?')
    .get(resultado.lastInsertRowid);

  res.status(201).json(notaCreada);
});

// PUT /api/notas/:id -> editar una nota existente
app.put('/api/notas/:id', (req, res) => {
  const { titulo, contenido } = req.body;
  const { id } = req.params;

  const nota = db.prepare('SELECT * FROM notas WHERE id = ?').get(id);
  if (!nota) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  db.prepare('UPDATE notas SET titulo = ?, contenido = ? WHERE id = ?')
    .run(titulo ?? nota.titulo, contenido ?? nota.contenido, id);

  const notaActualizada = db.prepare('SELECT * FROM notas WHERE id = ?').get(id);
  res.json(notaActualizada);
});

// DELETE /api/notas/:id -> borrar una nota
app.delete('/api/notas/:id', (req, res) => {
  const resultado = db.prepare('DELETE FROM notas WHERE id = ?').run(req.params.id);

  if (resultado.changes === 0) {
    return res.status(404).json({ error: 'Nota no encontrada' });
  }

  res.status(204).send(); // 204 = "todo bien, no hay contenido que devolver"
});


// INICIAR EL SERVIDOR
// -----------------------------------------------------------------------
app.listen(PUERTO, () => {
  console.log(`Backend corriendo en http://localhost:${PUERTO}`);
});
