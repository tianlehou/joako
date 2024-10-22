import { getUserRole } from './getUserRole.js'; // Importa la función para obtener el rol del usuario

// Función para verificar el acceso basado en el rol del usuario
export function checkUserAccess() {
    getUserRole()
        .then((role) => {
            const currentUrl = window.location.pathname; // Obtiene la URL actual

            // Verifica las restricciones de acuerdo al rol del usuario
            if (role === 'Administrador' && !currentUrl.startsWith('/users/admin')) {
                window.location.href = '/access-denied.html'; // Redirige a página de acceso denegado
            } else if (role === 'Cobrador' && !currentUrl.startsWith('/users/cobrador')) {
                window.location.href = '/access-denied.html'; // Redirige a página de acceso denegado
            } else if (role === 'Propietario' && !currentUrl.startsWith('/users/owner')) {
                window.location.href = '/access-denied.html'; // Redirige a página de acceso denegado
            } else if (role === 'Conductor' && !currentUrl.startsWith('/users/conductor')) {
                window.location.href = '/access-denied.html'; // Redirige a página de acceso denegado
            }
        })
        .catch((error) => {
            console.error("Error al verificar el acceso del usuario:", error);
            window.location.href = '../login'; // Redirige al login si hay algún error o no está autenticado
        });
}

