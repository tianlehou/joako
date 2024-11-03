import { database } from "../../../environment/firebaseConfig.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

import { checkAuth } from '../../../modules/accessControl/authCheck.js';
import { getUserRole } from "../../../modules/accessControl/getUserRole.js";
import { filterDataByRole } from "../../../modules/tabla/filterData/filterDataByRole.js";
import { checkUserAccess } from "../../../modules/accessControl/roleAccessControl.js";

import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { changeEstadoSelectEvent } from "./modules/tabla/changeSelectEvent.js";
import { updateSelectElements } from "./modules/tabla/updateSelectElements.js";
import { filtrarDatosPorUsuarioAutenticado } from "./modules/tabla/filterData/filterDataByUID.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

// Función para generar filas de usuarios
function generarFilaUsuario(user, filaNumero, mostrarSelect = true) {
  return `
    <tr>
      <td class="text-center">${filaNumero}</td>
      <td class="text-center">${user.unidad}</td>
      <td class="text-center">${user.nombre}</td>
      <td class="text-center">
        <a href="https://wa.me/${user.whatsapp}" target="_blank">
          ${user.whatsapp}
        </a>
      </td>
      <td class="text-center role-col">
        <div class="text-center">
          <span>${user.role}</span>
        </div>
      </td>
      <td class="text-center estado-col">
        <div class="flex-container text-center">
          <span class="text-center">${user.estado}</span>
          <select data-id="${user.id}" class="form-select estado-select" style="${mostrarSelect ? "" : "display: none;"}">
            <option value="Ninguno" ${user.estado === "Ninguno" ? "selected" : ""}>Ninguno</option>
            <option value="Activo" ${user.estado === "Activo" ? "selected" : ""}>Activo</option>
            <option value="Sin carro" ${user.estado === "Sin carro" ? "selected" : ""}>Sin carro</option>
          </select>
        </div>
      </td>
    </tr>
  `;
}

export function mostrarDatos() {
  onValue(ref(database, collection), async (snapshot) => {
    tabla.innerHTML = "";

    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Filtrar los datos según el usuario autenticado
    const usuarioAutenticadoData = await filtrarDatosPorUsuarioAutenticado(data);

    // Filtrar los datos según el rol del usuario
    const filteredData = await filterDataByRole(data);

    // Excluir el usuario autenticado de los datos filtrados
    const otherUsersData = filteredData.filter(user => user.id !== usuarioAutenticadoData[0].id);

    // Ordenar alfabéticamente los datos filtrados de los otros usuarios
    otherUsersData.sort((a, b) => a.nombre.localeCompare(b.nombre));

    let filaNumero = 1;

    // Mostrar el usuario autenticado en la primera fila, si existe
    if (usuarioAutenticadoData.length > 0) {
      tabla.innerHTML += generarFilaUsuario(usuarioAutenticadoData[0], filaNumero++, true);
    }

    // Mostrar los demás usuarios sin mostrar el select
    otherUsersData.forEach(user => {
      tabla.innerHTML += generarFilaUsuario(user, filaNumero++, false);
    });

    // Actualiza los elementos select después de cargar la tabla
    updateSelectElements();
  });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth();
  checkUserAccess();

  // Verifica el rol del usuario autenticado
  try {
    const role = await getUserRole();
    console.log("Rol del usuario autenticado:", role);
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
  }

  mostrarDatos();
  includeHTML();
  changeEstadoSelectEvent(tabla, database, collection);
});

console.log(database);
