// head.js
function loadHTMLmaincontent() {
    const bodyContent = `
  <!-- Main Content -->
  <main class="main-content">

    <div class="main-container">
      <table id="miTabla" class="table table-striped">
        <!-- Table - Head -->
        <thead>
          <tr>
            <td>#</th>
            <td>Unidad</th>
            <th>Placa</th>
            <th>Nombre, Apellido (Apodo)</th>
            <th>Whatsapp</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
            <th>Correo</th>
          </tr>
        </thead>

        <!--  Dinamic Table - Body -->
        <tbody class="table-body" id="contenidoTabla">
          <!-- aqui va el contenido d la tabla -->
        </tbody>
      </table>
    </div>
  </main>
    `;
  
    const bodyElement = document.createElement('div');
    bodyElement.innerHTML = bodyContent;
    document.getElementById('main-content-container').appendChild(bodyElement);
  }
  
  // Ejecutar la función para cargar el contenido del head
  loadHTMLmaincontent();
  