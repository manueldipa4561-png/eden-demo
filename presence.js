const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.mobile-menu');
const header = document.querySelector('.site-header');
const pageRegions = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

const conceptAssets = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_3JN4lq7KBj4c3qEQUgSkbrftgrd/hf_20260916_033526_774140c1-2d47-47a0-85df-9016b46a8376_min.webp',
  aperitivo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3JN4lq7KBj4c3qEQUgSkbrftgrd/hf_20260916_033526_632c054c-0f1f-443c-a593-0047ae0db428_min.webp',
  mixology: 'https://d8j0ntlcm91z4.cloudfront.net/user_3JN4lq7KBj4c3qEQUgSkbrftgrd/hf_20260916_033527_e654698d-63de-4032-b937-a3362b3835ee_min.webp',
  atmosphere: 'https://d8j0ntlcm91z4.cloudfront.net/user_3JN4lq7KBj4c3qEQUgSkbrftgrd/hf_20260916_033526_96f90932-8653-4814-a7c5-5a631523db85_min.webp',
};

function installPresenzaArtDirection() {
  if (!document.querySelector('link[data-eden-presenza]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'presenza-redesign.css';
    link.dataset.edenPresenza = 'true';
    document.head.appendChild(link);
  }

  const replaceConcept = (selector, src, alt = '') => {
    const image = document.querySelector(selector);
    if (!image) return;
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.removeAttribute('data-fallback');
    image.src = src;
    image.alt = alt;
    image.dataset.conceptImage = 'higgsfield';
  };

  replaceConcept('.hero-photo-layer img', conceptAssets.atmosphere, '');
  replaceConcept('.hero-photo-card img', conceptAssets.hero, 'Concept editoriale generato per la demo Eden; non raffigura necessariamente il locale reale');
  replaceConcept('.aperitivo-photo img', conceptAssets.aperitivo, 'Concept editoriale di aperitivo generato per la demo Eden; non raffigura necessariamente il locale reale');
  replaceConcept('.atmosphere-shot-main img', conceptAssets.atmosphere, 'Concept editoriale di atmosfera generato per la demo Eden; non raffigura necessariamente il locale reale');

  const mixology = document.querySelector('.mixology');
  if (mixology) mixology.style.setProperty('--eden-mixology-concept', `url("${conceptAssets.mixology}")`);

  const credit = document.querySelector('.photo-credit');
  if (credit) {
    credit.innerHTML = '<span>Concept imagery: Higgsfield — generata per questa demo e non presentata come fotografia reale di Eden.</span><span>Immagini reali / collegate a Eden: Coffeeland e Food News Italia, collaborazione Mercato del Pane 2025.</span>';
  }
}

installPresenzaArtDirection();

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
