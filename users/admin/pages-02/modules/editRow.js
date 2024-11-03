// editRow.js
// Importa funciones y referencias necesarias de Firebase y módulos personalizados
import { update, ref, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../../environment/firebaseConfig.js";
import { mostrarDatos, collection } from '../script-pages-02.js';
import { loadEditRowModal } from '../components/modal/editRowModal.js'; // Importa la función del modal
import { loadEditRowConfirmationModal } from '../components/modal/editRowConfirmationModal.js'; // Importa la función del modal de confirmación
import { loadToastComponent } from "../../../../components/toast/toastLoader.js";

// Cargar los modales una vez en el inicio
loadEditRowModal();
loadEditRowConfirmationModal();
loadToastComponent();

// Función para añadir event listeners a los botones de editar
export function addEditEventListeners() {
  const editButtons = document.querySelectorAll(".edit-user-button");
  editButtons.forEach((button) => {
    button.addEventListener("click", handleEdit);
  });
}

// Función que maneja la edición de un usuario
async function handleEdit(event) {
  const button = event.target.closest(".edit-user-button"); // Asegura que se selecciona el botón correctamente
  const id = button.getAttribute("data-id");

  // Verifica si el ID es válido
  if (!id) {
    console.error("ID de usuario no encontrado o inválido.");
    return;
  }

  // Obtiene los datos del usuario desde Firebase
  try {
    const userSnapshot = await get(ref(database, `${collection}/${id}`));
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();

      // Rellenar los inputs del modal con los valores actuales de Firebase
      document.getElementById("editNombre").value = userData.nombre || '';
      document.getElementById("correoConductor").value = userData.correoConductor || '';
      document.getElementById("correoPropietario").value = userData.correoPropietario || '';

      // Guardar el ID del usuario en un atributo de data para referencia futura
      document.getElementById("saveEditButton").setAttribute("data-id", id);

      // Mostrar el modal de edición después de obtener los datos
      const editModal = new bootstrap.Modal(document.getElementById('editRowModal'));
      editModal.show();
    } else {
      console.error("El usuario no existe en la base de datos.");
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario: ", error);
  }
}

// Evento para guardar cambios y confirmar antes de actualizar Firebase
document.getElementById("saveEditButton").addEventListener("click", function () {
  const id = this.getAttribute("data-id");
  const nuevoNombre = document.getElementById("editNombre").value;
  const nuevoCorreoConductor = document.getElementById("correoConductor").value;
  const nuevoCorreoPropietario = document.getElementById("correoPropietario").value;

  // Asegúrate de que los campos no estén vacíos
  if (!nuevoNombre) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Muestra el modal de confirmación
  const confirmationModal = new bootstrap.Modal(document.getElementById('editRowConfirmationModal'));
  confirmationModal.show();

  // Cuando se confirma la acción en el modal de confirmación
  document.getElementById("confirmActionButton").addEventListener("click", function () {
    const updates = {
      nombre: nuevoNombre,
      correoConductor: nuevoCorreoConductor,
      correoPropietario: nuevoCorreoPropietario
    };
  
    // Actualiza los datos en Firebase
    update(ref(database, `${collection}/${id}`), updates)
      .then(() => {
        // Muestra el toast de éxito en lugar del alert
        const toastElement = document.getElementById("updateToast");
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
  
        mostrarDatos(); // Refresca los datos en la tabla
      })
      .catch((error) => {
        console.error("Error al actualizar usuario: ", error);
      });
  
    // Cerrar el modal de confirmación y el modal de edición
    confirmationModal.hide();
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editRowModal'));
    editModal.hide();
  });
  
});
