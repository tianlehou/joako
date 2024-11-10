import { getUserRole } from "../../modules/accessControl/getUserRole.js";
import { collection } from "../../modules/collection/collectionHandler.js";

function loadMonthButtons(updateCollection, mostrarDatos, userRole) {
    fetch("../../../components/month-buttons/month-buttons.html")
        .then(response => response.ok ? response.text() : Promise.reject("Error al cargar el componente month-buttons."))
        .then(data => renderButtons(data, updateCollection, mostrarDatos, userRole))
        .catch(error => console.error(error));
}

function renderButtons(data, updateCollection, mostrarDatos, userRole) {
    const container = document.getElementById("month-buttons-container");
    if (container) {
        container.innerHTML = data;
        const buttons = container.querySelectorAll(".month-buttons .button");

        // Obtener el nombre de la colección del mes actual
        const currentMonthCollection = getCurrentMonthCollection();

        // Activar el botón correspondiente al mes actual
        buttons.forEach(button => {
            const buttonCollection = button.getAttribute("data-collection");
            // Activar solo el botón correspondiente al mes actual
            button.classList.toggle("active", buttonCollection === currentMonthCollection);
        });

        // Mostrar el botón según el rol del usuario
        showButtonByRole(userRole);

        addClickEventToButtons(buttons, updateCollection, mostrarDatos);
    }
}

// Función para obtener la colección del mes actual
function getCurrentMonthCollection() {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Obtener mes actual en formato 01, 02, etc.
    return `cobros-de-zarpe-${month}`; // Ajustar según el formato de tus colecciones
}

function addClickEventToButtons(buttons, updateCollection, mostrarDatos) {
    buttons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            const collectionValue = button.getAttribute("data-collection");

            if (collectionValue) {
                updateCollection(collectionValue);
                mostrarDatos();

                // Activar solo el botón seleccionado
                buttons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
            } else {
                console.error("La colección no está definida. Selecciona una colección válida.");
            }
        });
    });
}

// Función para mostrar el botón solo a roles permitidos
function showButtonByRole(userRole) {
    const adminButtonContainer = document.getElementById("adminButtonContainer");
    const rolesPermitidos = ["Administrador", "Cobrador", "Desarrollador"];
    
    // Si el rol está permitido, quitamos la clase display-none para mostrar el botón
    if (adminButtonContainer && rolesPermitidos.includes(userRole)) {
        adminButtonContainer.classList.remove("display-none");
    }
}

function getScriptPath(role) {
    const rolePaths = {
        "Desarrollador": "dev/pages-02/script-pages-02.js",
        "Administrador": "admin/pages-02/script-pages-02.js",
        "Cobrador": "cobrador/pages-02/script-pages-02.js",
        "Conductor": "conductor/pages-02/script-pages-02.js",
        "Propietario": "owner/pages-02/script-pages-02.js",
    };
    return rolePaths[role] || "default/pages-02/script-pages-02.js";
}

// Ejecutar la carga de los botones al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    getUserRole()
        .then(userRole => {
            return import(`../../users/${getScriptPath(userRole)}`)
                .then(module => ({ module, userRole }));
        })
        .then(({ module, userRole }) => {
            const { updateCollection, mostrarDatos } = module;
            loadMonthButtons(updateCollection, mostrarDatos, userRole);
        })
        .catch(error => console.error("Error obteniendo el rol del usuario o cargando el script:", error));
});
