/**
 * Animazione delle bolle nello sfondo
 * Bubble Zen 2025
 */
export function startBubblesAnimation(containerSelector) {
  const container = document.querySelector(containerSelector);

  if (!container) return;

  function createBubble() {
    const bubble = document.createElement("span");
    const size = Math.random() * 40 + 10; // da 10px a 50px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.position = "absolute";
    bubble.style.bottom = "-50px";
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.background = "rgba(214, 51, 132, 0.3)";
    bubble.style.borderRadius = "50%";
    bubble.style.boxShadow = "0 0 10px rgba(214, 51, 132, 0.6)";
    bubble.style.animation = `rise ${4 + Math.random() * 6}s linear forwards`;

    container.appendChild(bubble);

    // Rimuove la bolla dopo l'animazione
    bubble.addEventListener("animationend", () => {
      bubble.remove();
    });
  }

  // Genera bolle ogni 500ms
  setInterval(createBubble, 500);
}

// Aggiungi animazione CSS dinamicamente
const style = document.createElement("style");
style.innerHTML = `
@keyframes rise {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  50% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
}`;
document.head.appendChild(style);

