export function addCopyEmailListeners() {
    const copyButtons = document.querySelectorAll(".copy-email-button");
  
    copyButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        // Buscar el correo en la celda que está al lado del botón
        const email = event.target.closest("td").innerText.trim(); 
        
        // Usar el portapapeles nativo para copiar el texto
        navigator.clipboard.writeText(email).then(() => {
          alert(`Correo copiado: ${email}`);
        }).catch((error) => {
          console.error("Error al copiar el correo: ", error);
        });
      });
    });
  }
  