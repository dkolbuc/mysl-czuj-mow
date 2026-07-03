// forms.js — contact form validation and simulated submission
(function () {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successBox = document.getElementById('formSuccess');

    // Live error clearing
    form.querySelectorAll('.input, .textarea, .select').forEach(field => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) return;
      submitForm(form, successBox);
    });
  }

  function validate(form) {
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) { showError(field, 'Zgoda jest wymagana.'); valid = false; }
        else clearError(field);
      } else if (!field.value.trim()) {
        showError(field, 'To pole jest wymagane.');
        valid = false;
      } else if (field.type === 'email') {
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!emailOk) { showError(field, 'Podaj poprawny adres e-mail.'); valid = false; }
        else clearError(field);
      } else {
        clearError(field);
      }
    });

    return valid;
  }

  function showError(field, msg) {
    field.style.borderColor = 'var(--error)';
    const group = field.closest('.form-group') || field.closest('.checkbox-wrap')?.parentElement;
    if (!group) return;
    let err = group.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'font-size:0.8rem;color:var(--error);margin-top:0.25rem;display:block';
      group.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(field) {
    field.style.borderColor = '';
    const group = field.closest('.form-group') || field.closest('.checkbox-wrap')?.parentElement;
    group?.querySelector('.field-error')?.remove();
  }

  function submitForm(form, successBox) {
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = 'Wysyłanie…'; }

    fetch('https://formspree.io/f/xwvdalkg', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        form.style.display = 'none';
        if (successBox) {
          successBox.classList.add('visible');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      })
      .catch(() => {
        if (btn) { btn.disabled = false; btn.textContent = 'Wyślij wiadomość'; }
        alert('Wystąpił błąd podczas wysyłania. Spróbuj ponownie lub skontaktuj się przez SMS.');
      });
  }

  window.addEventListener('partials:loaded', initContactForm);
  document.addEventListener('DOMContentLoaded', initContactForm);
})();
