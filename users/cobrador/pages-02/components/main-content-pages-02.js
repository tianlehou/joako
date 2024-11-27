// main-content-pages-02.js
import { generateCalendarHeaders, getMonthAndYearFromDataCollection } from "../modules/calendarUtils.js";
import { collection } from "../script-pages-02.js"; // Importa la colección actual

function loadHTMLmaincontent() {
  // Obtener mes y año a partir de la colección
  const { month, year } = getMonthAndYearFromDataCollection(collection);

  const bodyContent = `
  <!-- Main Content -->
  <main class="main-content">
    <div class="main-container">
      <table id="miTabla" class="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Conductor</th>
            <th>Propietario</th>
            <th>Acciones</th>
            ${generateCalendarHeaders(month, year)}
          </tr>
        </thead>

        <!-- Dinamic Table -->
        <tbody class="table-body" id="contenidoTabla">
          <!-- aquí va el contenido de la tabla -->
        </tbody>
      </table>
    </div>
  </main>
  `;

  const bodyElement = document.createElement('div');
  bodyElement.innerHTML = bodyContent;
  document.getElementById('main-content-pages-02-container').appendChild(bodyElement);
}

// Ejecutar la función para cargar el contenido del main content
loadHTMLmaincontent();
