// toastLoader.js
export function loadToastComponent() {
    fetch("../../../components/toast/toast.html") // Ruta del componente del toast
      .then(response => response.ok ? response.text() : Promise.reject("Error loading toast component."))
      .then(html => {
        document.getElementById("toastComponentContainer").innerHTML = html;
      })
      .catch(error => console.error(error));
  }
  
  document.addEventListener("DOMContentLoaded", loadToastComponent);
  