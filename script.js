const mobileHeroTuning = document.createElement('link');
mobileHeroTuning.rel = 'stylesheet';
mobileHeroTuning.href = 'hero-mobile-tuning.css';
document.head.appendChild(mobileHeroTuning);

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const menuLinks = document.querySelectorAll('.mobile-menu a');
const reveals = document.querySelectorAll('.reveal');

const setMenu = (open) => {
  menuToggle.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
};

menuToggle?.addEventListener('click', () => {
  setMenu(!mobileMenu.classList.contains('open'));
});

menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const handleHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 28);
};

handleHeader();
window.addEventListener('scroll', handleHeader, { passive: true });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

// Subtle pointer depth on the hero artwork for devices with a fine pointer.
const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');

if (window.matchMedia('(pointer:fine)').matches && hero && heroVisual) {
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform = `translate3d(${x * 10}px, ${y * 8}px, 0)`;
  });

  hero.addEventListener('pointerleave', () => {
    heroVisual.style.transform = 'translate3d(0,0,0)';
  });
}