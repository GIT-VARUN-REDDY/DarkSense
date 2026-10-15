/**
 * DARKSENSE — Custom Cursor + Mood-Reactive Particle Trail
 * Cursor dot + elastic outer ring + sparks that bloom on move / click.
 * Colors attune to the active cosmic mood automatically.
 */

(function () {
  'use strict';

  // ── Skip on touch-only devices ─────────────────────────────────────────────
  if (window.matchMedia('(hover: none)').matches) return;

  // ── DOM elements ────────────────────────────────────────────────────────────
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'ds-cursor-dot';
  ring.className = 'ds-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // ── State ───────────────────────────────────────────────────────────────────
  let mouseX = -200, mouseY = -200;
  let dotX   = -200, dotY   = -200;
  let ringX  = -200, ringY  = -200;
  let mood   = 'luminous';
  let lastSparkTime = 0;
  const SPARK_INTERVAL = 30; // ms between trail sparks during movement
  const MAX_SPARKS = 22;
  let sparks = [];

  // ── Mood Accent Colors ───────────────────────────────────────────────────────
  const MOOD_COLORS = {
    luminous: { r: 186, g: 230, b: 253 },
    obsidian: { r: 192, g: 132, b: 252 },
    calista:  { r: 251, g: 146, b: 60  },
  };

  function getColor(alpha) {
    const c = MOOD_COLORS[mood] || MOOD_COLORS.luminous;
    return `rgba(${c.r},${c.g},${c.b},${alpha})`;
  }

  // ── Update cursor colors ─────────────────────────────────────────────────────
  function updateCursorColor() {
    const c = MOOD_COLORS[mood] || MOOD_COLORS.luminous;
    const col = `${c.r},${c.g},${c.b}`;
    dot.style.background  = `rgba(${col},0.95)`;
    dot.style.boxShadow   = `0 0 8px 2px rgba(${col},0.7), 0 0 20px 4px rgba(${col},0.3)`;
    ring.style.borderColor = `rgba(${col},0.55)`;
    ring.style.boxShadow  = `0 0 12px 2px rgba(${col},0.2)`;
  }

  // ── Spawn a spark ────────────────────────────────────────────────────────────
  function spawnSpark(x, y, isClick) {
    if (sparks.length >= MAX_SPARKS) {
      // Recycle oldest
      const old = sparks.shift();
      old.remove();
    }

    const el = document.createElement('div');
    el.className = 'ds-cursor-spark';

    const size      = isClick ? (6 + Math.random() * 8) : (2 + Math.random() * 4);
    const angle     = Math.random() * Math.PI * 2;
    const distance  = isClick ? (20 + Math.random() * 50) : (6 + Math.random() * 18);
    const driftX    = Math.cos(angle) * distance;
    const driftY    = Math.sin(angle) * distance;
    const duration  = isClick ? (500 + Math.random() * 400) : (300 + Math.random() * 250);
    const c         = MOOD_COLORS[mood] || MOOD_COLORS.luminous;

    el.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${x - size / 2}px;
      top:${y - size / 2}px;
      --spark-drift-x:${driftX}px;
      --spark-drift-y:${driftY}px;
      --spark-duration:${duration}ms;
      --spark-color:rgba(${c.r},${c.g},${c.b},0.9);
      --spark-glow:rgba(${c.r},${c.g},${c.b},0.4);
    `;

    document.body.appendChild(el);
    sparks.push(el);

    // Force reflow then trigger animation
    el.getBoundingClientRect();
    el.classList.add('ds-spark-animate');

    setTimeout(() => {
      el.remove();
      sparks = sparks.filter(s => s !== el);
    }, duration + 50);
  }

  // ── Click burst ──────────────────────────────────────────────────────────────
  function onMouseDown(e) {
    ring.classList.add('ds-cursor-ring--pressed');
    for (let i = 0; i < 10; i++) spawnSpark(e.clientX, e.clientY, true);
  }
  function onMouseUp() {
    ring.classList.remove('ds-cursor-ring--pressed');
  }

  // ── Mouse move — direct 1:1 placement, zero lag ──────────────────────────
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Move both elements directly — no lerp, exact mouse position
    dot.style.transform  = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;

    const now = Date.now();
    if (now - lastSparkTime > SPARK_INTERVAL) {
      spawnSpark(mouseX, mouseY, false);
      lastSparkTime = now;
    }
  }

  // ── Interactive hover: scale ring on clickable elements ────────────────────
  function onMouseEnterInteractive() { ring.classList.add('ds-cursor-ring--hover'); }
  function onMouseLeaveInteractive() { ring.classList.remove('ds-cursor-ring--hover'); }

  function attachHoverListeners() {
    document.querySelectorAll('a,button,input,textarea,[role="button"],[tabindex]').forEach(el => {
      el.addEventListener('mouseenter', onMouseEnterInteractive);
      el.addEventListener('mouseleave', onMouseLeaveInteractive);
    });
  }

  // ── RAF loop: smooth cursor follow ──────────────────────────────────────────
  // ── No RAF needed for cursor positioning — moved to mousemove ──────────────
  // (RAF loop kept only for future effects if needed)

  // ── Mood watcher ─────────────────────────────────────────────────────────────
  const observer = new MutationObserver(() => {
    mood = document.body.getAttribute('data-cosmic-mood') || 'luminous';
    updateCursorColor();
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['data-cosmic-mood'] });

  // ── Init ─────────────────────────────────────────────────────────────────────
  document.addEventListener('mousemove',  onMouseMove,  { passive: true });
  document.addEventListener('mousedown',  onMouseDown);
  document.addEventListener('mouseup',    onMouseUp);

  attachHoverListeners();

  // Re-attach after dynamic DOM changes (muse cards etc.)
  new MutationObserver(attachHoverListeners).observe(document.body, { childList: true, subtree: true });

  updateCursorColor();
  // (no animate() call needed — positioning is event-driven)
})();
