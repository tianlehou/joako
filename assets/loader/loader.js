// Función para cargar el loader en el contenedor
async function loadLoader() {
    const loaderContainer = document.getElementById('global-loader-container');
    const response = await fetch('../../../components/loader/loader.html');
    const loaderHTML = await response.text();
    loaderContainer.innerHTML = loaderHTML;
  
    // Agregar estilos del loader
    // const link = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = '../components/loader/loader.css';
    // document.head.appendChild(link);
  }
  
  // Función para mostrar el loader
  function showLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'flex';
  }
  
  // Función para ocultar el loader
  function hideLoader() {
    const loader = document.getElementById('global-loader');
    if (loader) loader.style.display = 'none';
  }
  
  // Llamar a la carga del loader al inicio
  loadLoader();
  