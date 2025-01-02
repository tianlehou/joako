// getUserName.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { auth, database } from "../../../../environment/firebaseConfig.js";

// Función para obtener el nombre del usuario autenticado desde la colección "biblioteca"
export function getUserName() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;

                // Consultar el nombre del usuario en la base de datos
                const userRef = query(ref(database, 'biblioteca'), orderByChild('userId'), equalTo(uid));

                get(userRef).then((snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((childSnapshot) => {
                            const user = childSnapshot.val();
                            const name = user.nombre; // Ajuste aquí para obtener el nombre

                            // Resuelve la promesa con el nombre del usuario
                            resolve(name);
                        });
                    } else {
                        reject("No se encontró el nombre del usuario.");
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
