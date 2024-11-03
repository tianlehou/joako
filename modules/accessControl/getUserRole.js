// getUserRole.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { auth, database } from "../../environment/firebaseConfig.js";

// Función para obtener el rol del usuario autenticado
export function getUserRole() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;

                // Consultar el rol del usuario en la base de datos
                const userRef = query(ref(database, 'biblioteca'), orderByChild('userId'), equalTo(uid));

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((childSnapshot) => {
                            const user = childSnapshot.val();
                            const role = user.role;

                            // Resuelve la promesa con el rol del usuario
                            resolve(role);
                        });
                    } else {
                        reject("No se encontró el rol del usuario.");
                    }
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject("No hay usuario autenticado.");
            }
        });
    });
}
