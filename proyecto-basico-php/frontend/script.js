// script.js
// -----------------------------------------------------------------------
// Igual que en la versión con Node: este archivo pide datos a la API con
// fetch() y actualiza el HTML. Lo único que cambia respecto a esa versión
// es la URL, porque ahora el backend es un archivo PHP, no un servidor
// Express corriendo en un puerto aparte.
// -----------------------------------------------------------------------

// OJO: esta URL depende de cómo levantes el servidor PHP (ver README).
// Si usás el servidor embebido de PHP como se explica ahí, esta URL es correcta.
const API_URL = 'http://localhost:8000/api/reclamos.php';

const form = document.getElementById('form-reclamo');
const inputDescripcion = document.getElementById('input-descripcion');
const listaReclamos = document.getElementById('lista-reclamos');

async function cargarReclamos() {
  const respuesta = await fetch(API_URL);
  const reclamos = await respuesta.json();

  listaReclamos.innerHTML = '';

  reclamos.forEach((reclamo) => {
    const li = document.createElement('li');
    li.className = 'reclamo';
    li.innerHTML = `
      <p>${reclamo.descripcion}</p>
      <div class="acciones">
        <span class="estado ${reclamo.estado}">${reclamo.estado.replace('_', ' ')}</span>
        <select data-id="${reclamo.id}">
          <option value="ingreso" ${reclamo.estado === 'ingreso' ? 'selected' : ''}>Ingreso</option>
          <option value="en_proceso" ${reclamo.estado === 'en_proceso' ? 'selected' : ''}>En proceso</option>
          <option value="resuelto" ${reclamo.estado === 'resuelto' ? 'selected' : ''}>Resuelto</option>
        </select>
        <button class="borrar" data-id="${reclamo.id}">Borrar</button>
      </div>
    `;
    listaReclamos.appendChild(li);
  });
}

// Crear un reclamo nuevo
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion: inputDescripcion.value }),
  });

  form.reset();
  cargarReclamos();
});

// Delegación de eventos: escuchamos clicks/cambios en toda la lista
listaReclamos.addEventListener('click', async (evento) => {
  if (!evento.target.classList.contains('borrar')) return;

  const id = evento.target.dataset.id;
  await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
  cargarReclamos();
});

listaReclamos.addEventListener('change', async (evento) => {
  if (evento.target.tagName !== 'SELECT') return;

  const id = evento.target.dataset.id;
  const nuevoEstado = evento.target.value;

  await fetch(`${API_URL}?id=${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  cargarReclamos();
});

cargarReclamos();
