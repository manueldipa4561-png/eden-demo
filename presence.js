// Load the optional interaction layer after the core visual CSS.
// Keeping it separate makes the enhancement easy to disable without affecting layout.
if (!document.querySelector('link[href="interaction-polish.css"]')) {
  const interactionStyles = document.createElement('link');
  interactionStyles.rel = 'stylesheet';
  interactionStyles.href = 'interaction-polish.css';
  document.head.appendChild(interactionStyles);
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');
const backgroundRegions = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

let lastInputWasKeyboard = false;
let menuCloseTimer = 0;

document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') lastInputWasKeyboard = true;
}, { passive: true });

document.addEventListener('pointerdown', () => {
  lastInputWasKeyboard = false;
}, { passive: true });

function setBackgroundInert(isOpen) {
  backgroundRegions.forEach((region) => {
    if (isOpen) region.setAttribute('inert', '');
    else region.removeAttribute('inert');
  });
}

function finishMenuClose() {
  if (!menu) return;
  menu.hidden = true;
  menu.classList.remove('is-closing');
}

function setMenu(isOpen, { returnFocus = false } = {}) {
  if (!toggle || !menu) return;

  window.clearTimeout(menuCloseTimer);
  toggle.classList.toggle('active', isOpen);
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
  document.body.classList.toggle('menu-open', isOpen);
  setBackgroundInert(isOpen);

  if (isOpen) {
    menu.hidden = false;
    menu.classList.remove('is-closing');

    requestAnimationFrame(() => {
      menu.classList.add('is-open');
      if (lastInputWasKeyboard) menu.querySelector('a')?.focus();
    });
    return;
  }

  menu.classList.remove('is-open');

  if (reducedMotion) {
    finishMenuClose();
  } else {
    menu.classList.add('is-closing');
    menuCloseTimer = window.setTimeout(finishMenuClose, 160);
  }

  if (returnFocus && lastInputWasKeyboard) toggle.focus();
}

if (toggle && menu) {
  toggle.addEventListener('click', () => setMenu(menu.hidden || !menu.classList.contains('is-open')));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      setMenu(false, { returnFocus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050 && !menu.hidden) setMenu(false);
  }, { passive: true });
}

// Give touch users immediate physical feedback on genuinely interactive controls only.
// Using Pointer Events avoids touch-specific duplicate click handling.
if (coarsePointer) {
  const pressTargets = document.querySelectorAll(
    '.button, .header-cta, .menu-toggle, .mobile-menu a, .hero-conversion-row a, .visit-meta a, .location-card, .site-footer a'
  );

  const release = (element) => element.classList.remove('is-pressed');

  pressTargets.forEach((element) => {
    element.addEventListener('pointerdown', () => element.classList.add('is-pressed'), { passive: true });
    element.addEventListener('pointerup', () => release(element), { passive: true });
    element.addEventListener('pointercancel', () => release(element), { passive: true });
    element.addEventListener('pointerleave', () => release(element), { passive: true });
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

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

// Keep desktop visitors oriented without adding another visible UI element.
// aria-current="location" is updated together with the underline state.
const desktopNavLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
const trackedSections = desktopNavLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (desktopNavLinks.length && trackedSections.length) {
  let activeSectionId = '';
  let ticking = false;

  const updateActiveSection = () => {
    const marker = Math.min(window.innerHeight * 0.32, 240);
    let nextId = trackedSections[0].id;

    trackedSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= marker) nextId = section.id;
    });

    if (nextId !== activeSectionId) {
      activeSectionId = nextId;
      desktopNavLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${activeSectionId}`;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    ticking = false;
  };

  const requestActiveSectionUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateActiveSection);
  };

  updateActiveSection();
  window.addEventListener('scroll', requestActiveSectionUpdate, { passive: true });
  window.addEventListener('resize', requestActiveSectionUpdate, { passive: true });
}

// Fine-pointer only: tiny image drift makes the hero feel responsive without turning it into a gimmick.
// It never runs on touch devices and respects reduced-motion preferences.
const heroCard = document.querySelector('.hero-card');

if (heroCard && finePointer && !reducedMotion) {
  let frame = 0;
  let nextX = 0;
  let nextY = 0;

  const applyHeroDrift = () => {
    heroCard.style.setProperty('--hero-media-x', `${nextX.toFixed(2)}px`);
    heroCard.style.setProperty('--hero-media-y', `${nextY.toFixed(2)}px`);
    frame = 0;
  };

  heroCard.addEventListener('pointermove', (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    nextX = x * 7;
    nextY = y * 5;

    if (!frame) frame = requestAnimationFrame(applyHeroDrift);
  }, { passive: true });

  heroCard.addEventListener('pointerleave', () => {
    nextX = 0;
    nextY = 0;
    if (!frame) frame = requestAnimationFrame(applyHeroDrift);
  }, { passive: true });
}
