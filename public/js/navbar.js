export function init() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  const openModalBtnDesktop = document.getElementById('openModalBtn');
  const openModalBtnMobile = document.getElementById('openModalBtnMobile');

  // Gestion du menu mobile (toggle)
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Fonction d'ouverture de la modale de réservation
  const handleOpenModal = () => {
    const modal = document.getElementById('modal');
    const formMessage = document.getElementById('formMessage');
    const appointmentForm = document.getElementById('appointmentForm');

    if (modal) {
      modal.classList.remove('hidden');
    }

    if (formMessage) {
      formMessage.textContent = '';
    }

    if (appointmentForm) {
      appointmentForm.reset();
    }

    // Fixer la date minimale à aujourd'hui sur le champ date
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  };

  if (openModalBtnDesktop) {
    openModalBtnDesktop.addEventListener('click', handleOpenModal);
  }

  if (openModalBtnMobile) {
    openModalBtnMobile.addEventListener('click', () => {
      // Fermer menu mobile si ouvert avant d'ouvrir modale
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
      handleOpenModal();
    });
  }

    // Gestion de la modale d'authentification
  const authModal = document.getElementById('auth-modal');
  const authToggleBtns = document.querySelectorAll('.auth-toggle-btn');
  const closeAuthBtn = document.getElementById('close-auth-modal');

  if (authModal) {
    authToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        authModal.classList.remove('hidden');
      });
    });

    if (closeAuthBtn) {
      closeAuthBtn.addEventListener('click', () => {
        authModal.classList.add('hidden');
      });
    }
  }



  
}
