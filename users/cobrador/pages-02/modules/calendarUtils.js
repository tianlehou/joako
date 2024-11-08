// calendarUtils.js

// Función para obtener la cantidad de días en un mes específico
export function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Función para extraer el mes y el año de la colección
export function getMonthAndYearFromDataCollection(collection) {
    if (!collection) return { month: 0, year: new Date().getFullYear() };
    const month = parseInt(collection.split("-").pop(), 10);
    const year = new Date().getFullYear();
    return { month, year };
}

// Función para generar encabezados de calendario en función del mes y año
export function generateCalendarHeaders(month, year) {
    const daysInMonth = getDaysInMonth(month, year);
    let headers = '';

    // Generar <th> para cada día del mes
    for (let i = 1; i <= daysInMonth; i++) {
        headers += `<th class="text-center">${i}</th>`;
    }
    return headers;
}

// Generar columnas del calendario basadas en los días del mes
export function generateCalendarDays(month, year, user) {
    const daysInMonth = getDaysInMonth(month, year);

    return Array.from({ length: daysInMonth }, (_, i) => {
        const dia = (i + 1).toString();
        const cobro = user[dia]?.Cobro || "";
        const timestamp = user[dia]?.timestamp || "";
        const cobrador = user[dia]?.cobrador || "";

        return `
            <td class="${["6.00", "10.00", "11.00", "24.00"].includes(cobro) ? "text-center" : ""}">
                <div class="flex-container display-center">
                    <select class="form-select pay-select ${["3.00", "6.00", "10.00", "11.00", "21.00", "24.00"].includes(cobro) ? "d-none" : ""}" data-id="${user.id}" data-field="${dia}">
                        ${["", "3.00", "6.00", "10.00", "11.00", "21.00", "24.00", "No Pagó"]
                            .map(option => `<option value="${option}" ${cobro === option ? "selected" : ""}>${option}</option>`)
                            .join("")}
                    </select>
                    <div class="timestamp">
                        ${timestamp.replace(" ", "<br>") || ""}
                        ${cobrador ? `<br>Cobrador: <span style="color: var(--clr-error);">${cobrador}</span>` : ""}
                    </div>
                </div>
            </td>
        `;
    }).join("");
}

// Función para inicializar los botones del calendario
export function initializeMonthButtons() {
    const buttons = document.querySelectorAll(".month-buttons .button");

    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Evita la recarga de la página
            const collection = button.getAttribute("data-collection");
            const { month, year } = getMonthAndYearFromDataCollection(collection);
            
            console.log(`Mes: ${month}, Año: ${year}`); // Aquí puedes agregar la lógica que necesitas para generar el calendario
        });
    });
}
