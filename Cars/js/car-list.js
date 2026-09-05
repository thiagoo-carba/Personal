import { autos } from "./autos.js";

const logoLink = document.getElementById("logo-link");

logoLink.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "main.html";
});

cargarAutos();

function cargarAutos() {
  const contenedor = document.querySelector(".car-container");
  contenedor.innerHTML = "";

  autos.forEach((auto) => {
    contenedor.innerHTML += `
  <a href="detalle.html?id=${auto.id}" class="car-card">

    <div class="car-header" style="background-image: url('${auto.imagen}')">
      <div class="car-year">${auto.anio}</div>

      <div class="car-favorite">
        <span class="material-symbols-outlined favorito">favorite</span>
      </div>
    </div>

    <div class="car-info">

      <div class="car-details">
        <div class="car-name">${auto.marca} ${auto.modelo}</div>
        <div class="car-specs">${auto.motor} | ${auto.potencia}</div>
      </div>

      <div class="car-price">
        U$S<span>${auto.precio.toLocaleString("en-US")}</span>
      </div>

    </div>

    
  </a>
`;
  });
}
const favoritos = document.querySelectorAll(".favorito");

favoritos.forEach(favorito => {
    favorito.addEventListener("click", (e) => {
        e.preventDefault();   
        e.stopPropagation();  

        favorito.classList.toggle("activo");
    });
});


