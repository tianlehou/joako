// script-pages-02.js
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";

import "./modules/newRegister.js";
import { checkAuth } from "../../../modules/accessControl/authCheck.js";
import { getUserRole } from "../../../modules/accessControl/getUserRole.js";
import { checkUserAccess } from "../../../modules/accessControl/roleAccessControl.js";

import "./modules/Excel/downloadToExcel.js";
import { deleteRow } from "./modules/tabla/deleteRow.js";
import { addEditEventListeners } from "./modules/tabla/editRow.js";
import { handleFileUpload } from './modules/Excel/uploadExcelHandler.js';

import { initializeSearch } from "./modules/searchFunction.js";
import { initScrollButtons } from "../modules/scrollButtons.js";
import { includeHTML } from "../components/includeHTML/includeHTML.js";
import { updateSelectElements } from "./modules/tabla/updateSelectElements.js";
import { updateTotalSums } from "./modules/tabla/sumColumns.js";
import { getMonthAndYearFromDataCollection, getDaysInMonth, generateCalendarHeaders, generateCalendarDays } from "./modules/tabla/calendarUtils.js";

export let collection = null;

// Asigna automáticamente la colección en función del mes actual
export function setCollectionByCurrentMonth() {
    const month = new Date().getMonth() + 1;
    collection = `cobros-de-zarpe-${month.toString().padStart(2, '0')}`;
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
        <th>Nombre</th>
        <th>#</th>
        <th>Conductor</th>
        <th>Propietario</th>
        <th>Acciones</th>
        ${generateCalendarHeaders(month, year)}
    `;

    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = ""; // Limpia la tabla

        const data = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            data.push({ id: childSnapshot.key, ...user });
        });

        data.sort((a, b) => a.nombre.localeCompare(b.nombre));

        data.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.nombre}</td>
                <td>${index + 1}</td>
                <td>${user.correoConductor || ""}</td>
                <td>${user.correoPropietario || ""}</td>
                <td class="display-flex-center">
                    <button class="btn btn-primary mg-05em edit-user-button" data-id="${user.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger mg-05em delete-user-button" data-id="${user.id}">
                        <i class="bi bi-eraser-fill"></i>
                    </button>
                </td>
                ${generateCalendarDays(month, year, user)}
            `;
            tabla.appendChild(row);
        });

        addEditEventListeners(database, collection);
        deleteRow(database, collection);
        updateSelectElements(database, collection);
        updateTotalSums(
            tabla,
            Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 5)
        );
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener("DOMContentLoaded", async () => {
    setCollectionByCurrentMonth();
    checkAuth();
    checkUserAccess();
    
    try {
        const role = await getUserRole();
        console.log("Rol del usuario autenticado:", role);
    } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
    }
    
    mostrarDatos();
    includeHTML();
    initializeSearch(document.getElementById("contenidoTabla"));
    initScrollButtons(document.getElementById("contenidoTabla"));
    handleFileUpload();
});

console.log(database);
