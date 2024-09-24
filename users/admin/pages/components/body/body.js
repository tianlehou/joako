document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('body-container');

    fetch('./components/body/body.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;

            // Cargar los scripts manualmente después de insertar el contenido
            loadScripts([
                './components/nav-header/nav-header.js',
                './components/radio-inputs/radio-inputs.js',
                './components/modal/register-modal.js',
                './components/modal/edit-modal.js',
                './assets/js/script.js'
            ]);
        })
        .catch(error => {
            console.error('Error al cargar body.html:', error);
        });
});

// Función para cargar y ejecutar scripts manualmente
function loadScripts(scripts) {
    scripts.forEach(scriptSrc => {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.defer = true;
        document.body.appendChild(script);
    });
}
