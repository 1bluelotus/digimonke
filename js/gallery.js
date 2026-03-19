'use strict';

/* ── Piece data ── */
const PIECES = window.GALLERY_PIECES || [
  {
    label: 'Reverie I',
    gradient: 'radial-gradient(ellipse at 30% 40%, #c45c3a 0%, #7a1c10 55%, #1a0808 100%)',
    ar: { w: 1, h: 1 },
  },
  {
    label: 'Coastal Memory',
    gradient: 'linear-gradient(170deg, #0a1528 0%, #1a4a8b 40%, #3a80c0 70%, #88c8e8 100%)',
    ar: { w: 16, h: 9 },
  },
  {
    label: 'Figure Study',
    gradient: 'linear-gradient(180deg, #0e1a0e 0%, #2a6a30 45%, #60b060 78%, #a8d890 100%)',
    ar: { w: 2, h: 3 },
  },
  {
    label: 'Ether',
    gradient: 'radial-gradient(ellipse at 60% 35%, #d480d4 0%, #7a28a0 45%, #280845 100%)',
    ar: { w: 4, h: 3 },
  },
  {
    label: 'Threshold',
    gradient: 'linear-gradient(210deg, #f0d070 0%, #c09020 40%, #5c3a08 75%, #180e00 100%)',
    ar: { w: 3, h: 4 },
  },
  {
    label: 'Horizon Line',
    gradient: 'linear-gradient(180deg, #06141e 0%, #0e4060 35%, #1a8090 60%, #70d8d8 100%)',
    ar: { w: 21, h: 9 },
  },
  {
    label: 'Warmth',
    gradient: 'radial-gradient(ellipse at 40% 55%, #f0a060 0%, #c04020 45%, #400808 100%)',
    ar: { w: 3, h: 2 },
  },
  {
    label: 'Ascent',
    gradient: 'linear-gradient(175deg, #0a061e 0%, #4a28b0 50%, #9070f0 80%, #d0b8ff 100%)',
    ar: { w: 5, h: 7 },
  },
  {
    label: 'Blush Study',
    gradient: 'radial-gradient(ellipse at 45% 40%, #f0b0c8 0%, #c83870 40%, #580828 80%, #120208 100%)',
    ar: { w: 1, h: 1.4 },
  },
  {
    label: 'Stillness',
    gradient: 'radial-gradient(ellipse at 50% 50%, #b0c8d8 0%, #4a6878 40%, #1a2830 75%, #080e12 100%)',
    ar: { w: 3, h: 2 },
  },
];

/* ── Constants ── */
const THUMB_R   = 58;
const EXP_MAX_W = 380;
const EXP_MAX_H = 420;
const SPREAD_MARGIN = 26;

/* ── State ── */
let activeBubble = null;

/* ── Bubble class ── */
class Bubble {
  constructor(data) {
    this.data = data;

    const { w, h } = data.ar;
    if (w / h >= 1) {
      this.expW = Math.min(EXP_MAX_W, window.innerWidth * 0.38);
      this.expH = this.expW * (h / w);
    } else {
      this.expH = Math.min(EXP_MAX_H, window.innerHeight * 0.50);
      this.expW = this.expH * (w / h);
    }
    this.expW = Math.min(this.expW, window.innerWidth * 0.7);
    this.expH = Math.min(this.expH, window.innerHeight * 0.7);

    this.cx = THUMB_R + 40 + Math.random() * (window.innerWidth  - (THUMB_R + 40) * 2);
    this.cy = THUMB_R + 70 + Math.random() * (window.innerHeight - (THUMB_R + 70) * 2);
    this.baseCx = this.cx;
    this.baseCy = this.cy;

    this.phaseX    = Math.random() * Math.PI * 2;
    this.phaseY    = Math.random() * Math.PI * 2;
    this.speedX    = 0.00025 + Math.random() * 0.00025;
    this.speedY    = this.speedX * (0.6 + Math.random() * 0.5);
    this.ampX      = 4 + Math.random() * 6;
    this.ampY      = 3 + Math.random() * 5;

    this.pushX = 0;
    this.pushY = 0;
    this.collOffX = 0;
    this.collOffY = 0;

    this.hovered     = false;
    this.locked      = false;
    this.expandReady = false;

    this._build();
  }

  _build() {
    const anchor = document.createElement('div');
    anchor.className = 'bubble-anchor';

    const bub = document.createElement('div');
    bub.className = 'bubble';
    bub.style.width  = THUMB_R * 2 + 'px';
    bub.style.height = THUMB_R * 2 + 'px';

    const fill = document.createElement('div');
    fill.className = 'bubble-fill';
    fill.style.background = this.data.gradient;

    const label = document.createElement('div');
    label.className = 'bubble-label';
    label.textContent = this.data.label;

    const dot = document.createElement('div');
    dot.className = 'bubble-lock-dot';

    bub.appendChild(fill);
    bub.appendChild(label);
    bub.appendChild(dot);
    anchor.appendChild(bub);

    this.anchorEl = anchor;
    this.bubbleEl = bub;

    bub.addEventListener('mouseenter', () => this._onEnter());
    bub.addEventListener('mouseleave', () => this._onLeave());
    bub.addEventListener('click',      () => this._onClick());
    bub.addEventListener('transitionend', e => {
      if (e.propertyName === 'width' && this.hovered && !this.locked) {
        this.expandReady = true;
      }
    });

    document.getElementById('canvas').appendChild(anchor);
  }

  _onEnter() {
    this.hovered = true;
    activeBubble = this;
    this.anchorEl.classList.add('active');
    this.bubbleEl.classList.add('expanded');
    this.bubbleEl.style.width  = this.expW + 'px';
    this.bubbleEl.style.height = this.expH + 'px';
  }

  _onLeave() {
    if (this.locked) return;
    this.hovered = false;
    this.expandReady = false;
    if (activeBubble === this) activeBubble = null;
    this.anchorEl.classList.remove('active');
    this.bubbleEl.classList.remove('expanded');
    this.bubbleEl.style.width  = THUMB_R * 2 + 'px';
    this.bubbleEl.style.height = THUMB_R * 2 + 'px';
  }

  _onClick() {
    if (this.locked) {
      this.locked = false;
      this.expandReady = false;
      this.hovered = false;
      activeBubble = null;
      this.anchorEl.classList.remove('active', 'locked');
      this.bubbleEl.classList.remove('expanded', 'locked');
      this.bubbleEl.style.width  = THUMB_R * 2 + 'px';
      this.bubbleEl.style.height = THUMB_R * 2 + 'px';
    } else if (this.expandReady) {
      this.locked = true;
      activeBubble = this;
      this.anchorEl.classList.add('active', 'locked');
      this.bubbleEl.classList.add('locked');
    }
  }

  unlock() {
    if (!this.locked) return;
    this.locked = false;
    this.expandReady = false;
    this.hovered = false;
    this.anchorEl.classList.remove('active', 'locked');
    this.bubbleEl.classList.remove('expanded', 'locked');
    this.bubbleEl.style.width  = THUMB_R * 2 + 'px';
    this.bubbleEl.style.height = THUMB_R * 2 + 'px';
    if (activeBubble === this) activeBubble = null;
  }

  updateDrift(t) {
    if (this.locked) return;
    this.cx = this.baseCx + Math.sin(t * this.speedX + this.phaseX) * this.ampX;
    this.cy = this.baseCy + Math.sin(t * this.speedY + this.phaseY) * this.ampY;
  }

  render() {
    const x = this.cx + this.pushX + this.collOffX;
    const y = this.cy + this.pushY + this.collOffY;
    this.anchorEl.style.transform = `translate(${x}px, ${y}px)`;
  }
}

/* ── Build all bubbles ── */
const bubbles = PIECES.map(p => new Bubble(p));

/* ── Hex grid placement (centered in viewport) ── */
const HEX_H_SPACING = 170;
const HEX_V_SPACING = 148;
const HEX_ROWS = [3, 4, 3];

function layoutHexGrid() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const totalRows = HEX_ROWS.length;
  let idx = 0;
  for (let r = 0; r < totalRows; r++) {
    const count = HEX_ROWS[r];
    for (let c = 0; c < count; c++) {
      const b = bubbles[idx++];
      b.baseCx = cx + (c - (count - 1) / 2) * HEX_H_SPACING;
      b.baseCy = cy + (r - (totalRows - 1) / 2) * HEX_V_SPACING;
      b.cx = b.baseCx;
      b.cy = b.baseCy;
    }
  }
}
layoutHexGrid();
bubbles.forEach(b => b.render());

/* ── Viewport boundary constants ── */
const EDGE_PAD_X = THUMB_R + 6;
const EDGE_PAD_Y = THUMB_R + 6;

/* ── Animation loop ── */
function tick(t) {
  const ab = activeBubble;

  bubbles.forEach(b => {
    if (b === ab) {
      if (!b.locked) {
        b.cx = b.baseCx + Math.sin(t * b.speedX + b.phaseX) * b.ampX;
        b.cy = b.baseCy + Math.sin(t * b.speedY + b.phaseY) * b.ampY;
      }
      b.pushX += (0 - b.pushX) * 0.1;
      b.pushY += (0 - b.pushY) * 0.1;
    } else {
      b.updateDrift(t);
      if (ab) {
        const margin = 30;
        const halfW = ab.expW / 2 + THUMB_R + margin;
        const halfH = ab.expH / 2 + THUMB_R + margin;
        const dx = (b.cx + b.pushX) - (ab.cx + ab.pushX);
        const dy = (b.cy + b.pushY) - (ab.cy + ab.pushY);
        const overlapX = halfW - Math.abs(dx);
        const overlapY = halfH - Math.abs(dy);
        if (overlapX > 0 && overlapY > 0) {
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const nx = dx / dist;
          const ny = dy / dist;
          const strength = Math.min(overlapX, overlapY) * 0.85;
          b.pushX += (nx * strength - b.pushX) * 0.14;
          b.pushY += (ny * strength - b.pushY) * 0.14;
        } else {
          b.pushX += (0 - b.pushX) * 0.10;
          b.pushY += (0 - b.pushY) * 0.10;
        }
      } else {
        b.pushX += (0 - b.pushX) * 0.09;
        b.pushY += (0 - b.pushY) * 0.09;
      }
    }
  });

  bubbles.forEach(b => { b.collOffX = 0; b.collOffY = 0; });

  const colMin = THUMB_R * 2 + SPREAD_MARGIN;
  for (let iter = 0; iter < 5; iter++) {
    for (let i = 0; i < bubbles.length; i++) {
      const a = bubbles[i];
      if (a.hovered || a.locked) continue;
      for (let j = i + 1; j < bubbles.length; j++) {
        const b = bubbles[j];
        if (b.hovered || b.locked) continue;
        const ax = a.cx + a.pushX + a.collOffX;
        const ay = a.cy + a.pushY + a.collOffY;
        const bx = b.cx + b.pushX + b.collOffX;
        const by = b.cy + b.pushY + b.collOffY;
        const dx = bx - ax;
        const dy = by - ay;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (dist < colMin) {
          const nx = dx / dist;
          const ny = dy / dist;
          const correction = (colMin - dist) / 2;
          a.collOffX -= nx * correction;
          a.collOffY -= ny * correction;
          b.collOffX += nx * correction;
          b.collOffY += ny * correction;
        }
      }
    }
  }

  const vw = window.innerWidth, vh = window.innerHeight;
  bubbles.forEach(b => {
    let x = b.cx + b.pushX + b.collOffX;
    let y = b.cy + b.pushY + b.collOffY;
    if (x < EDGE_PAD_X)      b.collOffX += EDGE_PAD_X - x;
    if (x > vw - EDGE_PAD_X) b.collOffX += (vw - EDGE_PAD_X) - x;
    if (y < EDGE_PAD_Y)      b.collOffY += EDGE_PAD_Y - y;
    if (y > vh - EDGE_PAD_Y) b.collOffY += (vh - EDGE_PAD_Y) - y;
  });

  bubbles.forEach(b => b.render());
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ── Escape to unlock ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') bubbles.forEach(b => b.unlock());
});

/* ── Resize handling ── */
window.addEventListener('resize', () => {
  layoutHexGrid();
});
