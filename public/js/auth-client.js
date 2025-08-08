export function init() {
  const authModal = document.getElementById('auth-modal');
  const closeModalBtn = document.getElementById('close-auth-modal');
  const authToggleBtns = document.querySelectorAll('.auth-toggle-btn');

  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  const loginBtn = loginForm.querySelector('button[type="submit"]');
  const registerBtn = registerForm.querySelector('button[type="submit"]');

  // Fonction générique pour afficher un message sous un champ
  function showFieldError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('input-error')) {
      error = document.createElement('div');
      error.className = 'input-error text-sm text-red-600 mt-1';
      input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = message;
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.input-error').forEach(e => e.remove());
  }

  // Message global (au-dessus des boutons)
  function showMessage(id, message, type = 'error') {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.remove('hidden');
    el.className = `text-sm text-center mt-2 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
    setTimeout(() => el.classList.add('hidden'), 5000);
  }

  // Afficher le modal
  function openAuthModal() {
    authModal.classList.remove('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }

  // Fermer le modal
  function closeAuthModal() {
    authModal.classList.add('hidden');
  }

  closeModalBtn?.addEventListener('click', closeAuthModal);
  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });

  document.getElementById('to-register')?.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  });

  document.getElementById('to-login')?.addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
    authToggleBtns.forEach((btn) => {
  if (res.ok && data.name) {
    btn.textContent = 'Mon compte';
    btn.onclick = () => {
      const dashboardModal = document.getElementById('user-dashboard-modal');
      if (dashboardModal) {
        dashboardModal.classList.remove('hidden');
        dashboardModal.classList.add('animate-fade-in');
      }
    };
  } else {
    btn.textContent = 'Me connecter';
    btn.onclick = openAuthModal;
  }
});

    } catch (err) {
      console.error('Erreur de session', err);
    }
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors(loginForm);

    const emailInput = loginForm.querySelector('#login-email');
    const passwordInput = loginForm.querySelector('#login-password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasError = false;

    if (!/\S+@\S+\.\S+/.test(email)) {
      showFieldError(emailInput, 'Email invalide');
      hasError = true;
    }

    if (!password) {
      showFieldError(passwordInput, 'Mot de passe requis');
      hasError = true;
    }

    if (hasError) return;

    loginBtn.disabled = true;
    loginBtn.innerText = 'Connexion...';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
     if (res.ok) {
  showMessage('login-message', 'Connexion réussie', 'success');
  setTimeout(() => {
    closeAuthModal();

    // ✅ Ouvrir le modal user-dashboard-modal
    const dashboardModal = document.getElementById('user-dashboard-modal');
    if (dashboardModal) {
      dashboardModal.classList.remove('hidden');
      dashboardModal.classList.add('animate-fade-in');
    }

  }, 800);
} else {
  showMessage('login-message', data.message || 'Erreur de connexion');
}

    } catch (err) {
      showMessage('login-message', 'Erreur réseau');
    } finally {
      loginBtn.disabled = false;
      loginBtn.innerText = 'Se connecter';
    }
  });

  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFieldErrors(registerForm);

    const nameInput = registerForm.querySelector('#register-name');
    const emailInput = registerForm.querySelector('#register-email');
    const phoneInput = registerForm.querySelector('#register-phone');
    const passInput = registerForm.querySelector('#register-password');
    const confirmInput = registerForm.querySelector('#register-confirm');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passInput.value;
    const confirm = confirmInput.value;

    let hasError = false;

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/.test(name.trim())) {
  showFieldError(nameInput, 'Nom invalide (lettres, accents et tirets uniquement)');
  hasError = true;
}


   if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) {
  showFieldError(emailInput, 'Email invalide ou contient des majuscules');
  hasError = true;
}


    if (
  !/^(\+229)?\d{8}$/.test(phone) &&
  !/^(\+33|0)[1-9]\d{8}$/.test(phone)
) {
  showFieldError(phoneInput, 'Téléphone invalide (FR ou BJ)');
  hasError = true;
}


   if (
  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)
) {
  showFieldError(passInput, 'Mot de passe trop faible (majuscule, minuscule, chiffre, spécial, min 8)');
  hasError = true;
}


    if (password !== confirm) {
  showFieldError(confirmInput, 'Les mots de passe ne correspondent pas');
  hasError = true;
}

    if (hasError) return;

    registerBtn.disabled = true;
    registerBtn.innerText = 'Inscription...';

   try {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  });

  const data = await res.json();

  if (res.ok) {
    showMessage('register-message', 'Inscription réussie. Veuillez vous connecter.', 'success');
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  } else {
    if (data.message) {
      if (/email/i.test(data.message)) {
        showFieldError(emailInput, data.message);
      }
      // Si message exact "Erreur serveur" on considère que c'est lié au téléphone
      else if (data.message === "Erreur serveur") {
        showFieldError(phoneInput, "Téléphone déjà utilisé ou invalide");
      } else {
        showMessage('register-message', data.message);
      }
    } else {
      showMessage('register-message', 'Erreur d’inscription');
    }
  }
} catch (err) {
  showMessage('register-message', 'Erreur réseau');
} finally {
  registerBtn.disabled = false;
  registerBtn.innerText = 'S\'inscrire';
}



  });

  checkSession();
}


// const toggleLoginPassword = document.getElementById('toggle-login-password');
// const loginPasswordField = document.getElementById('login-password');
// toggleLoginPassword.addEventListener('click', () => {
//   const isPasswordVisible = loginPasswordField.type === 'text';
//   loginPasswordField.type = isPasswordVisible ? 'password' : 'text';
//   toggleLoginPassword.classList.toggle('fa-lock', isPasswordVisible); // Icône verrouillée pour mot de passe masqué
//   toggleLoginPassword.classList.toggle('fa-unlock', !isPasswordVisible); // Icône déverrouillée pour mot de passe visible
// });

// // Toggle visibility for the register password
// const toggleRegisterPassword = document.getElementById('toggle-register-password');
// const registerPasswordField = document.getElementById('register-password');
// toggleRegisterPassword.addEventListener('click', () => {
//   const isPasswordVisible = registerPasswordField.type === 'text';
//   registerPasswordField.type = isPasswordVisible ? 'password' : 'text';
//   toggleRegisterPassword.classList.toggle('fa-lock', isPasswordVisible); // Icône verrouillée pour mot de passe masqué
//   toggleRegisterPassword.classList.toggle('fa-unlock', !isPasswordVisible); // Icône déverrouillée pour mot de passe visible
// });

// // Toggle visibility for the register confirm password
// const toggleRegisterConfirm = document.getElementById('toggle-register-confirm');
// const registerConfirmField = document.getElementById('register-confirm');
// toggleRegisterConfirm.addEventListener('click', () => {
//   const isPasswordVisible = registerConfirmField.type === 'text';
//   registerConfirmField.type = isPasswordVisible ? 'password' : 'text';
//   toggleRegisterConfirm.classList.toggle('fa-lock', isPasswordVisible); // Icône verrouillée pour mot de passe masqué
//   toggleRegisterConfirm.classList.toggle('fa-unlock', !isPasswordVisible); // Icône déverrouillée pour mot de passe visible
// });

window.togglePassword = togglePassword;

  function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  const eyes = button.querySelectorAll('.eye');

  const isVisible = input.type === 'text';
  input.type = isVisible ? 'password' : 'text';

  eyes.forEach(eye => eye.classList.toggle('hidden'));
}
