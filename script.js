const imageInput    = document.getElementById("imageInput");
const scanBtn       = document.getElementById("scanBtn");
const showTableBtn  = document.getElementById("showTableBtn");
const showRawBtn    = document.getElementById("showRawBtn");
const tableView     = document.getElementById("tableView");
const rawView       = document.getElementById("rawView");
const tableBody     = document.getElementById("tableBody");
const rawTexts      = document.getElementById("rawTexts");
const canvas        = document.getElementById("canvas");
const ctx           = canvas.getContext("2d");
const resultSection = document.getElementById("resultSection");
const progressWrap  = document.getElementById("progressWrap");
const progressBar   = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");

// =======================
// ARRAY PRINCIPAL
// =======================

const receipts = [];
// IVA por defecto (ej: 19% -> 0.19). Cambiá si necesitás otro porcentaje.
const IVA_RATE = 0.19;

function parseAmount(str) {
  if (!str || typeof str !== 'string') return NaN;
  // Mantener sólo dígitos, puntos y comas
  let s = str.replace(/[^0-9.,]/g, '').trim();
  if (!s) return NaN;
  const hasDot = s.indexOf('.') !== -1;
  const hasComma = s.indexOf(',') !== -1;

  if (hasDot && hasComma) {
    // Determinar cuál es el separador decimal: el que aparece más a la derecha
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      // coma como decimal, puntos como miles
      s = s.replace(/\./g, '');
      s = s.replace(/,/g, '.');
    } else {
      // punto como decimal, comas como miles
      s = s.replace(/,/g, '');
    }
  } else if (hasComma && !hasDot) {
    // coma como decimal
    s = s.replace(/,/g, '.');
  } else {
    // sólo punto o sólo dígitos: ya válido
    s = s.replace(/,/g, '.');
  }

  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}

function formatCurrency(n) {
  if (n === null || n === undefined || isNaN(n)) return 'No encontrado';
  // Formatear con separador de miles y dos decimales, prefijo $
  return '$ ' + n.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// =======================
// ESCANEAR
// =======================

scanBtn.addEventListener("click", async () => {

  const files = imageInput.files;

  if (files.length === 0) {
    alert("Subí al menos una imagen");
    return;
  }

  receipts.length = 0;
  tableBody.innerHTML = "";
  rawTexts.innerHTML = "";

  // Mostrar barra de progreso
  progressWrap.style.display = "flex";
  resultSection.style.display = "none";

  for (let i = 0; i < files.length; i++) {

    const file = files[i];
    const percent = Math.round((i / files.length) * 100);

    progressBar.style.setProperty("--progress", percent + "%");
    progressLabel.textContent = `Procesando ${i + 1} de ${files.length}: ${file.name}`;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {

      img.onload = async () => {

        // =======================
        // ESCALADO
        // =======================

        const scale = 3;
        canvas.width  = img.width  * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // =======================
        // PROCESAMIENTO
        // =======================

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let j = 0; j < data.length; j += 4) {
          const r = data[j], g = data[j+1], b = data[j+2];
          let gray = (r + g + b) / 3;
          gray = gray > 160 ? 255 : 0;
          data[j] = data[j+1] = data[j+2] = gray;
        }

        ctx.putImageData(imageData, 0, 0);

        // =======================
        // OCR
        // =======================

        const result = await Tesseract.recognize(canvas, "spa+eng", {
          logger: m => console.log(m)
        });

        // =======================
        // TEXTO LIMPIO
        // =======================

        let text = result.data.text
          .replace(/[|]/g, "I")
          .replace(/\s{2,}/g, " ");

        // =======================
        // EXTRAER DATOS
        // =======================

        const fechaMatch = text.match(/\d{2}[\/\-]\d{2}[\/\-]\d{2,4}/);
        const totalMatch = text.match(/\$?\s?\d+[.,]\d{2}/g);
        const rutMatch   = text.match(/\b\d{8,12}\b/);

        const fecha   = fechaMatch ? fechaMatch[0] : "No encontrada";
        const total   = totalMatch ? totalMatch[totalMatch.length - 1] : "No encontrado";
        const rut     = rutMatch   ? rutMatch[0]   : "No encontrado";
        const empresa = text.split("\n").slice(0, 3).join(" ") || "Desconocida";

        // =======================
        // GUARDAR + CALCULAR NETO
        // =======================

        const totalValue = parseAmount(total);
        const totalFormatted = isNaN(totalValue) ? total : formatCurrency(totalValue);
        const netValue = isNaN(totalValue) ? 'No encontrado' : formatCurrency(totalValue / (1 + IVA_RATE));

        receipts.push({ empresa, fecha, total: totalFormatted, rut, rawText: text, net: netValue, totalRaw: total });

        // =======================
        // RENDER TABLA
        // =======================

        tableBody.innerHTML += `
          <tr>
            <td>${empresa}</td>
            <td>${fecha}</td>
            <td>${netValue}</td>
            <td>${totalFormatted}</td>
            <td>${rut}</td>
          </tr>
        `;

        // =======================
        // OCR BRUTO — usa clases del CSS
        // =======================

        rawTexts.innerHTML += `
          <div class="raw-block">
            <div class="raw-block__filename">${file.name}</div>
            ${text}
          </div>
        `;

        resolve();
      };
    });
  }

  // Progreso al 100% y ocultar
  progressBar.style.setProperty("--progress", "100%");
  progressLabel.textContent = "Completado";

  setTimeout(() => {
    progressWrap.style.display = "none";
  }, 800);

  // Mostrar sección de resultados
  resultSection.style.display = "block";

  // Asegurar que empiece en tab Tabla
  tableView.style.display = "block";
  rawView.style.display   = "none";
  showTableBtn.classList.add("tabs__btn--active");
  showRawBtn.classList.remove("tabs__btn--active");

});

// =======================
// CAMBIAR VISTAS
// =======================

showTableBtn.addEventListener("click", () => {
  tableView.style.display = "block";
  rawView.style.display   = "none";
  showTableBtn.classList.add("tabs__btn--active");
  showRawBtn.classList.remove("tabs__btn--active");
});

showRawBtn.addEventListener("click", () => {
  tableView.style.display = "none";
  rawView.style.display   = "block";
  showRawBtn.classList.add("tabs__btn--active");
  showTableBtn.classList.remove("tabs__btn--active");
});