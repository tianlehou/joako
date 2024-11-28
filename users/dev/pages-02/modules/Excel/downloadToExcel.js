// Importa las funciones 'onValue' y 'ref' de la biblioteca de base de datos en tiempo real de Firebase
import { onValue, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
// Importa la configuración de la base de datos desde el archivo de configuración de Firebase
import { database } from "../../../../../environment/firebaseConfig.js";
import { collection } from "../../script-pages-02.js";

// Función para cargar un archivo Excel desde una URL
async function loadExcelTemplate(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    return workbook;
}

// Función para descargar los datos de la base de datos como un archivo Excel usando una plantilla
async function downloadToExcel() {
    const confirmDownload = confirm("¿Estás seguro de que deseas descargar el archivo Excel?");
    
    if (confirmDownload) {
        try {
            const templateWorkbook = await loadExcelTemplate("../pages-02/modules/Excel/templateCobros.xlsx");
            
            onValue(ref(database, collection), (snapshot) => {
                const data = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    const nombre = childData.nombre;
                    const conductor = childData.correoConductor || ""; // Columna de conductor
                    const propietario = childData.correoPropietario || ""; // Columna de propietario
                    
                    const row = { 
                        nombre: nombre, 
                        conductor: conductor, 
                        propietario: propietario 
                    };

                    // Inicializa las celdas de los días (1 al 31)
                    for (let i = 1; i <= 31; i++) {
                        row[i] = "";
                    }

                    // Asigna los cobros a las celdas correspondientes
                    Object.keys(childData).forEach(key => {
                        if (!isNaN(key)) {
                            const cobro = childData[key].Cobro;
                            row[key] = cobro;
                        }
                    });

                    data.push(row);
                });

                const worksheet = templateWorkbook.Sheets[templateWorkbook.SheetNames[0]];
                const range = XLSX.utils.decode_range(worksheet['!ref']);
                let startRow = range.e.r + 1;

                data.forEach((row, index) => {
                    const rowNum = startRow + index;

                    // Inserta 'nombre', 'conductor' y 'propietario' en las primeras columnas
                    worksheet[XLSX.utils.encode_cell({ c: 0, r: rowNum })] = { v: row.nombre };
                    worksheet[XLSX.utils.encode_cell({ c: 1, r: rowNum })] = { v: row.conductor };
                    worksheet[XLSX.utils.encode_cell({ c: 2, r: rowNum })] = { v: row.propietario };

                    // Inserta los datos de cada día (columnas 3 en adelante)
                    for (let i = 1; i <= 31; i++) {
                        worksheet[XLSX.utils.encode_cell({ c: i + 2, r: rowNum })] = { v: row[i] };
                    }
                });

                // Actualiza el rango de la hoja
                worksheet['!ref'] = XLSX.utils.encode_range(range.s, { c: 33, r: startRow + data.length - 1 });

                // Genera y descarga el archivo Excel
                XLSX.writeFile(templateWorkbook, "cobros.xlsx");
                alert("Se ha descargado un excel con los datos del tablero", "success");
            });
        } catch (error) {
            alert("Error al procesar la plantilla o los datos: " + error.message);
            console.error("Error al procesar la plantilla o los datos:", error);
        }
    } else {
        alert("Descarga cancelada");
    }
}

// Verifica si el botón para descargar el archivo existe en el DOM
const downloadButton = document.getElementById("downloadToExcel");
if (downloadButton) {
    downloadButton.addEventListener("click", downloadToExcel);
} else {
    console.log("El botón con ID 'downloadToExcel' no se encontró en el DOM, el script no se ejecutará.");
}
