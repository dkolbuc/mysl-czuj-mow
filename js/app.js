// app.js — core site functionality: nav, sticky header, back-to-top, active links
(function () {
  'use strict';

  function initSite() {
    initMobileNav();
    initStickyHeader();
    initBackToTop();
    setYearFooter();
    setActiveNavLink();
    initFaq();
  }

  // ── Mobile navigation ────────────────────────────────────────
  function initMobileNav() {
    const btn = document.getElementById('hamburgerBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;

    function syncDrawerTop() {
      const placeholder = document.getElementById('site-header-placeholder');
      if (placeholder) nav.style.top = placeholder.offsetHeight + 'px';
    }

    syncDrawerTop();
    window.addEventListener('resize', syncDrawerTop, { passive: true });

    function openNav() {
      nav.classList.add('open');
      nav.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      nav.querySelector('a')?.focus();
    }

    function closeNav() {
      nav.classList.remove('open');
      nav.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      btn.focus();
    }

    btn.addEventListener('click', () => {
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    // Close when a nav link is clicked
    nav.addEventListener('click', (e) => {
      if (e.target.matches('a')) closeNav();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !btn.contains(e.target) && !nav.contains(e.target)) {
        closeNav();
      }
    });
  }

  // ── Sticky header shadow on scroll ──────────────────────────
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const update = () => header.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ── Back to top button ───────────────────────────────────────
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 420);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Current year in footer ───────────────────────────────────
  function setYearFooter() {
    const el = document.getElementById('yearFooter');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ── Highlight active nav link ────────────────────────────────
  function setActiveNavLink() {
    // Use the resolved pathname so it works on GitHub Pages sub-paths too
    const currentPath = window.location.pathname.replace(/\/$/, '');

    document.querySelectorAll('.nav-link').forEach(link => {
      try {
        // link.href is the fully resolved absolute URL — use its pathname
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '');

        const currentIsHome = /\/index\.html$/.test(currentPath) || currentPath === '';
        const linkIsHome    = /\/index\.html$/.test(linkPath)    || linkPath === '';

        const isHome  = currentIsHome && linkIsHome;
        const isMatch = !linkIsHome && currentPath === linkPath;

        if (isHome || isMatch) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      } catch (_) {}
    });
  }

  // ── FAQ accordion ────────────────────────────────────────────
  function initFaq() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panel) return;

        // Collapse all others
        document.querySelectorAll('.faq-question').forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const op = document.getElementById(other.getAttribute('aria-controls'));
            if (op) op.classList.remove('open');
          }
        });

        // Toggle this one
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.classList.toggle('open', !expanded);
      });
    });
  }

  // ── Bootstrap ───────────────────────────────────────────────
  // Called by include-partials.js after DOM injection
  window.initSiteAfterPartials = initSite;

  // Fallback: if no partials placeholder exists (e.g. standalone page), run immediately
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('#site-header-placeholder')) initSite();
  });
})();