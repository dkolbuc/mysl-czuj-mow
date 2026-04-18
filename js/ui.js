// ui.js — scroll-reveal animations using IntersectionObserver
(function () {
  'use strict';

  function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length || !('IntersectionObserver' in window)) {
      // Fallback: just make everything visible
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // Run after partials are loaded and on plain DOMContentLoaded
  window.addEventListener('partials:loaded', initReveal);
  document.addEventListener('DOMContentLoaded', () => {
    // Small delay so partials have time to inject
    setTimeout(initReveal, 120);
  });
})();
