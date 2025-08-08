export async function init() {
  try {
    const response = await fetch('/api/testimonials');
    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const testimonials = await response.json();
    console.log("✅ Témoignages reçus depuis l'API :", testimonials);
    renderTestimonials(testimonials);
  } catch (error) {
    console.error('❌ Erreur chargement des témoignages :', error);
    renderTestimonials([]);
  }
}
function renderTestimonials(testimonials = []) {
  const container = document.getElementById('testimonial-cards');
  if (!container) {
    console.warn("⚠️ Élément #testimonial-cards introuvable dans le DOM.");
    return;
  }

  if (testimonials.length === 0) {
    console.warn("⚠️ Aucun témoignage reçu.");
    container.innerHTML = `
      <blockquote class="bg-pink-50 p-6 rounded-lg shadow-md">
        <p class="text-gray-700 italic">"Aucun témoignage pour l'instant."</p>
        <footer class="mt-4 text-sm font-semibold text-pink-700"> En attente</footer>
      </blockquote>
    `;
    return;
  }

  container.innerHTML = testimonials.map((t, index) => {
    return `
      <blockquote class="bg-pink-50 p-6 rounded-lg shadow-md text-center flex flex-col items-center">
        ${
          t.imageUrl ? `
            <div 
              class="rounded-full overflow-hidden mb-4" 
              style="width:4rem; height:4rem;"
              aria-label="Photo de ${t.name}"
              role="img"
            >
              <img src="${t.imageUrl}" alt="Photo de ${t.name}" class="w-full h-full object-cover" />
            </div>
          ` : ''
        }
        <p class="text-gray-700 italic mb-2">"${t.message}"</p>
        <footer class="mt-auto text-sm font-semibold text-pink-700"> ${t.name}</footer>
      </blockquote>
    `;
  }).join('');
}
