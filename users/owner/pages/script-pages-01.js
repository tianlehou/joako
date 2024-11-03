import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";

import { checkAuth } from "../../../modules/accessControl/authCheck.js";
import { getUserRole } from "../../../modules/accessControl/getUserRole.js";
import { checkUserAccess } from "../../../modules/accessControl/roleAccessControl.js";
import { filterDataByRole } from "../../../modules/tabla/filterData/filterDataByRole.js";

import { includeHTML } from "../components/includeHTML/includeHTML.js";
import { updateSelectElements } from "./modules/tabla/updateSelectElements.js";
import { changeEstadoSelectEvent } from "../modules/tabla/changeSelectEvent.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

export function mostrarDatos() {
  onValue(ref(database, collection), async (snapshot) => {
    tabla.innerHTML = "";

    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    // Filtrar los datos según el rol del usuario
    const filteredData = await filterDataByRole(data);

    // Ordenar alfabéticamente los datos filtrados
    filteredData.sort((a, b) => a.nombre.localeCompare(b.nombre));

    let filaNumero = 1;

    for (let i = 0; i < filteredData.length; i++) {
      const user = filteredData[i];
      const row = `
            <tr>
              <td class="text-center">${filaNumero++}</td>
              <td class="text-center">${user.nombre}</td>
              <td class="text-center">
                <a href="https://wa.me/${user.whatsapp}" target="_blank">
                  ${user.whatsapp}
                </a>
              </td>
              <td class="text-center estado-col">
                  <span>${user.estado}</span>
              </td>
              <td class="text-center role-col">
                <div class="text-center">
                  <span>${user.role}</span>
                </div>
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
document.addEventListener("DOMContentLoaded", async () => {
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
