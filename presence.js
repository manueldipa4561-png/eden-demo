const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');
const backgroundRegions = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

function setBackgroundInert(isOpen) {
  backgroundRegions.forEach((region) => {
    if (isOpen) region.setAttribute('inert', '');
    else region.removeAttribute('inert');
  });
}

function setMenu(isOpen) {
  if (!toggle || !menu) return;

  menu.hidden = !isOpen;
  toggle.classList.toggle('active', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
  document.body.classList.toggle('menu-open', isOpen);
  setBackgroundInert(isOpen);

  if (isOpen) {
    requestAnimationFrame(() => menu.querySelector('a')?.focus());
  }
}

if (toggle && menu) {
  toggle.addEventListener('click', () => setMenu(menu.hidden));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050 && !menu.hidden) setMenu(false);
  }, { passive: true });
}

if (header) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  reveals.forEach((item) => observer.observe(item));
}
