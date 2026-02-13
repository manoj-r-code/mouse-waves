// mouse.js
// Interactive ocean ripples (mobile optimized)

document.addEventListener('DOMContentLoaded', () => {
  const oceanBox = document.getElementById('ocean-box');

  const canvas = document.createElement('canvas');
  oceanBox.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let ripples = [];
  let lastRippleTime = 0;

  // -----------------------------
  // Resize (optimized for mobile)
  // -----------------------------
  function resizeCanvas() {
    const rect = oceanBox.getBoundingClientRect();

    // cap DPR for performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // -----------------------------
  // Ripple creation (throttled)
  // -----------------------------
  function addRipple(x, y) {
    const now = performance.now();

    // limit ripple frequency (big mobile boost)
    if (now - lastRippleTime < 30) return;
    lastRippleTime = now;

    const rect = canvas.getBoundingClientRect();

    ripples.push({
      x: x - rect.left,
      y: y - rect.top,
      t: 0
    });
  }

  // -----------------------------
  // Pointer events (mouse + touch)
  // -----------------------------
  oceanBox.addEventListener('pointerdown', (e) => {
    addRipple(e.clientX, e.clientY);
  });

  oceanBox.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
      addRipple(e.clientX, e.clientY);
    }
  });

  // -----------------------------
  // Animation loop
  // -----------------------------
  function draw() {
    // clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw ripples
    for (let i = 0; i < ripples.length; i++) {
      const r = ripples[i];

      const alpha = Math.max(0, 1 - r.t / 60);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,191,255,${alpha})`;
      ctx.lineWidth = 2;
      ctx.arc(r.x, r.y, r.t * 2, 0, Math.PI * 2);
      ctx.stroke();

      r.t++;
    }

    // remove old ripples
    ripples = ripples.filter(r => r.t < 60);

    requestAnimationFrame(draw);
  }

  draw();
});
