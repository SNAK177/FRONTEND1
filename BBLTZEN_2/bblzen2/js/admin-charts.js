document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
      datasets: [{
        label: "Vendite",
        data: [12, 19, 8, 15, 22, 30, 18],
        backgroundColor: "#d63384"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
});
