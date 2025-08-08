function injectUserDashboard() {
  const modalHtml = `
  <div id="user-dashboard-modal" class="fixed inset-0 bg-white bg-opacity-50 flex items-start justify-center z-50 p-2 md:p-4 overflow-auto">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-7xl h-[90vh] flex flex-row overflow-hidden">

      <!-- Aside toujours à gauche -->
      <aside class="bg-pink-600 text-white w-64 flex-shrink-0 flex flex-col">
        <div class="p-6 text-center font-bold text-2xl border-b border-pink-700">RDV Compacte</div>
        <nav class="flex-grow mt-4 flex flex-col gap-2 px-4">
          <button id="dashboard-link" class="py-2 px-3 rounded hover:bg-pink-700 transition text-left">Mes Témoignages</button>
          <button id="appointment-link" class="py-2 px-3 rounded hover:bg-pink-700 transition text-left">Prendre un rendez-vous</button>
          <button id="review-link" class="py-2 px-3 rounded hover:bg-pink-700 transition text-left">Laisser un avis</button>
          <button id="profile-link" class="py-2 px-3 rounded hover:bg-pink-700 transition text-left">Mon profil</button>
        </nav>
        <button id="logout-btn" class="m-4 py-2 px-4 bg-pink-800 rounded hover:bg-pink-900 transition self-start">Déconnexion</button>
      </aside>

      <!-- Main toujours à droite -->
      <main class="flex-grow p-6 overflow-y-auto">
        <button id="close-dashboard" class="mb-4 text-pink-600 hover:text-pink-900 font-bold">✕ Fermer</button>
        <div id="dashboard-content"></div>
      </main>

    </div>
  </div>
  `;

  if (!document.getElementById('user-dashboard-modal')) {
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  const modal = document.getElementById('user-dashboard-modal');
  modal.classList.remove('hidden');

  // Récupérer éléments
  const dashboardBtn = document.getElementById('dashboard-link');
  const appointmentBtn = document.getElementById('appointment-link');
  const reviewBtn = document.getElementById('review-link');
  const profileBtn = document.getElementById('profile-link');
  const logoutBtn = document.getElementById('logout-btn');
  const closeBtn = document.getElementById('close-dashboard');
  const contentDiv = document.getElementById('dashboard-content');

  // Fermer modal
  closeBtn.onclick = () => modal.classList.add('hidden');

  // Déconnexion
  logoutBtn.onclick = () => {
    fetch('/api/logout', { method: 'POST' })
      .then(() => window.location.reload())
      .catch(() => alert('Erreur lors de la déconnexion'));
  };

  // Navigation
  dashboardBtn.onclick = () => loadTestimonials();
  appointmentBtn.onclick = () => loadAppointmentForm();
  reviewBtn.onclick = () => loadReviewForm();
  profileBtn.onclick = () => loadProfile();

  loadTestimonials();

  // ----------- Fonctions -----------

  async function loadTestimonials() {
    contentDiv.innerHTML = `<h2 class="text-xl font-bold mb-4 text-pink-600">Mes Témoignages</h2><p>Chargement...</p>`;
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error('Erreur chargement témoignages');
      const testimonials = await res.json();

      if (!testimonials.length) {
        contentDiv.innerHTML = `<p>Aucun témoignage trouvé.</p>`;
        return;
      }

      contentDiv.innerHTML = testimonials.map(t => `
        <div class="border border-pink-300 rounded p-4 mb-4 flex gap-4 items-center">
          <img src="${t.imageUrl || '/default-avatar.png'}" alt="${t.name}" class="w-16 h-16 rounded-full object-cover" />
          <div class="flex-grow">
            <h3 class="font-semibold text-pink-700">${t.name}</h3>
            <p class="italic text-gray-700">${t.message}</p>
          </div>
          <div class="flex flex-col gap-2">
            <button class="edit-btn text-pink-600 hover:text-pink-800 underline" data-id="${t._id}">Modifier</button>
            <button class="delete-btn text-red-600 hover:text-red-800 underline" data-id="${t._id}">Supprimer</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => loadEditForm(btn.dataset.id);
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
          if (confirm('Confirmer la suppression ?')) {
            const res = await fetch(`/api/testimonials/${btn.dataset.id}`, { method: 'DELETE' });
            if (res.ok) loadTestimonials();
            else alert('Erreur suppression');
          }
        };
      });
    } catch (err) {
      contentDiv.innerHTML = `<p class="text-red-600">Erreur lors du chargement.</p>`;
      console.error(err);
    }
  }

  

  function loadReviewForm() {
    contentDiv.innerHTML = `
      <h2 class="text-xl font-bold mb-4 text-pink-600">Laisser un avis</h2>
      <form id="review-form" enctype="multipart/form-data" class="flex flex-col gap-4 max-w-md">
        <input type="text" name="name" placeholder="Votre nom" required class="p-2 border border-pink-300 rounded" />
        <textarea name="message" placeholder="Votre témoignage" rows="4" required class="p-2 border border-pink-300 rounded"></textarea>
        <input type="file" name="image" accept="image/*" class="p-2 border border-pink-300 rounded" />
        <button type="submit" class="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">Envoyer</button>
      </form>
      <div id="review-msg" class="mt-2"></div>
    `;

    document.getElementById('review-form').onsubmit = async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      try {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          body: formData
        });
        const msgDiv = document.getElementById('review-msg');
        if (res.ok) {
          msgDiv.textContent = "Merci pour votre avis !";
          form.reset();
        } else {
          msgDiv.textContent = "Erreur lors de l'envoi.";
        }
      } catch {
        document.getElementById('review-msg').textContent = "Erreur réseau.";
      }
    };
  }

async function loadAppointmentForm() {
  contentDiv.innerHTML = `
    <h2 class="text-xl font-bold mb-4 text-pink-600">Prendre un rendez-vous</h2>
    <form id="appointment-form" class="flex flex-col gap-4 max-w-md">
      <input type="text" name="clientName" placeholder="Nom complet" required class="p-2 border border-pink-300 rounded" />
      <input type="tel" name="clientPhone" placeholder="Téléphone" required class="p-2 border border-pink-300 rounded" />

      <label for="technician">Technicien</label>
      <select name="technician" id="technician" required class="p-2 border border-pink-300 rounded">
        <option value="" disabled selected>Chargement...</option>
      </select>

      <label for="service">Service</label>
      <select name="service" id="service" required class="p-2 border border-pink-300 rounded">
        <option value="" disabled selected>Chargement...</option>
      </select>

      <label for="date">Date</label>
      <input type="text" name="date" id="date" required placeholder="Choisissez une date" class="p-2 border border-pink-300 rounded" />

      <label for="hour">Heure</label>
      <select name="hour" id="hour" required class="p-2 border border-pink-300 rounded">
        <option value="">Choisir une date et un technicien</option>
      </select>

      <textarea name="message" placeholder="Votre message (optionnel)" rows="4" class="p-2 border border-pink-300 rounded"></textarea>

      <button type="submit" class="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">Envoyer</button>
    </form>
    <div id="appointment-msg" class="mt-2"></div>
  `;

  const form = document.getElementById('appointment-form');
  const techSelect = document.getElementById('technician');
  const serviceSelect = document.getElementById('service');
  const dateInput = document.getElementById('date');
  const hourSelect = document.getElementById('hour');
  const msgDiv = document.getElementById('appointment-msg');

  let fpInstance = null;

  // Charge la liste des techniciens
  async function loadTechnicians() {
    try {
      const res = await fetch('/api/technicians');
      if (!res.ok) throw new Error('Erreur chargement techniciens');
      const technicians = await res.json();
      techSelect.innerHTML = '<option value="" disabled selected>Choisir</option>';
      technicians.forEach(t => {
        techSelect.innerHTML += `<option value="${t._id}">${t.name}</option>`;
      });
    } catch {
      techSelect.innerHTML = '<option disabled>Erreur chargement techniciens</option>';
    }
  }

  // Charge la liste des services
  async function loadServices() {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error('Erreur chargement services');
      const services = await res.json();
      serviceSelect.innerHTML = '<option value="" disabled selected>Choisir</option>';
      services.forEach(s => {
        serviceSelect.innerHTML += `<option value="${s._id}">${s.name}</option>`;
      });
    } catch {
      serviceSelect.innerHTML = '<option disabled>Erreur chargement services</option>';
    }
  }

  // Charge les dates disponibles pour un technicien
  async function loadAvailableDates(techId) {
    try {
      const res = await fetch(`/api/availability/dates/${techId}`);
      if (!res.ok) throw new Error('Erreur récupération dates');
      const availableDates = await res.json();

      if (fpInstance) fpInstance.destroy();

       console.log('availableDates:', availableDates);

      fpInstance = flatpickr(dateInput, {
        enable: availableDates.length ? availableDates : [],
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: updateAvailableHours,
        disableMobile: true,
      });

      dateInput.value = "";
      hourSelect.innerHTML = '<option value="">Choisir une date et un technicien</option>';
    } catch (err) {
      console.error('Erreur loadAvailableDates:', err);
      if (fpInstance) fpInstance.destroy();
      dateInput.value = "";
      hourSelect.innerHTML = '<option value="">Erreur chargement dates</option>';
    }
  }

  // Charge les créneaux horaires disponibles pour une date et un technicien donnés
  async function updateAvailableHours() {
    const techId = techSelect.value;
    const selectedDate = dateInput.value;
    if (!techId || !selectedDate) {
      hourSelect.innerHTML = '<option value="">Choisir une date et un technicien</option>';
      return;
    }

    try {
      const res = await fetch(`/api/availability/date/${techId}/${selectedDate}`);
      if (!res.ok) throw new Error("Erreur disponibilité");
      const slots = await res.json();

      if (!slots || slots.length === 0) {
        hourSelect.innerHTML = `<option value="">Aucune disponibilité ce jour-là</option>`;
        return;
      }

      const hours = [];
      slots.forEach(slot => {
        let current = new Date(`${selectedDate}T${slot.startTime}:00`);
        const end = new Date(`${selectedDate}T${slot.endTime}:00`);

        while (current < end) {
          const hh = current.getHours().toString().padStart(2, '0');
          const mm = current.getMinutes().toString().padStart(2, '0');
          hours.push(`${hh}:${mm}`);
          current.setMinutes(current.getMinutes() + 30);
        }
      });

      if (hours.length === 0) {
        hourSelect.innerHTML = `<option value="">Pas de créneaux disponibles</option>`;
        return;
      }

      hourSelect.innerHTML = `<option value="">Choisir une heure</option>`;
      hours.forEach(h => {
        hourSelect.innerHTML += `<option value="${h}">${h}</option>`;
      });
    } catch (err) {
      console.error('Erreur updateAvailableHours:', err);
      hourSelect.innerHTML = `<option value="">Erreur de chargement</option>`;
    }
  }

  // Quand on change de technicien, on recharge les dates disponibles
  techSelect.addEventListener('change', () => {
    const techId = techSelect.value;
    if (techId) {
      loadAvailableDates(techId);
    } else {
      if (fpInstance) fpInstance.destroy();
      dateInput.value = "";
      hourSelect.innerHTML = '<option value="">Choisir une date et un technicien</option>';
    }
  });

  // Soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const dateStr = data.date;
    const timeStr = data.hour;

    if (!dateStr || !timeStr) {
      msgDiv.textContent = "Veuillez sélectionner une date et une heure valides.";
      return;
    }

    const start = new Date(`${dateStr}T${timeStr}:00`);
    if (isNaN(start.getTime())) {
      msgDiv.textContent = "Date ou heure invalide.";
      return;
    }

    data.startTime = start.toISOString();

    // Nettoyer avant envoi
    delete data.date;
    delete data.hour;

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        msgDiv.textContent = "✅ Rendez-vous envoyé avec succès !";
        form.reset();
        if (fpInstance) fpInstance.clear();
        hourSelect.innerHTML = '<option value="">Choisir une date et un technicien</option>';
      } else {
        msgDiv.textContent = `❌ Erreur : ${result.message || res.statusText}`;
      }
    } catch (err) {
      console.error('Erreur submit:', err);
      msgDiv.textContent = "❌ Erreur réseau.";
    }
  });

  // Chargement initial des techniciens et services
  await Promise.all([loadTechnicians(), loadServices()]);
}


//limite





  function loadProfile() {
    contentDiv.innerHTML = `
      <h2 class="text-xl font-bold mb-4 text-pink-600">Mon profil</h2>
      <p>Cette section est en construction.</p>
    `;
  }

  function loadEditForm(id) {
    
    fetch(`/api/testimonials/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur récupération');
        return res.json();
      })
      .then(t => {
        contentDiv.innerHTML = `
          <h2 class="text-xl font-bold mb-4 text-pink-600">Modifier témoignage</h2>
          <form id="edit-form" enctype="multipart/form-data" class="flex flex-col gap-4 max-w-md">
            <input type="text" name="name" value="${t.name}" required class="p-2 border border-pink-300 rounded" />
            <textarea name="message" rows="4" required class="p-2 border border-pink-300 rounded">${t.message}</textarea>
            <input type="file" name="image" accept="image/*" class="p-2 border border-pink-300 rounded" />
            <button type="submit" class="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition">Mettre à jour</button>
            <button type="button" id="cancel-edit" class="text-pink-600 underline mt-2">Annuler</button>
          </form>
          <div id="edit-msg" class="mt-2"></div>
        `;

        document.getElementById('cancel-edit').onclick = () => loadTestimonials();

        document.getElementById('edit-form').onsubmit = async (e) => {
          e.preventDefault();
          const form = e.target;
          const formData = new FormData(form);

          try {
            const res = await fetch(`/api/testimonials/${id}`, {
              method: 'PUT',
              body: formData
            });
            const msgDiv = document.getElementById('edit-msg');
            if (res.ok) {
              msgDiv.textContent = "Témoignage mis à jour.";
              setTimeout(loadTestimonials, 1000);
            } else {
              msgDiv.textContent = "Erreur lors de la mise à jour.";
            }
          } catch {
            document.getElementById('edit-msg').textContent = "Erreur réseau.";
          }
        };
      })
      .catch(err => {
        contentDiv.innerHTML = `<p class="text-red-600">Erreur récupération témoignage.</p>`;
        console.error(err);
      });
  }
}

// Bouton pour ouvrir le dashboard
document.getElementById('open-dashboard-btn')?.addEventListener('click', () => {
  injectUserDashboard();
});



