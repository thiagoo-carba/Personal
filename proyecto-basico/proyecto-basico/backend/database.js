// database.js
// -----------------------------------------------------------------------
// Este archivo se encarga de UNA sola cosa: conectarse a la base de datos
// y crear la tabla si no existe. Separarlo del server.js ayuda a entender
// qué parte del código es "backend" y qué parte es "base de datos".
//
// Usamos SQLite porque no necesita instalar ni configurar un servidor de
// base de datos aparte (como MySQL o PostgreSQL): todo se guarda en un
// archivo local llamado database.sqlite. Ideal para aprender.
// -----------------------------------------------------------------------

const Database = require('better-sqlite3');

// Esto crea (o abre si ya existe) el archivo database.sqlite
const db = new Database('database.sqlite');

// Creamos la tabla "notas" si todavía no existe.
// id         -> identificador único, se autoincrementa solo
// titulo     -> texto obligatorio
// contenido  -> texto obligatorio
// creado_en  -> fecha de creación, se pone sola por defecto
db.exec(`
  CREATE TABLE IF NOT EXISTS notas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    creado_en TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Exportamos la conexión "db" para poder usarla desde server.js
module.exports = db;
