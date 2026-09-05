-- database.sql
-- -----------------------------------------------------------------------
-- Ejecutá este archivo UNA sola vez para crear la base de datos y la
-- tabla. Podés hacerlo desde phpMyAdmin (pestaña "Importar") o desde
-- la consola de MySQL con: mysql -u root -p < database.sql
-- -----------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS reclamos_basico;
USE reclamos_basico;

CREATE TABLE IF NOT EXISTS reclamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    estado ENUM('ingreso', 'en_proceso', 'resuelto') NOT NULL DEFAULT 'ingreso',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Un par de datos de ejemplo, para no arrancar con la tabla vacía
INSERT INTO reclamos (descripcion, estado) VALUES
('Bache en Av. Principal', 'ingreso'),
('Luminaria quemada en plaza central', 'en_proceso');
