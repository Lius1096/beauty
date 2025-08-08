export function initFormValidation() {
  const form = document.getElementById('appointmentForm');
  const message = document.getElementById('formMessage');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.textContent = '';
    message.className = 'mt-4 text-center text-sm';

    const { clientName, clientPhone, technician, service, appointmentDate, appointmentTime } = form;

    if (!clientName.value || !clientPhone.value || !technician.value || !service.value || !appointmentDate.value || !appointmentTime.value) {
      message.textContent = 'Veuillez remplir tous les champs obligatoires.';
      message.classList.add('text-red-600');
      return;
    }

    const phoneRegex = /^0[1-9](?:[\s.-]?\d{2}){4}$/;
    if (!phoneRegex.test(clientPhone.value)) {
      message.textContent = 'Le format du téléphone est invalide (ex: 06 12 34 56 78).';
      message.classList.add('text-red-600');
      return;
    }

    const selectedDate = new Date(`${appointmentDate.value}T${appointmentTime.value}`);
    const now = new Date();
    if (selectedDate < now) {
      message.textContent = 'La date et l’heure doivent être dans le futur.';
      message.classList.add('text-red-600');
      return;
    }

    const payload = {
      clientName: clientName.value,
      clientPhone: clientPhone.value,
      technician: technician.value,
      service: service.value,
      date: appointmentDate.value,
      time: appointmentTime.value
    };

    try {
      console.log("Envoyé au backend:", payload);
      message.textContent = 'Rendez-vous pris avec succès !';
      message.classList.add('text-green-600');
      form.reset();
    } catch (error) {
      message.textContent = 'Erreur lors de la réservation. Réessayez.';
      message.classList.add('text-red-600');
    }
  });
}
