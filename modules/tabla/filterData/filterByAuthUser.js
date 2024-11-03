import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "../../../environment/firebaseConfig.js";

// Función para filtrar los datos según el correo del usuario autenticado
export function filterDataByAuthenticatedUser(data, emailField) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const filteredData = data.filter((item) => item[emailField] === user.email);
                resolve(filteredData);
            } else {
                console.error("No hay un usuario autenticado.");
                reject("Usuario no autenticado");
            }
        });
    });
}
