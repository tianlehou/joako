import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../../environment/firebaseConfig.js";
import { checkAuth } from '../../../auth/authCheck.js';

import { includeHTML } from '../components/includeHTML/includeHTML.js';
import { updateTotalSums } from './modules/sumColumns.js';
import { getDaysInMonth, getMonthAndYearFromURL, generateCalendarDays } from './modules/calendarUtils.js';

const tabla = document.getElementById("contenidoTabla");

export const collection = (() => {
    const scriptTag = document.querySelector('script[data-collection]');
    if (scriptTag) {
        return scriptTag.getAttribute('data-collection');
    }
})();

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
        console.error('La ruta de la colección es inválida.');
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
                <td class="text-center">${filaNumero++}</td>
                <td class="text-center">${user.nombre}</td>
                ${generateCalendarDays(month, year, user)}
                <td class="text-center">${user.email}</td>
                <td class="text-center">
                    <span class="${!user.userId ? 'invisible-value' : ''}">${user.userId || ''}</span>
                </td>
            `;
            tabla.appendChild(row);
        });

        updateTotalSums(tabla, Array.from({ length: getDaysInMonth(month, year) }, (_, i) => i + 2));
    });
}

// Inicializa la tabla y eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    mostrarDatos();
    includeHTML();
});

console.log(database);
