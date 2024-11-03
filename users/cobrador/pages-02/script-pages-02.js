import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";

import "./modules/newRegister.js";
import { checkAuth } from '../../../modules/accessControl/authCheck.js';
import { getUserRole } from "../../../modules/accessControl/getUserRole.js";
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

// Definir variable global para almacenar la colección
export let collection = null; 

// Función para definir automáticamente la colección en función del mes actual
export function setCollectionByCurrentMonth() {
    const month = new Date().getMonth() + 1; // Obtener mes actual (1-12)
    collection = `cobros-de-zarpe-${month.toString().padStart(2, '0')}`; // Asigna colección basada en el mes
    console.log("Colección asignada automáticamente:", collection);
}

// Actualizar colección manualmente si es necesario
export function updateCollection(value) {
    collection = value;
    console.log("Colección actualizada manualmente a:", collection);
}

// Función para mostrar los datos en la tabla
export function mostrarDatos() {
    const tabla = document.getElementById("contenidoTabla");
    if (!tabla) {
        console.error("Elemento 'contenidoTabla' no encontrado.");
        return;
    }

    if (!collection) {
        console.error("La colección no está definida. Selecciona una colección válida.");
        return;
    }

    const { month, year } = getMonthAndYearFromURL();

    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            data.push({ id: childSnapshot.key, ...user });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        data.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.nombre}</td>
                <td>${user.correoConductor || ''}</td>
                <td>${user.correoPropietario || ''}</td>
                <td class="display-flex-center action-col">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
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
            tabla, Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 5)
        );
    });
}

// Inicialización al cargar el documento
document.addEventListener('DOMContentLoaded', async () => {
    setCollectionByCurrentMonth();
    checkAuth();
    checkUserAccess();
  
    // Verifica el rol del usuario autenticado
    try {
      const role = await getUserRole();
      console.log("Rol del usuario autenticado:", role);
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
    }

    includeHTML();
    mostrarDatos();
    handleFileUpload();
    initializeSearch(document.getElementById("contenidoTabla"));
    initScrollButtons(document.getElementById("contenidoTabla"));
});

console.log(database);
