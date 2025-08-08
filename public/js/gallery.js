export async function init() {
  const gallerySection = document.getElementById('gallery');         // la section globale
  const galleryImages = document.getElementById('gallery-images');   // la div qui contiendra les images
  const loading = document.getElementById('loading');

  try {
    const res = await fetch('/api/cloudinary/hero-images');
    const images = await res.json();

    if (loading) loading.remove();

    if (!Array.isArray(images) || images.length === 0) {
      galleryImages.innerHTML = `<p class="col-span-full text-center text-pink-600 font-semibold">Aucune image trouvée.</p>`;
      return;
    }

    galleryImages.innerHTML = images.map((img, i) => `
      <div class="bg-white rounded shadow overflow-hidden flex flex-col items-center">
        <div class="w-full aspect-square overflow-hidden">
          <img 
            src="${img.url}" 
            alt="Image ${i + 1}" 
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <p class="text-xs text-pink-700 text-center p-2">${img.title ? img.title : 'Sans titre'}</p>
      </div>
    `).join('');

  } catch (err) {
    if (loading) loading.remove();
    galleryImages.innerHTML = `<p class="col-span-full text-center text-red-500 font-semibold">Erreur de chargement des images.</p>`;
    console.error(err);
  }
}
