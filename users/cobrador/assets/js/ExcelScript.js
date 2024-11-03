// Librería para generar Excel
const xlsxScript = document.createElement('script');
xlsxScript.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
document.body.appendChild(xlsxScript);

const xlsxStyleScript = document.createElement('script');
xlsxStyleScript.src = "https://cdn.jsdelivr.net/npm/xlsx-style@0.8.13/dist/xlsx-style.min.js";
document.body.appendChild(xlsxStyleScript);

// Ionic Icons
const ioniconsModuleScript = document.createElement('script');
ioniconsModuleScript.type = "module";
ioniconsModuleScript.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
document.body.appendChild(ioniconsModuleScript);

const ioniconsNoModuleScript = document.createElement('script');
ioniconsNoModuleScript.setAttribute('nomodule', '');
ioniconsNoModuleScript.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
document.body.appendChild(ioniconsNoModuleScript);