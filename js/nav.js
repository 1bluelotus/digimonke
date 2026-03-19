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
})();
