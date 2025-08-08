// Logique du formulaire de contact
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#contact form');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Désactiver le bouton et afficher un état de chargement
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi...';

    const contactData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      // Réinitialiser le formulaire
      form.reset();

      // Afficher un message de succès
      showToast('Votre message a bien été envoyé. Merci !', 'success');
    } catch (error) {
      console.error('Erreur de soumission :', error);
      showToast('Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Envoyer';
    }
  });

  // Simple toast stylé avec Tailwind (optionnel mais recommandé)
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
