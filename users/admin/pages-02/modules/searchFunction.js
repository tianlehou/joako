// searchFunction.js
import { database } from "../../../../environment/firebaseConfig.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { addEditEventListeners } from './tabla/editRow.js'; // Importa la función para añadir event listeners a los botones de editar
import { deleteRow } from './tabla/deleteRow.js'; // Importa la función para añadir event listeners a los botones de borrar
import { updateSelectElements } from "./tabla/updateSelectElements.js";
import { getMonthAndYearFromDataCollection, generateCalendarHeaders, generateCalendarDays } from "./tabla/calendarUtils.js";
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
    const tabla = document.getElementById("contenidoTabla");
    const thead = document.querySelector("#miTabla thead tr");
    if (!tabla || !thead) {
        console.error("Elemento 'contenidoTabla' o 'thead' no encontrado.");
        return;
    }

    if (!collection) {
        console.error("La colección no está definida.");
        return;
    }

    const { month, year } = getMonthAndYearFromDataCollection(collection);

    // Generar encabezado dinámico
    thead.innerHTML = `
        <th>#</th>
        <th>Unidad</th>
        <th>Conductor</th>
        <th>Propietario</th>
        <th>Acciones</th>
        ${generateCalendarHeaders(month, year)}
    `;

    // Limpiar el cuerpo de la tabla antes de renderizar
    tabla.innerHTML = ""; 

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
                    <button class="btn btn-danger mg-05em delete-user-button" data-id="${user.id}">
                        <i class="bi bi-eraser-fill"></i>
                    </button>
                </td>
                ${generateCalendarDays(month, year, user)}
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
