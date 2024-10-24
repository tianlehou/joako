import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";

import "./modules/newRegister.js";
import { checkAuth } from '../../../modules/accessControl/authCheck.js';
import { checkUserAccess } from "../../../modules/accessControl/roleAccessControl.js";

import "./modules/downloadToExcel.js";
import { addEditEventListeners } from "./modules/editRow.js";
import { handleFileUpload } from "../modules/Excel/uploadExcelHandler.js";

import { updateTotalSums } from "./modules/sumColumns.js";
import { initializeSearch } from "./modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { includeHTML } from "../components/includeHTML/includeHTML.js";
import { updateSelectElements } from "./modules/updateSelectElements.js";
import { getDaysInMonth, generateCalendarDays, getMonthAndYearFromURL } from "./modules/calendarUtils.js";

// Constantes y variables de estado
const tabla = document.getElementById("contenidoTabla");

// Lee la variable collection desde el HTML
export const collection = (() => {
    const scriptTag = document.querySelector("script[data-collection]");
    if (scriptTag) {
        return scriptTag.getAttribute("data-collection");
    }
})();
if (!collection) {
    console.error("La variable collection está vacía.");
}

function getElementByIdSafe(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with ID '${id}' not found.`);
    }
    return element;
}

export function mostrarDatos() {
    const tabla = getElementByIdSafe("contenidoTabla");
    if (!tabla) {
        return;
    }

    const { month, year } = getMonthAndYearFromURL();

    if (!collection) {
        console.error("La ruta de la colección es inválida.");
        return;
    }

    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            data.push({ id: childSnapshot.key, ...user });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        let filaNumero = 1;
        data.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${filaNumero++}</td>
                <td>${user.nombre}</td>
                <td>${user.correoConductor || ''}</td>
                <td>${user.correoPropietario || ''}</td>
                <td class="display-flex-center action-col">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id
                }">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
                ${generateCalendarDays(month, year, user)}
            `;
            tabla.appendChild(row);
        });

        updateSelectElements(database, collection);
        addEditEventListeners(database, collection);
        updateTotalSums(
            tabla,
            Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 5)
        );
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    checkUserAccess();

    includeHTML();
    mostrarDatos();
    handleFileUpload();
    initializeSearch(tabla);
    initScrollButtons(tabla);
});

console.log(database);
