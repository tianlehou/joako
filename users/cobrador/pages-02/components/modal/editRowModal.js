export function loadEditRowModal() {
  const bodyContent = `
  <div class="modal fade" id="editRowModal" tabindex="-1" aria-labelledby="editNombreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editNombreModalLabel">Editar Nombre</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="editNombreForm">
            <!-- Campo de Nombre -->
            <div class="mb-3">
              <label for="editNombre" class="form-label">Nombre de Unidad:</label>
              <input type="text" class="form-control" id="editNombre" required>
            </div>
            <!-- Nuevo campo: Correo Conductor con icono de pegar -->
            <div class="mb-3">
              <label for="correoConductor" class="form-label">Correo del Conductor:</label>
              <div class="mb-3 input-group">
              <input type="email" class="form-control" id="correoConductor" required>
              <button type="button" class="btn btn-outline-secondary" id="pasteConductorEmail">
                <i class="bi bi-clipboard"></i> <!-- Ícono de pegar de Bootstrap -->
              </button>
                </div>
            </div>
            <!-- Nuevo campo: Correo Propietario con icono de pegar -->
            <div class="mb-3">
              <label for="correoPropietario" class="form-label">Correo del Propietario:</label>
                  <div class="mb-3 input-group">
              <input type="email" class="form-control" id="correoPropietario" required>
              <button type="button" class="btn btn-outline-secondary" id="pastePropietarioEmail">
                <i class="bi bi-clipboard"></i> <!-- Ícono de pegar de Bootstrap -->
              </button>
                 </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="button" class="btn btn-primary" id="saveEditButton">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
    `;

  const bodyElement = document.createElement('div');
  bodyElement.innerHTML = bodyContent;
  document.getElementById('edit-row-modal-container').appendChild(bodyElement);

  // Asigna eventos para pegar el correo al hacer click en el icono de pegar
  document.getElementById('pasteConductorEmail').addEventListener('click', () => pasteEmail('correoConductor'));
  document.getElementById('pastePropietarioEmail').addEventListener('click', () => pasteEmail('correoPropietario'));
}

// Función para pegar el correo copiado al campo correspondiente
function pasteEmail(inputId) {
  navigator.clipboard.readText().then((text) => {
    document.getElementById(inputId).value = text;
  }).catch((err) => {
    console.error('Error al leer desde el portapapeles: ', err);
  });
}

// Ejecutar la función para cargar el contenido del modal
loadEditRowModal();
