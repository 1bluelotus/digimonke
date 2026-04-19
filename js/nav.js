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

  /* ── Day/Night theme toggle ── */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDay = document.documentElement.classList.toggle('day');
      localStorage.setItem('theme', isDay ? 'day' : 'night');
    });
  }

  /* ── Cat toggle ── */
  const catToggle = document.getElementById('cat-toggle');
  if (catToggle) {
    catToggle.addEventListener('click', () => {
      const isActive = document.documentElement.classList.toggle('cat-active');
      localStorage.setItem('cat', isActive ? 'on' : 'off');
    });
  }

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
    new ResizeObserver(updateFooterPos).observe(panel);
  }
})();
