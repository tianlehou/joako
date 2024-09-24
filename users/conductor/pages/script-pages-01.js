import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";
import { checkAuth } from '../../../auth/authCheck.js';

import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { initializeSearch } from "../modules/searchFunction.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

export function mostrarDatos() {
  onValue(ref(database, collection), (snapshot) => {
    tabla.innerHTML = "";

    const data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });

    data.sort((a, b) => a.nombre.localeCompare(b.nombre));

    let filaNumero = 1;

    for (let i = 0; i < data.length; i++) {
      const user = data[i];
      const row = `
            <tr>
              <td class="text-center">${filaNumero++}</td>
              <td class="text-center">${user.unidad}</td>
              <td class="text-center">${user.placa}</td>
              <td class="text-center">${user.nombre}</td>
              <td class="text-center">${user.cedula}</td>
              <td class="text-center">
                <a href="https://wa.me/${user.whatsapp}" target="_blank">${user.whatsapp}</a>
              </td>
              <td class="text-center estado-col">${user.estado}</td>
              <td class="text-center role-col">${user.role}</td>
            </tr>
          `;
      tabla.innerHTML += row;
    }
  });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  mostrarDatos();
  initializeSearch(tabla);
  includeHTML();
});

console.log(database);
