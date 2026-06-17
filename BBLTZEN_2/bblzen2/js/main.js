// Effetto bolle aggiuntive dinamiche
document.addEventListener("DOMContentLoaded", () => {
  const bubblesContainer = document.querySelector(".bubbles");

  for (let i = 0; i < 10; i++) {
    let bubble = document.createElement("span");
    bubble.classList.add("bubble");
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${5 + Math.random() * 10}s`;
    bubble.style.width = bubble.style.height = `${20 + Math.random() * 60}px`;
    bubblesContainer.appendChild(bubble);
  }
});

