// main-content-pages-02.js
import { generateCalendarHeaders } from "../modules/calendarUtils.js";

function loadHTMLmaincontent() {
  const bodyContent = `
  <!-- Main Content -->
  <main class="main-content">
    <!-- Main Content - Container -->
    <div class="main-container">
      <table id="miTabla" class="table table-striped">
        <!-- Table - Head -->
        <thead>
          <tr>
            <th class="text-center">#</th>
            <th class="text-center" id="headerTabla">Nombre</th>
            ${generateCalendarHeaders()}
          </tr>
        </thead>

        <!--  Dinamic Table - Body -->
        <tbody class="table-body" id="contenidoTabla">
          <!-- aqui va el contenido de la tabla -->
        </tbody>
      </table>
    </div>
  </main>
  `;

  const bodyElement = document.createElement('div');
  bodyElement.innerHTML = bodyContent;
  document.getElementById('main-content-pages-02-container').appendChild(bodyElement);
}

// Ejecutar la función para cargar el contenido del head
loadHTMLmaincontent();
