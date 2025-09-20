/**
 * Scanner QR per Bubble Zen
 * Usa la libreria jsQR (mock in /lib/jsQR.js)
 */
export function initQRScanner(videoSelector, resultCallback) {
  const video = document.querySelector(videoSelector);
  if (!video) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Accesso alla webcam
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
      video.setAttribute("playsinline", true); // evita fullscreen su iOS
      video.play();
      requestAnimationFrame(scanFrame);
    })
    .catch(err => {
      console.error("Errore accesso webcam:", err);
    });

  function scanFrame() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = window.jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("QR trovato:", code.data);
        if (typeof resultCallback === "function") {
          resultCallback(code.data);
        }
      }
    }
    requestAnimationFrame(scanFrame);
  }
}

