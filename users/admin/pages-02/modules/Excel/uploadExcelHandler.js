// uploadExcelHandler.js

import { ref, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../../../environment/firebaseConfig.js";
import { collection } from "../../script-pages-02.js";
// Función para leer y procesar el archivo Excel y actualizar la base de datos
export function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const fileLabel = document.querySelector('label[for="fileInput"]');
    const modalElement = document.getElementById('newRegisterModal');

    // Ocultar el botón de carga inicialmente
    uploadButton.classList.add('hidden');

    // Mostrar el botón de cargar datos solo si hay un archivo seleccionado
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            fileLabel.textContent = `Archivo "${fileName}" ha sido seleccionado.`;
            uploadButton.classList.remove('hidden');
        } else {
            fileLabel.textContent = 'Seleccionar Archivo';
            uploadButton.classList.add('hidden');
        }
    });

    uploadButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (file) {
            try {
                await uploadExcelData(file);
                alert('Datos cargados exitosamente.');
                resetUploadForm();
                closeModal(modalElement);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                alert('Error al cargar los datos.');
            }
        } else {
            alert('Por favor, selecciona un archivo.');
        }
    });
}

// Función para leer y procesar el archivo Excel
async function uploadExcelData(file) {
    const reader = new FileReader();
    const data = await new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(new Uint8Array(event.target.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });

    // Lee el archivo Excel
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Configura el rango para que lea a partir de la fila 2 (encabezados) y fila 3 (datos)
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Indica que no use la primera fila como encabezados
        range: 1 // Empieza a leer desde la fila 2 (índice basado en 0)
    });

    // Mapea los encabezados manualmente (fila 2)
    const headers = jsonData[0]; // Fila 2 del Excel
    const rows = jsonData.slice(1); // Desde la fila 3 en adelante

    // Convierte las filas a objetos usando los encabezados
    const mappedData = rows.map(row => {
        const rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = row[index] || ""; // Mapea cada celda al encabezado correspondiente
        });
        return rowObject;
    });

    console.log("Datos procesados después de ajustar rango:", mappedData); // Verifica el mapeo

    const nombresRef = ref(database, collection);

    // Mapea a las claves esperadas y sube los datos a Firebase
    for (const item of mappedData) {
        const nuevoRegistro = {
            nombre: item["Nombre"] || "", // Mapea desde "Nombre" en Excel a "nombre"
            correoConductor: item["Conductor"] || "", // Mapea desde "Conductor" en Excel a "correoConductor"
            correoPropietario: item["Propietario"] || "" // Mapea desde "Propietario" en Excel a "correoPropietario"
        };

        console.log("Subiendo registro:", nuevoRegistro); // Depuración para confirmar qué datos se están subiendo
        await push(nombresRef, nuevoRegistro);
    }
}



// Función para limpiar el formulario de carga
function resetUploadForm() {
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.querySelector('label[for="fileInput"]');
    const uploadButton = document.getElementById('uploadButton');

    fileInput.value = '';
    fileLabel.textContent = 'Seleccionar Archivo';
    uploadButton.classList.add('hidden');
}

// Función para cerrar el modal
function closeModal(modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}
