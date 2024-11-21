// modules/sumColumns.js

export function updateTotalSums(tbody, columns) {
    const table = tbody.closest('table');
    let totalThead = table.querySelector('.total-thead'); 

    // Si no existe, crear un segundo thead para los totales
    if (!totalThead) {
        totalThead = document.createElement('thead');
        totalThead.classList.add('total-thead');

        const totalRow = totalThead.insertRow(-1); // Inserta la fila para el total

        // Añadir celdas vacías para columnas que no contienen selects
        for (let i = 0; i < columns[0]; i++) {
            totalRow.insertCell(-1).textContent = ''; 
        }

        // Añadir celdas de totales
        columns.forEach(() => {
            const sumCell = totalRow.insertCell(-1);
            sumCell.textContent = 'Total: 0.00'; // Inicializar con 0.00
        });

        // Insertar el nuevo thead justo debajo del original
        table.insertBefore(totalThead, tbody);
    }

    // Actualizar los totales
    columns.forEach((columnIndex, idx) => {
        const total = Array.from(tbody.rows).reduce((sum, row) => {
            return sum + (parseFloat(row.cells[columnIndex].querySelector('select')?.value) || 0);
        }, 0).toFixed(2);

        totalThead.rows[0].cells[idx + columns[0]].textContent = `Total: ${total}`;
    });
}
