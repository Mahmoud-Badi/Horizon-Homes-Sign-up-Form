(function () {
  const form = document.getElementById('signup-form');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const notification = document.getElementById('success-notification');

  // show check when field is valid
  function updateFieldValidity(input) {
    const wrap = input.closest('.input-wrap');
    if (!wrap) return;

    let valid = false;
    if (input === confirmPassword) {
      valid = confirmPassword.value.length >= 8 && confirmPassword.value === password.value;
      confirmPassword.setCustomValidity(valid ? '' : 'Passwords do not match');
    } else {
      valid = input.validity.valid && (input.value.trim() !== '' || input.type === 'datetime-local' || input.tagName === 'SELECT');
      if (input.type === 'datetime-local' && !input.value) valid = false;
      if (input.tagName === 'SELECT' && !input.value) valid = false;
    }

    wrap.classList.toggle('is-valid', valid);
  }

  // mark field as touched on blur so we only show red border after interaction
  function markTouched(input) {
    input.classList.add('touched');
  }

  // attach input/blur/change listeners to all form inputs
  form.querySelectorAll('.form-input').forEach(function (input) {
    input.addEventListener('input', function () {
      updateFieldValidity(input);
      if (input === password) updateFieldValidity(confirmPassword);
    });
    input.addEventListener('blur', function () {
      markTouched(input);
      updateFieldValidity(input);
    });
    input.addEventListener('change', function () {
      updateFieldValidity(input);
    });
  });

  // confirm password: clear custom validity on input
  confirmPassword.addEventListener('input', function () {
    this.setCustomValidity('');
    updateFieldValidity(this);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('Passwords do not match');
      confirmPassword.reportValidity();
      return;
    }
    confirmPassword.setCustomValidity('');

    if (!form.checkValidity()) {
      form.querySelectorAll('.form-input').forEach(markTouched);
      form.reportValidity();
      return;
    }

    // show notification
    notification.hidden = false;
    notification.classList.add('is-visible');

    // reset form, remove check states and touched so red borders don't show on next fill
    form.reset();
    form.querySelectorAll('.input-wrap').forEach(function (wrap) {
      wrap.classList.remove('is-valid');
    });
    form.querySelectorAll('.form-input').forEach(function (input) {
      input.classList.remove('touched');
    });

    // hide notification after 5 seconds
    setTimeout(function () {
      notification.classList.remove('is-visible');
      setTimeout(function () {
        notification.hidden = true;
      }, 300);
    }, 5000);
  });
})();
