const sections = [
  { id: 'navbar', file: 'components/navbar.html', script: 'navbar.js' },
  { id: 'hero', file: 'components/hero.html', script: 'hero.js' },
  { id: 'testimonials', file: 'components/testimonials.html', script: 'testimonials.js' },
  { id: 'gallery', file: 'components/gallery.html', script: 'gallery.js' },
  { id: 'contact', file: 'components/contact.html', script: 'contact.js' },
  { id: 'newsletter', file: 'components/newsletter.html', script: 'newsletter.js' },
  { id: 'footer', file: 'components/footer.html', script: 'footer.js' },
  { id: 'modalContainer', file: 'components/modal.html', script: 'modal.js' },
  { id: 'open-dashboard-btn', file: 'components/user-dashboard-modal.html', script: 'user-dashboard-modal.js' },
  { id: 'auth-toggle-btn', file: 'components/auth-client.html', script: 'auth-client.js' },
  { id: 'soin-section', file: 'components/pleasure.html', script: 'pleasure.js' }
];

// Étape 1 : Injecter tout le HTML
async function loadAllHTML() {
  for (const section of sections) {
    try {
      const res = await fetch(section.file);
      const html = await res.text();
      document.getElementById(section.id).innerHTML = html;
    } catch (error) {
      console.error(`Erreur chargement HTML: ${section.file}`, error);
    }
  }
}

// Étape 2 : Charger tous les JS associés
async function initAllScripts() {
  for (const section of sections) {
    if (section.script) {
      try {
        const module = await import(`./${section.script}`);
        if (typeof module.init === 'function') {
          module.init();
        }
      } catch (error) {
        console.error(`Erreur chargement script: ${section.script}`, error);
      }
    }
  }
}

// Initialisation globale
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllHTML();    // Injecte les composants HTML
  await initAllScripts(); // Lance les scripts JS correspondants
});
