// Función para obtener la fecha y hora en la zona horaria de Panamá.
function getPanamaDateTime() {
    const panamaOffset = -5;
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const panamaDate = new Date(utc + (3600000 * panamaOffset));
    
    // Formatear manualmente para obtener DD/MM/AA y HH:MM:SS
    const day = String(panamaDate.getDate()).padStart(2, '0');
    const month = String(panamaDate.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = String(panamaDate.getFullYear()).slice(-2); // Obtener solo los dos últimos dígitos del año
    const hours = String(panamaDate.getHours()).padStart(2, '0');
    const minutes = String(panamaDate.getMinutes()).padStart(2, '0');
    const seconds = String(panamaDate.getSeconds()).padStart(2, '0');

    // Retornar tanto la fecha como la hora por separado para visualización
    return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}:${seconds}`
    };
}

// Función principal que maneja los eventos y actualiza el select correspondiente
export function updateSelectElements() {
    const selectElements = document.querySelectorAll(".pay-select");

    selectElements.forEach((selectElement) => {

        // Aplicar los estilos iniciales basados en el valor actual del select
        const timestamp = getPanamaDateTime(); // Llamada a la función para obtener timestamp actual
        updateCellAppearance(selectElement, selectElement.value, timestamp); 
    });
}

// Función para aplicar estilos al valor de Cobro
export function applyStyles(cobroElement, selectedValue) {
    cobroElement.style.color = selectedValue === "No Pagó" ? "var(--clr-error)" : "var(--clr-primary)";
    cobroElement.style.fontWeight = "500";
    cobroElement.style.fontSize = "1.33em";
}
