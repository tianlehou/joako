import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../environment/firebaseConfig.js";

import { checkAuth } from '../../../modules/accessControl/authCheck.js';
import { getUserRole } from "../../../modules/accessControl/getUserRole.js";
import { checkUserAccess } from "../../../modules/accessControl/roleAccessControl.js";
import { filterDataByAuthenticatedUser } from "../../../modules/tabla/filterData/filterByAuthUser.js";

import { includeHTML } from "../components/includeHTML/includeHTML.js";
import { getMonthAndYearFromDataCollection, generateCalendarHeaders, generateCalendarDays } from "./modules/calendarUtils.js";

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
        <th>Nombre</th>
        ${generateCalendarHeaders(month, year)}
    `;

    // Escuchar los cambios en la base de datos
    onValue(ref(database, collection), (snapshot) => {
        tabla.innerHTML = "";

        const data = [];
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            data.push({ id: childSnapshot.key, ...user });
        });

        // Filtrar los datos según el usuario autenticado
        filterDataByAuthenticatedUser(data, "correoPropietario")
            .then((filteredData) => {
                // Ordenar los datos filtrados
                filteredData.sort((a, b) => a.nombre.localeCompare(b.nombre));

                // Renderizar los datos filtrados en la tabla
                filteredData.forEach((user, index) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td class="text-center">${index + 1}</td>
                        <td class="text-center">${user.nombre}</td>
                        ${generateCalendarDays(month, year, user)}
                    `;
                    tabla.appendChild(row);
                });
            })
            .catch((error) => {
                console.error("Error al filtrar los datos: ", error);
            });
    });
}

// Inicializa la tabla y eventos al cargar el documento
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
});

console.log(database);
