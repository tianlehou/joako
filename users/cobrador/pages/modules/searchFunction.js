import { database } from "../../../../environment/firebaseConfig.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { changeEstadoSelectEvent, changeRoleSelectEvent } from "../../modules/tabla/changeSelectEvent.js"; // Importa las funciones de changeSelectEvent.js
import { updateSelectElements } from "./updateSelectElements.js"; // Importa la función de updateSelectElements.js
import { addEditEventListeners } from "./editRow.js";

const tabla = document.getElementById("contenidoTabla");

export function findAndSearch(tabla) {
  const input = document.getElementById("searchInput").value.toLowerCase();

  // Obtén los datos desde Firebase
  onValue(ref(database, collection), (snapshot) => {
    const data = [];
    snapshot.forEach((childSnapshot) => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      data.push(user);
    });

    // Filtrar los datos
    const filteredData = data.filter(user => {
      return Object.values(user).some(value => value.toString().toLowerCase().includes(input));
    });

    // Renderiza los datos filtrados
    renderUsersTable(filteredData);
  });
}

// Función para renderizar los datos en la tabla
function renderUsersTable(data) {
  const tabla = document.getElementById("miTabla");
  tabla.innerHTML = "";

  // Agrega el thead una sola vez antes de las filas
  const thead = `
    <thead>
      <tr>
        <th>#</th>
        <th>Unidad</th>
        <th>Placa</th>
        <th>Nombre</th>
        <th>WhatsApp</th>
        <th>Estado</th>
        <th>Rol</th>
        <th>Acciones</th>
        <th>Correo</th>
      </tr>
    </thead>
  `;
  tabla.innerHTML = thead; // Inserta el encabezado en la tabla

  // Itera sobre los datos para crear las filas
  data.forEach((user, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${user.unidad}</td>
        <td>${user.placa}</td>
        <td>${user.nombre}</td>
        <td>
          <a href="https://wa.me/${user.whatsapp}" target="_blank">
            ${user.whatsapp}
          </a>
        </td>
        <td class="estado-col">
          <div class="flex-container">
            <span>${user.estado}</span>
            <select class="form-select estado-select" data-id="${user.id}">
              <option value="" ${user.estado === "" ? "selected" : ""}></option>
              <option value="Activo" ${user.estado === "Activo" ? "selected" : ""}>Activo</option>
              <option value="Sin carro" ${user.estado === "Sin carro" ? "selected" : ""}>Sin carro</option>
              <option value="Suspendido" ${user.estado === "Suspendido" ? "selected" : ""}>Suspendido</option>
              <option value="Expulsado" ${user.estado === "Expulsado" ? "selected" : ""}>Expulsado</option>
            </select>
          </div>
        </td>
        <td class="role-col">
          <div class="flex-container">
            <span>${user.role}</span>
            <select class="form-select role-select" data-id="${user.id}">
              <option value="" ${user.role === "" ? "selected" : ""}></option>
              <option value="Propietario" ${user.role === "Propietario" ? "selected" : ""}>Propietario</option>
              <option value="Conductor" ${user.role === "Conductor" ? "selected" : ""}>Conductor</option>
              <option value="Secretario" ${user.role === "Secretario" ? "selected" : ""}>Secretario</option>
            </select>
          </div>
        </td>
        <td><button class="btn btn-primary edit-user-button" data-id="${user.id}"><i class="bi bi-highlighter"></i></button></td>
        <td>${user.email}</td>
      </tr>
    `;
    tabla.innerHTML += row; // Inserta cada fila debajo del thead
  });

  // Actualizar selects después de renderizar los datos
  updateSelectElements(); // Vuelve a agregar los eventos a los selects
  addEditEventListeners(database, collection);
  // Agregar eventos para los selectores de estado y rol después del renderizado
  changeEstadoSelectEvent(tabla, database, collection); // Asegúrate de que el evento del select de estado funcione
  changeRoleSelectEvent(tabla, database, collection);   // Asegúrate de que el evento del select de rol funcione
}

export function initializeSearch(tabla) {
  document.getElementById("searchButton").addEventListener("click", () => findAndSearch(tabla));

  document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      findAndSearch(tabla);
    }
  });
}

// Inicializa los eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch(tabla);
});
