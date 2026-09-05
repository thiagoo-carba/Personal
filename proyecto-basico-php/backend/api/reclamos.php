<?php
// api/reclamos.php
// -----------------------------------------------------------------------
// Esta es nuestra "ruta" de la API. En PHP puro (sin framework) no hay
// un router automático: cada archivo .php ES una URL, y adentro nosotros
// decidimos qué hacer según el método HTTP (GET, POST, PATCH, DELETE).
//
// Con esto corriendo en el servidor embebido de PHP, esta API queda en:
//   http://localhost:8000/api/reclamos.php        -> listar / crear
//   http://localhost:8000/api/reclamos.php?id=1   -> uno puntual / editar / borrar
//
// Cuando más adelante uses Laravel, esto es exactamente lo que hacen las
// rutas de routes/api.php + un Controller: solo que Laravel te da URLs
// más lindas (/api/reclamos/1) y te ahorra escribir el switch de abajo.
// -----------------------------------------------------------------------

require_once __DIR__ . '/../config/db.php';

// Le decimos al navegador que la respuesta es JSON
header('Content-Type: application/json');

// Permitir que el frontend (aunque esté en otro puerto/origen) pueda pedir datos.
// Esto es lo que en Node hacía el paquete "cors"; acá lo hacemos a mano con headers.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// El navegador a veces manda una petición "OPTIONS" antes de la real,
// para preguntar si tiene permiso (esto se llama preflight). La respondemos vacía.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];

switch ($metodo) {

    case 'GET':
        if (isset($_GET['id'])) {
            // GET /api/reclamos.php?id=1 -> un reclamo puntual
            $stmt = $pdo->prepare('SELECT * FROM reclamos WHERE id = ?');
            $stmt->execute([$_GET['id']]);
            $reclamo = $stmt->fetch();

            if (!$reclamo) {
                http_response_code(404);
                echo json_encode(['error' => 'Reclamo no encontrado']);
                exit;
            }
            echo json_encode($reclamo);
        } else {
            // GET /api/reclamos.php -> todos los reclamos
            $stmt = $pdo->query('SELECT * FROM reclamos ORDER BY id DESC');
            echo json_encode($stmt->fetchAll());
        }
        break;

    case 'POST':
        // Leemos el body de la petición (viene como JSON, hay que decodificarlo)
        $datos = json_decode(file_get_contents('php://input'), true);

        if (empty($datos['descripcion'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta la descripción']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO reclamos (descripcion, estado) VALUES (?, ?)');
        $stmt->execute([$datos['descripcion'], $datos['estado'] ?? 'ingreso']);

        $nuevoId = $pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT * FROM reclamos WHERE id = ?');
        $stmt->execute([$nuevoId]);

        http_response_code(201);
        echo json_encode($stmt->fetch());
        break;

    case 'PATCH':
        // PATCH /api/reclamos.php?id=1 -> actualizar el estado de un reclamo
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el id']);
            exit;
        }

        $datos = json_decode(file_get_contents('php://input'), true);

        if (empty($datos['estado'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el nuevo estado']);
            exit;
        }

        $stmt = $pdo->prepare('UPDATE reclamos SET estado = ? WHERE id = ?');
        $stmt->execute([$datos['estado'], $_GET['id']]);

        $stmt = $pdo->prepare('SELECT * FROM reclamos WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        echo json_encode($stmt->fetch());
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta el id']);
            exit;
        }

        $stmt = $pdo->prepare('DELETE FROM reclamos WHERE id = ?');
        $stmt->execute([$_GET['id']]);

        http_response_code(204);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
