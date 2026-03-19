'use strict';

(function () {
  /* ── Active page highlighting ── */
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('#nav a[data-page]').forEach(a => {
    if (a.dataset.page === filename) {
      a.classList.add('active');
    }
  });

  /* ── Socials flyout toggle ── */
  const toggle = document.getElementById('socials-toggle');
  const flyout = document.getElementById('socials-flyout');
  if (toggle && flyout) {
    toggle.addEventListener('click', e => {
      e.preventDefault();
      flyout.classList.toggle('open');
    });
  }
})();
