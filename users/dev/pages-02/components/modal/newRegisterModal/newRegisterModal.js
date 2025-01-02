// loadNewRegisterModal.js
export async function loadNewRegisterModal() {
    try {
        const response = await fetch('./components/modal/newRegisterModal/newRegisterModal.html');
        if (!response.ok) throw new Error(`Error al cargar el modal: ${response.statusText}`);
        
        const modalHTML = await response.text();
        const container = document.getElementById('new-register-modal-container');
        container.innerHTML = modalHTML;

        // Asegurar que el botón de cargar esté oculto
        const uploadButton = container.querySelector('#uploadButton');
        if (uploadButton) uploadButton.classList.add('hidden');
    } catch (error) {
        console.error(error.message);
    }
}
