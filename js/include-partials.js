// include-partials.js — inject shared header and footer into every page
(async function () {
  'use strict';

  async function loadPartial(url, placeholderSelector) {
    const placeholder = document.querySelector(placeholderSelector);
    if (!placeholder) return false;

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      placeholder.innerHTML = await res.text();
      return true;
    } catch (err) {
      console.warn(`[partials] Could not load ${url}:`, err.message);
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      loadPartial('/partials/header.html', '#site-header-placeholder'),
      loadPartial('/partials/footer.html', '#site-footer-placeholder'),
    ]);

    // Initialise site JS that depends on the injected DOM
    if (typeof window.initSiteAfterPartials === 'function') {
      window.initSiteAfterPartials();
    }

    // Signal other modules (ui.js, forms.js) that partials are ready
    window.dispatchEvent(new CustomEvent('partials:loaded'));
  });
})();
