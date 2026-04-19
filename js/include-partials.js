// include-partials.js — inject shared header and footer into every page
(async function () {
  'use strict';

  // Compute the relative path from the current page to the site root.
  // Pages under /pages/ need '../', everything else (root) needs './'
  function getSiteRoot() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
  }

  const root = getSiteRoot();

  // After injecting HTML, rewrite all absolute /path links to relative ones
  function fixLinks(container) {
    container.querySelectorAll('[href^="/"]').forEach(el => {
      el.setAttribute('href', root + el.getAttribute('href').slice(1));
    });
    container.querySelectorAll('[src^="/"]').forEach(el => {
      el.setAttribute('src', root + el.getAttribute('src').slice(1));
    });
  }

  async function loadPartial(url, placeholderSelector) {
    const placeholder = document.querySelector(placeholderSelector);
    if (!placeholder) return false;

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      placeholder.innerHTML = await res.text();
      fixLinks(placeholder);
      return true;
    } catch (err) {
      console.warn(`[partials] Could not load ${url}:`, err.message);
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      loadPartial(root + 'partials/header.html', '#site-header-placeholder'),
      loadPartial(root + 'partials/footer.html', '#site-footer-placeholder'),
    ]);

    // Initialise site JS that depends on the injected DOM
    if (typeof window.initSiteAfterPartials === 'function') {
      window.initSiteAfterPartials();
    }

    // Signal other modules (ui.js, forms.js) that partials are ready
    window.dispatchEvent(new CustomEvent('partials:loaded'));
  });
})();
