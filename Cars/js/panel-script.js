// ============================================================
// Referencias
// ============================================================
const form        = document.getElementById("carForm");
const formError    = document.getElementById("formError");
const submitBtn    = form.querySelector(".btn-solid");
const clearBtn     = document.getElementById("clearBtn");
const sessionBadge = document.getElementById("sessionBadge");
const sessionList  = document.getElementById("sessionList");
const sessionItems = document.getElementById("sessionItems");
const codeOutput   = document.getElementById("codeOutput");
const copyBtn      = document.getElementById("copyBtn");

const previewCard  = document.getElementById("previewCard");
const previewImg   = document.getElementById("previewImg");
const previewYear  = document.getElementById("previewYear");
const previewName  = document.getElementById("previewName");
const previewSpecs = document.getElementById("previewSpecs");
const previewPrice = document.getElementById("previewPrice");

const fields = [
  "marca", "modelo", "anio", "motor", "potencia", "combustible",
  "transmision", "precio", "color", "kilometraje", "condicion",
  "ubicacion", "vendedor", "descripcion", "imagen"
];

// Autos agregados durante esta sesión del navegador (sin backend,
// se pierden al recargar la página — ver nota más abajo).
let sessionCars = [];

// ============================================================
// Vista previa en vivo
// ============================================================
function updatePreview() {
  const marca = document.getElementById("marca").value.trim();
  const modelo = document.getElementById("modelo").value.trim();
  const anio = document.getElementById("anio").value.trim();
  const motor = document.getElementById("motor").value.trim();
  const transmision = document.getElementById("transmision").value.trim();
  const precio = document.getElementById("precio").value.trim();
  const imagen = document.getElementById("imagen").value.trim();

  previewName.textContent = (marca || modelo) ? `${marca} ${modelo}`.trim() : "Marca Modelo";
  previewYear.textContent = anio || "Año";
  previewSpecs.textContent = (motor || transmision) ? `${motor}${motor && transmision ? " · " : ""}${transmision}` : "Motor · Transmisión";
  previewPrice.textContent = precio ? `USD ${Number(precio).toLocaleString("es-UY")}` : "USD 0";

  previewImg.style.backgroundImage = imagen ? `url("${imagen}")` : "none";
}

fields.forEach((id) => {
  document.getElementById(id).addEventListener("input", updatePreview);
});

// ============================================================
// Generar el objeto y el código para autos.js
// ============================================================
function buildCarObject() {
  return {
    id: Date.now(),
    marca: document.getElementById("marca").value.trim(),
    modelo: document.getElementById("modelo").value.trim(),
    anio: Number(document.getElementById("anio").value),
    motor: document.getElementById("motor").value.trim(),
    potencia: document.getElementById("potencia").value.trim(),
    combustible: document.getElementById("combustible").value,
    transmision: document.getElementById("transmision").value.trim(),
    precio: Number(document.getElementById("precio").value),
    color: document.getElementById("color").value.trim(),
    kilometraje: Number(document.getElementById("kilometraje").value),
    condicion: document.getElementById("condicion").value,
    ubicacion: document.getElementById("ubicacion").value.trim(),
    vendedor: document.getElementById("vendedor").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    imagen: document.getElementById("imagen").value.trim()
  };
}

function carToCode(car) {
  return `  {
    id: ${car.id},
    marca: "${car.marca}",
    modelo: "${car.modelo}",
    anio: ${car.anio},
    motor: "${car.motor}",
    potencia: "${car.potencia}",
    combustible: "${car.combustible}",
    transmision: "${car.transmision}",
    precio: ${car.precio},
    color: "${car.color}",
    kilometraje: ${car.kilometraje},
    condicion: "${car.condicion}",
    ubicacion: "${car.ubicacion}",
    vendedor: "${car.vendedor}",
    descripcion: "${car.descripcion}",
    imagen: "${car.imagen}"
  },`;
}

// ============================================================
// Envío del formulario
// ============================================================
function isFormComplete() {
  return fields.every((id) => document.getElementById(id).value.trim() !== "");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!isFormComplete()) {
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  submitBtn.classList.add("is-loading");
  submitBtn.disabled = true;

  setTimeout(() => {
    const car = buildCarObject();
    sessionCars.push(car);

    codeOutput.textContent = carToCode(car);
    renderSessionList();

    submitBtn.classList.remove("is-loading");
    submitBtn.disabled = false;

    form.reset();
    updatePreview();
  }, 350);
});

clearBtn.addEventListener("click", () => {
  form.reset();
  formError.hidden = true;
  updatePreview();
});

// ============================================================
// Copiar código
// ============================================================
copyBtn.addEventListener("click", async () => {
  const text = codeOutput.textContent;
  if (!text || text.startsWith("//")) return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "¡Copiado!";
    copyBtn.classList.add("is-copied");
    setTimeout(() => {
      copyBtn.textContent = "Copiar";
      copyBtn.classList.remove("is-copied");
    }, 1500);
  } catch {
    // Si el navegador bloquea el portapapeles, seleccioná el texto manualmente.
  }
});

// ============================================================
// Lista de agregados en esta sesión
// ============================================================
function renderSessionList() {
  sessionBadge.textContent = `${sessionCars.length} agregado${sessionCars.length === 1 ? "" : "s"} en esta sesión`;
  sessionList.hidden = sessionCars.length === 0;

  sessionItems.innerHTML = "";

  sessionCars.forEach((car, index) => {
    const item = document.createElement("div");
    item.className = "session-item";

    item.innerHTML = `
      <div class="session-item__info">
        <div class="session-item__thumb" style="background-image:url('${car.imagen}')"></div>
        <div>
          <div class="session-item__name">${car.marca} ${car.modelo}</div>
          <div class="session-item__price">USD ${car.precio.toLocaleString("es-UY")}</div>
        </div>
      </div>
      <button class="session-item__remove" type="button" data-index="${index}">Quitar</button>
    `;
    sessionItems.appendChild(item);
  });

  sessionItems.querySelectorAll(".session-item__remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      sessionCars.splice(Number(btn.dataset.index), 1);
      renderSessionList();
    });
  });
}

updatePreview();
