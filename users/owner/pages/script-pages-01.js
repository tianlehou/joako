import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";
import { checkAuth } from '../../../auth/authCheck.js';
import { includeHTML } from '../components/includeHTML/includeHTML.js';

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
                <a href="https://wa.me/${user.whatsapp}" target="_blank">
                  ${user.whatsapp}
                </a>
              </td>
              <td class="text-center estado-col">${user.estado}</td>
              <td class="text-center role-col">${user.role}</td>
            </tr>
          `;
          tabla.innerHTML += row;
        }

        const selectElements = document.querySelectorAll("select");

        selectElements.forEach((selectElement) => {
            selectElement.addEventListener("change", function () {
                const selectedValue = this.value;
                const userId = this.getAttribute("data-id");
                const field = this.getAttribute("data-field");

                if (["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].includes(field)) {
                    if (!confirm("¿Estás seguro de que deseas hacer este cambio?")) {
                        this.value = this.dataset.oldValue;
                        return;
                    }
                }

                update(ref(database, `${collection}/${userId}`), {
                    [field]: selectedValue,
                });

            });
        });
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
    mostrarDatos();
    includeHTML();
});

console.log(database);
