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

  /* ── Position footer below chrome panel ── */
  const panel = document.getElementById('chrome-panel');
  const footer = document.getElementById('footer');
  if (panel && footer) {
    function updateFooterPos() {
      const rect = panel.getBoundingClientRect();
      footer.style.top = (rect.bottom + 10) + 'px';
    }
    updateFooterPos();
    window.addEventListener('resize', updateFooterPos);
    const observer = new MutationObserver(updateFooterPos);
    observer.observe(panel, { childList: true, subtree: true, attributes: true });
  }
})();
