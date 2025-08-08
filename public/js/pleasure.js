document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('soin-container');

  try {
    const res = await fetch('/api/cloudinary/pleasure');
    const data = await res.json();

    if (!Array.isArray(data)) throw new Error('Invalid data format');

    console.log('Images reçues :', data);

    data.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'rounded-lg shadow-md overflow-hidden bg-white transition hover:shadow-lg';

      const img = document.createElement('img');
      img.src = item.url;
      img.alt = 'soin';
      img.className = 'w-full h-64 object-cover';

      const caption = document.createElement('div');
      caption.className = 'p-4 text-center text-pink-600 font-semibold';

      // Nom lisible à partir de l'ID ou valeur fixe
      caption.textContent = item.alt?.replace(/[-_]/g, ' ').toUpperCase() || 'SOINS BEAUTÉ';

      card.appendChild(img);
      card.appendChild(caption);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur lors du chargement des soins :', err);
    container.innerHTML = '<p class="text-red-500">Impossible de charger les soins pour le moment.</p>';
  }
});
