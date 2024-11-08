// searchFunction.js
import { database } from "../../../../environment/firebaseConfig.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { addEditEventListeners } from './editRow.js'; // Importa la función para añadir event listeners a los botones de editar
import { deleteRow } from './deleteRow.js'; // Importa la función para añadir event listeners a los botones de borrar
import { updateSelectElements } from "./updateSelectElements.js";
import { collection } from "../script-pages-02.js";

// Función para buscar y filtrar los datos
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

    // Agrega el encabezado
    const thead = `
        <thead>
            <tr>
                <th>#</th>
                <th>Unidad</th>
                <th>Conductor</th>
                <th>Propietario</th>
                <th>Acciones</th>
                ${Array.from({ length: 31 }, (_, i) => `<th>${i + 1}</th>`).join('')}
            </tr>
        </thead>
    `;
    tabla.innerHTML = thead;

    data.forEach((user, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${user.nombre}</td>
                <td>${user.correoConductor || ''}</td>
                <td>${user.correoPropietario || ''}</td>
                <td class="display-flex-center">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
                ${Array.from({ length: 31 }, (_, i) => {
                    const dia = (i + 1).toString();
                    const cobroData = user[dia] || {};
                    const cobro = cobroData.Cobro || '';
                    const timestamp = cobroData.timestamp || '';
                    const cobrador = cobroData.cobrador || '';
                    const isHidden = ["3.00","6.00", "10.00", "11.00", "21.00", "24.00"].includes(cobro);

                    return `
                        <td class="${isHidden ? 'text-center' : ''}">
                            <div class="flex-container display-center">
                                <select class="form-select pay-select ${isHidden ? 'd-none' : ''}" data-id="${user.id}" data-field="${dia}">
                                    ${["", "3.00", "6.00", "10.00", "11.00", "21.00", "24.00", "No Pagó"].map(option =>
                                        `<option value="${option}" ${cobro === option ? "selected" : ""}>${option}</option>`
                                    ).join('')}
                                </select>
                                <div class="timestamp">
                                    ${timestamp.replace(' ', '<br>')}
                                    ${cobrador ? `<br>Cobrador: <span style="color: var(--clr-error);">${cobrador}</span>` : ""}
                                </div>
                            </div>
                        </td>
                    `;
                }).join('')}
            </tr>
        `;
        tabla.innerHTML += row;
    });

    // Añadir el manejador de eventos a los selects
    attachSelectChangeListeners();
    updateSelectElements(database, collection);
}

// Función para adjuntar manejadores de eventos a los selects
function attachSelectChangeListeners() {
    document.querySelectorAll('.form-select').forEach(select => {
        select.addEventListener('change', (event) => {
            const selectElement = event.target;
            const newValue = selectElement.value;
            const id = selectElement.getAttribute('data-id');
            const field = selectElement.getAttribute('data-field');

            // Actualiza los datos en Firebase
            update(ref(database, `${collection}/${id}`), {
                [field]: newValue
            }).then(() => {
                console.log('Datos actualizados exitosamente');
            }).catch(error => {
                console.error('Error al actualizar los datos: ', error);
            });
        });
    });

    // Añadir el manejador de eventos para los botones de editar y borrar
    addEditEventListeners();
    deleteRow(database, collection);
}

// Función para inicializar la búsqueda
export function initializeSearch(tabla) {
    document.getElementById("searchButton").addEventListener("click", () => findAndSearch(tabla));

    document.getElementById("searchInput").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            findAndSearch(tabla);
        }
    });
}
