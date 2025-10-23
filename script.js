const demoLoginButton = document.getElementById('demo-login');
const toast = document.querySelector('.toast');
const scrollButtons = document.querySelectorAll('[data-scroll]');

scrollButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const target = event.currentTarget.getAttribute('data-scroll');
    const targetEl = document.querySelector(target);

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      showToast(`Navegando a ${target}`);
    }
  });
});

if (demoLoginButton) {
  demoLoginButton.addEventListener('click', () => {
    if (demoLoginButton.classList.contains('is-running')) return;

    const originalText = demoLoginButton.textContent;
    demoLoginButton.classList.add('is-running');
    demoLoginButton.textContent = 'Encrypting credentials…';

    setTimeout(() => {
      demoLoginButton.textContent = 'Handshake OK ✓';
    }, 1400);

    setTimeout(() => {
      demoLoginButton.classList.add('success');
      demoLoginButton.textContent = 'Acceso concedido';
      showToast('Animación de login completada');
    }, 2400);

    setTimeout(() => {
      demoLoginButton.classList.remove('is-running', 'success');
      demoLoginButton.textContent = originalText;
    }, 5000);
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// tilt effect for cards
const tiles = document.querySelectorAll('.tile, .map-card, .experience-item');
tiles.forEach((tile) => {
  tile.addEventListener('pointermove', (event) => {
    const bounds = tile.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    tile.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tile.addEventListener('pointerleave', () => {
    tile.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
  });
});

// intersection observer for reveal animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll('.section, .hero-card').forEach((section) => {
  observer.observe(section);
});
