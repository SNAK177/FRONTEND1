
/**
 * Mock libreria jsQR
 * Versione semplificata per Bubble Zen
 * In produzione, sostituisci con la libreria originale: https://github.com/cozmo/jsQR
 */
function jsQR(imageData, width, height) {
  // Simulazione: se trova qualcosa "decodifica" sempre un QR demo
  return {
    data: "https://bubblezen.menu/demo",
    location: {
      topLeftCorner: { x: 0, y: 0 },
      topRightCorner: { x: width, y: 0 },
      bottomLeftCorner: { x: 0, y: height },
      bottomRightCorner: { x: width, y: height }
    }
  };
}

// Esporta globalmente
window.jsQR = jsQR;
