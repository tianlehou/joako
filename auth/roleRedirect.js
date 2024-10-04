import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, query, equalTo, orderByChild, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth, database } from '../environment/firebaseConfig.js';

const baseUrl = window.location.origin.includes('github.io') ? '/joako' : '';
// Mapeo de roles a sus respectivas páginas
const rolePages = {
  "Desarrollador": `${baseUrl}/users/dev/pages/biblioteca.html`,
  "Administrador": `${baseUrl}/users/admin/pages/biblioteca.html`,
  "Cobrador": `${baseUrl}/users/cobrador/pages/biblioteca.html`,
  "Propietario": `${baseUrl}/users/owner/pages/biblioteca.html`,
  "Conductor": `${baseUrl}/users/conductor/pages/biblioteca.html`
};

export function detectRoleAndRedirect() {
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
            const redirectPage = rolePages[role];
            
            if (redirectPage) {
              // Redirigir al usuario a la página correspondiente
              window.location.href = redirectPage;
            } else {
              console.error("Rol no válido o no encontrado.");
            }
          });
        } else {
          console.error("No se encontró usuario con este UID en la colección.");
        }
      }).catch((error) => {
        console.error("Error al obtener los datos del usuario:", error);
      });
    } else {
      // Si no hay usuario logueado, redirigir al login
      window.location.href = '../login.html';
    }
  });
}
