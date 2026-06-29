// gallery.js — masonry gallery with lightbox
(function () {
  'use strict';

  const gallery   = document.getElementById('gallery');
  const lightbox  = document.getElementById('lightbox');
  if (!gallery || !lightbox) return;

  const lbImg     = lightbox.querySelector('.lightbox__img');
  const lbClose   = lightbox.querySelector('.lightbox__close');
  const lbPrev    = lightbox.querySelector('.lightbox__arrow--prev');
  const lbNext    = lightbox.querySelector('.lightbox__arrow--next');
  const lbCounter = lightbox.querySelector('.lightbox__counter');
  const backdrop  = lightbox.querySelector('.lightbox__backdrop');

  let items   = [];
  let current = 0;

  function getItems() {
    return Array.from(gallery.querySelectorAll('.gallery-item img'));
  }

  function open(index) {
    items   = getItems();
    current = Math.max(0, Math.min(index, items.length - 1));
    render();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function render() {
    const img = items[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCounter.textContent = `${current + 1} / ${items.length}`;
    lbPrev.hidden = items.length <= 1;
    lbNext.hidden = items.length <= 1;
  }

  function prev() { current = (current - 1 + items.length) % items.length; render(); }
  function next() { current = (current + 1) % items.length; render(); }

  // Open lightbox on gallery item click
  gallery.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const img   = item.querySelector('img');
    if (!img)   return;
    const index = getItems().indexOf(img);
    open(index);
  });

  // Gallery keyboard a11y: Enter/Space on focused item
  gallery.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    e.preventDefault();
    const img   = item.querySelector('img');
    const index = getItems().indexOf(img);
    open(index);
  });

  // Make gallery items focusable
  gallery.querySelectorAll('.gallery-item').forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  lbClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')      { close(); }
    if (e.key === 'ArrowLeft')   { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight')  { e.preventDefault(); next(); }
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });
})();
