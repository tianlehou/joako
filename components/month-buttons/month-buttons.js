import { getUserRole } from "../../modules/accessControl/getUserRole.js";  // Importar la función para obtener el rol del usuario

// Función para mostrar/ocultar el botón "00" basado en el rol del usuario
function mostrarBotonSegunRol(userRole) {
    const adminButton = document.getElementById("adminButton");
    const rolesPermitidos = ['Administrador', 'Cobrador', 'Desarrollador'];  // Roles permitidos
    if (rolesPermitidos.includes(userRole)) {
        adminButton.style.display = 'flex';  // Mostrar el botón si el rol es permitido
    } else {
        adminButton.style.display = 'none';  // Ocultar el botón si no es permitido
    }
}

// Obtener el rol del usuario autenticado y mostrar/ocultar el botón "00"
getUserRole()
    .then(userRole => {
        mostrarBotonSegunRol(userRole);  // Mostrar u ocultar el botón según el rol
    })
    .catch(error => {
        console.error("Error obteniendo el rol del usuario:", error);
        const adminButton = document.getElementById("adminButton");
        if (adminButton) {
            adminButton.style.display = 'none';  // Ocultar el botón en caso de error
        }
    });

// Cargar el contenido del componente month-buttons.html y resaltar el botón activo
fetch('../../../components/month-buttons/month-buttons.html')
    .then(response => response.text())
    .then(data => {
        const container = document.getElementById('month-buttons-container');
        if (container) {
            container.innerHTML = data;

            // Obtener la URL actual para resaltar el botón correspondiente
            const currentPage = window.location.pathname.split('/').pop();
            const buttons = document.querySelectorAll('.month-buttons a');

            // Asignar la clase 'active' al botón correspondiente
            buttons.forEach(button => {
                if (button.getAttribute('href') === `./${currentPage}`) {
                    button.classList.add('active');
                }
            });
        }
    })
    .catch(error => {
        console.error("Error al cargar el componente month-buttons:", error);
    });
