// calendarUtils.js
import { applyStyles } from "./updateSelectElements.js"; // Importa la función applyStyles

// ==============================
// Función para obtener la cantidad de días en un mes específico
// ==============================
export function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

// ==============================
// Función para extraer el mes y el año de la colección
// ==============================
export function getMonthAndYearFromDataCollection(collection) {
  if (!collection) return { month: 0, year: new Date().getFullYear() };
  const month = parseInt(collection.split("-").pop(), 10);
  const year = new Date().getFullYear();
  return { month, year };
}

// ==============================
// Función para generar encabezados de calendario en función del mes y año
// ==============================
export function generateCalendarHeaders(month, year) {
  const daysInMonth = getDaysInMonth(month, year);
  let headers = "";

  for (let i = 1; i <= daysInMonth; i++) {
    headers += `<th class="text-center">${i}</th>`;
  }
  return headers;
}

// ==============================
// Función para generar días del calendario en función del usuario y el mes/año especificados
// ==============================
export function generateCalendarDays(month, year, user) {
  const daysInMonth = getDaysInMonth(month, year);

  const daysHTML = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString();
    const cobro = user[day]?.Cobro || "";
    const timestamp = user[day]?.timestamp || "";
    const cobrador = user[day]?.cobrador || "";

    // Generar el valor de cobro con clase específica para estilos
    return `
      <td>
        <div class="flex-container display-center">
          <div class="timestamp">
            ${timestamp.replace(" ", "<br>") || ""}
            ${cobrador ? `<br>Cobrador: <span style="color: var(--clr-error);">${cobrador}</span>` : ""}
            <div><span class="cobro-value">${cobro}</span></div>
          </div>
        </div>
      </td>
    `;
  }).join("");

  // Después de generar el HTML, aplica estilos a los spans
  setTimeout(() => {
    const cobroElements = document.querySelectorAll(".cobro-value");
    cobroElements.forEach(cobroElement => {
      const selectedValue = cobroElement.textContent.trim();
      applyStyles(cobroElement, selectedValue); // Aplica los estilos
    });
  }, 0); // Asegúrate de que los elementos estén en el DOM antes de aplicar estilos

  return daysHTML;
}
