document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('middle-section-container');

    fetch('../../../components/middle-section-pagos/middle-section.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error al cargar middle-section.html:', error);
        });
});
