import { getUserRole } from "../../modules/accessControl/getUserRole.js"; // Importa la función para obtener el rol del usuario

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("middle-section-container");

    // Carga el HTML del componente middle-section
    fetch("../../../components/middle-section/middle-section.html")
        .then((response) => response.text())
        .then((html) => {
            container.innerHTML = html;

            // Después de cargar el HTML, obtenemos el rol del usuario
            getUserRole()
                .then((role) => {
                    const titleElement = container.querySelector("h1"); // Selecciona el elemento <h1>

                    // Modifica el contenido del <h1> según el rol
                    if (role === "Conductor" || role === "Propietario") {
                        titleElement.textContent = "Registro de Pagos";
                    } else if (
                        ["Cobrador", "Administrador", "Desarrollador"].includes(role)
                    ) {
                        titleElement.textContent = "Registro de Cobros";
                    } else {
                        titleElement.textContent = "Registro";
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el rol del usuario:", error);
                });
        })
        .catch((error) => {
            console.error("Error al cargar middle-section.html:", error);
        });
});
