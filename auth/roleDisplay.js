// roleDisplay.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, query, equalTo, orderByChild, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth, database } from '../environment/firebaseConfig.js';

function displayUserRole() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      
      // Consultar en la colección "biblioteca" usando el campo "userId"
      const userRef = query(ref(database, 'biblioteca'), orderByChild('userId'), equalTo(uid));

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const role = data.role;
            
            // Mostrar el rol en el nav-header
            const roleElement = document.getElementById('user-role');
            if (roleElement) {
              roleElement.textContent = role;
            }
          });
        } else {
          console.error("No se encontró usuario con este UID en la colección.");
        }
      }).catch((error) => {
        console.error("Error al obtener los datos del usuario:", error);
      });
    } else {
      console.log("No hay usuario autenticado.");
    }
  });
}

export { displayUserRole };
