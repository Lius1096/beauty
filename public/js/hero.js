export async function init() {
  const carousel = document.querySelector('#heroCarousel');
  const track = carousel.querySelector('.carousel-track');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  const pagination = carousel.querySelector('.carousel-pagination');

  let index = 0;
  let images = [];
  let intervalId;

  // Récupérer images backend
  try {
    const res = await fetch('/api/cloudinary/hero-images');
    images = await res.json();
    if (!Array.isArray(images) || images.length === 0) throw new Error('Aucune image reçue');
  } catch (e) {
    console.error('Impossible de charger images du carousel', e);
    return;
  }

  // Nettoyer contenu
  track.innerHTML = '';
  pagination.innerHTML = '';

  // Fixer largeur track (flex container)
  track.style.width = `${images.length * 100}%`;

  // Fonction chargement image (promesse)
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // Ajouter images + dots
  await Promise.all(
    images.map(async ({ url, alt }, i) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = alt || `Image ${i + 1}`;
      img.loading = 'lazy';
      img.className = 'select-none pointer-events-none object-cover h-full';

      // Taille img = 100%/nb images pour slider fluide
      img.style.width = `${100 / images.length}%`;
      img.style.flexShrink = '0';

      track.appendChild(img);

      // Dot pagination
      const dot = document.createElement('button');
      dot.className = 'w-3 h-3 rounded-full bg-pink-300 hover:bg-pink-600 transition-colors';
      dot.setAttribute('aria-label', `Aller à l’image ${i + 1}`);
      dot.type = 'button';
      dot.addEventListener('click', () => slideTo(i));
      pagination.appendChild(dot);

      if (i === 0) await loadImage(url);
    })
  );

  const dots = [...pagination.children];
  const setActiveDot = (i) => {
    dots.forEach((d, idx) => d.classList.toggle('bg-pink-600', idx === i));
  };

  const slideTo = (i) => {
    index = (i + images.length) % images.length;
    track.style.transform = `translateX(-${(index * 100) / images.length}%)`;
    setActiveDot(index);
  };

  // Navigation boutons
  btnNext.addEventListener('click', () => slideTo(index + 1));
  btnPrev.addEventListener('click', () => slideTo(index - 1));

  // Auto-play
  const startAutoPlay = () => {
    intervalId = setInterval(() => slideTo(index + 1), 5000);
  };
  const stopAutoPlay = () => clearInterval(intervalId);

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Navigation clavier
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') slideTo(index + 1);
    if (e.key === 'ArrowLeft') slideTo(index - 1);
  });





  slideTo(0);
  startAutoPlay();
}
