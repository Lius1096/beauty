// Logique de réservation
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('appointmentForm');
  const formMessage = document.getElementById('formMessage');

  // 👉 Ouvrir le modal
  openBtn?.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // 👉 Fermer le modal
  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
    form.reset();
    formMessage.textContent = '';
  });

  // 👉 Fermer si clic à l'extérieur du modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      form.reset();
      formMessage.textContent = '';
    }
  });

  // 👉 Envoi du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      clientName: form.clientName.value.trim(),
      clientPhone: form.clientPhone.value.trim(),
      technician: form.technician.value,
      service: form.service.value,
      appointmentDate: form.appointmentDate.value,
      appointmentTime: form.appointmentTime.value,
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error('Erreur lors de la réservation');

      form.reset();
      formMessage.textContent = "✅ Rendez-vous enregistré avec succès !";
      formMessage.className = "text-green-600 mt-4 text-center";

      // Optionnel : Fermer auto après 3s
      setTimeout(() => {
        modal.classList.add('hidden');
        formMessage.textContent = '';
      }, 3000);

    } catch (err) {
      console.error(err);
      formMessage.textContent = " Une erreur est survenue. Réessayez.";
      formMessage.className = "text-red-600 mt-4 text-center";
    }
  });
});
