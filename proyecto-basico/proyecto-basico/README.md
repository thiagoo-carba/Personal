# Proyecto básico: Notas (aprender frontend + backend + base de datos)

## Cómo está organizado

```
proyecto-basico/
├── backend/
│   ├── server.js       -> el servidor (API con rutas GET/POST/PUT/DELETE)
│   ├── database.js     -> conexión a la base de datos + creación de tabla
│   └── package.json    -> lista de dependencias
└── frontend/
    ├── index.html       -> estructura de la página
    ├── style.css        -> estilos
    └── script.js        -> hace fetch() al backend y actualiza el HTML
```

La idea de separar todo así es que puedas tocar una parte sin romper las otras:
- Si querés cambiar cómo se ve la página -> tocás `frontend/style.css`
- Si querés agregar un campo a la nota (por ejemplo "categoria") -> lo agregás en `database.js` (la tabla), en `server.js` (las rutas) y en `script.js`/`index.html` (el formulario)

## Cómo correrlo

1. Necesitás tener [Node.js](https://nodejs.org/) instalado (versión 18 o más nueva).
2. Abrí una terminal dentro de la carpeta `backend/` y corré:
   ```
   npm install
   npm start
   ```
   Esto va a instalar Express, cors y better-sqlite3, y va a levantar el servidor en `http://localhost:3000`. La primera vez que corra, se va a crear solo un archivo `database.sqlite` (ahí vive tu base de datos).

3. Abrí el archivo `frontend/index.html` directamente en el navegador (doble clic alcanza), o usá una extensión tipo "Live Server" si usás VS Code.

4. Escribí una nota en el formulario y guardala. Si todo anda bien, vas a ver la nota aparecer en la lista, y si abrís `backend/database.sqlite` con algún visor de SQLite (por ejemplo la extensión "SQLite Viewer" de VS Code) vas a ver el dato guardado en la tabla `notas`.

## Cómo funciona el flujo (para entenderlo)

1. Abrís `index.html` en el navegador → eso es el **frontend**.
2. Completás el formulario y le das a "Guardar nota" → `script.js` ejecuta un `fetch()` que manda los datos a `http://localhost:3000/api/notas`.
3. `server.js` (el **backend**) recibe esa petición en la ruta `app.post('/api/notas', ...)`.
4. El backend usa `database.js` para guardar la nota en la base de datos SQLite.
5. El backend responde con la nota guardada, y `script.js` vuelve a pedir la lista completa para mostrarla actualizada.

Ese ciclo (frontend pide algo → backend lo procesa → base de datos guarda/devuelve → backend responde → frontend actualiza la pantalla) es la base de casi cualquier aplicación web, sin importar cuán compleja se vuelva después.

## Ideas para seguir practicando

- Agregar un botón "Editar" que use la ruta `PUT /api/notas/:id` que ya está lista en el backend pero no se usa todavía en el frontend.
- Agregar una columna `categoria` a la tabla y un filtro en el frontend.
- Cambiar SQLite por MySQL cuando quieras dar el siguiente paso (la lógica de las rutas en `server.js` cambia poco, lo que cambia es cómo se conecta `database.js`).
