import { ref, update } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getUserName } from "./getUserName.js";

// Función para obtener la fecha y hora en la zona horaria de Panamá.
function getPanamaDateTime() {
    const panamaOffset = -5;
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const panamaDate = new Date(utc + (3600000 * panamaOffset));

    // Formato DD/MM/AA HH:MM:SS
    const day = String(panamaDate.getDate()).padStart(2, '0');
    const month = String(panamaDate.getMonth() + 1).padStart(2, '0');
    const year = String(panamaDate.getFullYear()).slice(-2);
    const hours = String(panamaDate.getHours()).padStart(2, '0');
    const minutes = String(panamaDate.getMinutes()).padStart(2, '0');
    const seconds = String(panamaDate.getSeconds()).padStart(2, '0');

    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}:${seconds}`
    };
}

// Función principal para actualizar los elementos de selección
export async function updateSelectElements(database, collection) {
    let currentUserName;

    try {
        // Obtener el nombre del usuario autenticado
        currentUserName = await getUserName();
    } catch (error) {
        console.error("Error al obtener el nombre del usuario:", error);
        return;
    }

    const selectElements = document.querySelectorAll(".pay-select");

    selectElements.forEach((selectElement) => {
        const originalValue = selectElement.value;

        // Configurar evento de cambio en cada select
        selectElement.removeEventListener("change", handleSelectChange);
        selectElement.addEventListener("change", handleSelectChange);

        async function handleSelectChange(event) {
            const selectedValue = event.target.value;
            const userId = event.target.getAttribute("data-id");
            const field = event.target.getAttribute("data-field");
            const timestamp = getPanamaDateTime();

            if (!userId) {
                console.error("El atributo 'data-id' no está definido en el select", event.target);
                return;
            }

            const updateData = {
                [field]: {
                    Cobro: selectedValue,
                    timestamp: `${timestamp.date} ${timestamp.time}`,
                    cobrador: currentUserName
                }
            };

            try {
                await update(ref(database, `${collection}/${userId}`), updateData);
                updateCellAppearance(event.target, selectedValue, timestamp, currentUserName);

            } catch (error) {
                console.error("Error al actualizar en Firebase:", error);
                event.target.value = originalValue;
            }
        }

        const timestamp = getPanamaDateTime();
        updateCellAppearance(selectElement, selectElement.value, timestamp, currentUserName);
    });
}

// Función para aplicar estilos al valor de Cobro
function applyStyles(cobroElement, selectedValue) {
    cobroElement.style.color = selectedValue === "No Pagó" ? "var(--clr-error)" : "var(--clr-primary)";
    cobroElement.style.fontWeight = "500";
    cobroElement.style.fontSize = "1.33em";
}

// Función para actualizar visualmente el select
function updateCellAppearance(selectElement, selectedValue) {
    const tdElement = selectElement.closest('td');
    let displayElement = tdElement.querySelector('.display-values');

    if (!displayElement) {
        displayElement = document.createElement('div');
        displayElement.classList.add('display-values');
        tdElement.appendChild(displayElement);
    }

    displayElement.innerHTML = `
        <span class="cobro-value">${selectedValue}</span><br>
    `;
    applyStyles(displayElement.querySelector('.cobro-value'), selectedValue);
}
