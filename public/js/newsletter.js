// Abonnement newsletter
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#newsletter form');
  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) return showToast("Veuillez entrer un email valide.", "error");

    submitButton.disabled = true;
    submitButton.textContent = "Envoi...";

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error("Erreur serveur");

      form.reset();
      showToast("Inscription réussie à la newsletter !", "success");
    } catch (err) {
      console.error(err);
      showToast("Une erreur est survenue. Réessayez plus tard.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "S'abonner";
    }
  });

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `
      fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white text-sm font-medium shadow-lg z-50
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
});
