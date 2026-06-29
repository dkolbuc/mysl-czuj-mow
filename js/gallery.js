// gallery.js — justified grid (Google Photos style) + lightbox
(function () {
  'use strict';

  const gallery  = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  if (!gallery || !lightbox) return;

  // ── Justified grid ────────────────────────────────────────────
  // Algorithm: group images into rows at a target height so each
  // row fills the full container width. Box dimensions match the
  // image's natural aspect ratio → object-fit: cover shows the
  // full image with no cropping.

  const GAP = 6; // px, must match CSS gap

  function targetRowHeight() {
    const w = gallery.clientWidth;
    if (w < 480) return 180;
    if (w < 768) return 220;
    return 260;
  }

  function justify() {
    const items = Array.from(gallery.querySelectorAll('.gallery-item'));
    if (!items.length) return;

    const containerWidth = gallery.clientWidth;
    const rowH = targetRowHeight();

    let row = [];       // { item, ratio }
    let ratioSum = 0;

    function flushRow(isFinalRow) {
      if (!row.length) return;
      const gaps = (row.length - 1) * GAP;

      let height;
      // Last incomplete row: keep target height (don't stretch)
      if (isFinalRow && ratioSum * rowH + gaps < containerWidth) {
        height = rowH;
      } else {
        height = (containerWidth - gaps) / ratioSum;
        // Clamp so a single very-wide image doesn't become tiny
        height = Math.min(height, rowH * 1.6);
      }

      row.forEach(function (r) {
        r.item.style.flexBasis = (height * r.ratio) + 'px';
        r.item.style.flexGrow  = '0';
        r.item.style.height    = height + 'px';
      });

      row = [];
      ratioSum = 0;
    }

    items.forEach(function (item, i) {
      const img   = item.querySelector('img');
      const ratio = (img.naturalWidth && img.naturalHeight)
        ? img.naturalWidth / img.naturalHeight
        : 4 / 3; // fallback while image loads

      row.push({ item, ratio });
      ratioSum += ratio;

      const gaps    = (row.length - 1) * GAP;
      const rowFull = (ratioSum * rowH + gaps) >= containerWidth;
      const isLast  = i === items.length - 1;

      if (rowFull || isLast) {
        flushRow(isLast && !rowFull);
      }
    });
  }

  // Run after every image loads (handles lazy-loaded images too)
  function initGallery() {
    const imgs = Array.from(gallery.querySelectorAll('.gallery-item img'));
    let loaded = 0;

    function onLoad() {
      loaded++;
      justify(); // re-justify incrementally as images arrive
      if (loaded === imgs.length) {
        justify(); // final pass for precision
      }
    }

    imgs.forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        onLoad();
      } else {
        img.addEventListener('load',  onLoad);
        img.addEventListener('error', onLoad); // skip broken images
      }
    });

    // Initial layout with fallback ratios
    justify();
  }

  // Re-justify on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(justify, 120);
  });

  initGallery();

  // ── Lightbox ──────────────────────────────────────────────────
  const lbImg     = lightbox.querySelector('.lightbox__img');
  const lbClose   = lightbox.querySelector('.lightbox__close');
  const lbPrev    = lightbox.querySelector('.lightbox__arrow--prev');
  const lbNext    = lightbox.querySelector('.lightbox__arrow--next');
  const lbCounter = lightbox.querySelector('.lightbox__counter');
  const backdrop  = lightbox.querySelector('.lightbox__backdrop');

  let items   = [];
  let current = 0;

  function getImgs() {
    return Array.from(gallery.querySelectorAll('.gallery-item img'));
  }

  function open(index) {
    items   = getImgs();
    current = Math.max(0, Math.min(index, items.length - 1));
    render();
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lbClose.focus({ preventScroll: true });
  }

  function close() {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function render() {
    const img = items[current];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCounter.textContent = (current + 1) + ' / ' + items.length;
    lbPrev.hidden = items.length <= 1;
    lbNext.hidden = items.length <= 1;
  }

  function prev() { current = (current - 1 + items.length) % items.length; render(); }
  function next() { current = (current + 1)                % items.length; render(); }

  gallery.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const img   = item.querySelector('img');
    if (!img)   return;
    open(getImgs().indexOf(img));
  });

  // Keyboard a11y on gallery items
  gallery.querySelectorAll('.gallery-item').forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const img = item.querySelector('img');
      open(getImgs().indexOf(img));
    });
  });

  lbClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);

  document.addEventListener('keydown', function (e) {
    if (lightbox.hasAttribute('hidden')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  // Touch swipe in lightbox
  let touchX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
  }, { passive: true });
})();
