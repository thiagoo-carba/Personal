// script.js
// -----------------------------------------------------------------------
// Este archivo es el "puente" entre lo que ve el usuario (HTML) y el
// backend (API). Usa fetch() para pedir datos y mostrarlos.
// -----------------------------------------------------------------------

// Dirección de nuestro backend. Si cambiás el puerto en server.js,
// tenés que cambiarlo acá también.
const API_URL = 'http://localhost:3000/api/notas';

const form = document.getElementById('form-nota');
const inputTitulo = document.getElementById('input-titulo');
const inputContenido = document.getElementById('input-contenido');
const listaNotas = document.getElementById('lista-notas');

// Pedir todas las notas al backend y dibujarlas en pantalla
async function cargarNotas() {
  const respuesta = await fetch(API_URL);
  const notas = await respuesta.json();

  listaNotas.innerHTML = '';

  notas.forEach((nota) => {
    const li = document.createElement('li');
    li.className = 'nota';
    li.innerHTML = `
      <div>
        <h3>${nota.titulo}</h3>
        <p>${nota.contenido}</p>
      </div>
      <button data-id="${nota.id}">Borrar</button>
    `;
    listaNotas.appendChild(li);
  });
}

// Crear una nota nueva cuando se envía el formulario
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nuevaNota = {
    titulo: inputTitulo.value,
    contenido: inputContenido.value,
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevaNota),
  });

  form.reset();
  cargarNotas(); // volvemos a pedir la lista actualizada
});

// Borrar una nota (usamos delegación de eventos sobre la lista)
listaNotas.addEventListener('click', async (evento) => {
  if (evento.target.tagName !== 'BUTTON') return;

  const id = evento.target.dataset.id;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  cargarNotas();
});

// Al abrir la página, cargamos las notas que ya existan
cargarNotas();
