<?php
// db.php
// -----------------------------------------------------------------------
// Este archivo hace UNA sola cosa: conectarse a MySQL usando PDO
// (PHP Data Objects, la forma moderna y segura de hablar con la base
// de datos en PHP puro). Todos los demás archivos van a "requerir"
// este archivo cuando necesiten hablar con la base de datos.
//
// PDO en vez de mysqli: PDO usa "prepared statements" fácilmente, que
// evitan inyección SQL (que alguien mande código SQL malicioso en un
// formulario). Laravel, por dentro, hace básicamente esto mismo.
// -----------------------------------------------------------------------

$host = '127.0.0.1';
$db   = 'reclamos_basico';
$user = 'root';       // usuario por defecto en XAMPP/Laragon
$pass = '';            // contraseña por defecto en XAMPP/Laragon (vacía)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$opciones = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // si algo falla, tira una excepción clara
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,        // los resultados vienen como array asociativo
    PDO::ATTR_EMULATE_PREPARES   => false,                   // usa prepared statements reales
];

try {
    $pdo = new PDO($dsn, $user, $pass, $opciones);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No se pudo conectar a la base de datos: ' . $e->getMessage()]);
    exit;
}
