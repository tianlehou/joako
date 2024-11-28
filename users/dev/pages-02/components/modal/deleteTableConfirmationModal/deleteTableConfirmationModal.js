// deleteTableConfirmationModal.js
export async function loadDeleteTableConfirmationModal() {
    try {
      const response = await fetch('./components/modal/deleteTableConfirmationModal/deleteTableConfirmationModal.html');
      if (!response.ok) {
        throw new Error(`Error al cargar el modal: ${response.statusText}`);
      }
  
      const modalHTML = await response.text();
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer); // Inserta el modal en el DOM
    } catch (error) {
      console.error('Error cargando el modal de confirmación:', error);
    }
  }
  