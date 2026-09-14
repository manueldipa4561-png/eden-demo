const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');
const pageRegions = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

function setBackgroundInert(isOpen) {
  pageRegions.forEach((region) => {
    if (isOpen) region.setAttribute('inert', '');
    else region.removeAttribute('inert');
  });
}

function setMenu(isOpen) {
  if (!toggle || !menu) return;

  menu.hidden = !isOpen;
  menu.classList.toggle('open', isOpen);
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
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

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
