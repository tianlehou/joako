// collectionHandler.js

// Definir variable global para almacenar la colección
export let collection = null;

// Función para definir automáticamente la colección en función del mes actual
export function setCollectionByCurrentMonth() {
    const month = new Date().getMonth() + 1; // Obtener mes actual (1-12)
    collection = `cobros-de-zarpe-${month.toString().padStart(2, '0')}`; // Asigna colección basada en el mes
    console.log("Colección asignada automáticamente:", collection);
}

// Actualizar colección manualmente si es necesario
export function updateCollection(value) {
    collection = value;
    console.log("Colección actualizada manualmente a:", collection);
}
