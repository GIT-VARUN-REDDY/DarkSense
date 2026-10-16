/**
 * DARKSENSE — Animated Gradient Mesh Background
 * 8 slowly drifting luminous blobs, mood-reactive with smooth color lerp.
 * Inspired by Apple macOS Sonoma / Linear.app gradient mesh aesthetic.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('mesh-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;
  let time = 0;
  let currentMood = 'luminous';
  let targetMood  = 'luminous';

  /* ── Mood Palettes ────────────────────────────────────────────────────────
     Each blob: r,g,b (color), a (peak alpha), rad (radius as fraction of
     min(W,H)), sx/sy (drift amplitude as fraction of W/H), px/py (base
     normalised position 0-1), speed (time multiplier).
  ───────────────────────────────────────────────────────────────────────── */
  const PALETTES = {
    luminous: [
      { r:12,  g:28,  b:58,  a:0.55, rad:0.72, sx:0.18, sy:0.14, px:0.12, py:0.10, speed:0.00018 },
      { r:8,   g:18,  b:45,  a:0.50, rad:0.68, sx:0.14, sy:0.18, px:0.80, py:0.75, speed:0.00015 },
      { r:24,  g:52,  b:110, a:0.38, rad:0.50, sx:0.22, sy:0.16, px:0.55, py:0.22, speed:0.00022 },
      { r:16,  g:38,  b:80,  a:0.32, rad:0.45, sx:0.18, sy:0.20, px:0.28, py:0.68, speed:0.00019 },
      { r:186, g:230, b:253, a:0.04, rad:0.38, sx:0.24, sy:0.22, px:0.72, py:0.38, speed:0.00028 },
      { r:200, g:225, b:255, a:0.03, rad:0.32, sx:0.20, sy:0.26, px:0.40, py:0.85, speed:0.00025 },
      { r:4,   g:8,   b:22,  a:0.60, rad:0.55, sx:0.16, sy:0.12, px:0.88, py:0.18, speed:0.00012 },
      { r:6,   g:12,  b:32,  a:0.48, rad:0.42, sx:0.12, sy:0.14, px:0.30, py:0.35, speed:0.00014 },
    ],
    obsidian: [
      { r:18,  g:6,   b:38,  a:0.58, rad:0.72, sx:0.18, sy:0.14, px:0.12, py:0.10, speed:0.00018 },
      { r:10,  g:4,   b:28,  a:0.52, rad:0.68, sx:0.14, sy:0.18, px:0.80, py:0.75, speed:0.00015 },
      { r:80,  g:28,  b:140, a:0.30, rad:0.50, sx:0.22, sy:0.16, px:0.55, py:0.22, speed:0.00022 },
      { r:60,  g:20,  b:110, a:0.26, rad:0.45, sx:0.18, sy:0.20, px:0.28, py:0.68, speed:0.00019 },
      { r:192, g:132, b:252, a:0.06, rad:0.38, sx:0.24, sy:0.22, px:0.72, py:0.38, speed:0.00028 },
      { r:168, g:85,  b:247, a:0.04, rad:0.32, sx:0.20, sy:0.26, px:0.40, py:0.85, speed:0.00025 },
      { r:6,   g:2,   b:18,  a:0.64, rad:0.55, sx:0.16, sy:0.12, px:0.88, py:0.18, speed:0.00012 },
      { r:8,   g:3,   b:22,  a:0.52, rad:0.42, sx:0.12, sy:0.14, px:0.30, py:0.35, speed:0.00014 },
    ],
    calista: [
      { r:36,  g:10,  b:4,   a:0.58, rad:0.72, sx:0.18, sy:0.14, px:0.12, py:0.10, speed:0.00018 },
      { r:22,  g:6,   b:2,   a:0.52, rad:0.68, sx:0.14, sy:0.18, px:0.80, py:0.75, speed:0.00015 },
      { r:130, g:40,  b:8,   a:0.28, rad:0.50, sx:0.22, sy:0.16, px:0.55, py:0.22, speed:0.00022 },
      { r:100, g:28,  b:6,   a:0.24, rad:0.45, sx:0.18, sy:0.20, px:0.28, py:0.68, speed:0.00019 },
      { r:251, g:146, b:60,  a:0.05, rad:0.38, sx:0.24, sy:0.22, px:0.72, py:0.38, speed:0.00028 },
      { r:249, g:115, b:22,  a:0.04, rad:0.32, sx:0.20, sy:0.26, px:0.40, py:0.85, speed:0.00025 },
      { r:12,  g:3,   b:1,   a:0.64, rad:0.55, sx:0.16, sy:0.12, px:0.88, py:0.18, speed:0.00012 },
      { r:16,  g:4,   b:2,   a:0.52, rad:0.42, sx:0.12, sy:0.14, px:0.30, py:0.35, speed:0.00014 },
    ]
  };

  /* Lerped blob state */
  let blobs = PALETTES.luminous.map((b, i) => ({
    ...b,
    phaseX: i * 0.74,
    phaseY: i * 1.13,
    phaseR: i * 0.55,
    cr: b.r, cg: b.g, cb: b.b, ca: b.a,
  }));

  let lerpProgress = 1;
  const LERP_FRAMES = 140; // ~2.3 s at 60 fps

  function resize() {
    // Sharp high-fidelity background mesh resolution: 0.75x on mobile, 0.6x on desktop
    const scale = window.innerWidth <= 860 ? 0.75 : 0.6;
    W = canvas.width  = Math.max(390, Math.floor(window.innerWidth * scale));
    H = canvas.height = Math.max(300, Math.floor(window.innerHeight * scale));
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

  function setMood(mood) {
    if (!PALETTES[mood] || mood === targetMood) return;
    targetMood    = mood;
    currentMood   = mood;
    lerpProgress  = 0;
  }

  let lastDrawTime = 0;
  function draw(timestamp) {
    if (document.hidden) {
      requestAnimationFrame(draw);
      return;
    }

    // Throttle to 30 FPS: ambient gradient blobs are slow and smooth, saves huge GPU power
    if (timestamp && (timestamp - lastDrawTime < 32)) {
      requestAnimationFrame(draw);
      return;
    }
    lastDrawTime = timestamp || 0;

    ctx.clearRect(0, 0, W, H);

    // Deep-space base
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#04040c';
    ctx.fillRect(0, 0, W, H);

    const tp     = PALETTES[targetMood];
    const ease   = easeInOut(Math.min(lerpProgress / LERP_FRAMES, 1));
    if (lerpProgress < LERP_FRAMES) lerpProgress++;

    blobs.forEach((blob, i) => {
      const tgt = tp[i];
      const k   = ease * 0.05 + 0.002;
      blob.cr = lerp(blob.cr, tgt.r, k);
      blob.cg = lerp(blob.cg, tgt.g, k);
      blob.cb = lerp(blob.cb, tgt.b, k);
      blob.ca = lerp(blob.ca, tgt.a, k * 0.6);

      const t = time * blob.speed;
      const xDrift = Math.sin(t + blob.phaseX) * blob.sx + Math.cos(t * 0.61 + blob.phaseX) * blob.sx * 0.45;
      const yDrift = Math.cos(t * 0.84 + blob.phaseY) * blob.sy + Math.sin(t * 0.47 + blob.phaseY) * blob.sy * 0.45;
      const rPulse = 1 + Math.sin(t * 0.31 + blob.phaseR) * 0.10;

      const x = (blob.px + xDrift) * W;
      const y = (blob.py + yDrift) * H;
      const r = blob.rad * Math.min(W, H) * rPulse;

      const R = Math.round(blob.cr), G = Math.round(blob.cg), B = Math.round(blob.cb);
      const A = blob.ca.toFixed(3);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0,   `rgba(${R},${G},${B},${A})`);
      grad.addColorStop(0.42,`rgba(${R},${G},${B},${(blob.ca * 0.5).toFixed(3)})`);
      grad.addColorStop(1,   `rgba(${R},${G},${B},0)`);

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vignette
    ctx.globalCompositeOperation = 'source-over';
    const vig = ctx.createRadialGradient(W/2, H/2, H * 0.25, W/2, H/2, H * 0.88);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.74)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    time += 2;
    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const observer = new MutationObserver((muts) => {
      muts.forEach((m) => {
        if (m.attributeName === 'data-cosmic-mood') {
          setMood(document.body.getAttribute('data-cosmic-mood') || 'luminous');
        }
      });
    });
    observer.observe(document.body, { attributes: true });

    window.setMeshMood = setMood;

    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
