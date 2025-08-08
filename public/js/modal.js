export function initModal() {
  const modal = document.getElementById('modal');
  const openButtons = [
    document.getElementById('openModalBtn'),
    document.getElementById('openModalBtnMobile'),
    document.getElementById('openModalBtnHero')
  ];
  const closeBtn = document.getElementById('closeModalBtn');

  openButtons.forEach(btn => {
    btn?.addEventListener('click', () => {
      modal.classList.remove('hidden');
      const dateInput = document.getElementById('appointmentDate');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
      }
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}
