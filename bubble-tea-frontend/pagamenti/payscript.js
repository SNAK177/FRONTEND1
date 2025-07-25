// Inserisci qui la tua chiave pubblica di Stripe
const stripe = Stripe("pk_test_TUA_CHIAVE_PUBBLICA");

document.getElementById("checkout-button").addEventListener("click", () => {
  fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.id) {
        stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert("Errore durante la creazione della sessione di pagamento.");
      }
    })
    .catch((error) => {
      console.error("Errore durante il pagamento:", error);
      alert("Si è verificato un errore.");
    });
});
document.getElementById("decline-order").addEventListener("click", function () {
  const conferma = confirm("Sei sicuro di voler annullare l'ordine?");
  if (conferma) {
    // Se vuoi solo mostrare un messaggio:
    alert("Ordine annullato.");

    // Se vuoi anche reindirizzare a un'altra pagina (es. menu.html):
    window.location.href = "../menu.html";
  }
});
