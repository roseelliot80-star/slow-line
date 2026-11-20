(() => {
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('#mobile-nav');
  const toggle = document.querySelector('#menu-toggle');
  const closeButton = document.querySelector('#menu-close');
  const backdrop = document.querySelector('#menu-backdrop');

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const setMenu = (open, returnFocus = false) => {
    if (!menu || !toggle || !backdrop) return;
    menu.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      const firstLink = menu.querySelector('a');
      window.setTimeout(() => firstLink?.focus(), 60);
    } else if (returnFocus) {
      toggle.focus();
    }
  };

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  closeButton?.addEventListener('click', () => setMenu(false, true));
  backdrop?.addEventListener('click', () => setMenu(false, true));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false, true);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && menu?.classList.contains('is-open')) setMenu(false);
  });

  const mainImage = document.querySelector('#product-main-image');
  const thumbnails = [...document.querySelectorAll('.product-thumbnail')];
  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
      if (!mainImage || thumbnail.getAttribute('aria-pressed') === 'true') return;
      thumbnails.forEach((item) => item.setAttribute('aria-pressed', 'false'));
      thumbnail.setAttribute('aria-pressed', 'true');
      mainImage.classList.add('is-changing');
      const nextSource = thumbnail.dataset.full;
      const nextAlt = thumbnail.dataset.alt || '';
      const preload = new Image();
      preload.src = nextSource;
      const commit = () => {
        mainImage.src = nextSource;
        mainImage.alt = nextAlt;
        mainImage.classList.remove('is-changing');
      };
      if (preload.complete) commit();
      else {
        preload.addEventListener('load', commit, { once: true });
        preload.addEventListener('error', commit, { once: true });
      }
    });
  });
})();
