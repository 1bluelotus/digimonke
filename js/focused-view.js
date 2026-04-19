'use strict';

(function () {
  const overlay = document.createElement('div');
  overlay.id = 'focused-overlay';
  overlay.innerHTML =
    '<div id="focused-backdrop"></div>' +
    '<img id="focused-img" src="" alt="">';
  document.body.appendChild(overlay);

  const backdrop = document.getElementById('focused-backdrop');
  const img = document.getElementById('focused-img');

  window.openFocusedView = function (pieceId) {
    const piece = window.PIECES.find(p => p.id === pieceId);
    if (!piece) return;

    img.src = piece.image || '';
    img.alt = piece.label;
    overlay.classList.add('open');
  };

  window.closeFocusedView = function () {
    overlay.classList.remove('open');
  };

  backdrop.addEventListener('click', () => window.closeFocusedView());
  img.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      window.closeFocusedView();
    }
  });
})();
