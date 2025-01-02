import { ref, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../../environment/firebaseConfig.js";

import { collection } from "../script-pages-02.js";
import { getUserRole } from "../../../../modules/accessControl/getUserRole.js";
import { loadDeleteTableConfirmationModal } from "../components/modal/deleteTableConfirmationModal/deleteTableConfirmationModal.js";

async function initDeleteModule() {
  try {
    // Carga el modal de confirmación
    await loadDeleteTableConfirmationModal();

    // Obtén el rol del usuario
    const userRole = await getUserRole();

    if (userRole !== "Desarrollador") {
      // Si el usuario no tiene permisos, oculta el botón y termina la ejecución
      console.warn("Acceso denegado: Solo el Desarrollador puede acceder a este módulo.");
      const deleteButton = document.getElementById("delete-table-button");
      if (deleteButton) deleteButton.style.display = "none";
      return;
    }

    // Elementos del DOM
    const deleteButton = document.getElementById("delete-table-button");
    const confirmationModal = document.getElementById("deleteTableConfirmationModal");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const cancelDeleteButton = document.getElementById("cancel-delete");

    // Verifica que los elementos del modal estén cargados correctamente
    if (!confirmationModal || !confirmDeleteButton || !cancelDeleteButton) {
      console.error("No se encontraron elementos del modal. Verifica la carga del modal.");
      return;
    }

    // Muestra el modal al hacer clic en el botón de borrado
    deleteButton?.addEventListener("click", () => {
      confirmationModal.style.display = "block";
    });

    // Confirmar borrado
    confirmDeleteButton.addEventListener("click", async () => {
      const collectionRef = ref(database, collection);

      try {
        await remove(collectionRef);
        alert("El tablero ha sido borrado exitosamente.");
        confirmationModal.style.display = "none";
      } catch (error) {
        console.error("Error al borrar la tabla:", error);
        alert("Hubo un error al intentar borrar la tabla.");
      }
    });

    // Cancelar borrado
    cancelDeleteButton.addEventListener("click", () => {
      confirmationModal.style.display = "none";
    });
  } catch (error) {
    console.error("Error al inicializar el módulo de borrado:", error);
  }
}

// Ejecuta la función al cargar el DOM
document.addEventListener("DOMContentLoaded", initDeleteModule);
