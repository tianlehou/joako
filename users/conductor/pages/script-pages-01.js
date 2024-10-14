import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";

import { checkAuth } from '../../../modules/accessControl/authCheck.js';
import { checkUserAccess } from "../../../modules/accessControl/roleAccessControl.js";
import { filterDataByRole } from "./modules/tabla/filterData/filterDataByRole.js";

import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { changeEstadoSelectEvent } from "./modules/tabla/changeSelectEvent.js";
import { updateSelectElements } from "./modules/tabla/updateSelectElements.js";
import { filtrarDatosPorUsuarioAutenticado } from "./modules/tabla/filterData/filterDataByUID.js";  // Importa la función para filtrar por UID

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

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

    // Mostrar el usuario autenticado en la primera fila
    if (usuarioAutenticadoData.length > 0) {
      const user = usuarioAutenticadoData[0];
      const row = `
            <tr>
              <td class="text-center">${filaNumero++}</td>
              <td class="text-center">${user.unidad}</td>
              <td class="text-center">${user.nombre}</td>

              <td class="text-center role-col">
                <div class="text-center">
                  <span>${user.role}</span>
                </div>
              </td>

              <td class="text-center estado-col">
                <div class="flex-container text-center">
                  <span class="text-center">${user.estado}</span>
                  <select data-id="${user.id}" class="form-select estado-select">
                    <option value="Ninguno" ${user.estado === "Ninguno" ? "selected" : ""}>Ninguno</option>
                    <option value="Activo" ${user.estado === "Activo" ? "selected" : ""}>Activo</option>
                    <option value="Sin carro" ${user.estado === "Sin carro" ? "selected" : ""}>Sin carro</option>
                  </select>
                </div>
              </td>
              
              <td class="text-center">
                <a href="https://wa.me/${user.whatsapp}" target="_blank">
                  ${user.whatsapp}
                </a>
              </td>
            </tr>
          `;
      tabla.innerHTML += row;
    }

    // Mostrar los demás usuarios sin mostrar sus select
    for (let i = 0; i < otherUsersData.length; i++) {
      const user = otherUsersData[i];
      const row = `
            <tr>
              <td class="text-center">${filaNumero++}</td>
              <td class="text-center">${user.unidad}</td>
              <td class="text-center">${user.nombre}</td>
              
              <td class="text-center role-col">
                <div class="text-center">
                  <span>${user.role}</span>
                </div>
              </td>

              <td class="text-center estado-col">
                <div class="flex-container text-center">
                  <span class="text-center">${user.estado}</span>
                  <select data-id="${user.id}" class="form-select estado-select" style="display: none;">
                    <option value="Ninguno" ${user.estado === "Ninguno" ? "selected" : ""}>Ninguno</option>
                    <option value="Activo" ${user.estado === "Activo" ? "selected" : ""}>Activo</option>
                    <option value="Sin carro" ${user.estado === "Sin carro" ? "selected" : ""}>Sin carro</option>
                  </select>
                </div>
              </td>
              
              <td class="text-center">
                <a href="https://wa.me/${user.whatsapp}" target="_blank">
                  ${user.whatsapp}
                </a>
              </td>
            </tr>
          `;
      tabla.innerHTML += row;
    }

    // Actualiza los elementos select después de cargar la tabla
    updateSelectElements();
  });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  checkUserAccess();

  mostrarDatos();
  includeHTML();
  changeEstadoSelectEvent(tabla, database, collection);
});

console.log(database);
