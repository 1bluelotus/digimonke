'use strict';

(function () {
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m] = dateStr.split('-');
    return MONTHS[parseInt(m, 10) - 1] + ' ' + y;
  }

  /* ── Build overlay DOM ── */
  const overlay = document.createElement('div');
  overlay.id = 'focused-overlay';
  overlay.innerHTML =
    '<div id="focused-backdrop"></div>' +
    '<div id="focused-panel">' +
      '<div id="focused-image"><div id="focused-fill"></div></div>' +
      '<div id="focused-meta">' +
        '<h2 id="focused-title"></h2>' +
        '<div class="focused-field"><div class="focused-field-label">Date</div><div class="focused-field-value" id="focused-date"></div></div>' +
        '<div class="focused-field"><div class="focused-field-label">Medium</div><div class="focused-field-value" id="focused-medium"></div></div>' +
        '<div class="focused-field"><div class="focused-field-label">Inspiration</div><div class="focused-field-value" id="focused-inspiration"></div></div>' +
        '<div class="focused-field"><div class="focused-field-label">Description</div><div class="focused-field-value" id="focused-description"></div></div>' +
        '<button id="focused-close">Close</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  const backdrop = document.getElementById('focused-backdrop');
  const fill = document.getElementById('focused-fill');
  const title = document.getElementById('focused-title');
  const dateEl = document.getElementById('focused-date');
  const mediumEl = document.getElementById('focused-medium');
  const inspirationEl = document.getElementById('focused-inspiration');
  const descriptionEl = document.getElementById('focused-description');
  const closeBtn = document.getElementById('focused-close');

  function setField(el, value, fallback) {
    if (value) {
      el.textContent = value;
      el.classList.remove('empty');
    } else {
      el.textContent = fallback;
      el.classList.add('empty');
    }
  }

  window.openFocusedView = function (pieceId) {
    const piece = window.PIECES.find(p => p.id === pieceId);
    if (!piece) return;

    fill.style.background = piece.gradient;
    title.textContent = piece.label;
    setField(dateEl, formatDate(piece.date), 'TBD');
    setField(mediumEl, piece.medium, 'TBD');
    setField(inspirationEl, piece.inspiration, 'TBD');
    setField(descriptionEl, piece.description, 'No description yet.');

    overlay.classList.add('open');
  };

  window.closeFocusedView = function () {
    overlay.classList.remove('open');
  };

  backdrop.addEventListener('click', () => window.closeFocusedView());
  closeBtn.addEventListener('click', () => window.closeFocusedView());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      window.closeFocusedView();
    }
  });
})();
