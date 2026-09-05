# Proyecto básico: Reclamos (PHP puro + MySQL, sin frameworks)

Esta versión usa las mismas tecnologías que tu proyecto real (PHP + MySQL),
pero sin Laravel, para que veas "a mano" lo que el framework hace por
detrás. **Acá no se usa npm ni Node en ningún momento** — eso era solo de
la versión anterior. PHP no lo necesita.

## Cómo está organizado

```
proyecto-basico-php/
├── database.sql             -> crea la base de datos y la tabla
├── backend/
│   ├── config/db.php         -> conexión a MySQL (PDO)
│   └── api/reclamos.php      -> la API: acá vive toda la lógica (GET/POST/PATCH/DELETE)
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js             -> hace fetch() a reclamos.php
```

En Laravel, `reclamos.php` sería reemplazado por una ruta en
`routes/api.php` + un método en un `Controller`, y `db.php` sería la
configuración de `.env` + Eloquent. La lógica de fondo (recibir la
petición, hablar con la base de datos, devolver JSON) es la misma.

## Qué necesitás instalado

Solo **PHP** y **MySQL**. La forma más simple en Windows es instalar
[XAMPP](https://www.apachefriends.org/es/index.html) o
[Laragon](https://laragon.org/) — ambos te instalan PHP + MySQL +
phpMyAdmin juntos, con un click. No hace falta npm, Node, ni Composer
para esta versión básica.

## Paso a paso para correrlo

### 1. Crear la base de datos

Abrí phpMyAdmin (con XAMPP/Laragon corriendo, normalmente en
`http://localhost/phpmyadmin`) → pestaña **Importar** → seleccioná el
archivo `database.sql` → Ejecutar.

Esto crea la base `reclamos_basico` con la tabla `reclamos` y dos
registros de ejemplo.

Si tu MySQL tiene usuario/contraseña distintos a `root` / (vacío),
editá esos dos datos en `backend/config/db.php`.

### 2. Levantar el backend

PHP trae un servidor propio para desarrollo, no hace falta Apache para
esto. Abrí una terminal **dentro de la carpeta `backend/`** y corré:

```
php -S localhost:8000
```

Dejá esa terminal abierta. Ahora `http://localhost:8000/api/reclamos.php`
ya te devuelve JSON si lo abrís en el navegador.

### 3. Abrir el frontend

Abrí `frontend/index.html` directamente en el navegador (doble clic), o
con la extensión "Live Server" de VS Code si preferís.

## Cómo funciona el flujo (para entenderlo)

1. Abrís `index.html` → eso es el **frontend**, corre en tu navegador.
2. Completás el formulario → `script.js` hace `fetch()` a
   `http://localhost:8000/api/reclamos.php` con método `POST`.
3. PHP recibe la petición en `reclamos.php`. Como en PHP puro no hay
   router automático, el propio archivo mira `$_SERVER['REQUEST_METHOD']`
   para decidir si es un GET, POST, PATCH o DELETE.
4. Usa `db.php` (PDO) para ejecutar una consulta SQL preparada contra
   MySQL — por ejemplo `INSERT INTO reclamos ...`.
5. MySQL guarda el dato y PHP devuelve el reclamo creado en formato
   JSON.
6. `script.js` recibe esa respuesta y vuelve a pedir la lista completa
   para actualizar la pantalla.

Es exactamente el mismo ciclo que la versión con Node, solo que ahora
"el backend" es PHP en vez de JavaScript, y quien atiende la petición es
`php -S` en vez de Express.

## Por qué esto te prepara para Laravel

- `db.php` con PDO = lo que en Laravel hace la configuración de Eloquent
  (el ORM). Vos escribís `SELECT * FROM reclamos`, Laravel te deja
  escribir `Reclamo::all()` y él arma el SQL solo.
- El `switch` según `$_SERVER['REQUEST_METHOD']` en `reclamos.php` = lo
  que en Laravel son las líneas de `routes/api.php`
  (`Route::get('/reclamos', ...)`, `Route::post('/reclamos', ...)`, etc.)
  apuntando a métodos de un Controller.
- Los `json_encode()` / `json_decode()` a mano = lo que Laravel hace
  automático cuando devolvés un modelo o un array desde un Controller.

## Ideas para seguir practicando

- Agregar validación de que `estado` sea uno de los tres valores válidos
  antes de guardarlo (ahora mismo confía en lo que mande el frontend).
- Agregar una tabla `historial_actividad` y, cada vez que cambia el
  `estado` de un reclamo, insertar una fila ahí (así vas practicando el
  modelo de datos real de tu proyecto).
- Cuando te sientas cómodo con esto, instalar Composer y arrancar un
  proyecto Laravel nuevo (`composer create-project laravel/laravel nombre`)
  y recrear este mismo CRUD ahí — vas a reconocer cada pieza.
