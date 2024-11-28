function loadDeleteTable() {
    fetch('./components/buttons/deleteTableButton/deleteTableButton.html')
        .then(response => response.text())
        .then(html => {
            const modalContainer = document.getElementById('delete-table-container');
            modalContainer.innerHTML = html;
        })
}

loadDeleteTable();
