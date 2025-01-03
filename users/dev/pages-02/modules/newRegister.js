import { push, ref } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { database } from "../../../../environment/firebaseConfig.js";
import { collection } from "../script-pages-02.js";
import { loadNewRegisterModal } from "../components/modal/newRegisterModal/newRegisterModal.js";

let isSubmitting = false;

document.addEventListener("DOMContentLoaded", async () => {
    await loadNewRegisterModal(); // Asegurar que el modal se cargue antes de usarlo

    const form = document.getElementById("registerForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("Evento submit está funcionando");

            if (!isSubmitting) {
                isSubmitting = true;

                if (!form.checkValidity()) {
                    form.classList.add('was-validated');
                    isSubmitting = false;
                    return;
                }

                const nombreInput = document.getElementById("validationNombre").value;

                if (nombreInput.trim() !== "") {
                    const nuevoRegistro = { nombre: nombreInput };
                    const referenciaUnidades = ref(database, collection);

                    push(referenciaUnidades, nuevoRegistro)
                        .then(() => {
                            console.log("Datos enviados exitosamente a la base de datos.");
                            form.reset();
                            form.classList.remove('was-validated');
                            const modalElement = document.getElementById("newRegisterModal");
                            const modalInstance = bootstrap.Modal.getInstance(modalElement);
                            modalInstance.hide();
                            setTimeout(() => { isSubmitting = false; }, 1000);
                        })
                        .catch((error) => {
                            console.error("Error al enviar datos a la base de datos:", error);
                            isSubmitting = false;
                        });
                } else {
                    alert("Por favor completa todos los campos.");
                    isSubmitting = false;
                }
            } else {
                alert("Ya se está enviando un formulario. Por favor espera unos momentos antes de intentar de nuevo.");
            }
        });
    } else {
        console.error("El formulario no fue encontrado.");
    }
});
