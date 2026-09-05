// ============================================================
// CONFIGURÁ ACÁ TUS URLs DE DESTINO
// ============================================================
const REDIRECT_USUARIO = "/Cars/main.html";   // página que ya tenés para el usuario común
const REDIRECT_ADMIN   = "/Cars/panel_admin.html";     // página a la que va el administrador tras loguearse
// ============================================================

const cardUsuario = document.getElementById("cardUsuario");
const cardAdmin   = document.getElementById("cardAdmin");
const cardStep    = document.getElementById("cardStep");
const formStep    = document.getElementById("formStep");
const backBtn     = document.getElementById("backBtn");
const adminForm   = document.getElementById("adminForm");
const formError   = document.getElementById("formError");
const submitBtn   = adminForm.querySelector(".submit");
const statusText  = document.getElementById("statusText");

function setStatus(text) {
  statusText.textContent = text;
}

// --- Usuario común: redirige directo ---
cardUsuario.addEventListener("click", () => {
  cardUsuario.classList.add("is-loading");
  cardUsuario.querySelector(".role-card__title").textContent = "Ingresando…";
  setStatus("Redirigiendo como usuario…");

  window.location.href = REDIRECT_USUARIO;
});

// --- Administrador: muestra el formulario ---
cardAdmin.addEventListener("click", () => {
  cardStep.hidden = true;
  formStep.hidden = false;
  setStatus("Ingresá tus credenciales");
  document.getElementById("adminUser").focus();
});

// --- Volver al selector ---
backBtn.addEventListener("click", () => {
  formStep.hidden = true;
  cardStep.hidden = false;
  formError.hidden = true;
  adminForm.reset();
  setStatus("");
});

// --- Envío del formulario de administrador ---
adminForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (!user || !pass) {
    formError.hidden = false;
    setStatus("Faltan datos");
    return;
  }

  formError.hidden = true;
  submitBtn.classList.add("is-loading");
  submitBtn.disabled = true;
  setStatus("Verificando credenciales…");

  // Acá iría la validación real contra tu backend/API.
  // Por ahora simulamos una pequeña espera y redirigimos.
  setTimeout(() => {
    window.location.href = REDIRECT_ADMIN;
  }, 500);
});