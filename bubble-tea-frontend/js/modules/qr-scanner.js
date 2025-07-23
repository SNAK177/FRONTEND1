// QR Scanner functionality
const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const qrResult = document.getElementById('qr-result');
const startScannerBtn = document.getElementById('start-scanner');
const manualEntryBtn = document.getElementById('enter-manually');

let scannerActive = false;
let stream = null;

// Start scanner button event
if (startScannerBtn) {
    startScannerBtn.addEventListener('click', startScanner);
}

// Manual entry button event
if (manualEntryBtn) {
    manualEntryBtn.addEventListener('click', function() {
        const tableCode = document.getElementById('table-code').value.trim();
        if (tableCode) {
            setTable(tableCode);
        } else {
            alert('Per favore inserisci un codice tavolo valido');
        }
    });
}

function startScanner() {
    if (scannerActive) {
        stopScanner();
        startScannerBtn.textContent = 'Avvia Scanner';
        return;
    }
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(s) {
            stream = s;
            video.srcObject = stream;
            video.play();
            startScannerBtn.textContent = 'Ferma Scanner';
            scannerActive = true;
            requestAnimationFrame(tick);
        })
        .catch(function(err) {
            console.error('Error accessing camera:', err);
            alert('Impossibile accedere alla fotocamera. Per favore assicurati di aver concesso i permessi.');
        });
}

function stopScanner() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        scannerActive = false;
    }
}

function tick() {
    if (!scannerActive) return;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.hidden = false;
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });
        
        if (code) {
            qrResult.textContent = `Tavolo rilevato: ${code.data}`;
            setTable(code.data);
            stopScanner();
            startScannerBtn.textContent = 'Avvia Scanner';
        }
    }
    
    requestAnimationFrame(tick);
}

function setTable(tableNumber) {
    localStorage.setItem('currentTable', tableNumber);
    window.location.href = 'menu.html';
}
