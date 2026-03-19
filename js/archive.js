'use strict';

(function () {
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const WIDE_THRESHOLD = 2.0;

  function formatDate(dateStr) {
    const [y, m] = dateStr.split('-');
    return MONTHS[parseInt(m, 10) - 1] + ' ' + y;
  }

  /* ── Group pieces by date (newest first) ── */
  const groups = new Map();
  window.PIECES.forEach(p => {
    const key = p.date || '0000-00';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  });

  const sortedKeys = [...groups.keys()].sort().reverse();

  /* ── Render into #archive-scroll ── */
  const container = document.getElementById('archive-scroll');

  sortedKeys.forEach(key => {
    const pieces = groups.get(key);
    const section = document.createElement('section');
    section.className = 'archive-section';

    const sep = document.createElement('div');
    sep.className = 'archive-separator';
    sep.textContent = formatDate(key);
    section.appendChild(sep);

    const grid = document.createElement('div');
    grid.className = 'archive-grid';

    pieces.forEach(p => {
      const card = document.createElement('div');
      card.className = 'archive-card';
      card.dataset.piece = p.id;

      const ratio = p.ar.w / p.ar.h;
      card.style.aspectRatio = p.ar.w + ' / ' + p.ar.h;

      if (ratio >= WIDE_THRESHOLD) {
        card.classList.add('wide');
        card.style.aspectRatio = Math.max(p.ar.w, 3) + ' / ' + Math.min(p.ar.h, 1.2);
      }

      const fill = document.createElement('div');
      fill.className = 'archive-card-fill';
      fill.style.background = p.gradient;

      const label = document.createElement('div');
      label.className = 'archive-card-label';
      label.textContent = p.label;

      card.appendChild(fill);
      card.appendChild(label);
      grid.appendChild(card);

      card.addEventListener('click', () => {
        window.openFocusedView(p.id);
      });
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
})();
