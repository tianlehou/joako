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
    let headers = "";

    // Generar <th> para cada día del mes con su día de la semana
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month - 1, i); // Crear una fecha específica
        const dayName = date.toLocaleDateString("es-ES", { weekday: "long" }); // Obtener el nombre del día
        const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1); // Capitalizar la primera letra
        const isSunday = dayName.toLowerCase() === "domingo"; // Verificar si es domingo

        // Agregar clase condicional si es domingo
        headers += `
            <th class="text-center ${isSunday ? "sunday" : ""}">
                ${i}<br><span class="day-name">${formattedDayName}</span>
            </th>`;
    }

    return headers;
}

// Función para calcular y generar el encabezado de totales
export function generateColumnTotals(data, month, year) {
    const daysInMonth = getDaysInMonth(month, year);

    // Inicializar un array para almacenar la suma de cada columna
    const totals = Array(daysInMonth).fill(0);

    // Calcular totales por cada día
    data.forEach((user) => {
        for (let i = 1; i <= daysInMonth; i++) {
            const dia = i.toString();
            const valor = parseFloat(user[dia]?.Cobro) || 0;
            if (!isNaN(valor)) {
                totals[i - 1] += valor;
            }
        }
    });

    // Generar HTML de totales
    const totalsHTML = `
        <tr>
            <th>Totales</th>
            <th></th>
            <th></th>
            <th></th>
            ${totals
                .map((total) => `<th class="text-center">${total.toFixed(2)}</th>`)
                .join("")}
        </tr>
    `;

    return totalsHTML;
}

// Genera las columnas del calendario basadas en la cantidad de días en el mes
export function generateCalendarDays(month, year, user) {
    const daysInMonth = getDaysInMonth(month, year);

    return Array.from({ length: daysInMonth }, (_, i) => {
        const dia = (i + 1).toString();
        const cobro = user[dia]?.Cobro || "";
        const timestamp = user[dia]?.timestamp || "";
        const cobrador = user[dia]?.cobrador || "";

        // Generar cada celda de día con los valores correspondientes
        return `
            <td class="text-center">
                <div class="flex-container display-center">
                    <select class="form-select pay-select" 
                            data-id="${user.id}"
                            data-field="${dia}" 
                            data-current-value="${cobro}">
                        ${["", "3.00", "6.00", "10.00", "11.00", "21.00", "24.00", "Libre", "Feriado", "Taller", "No Pagó"]
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
    }).join(""); // Retorna un string con todas las celdas de los días
}
