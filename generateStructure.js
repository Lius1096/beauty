import fs from 'fs/promises';
import path from 'path';

const baseDir = 'public';

const structure = {
  css: {
    'input.css': '/* Fichier source Tailwind CSS */\n',
    'style.css': '/* Fichier Tailwind compilé */\n'
  },
  js: {
    'main.js': '// Script global pour navigation / routing dynamique\n',
    'auth.js': '// Gestion login/register/logout\n',
    'reservation.js': '// Logique de réservation\n',
    'contact.js': '// Logique du formulaire de contact\n',
    'testimonials.js': '// Témoignages dynamiques\n',
    'gallery.js': '// Logique pour la galerie\n',
    'newsletter.js': '// Abonnement newsletter\n'
  },
  components: {
    'header.html': '<!-- En-tête commun -->\n',
    'footer.html': '<!-- Pied de page commun -->\n',
    'hero.html': '<!-- Section d’accueil (bannière, etc.) -->\n',
    'auth.html': '<!-- Formulaire login/register -->\n',
    'reservation.html': '<!-- Interface réservation (client/technicien) -->\n',
    'contact.html': '<!-- Formulaire contact -->\n',
    'testimonials.html': '<!-- Témoignages clients -->\n',
    'gallery.html': '<!-- Galerie d’images ou vidéos -->\n',
    'newsletter.html': '<!-- Formulaire d’abonnement -->\n'
  },
  assets: {
    images: {},
    icons: {}
  },
  'index.html': '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>Mon Projet</title>\n  <link href="css/style.css" rel="stylesheet" />\n  <script defer src="js/main.js"></script>\n</head>\n<body>\n  <div id="header"></div>\n  <main id="app"></main>\n  <div id="footer"></div>\n</body>\n</html>\n'
};

async function createStructure(base, obj) {
  await fs.mkdir(base, { recursive: true });
  for (const [name, content] of Object.entries(obj)) {
    const fullPath = path.join(base, name);
    if (typeof content === 'string') {
      await fs.writeFile(fullPath, content, 'utf8');
    } else {
      await createStructure(fullPath, content);
    }
  }
}

createStructure(baseDir, structure)
  .then(() => console.log('Structure créée avec succès !'))
  .catch((err) => console.error('Erreur lors de la création :', err));
