// script.js
// Interactive ocean ripples (separate JS file)

document.addEventListener('DOMContentLoaded', () => {
  const oceanBox = document.getElementById('ocean-box');

  const canvas = document.createElement('canvas');
  oceanBox.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  // handle high-DPI displays
  function resizeCanvas() {
    const rect = oceanBox.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing operations
  }

  // initial resize
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ripple store
  let ripples = [];

  function addRipple(x, y) {
    // Convert client coords to canvas local coords
    const rect = canvas.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;
    ripples.push({ x: localX, y: localY, t: 0 });
  }

  // Mouse events
  oceanBox.addEventListener('mousemove', (e) => {
    addRipple(e.clientX, e.clientY);
  });

  // Touch events (prevent default on touchmove so page doesn't scroll)
  oceanBox.addEventListener('touchmove', (e) => {
    // only handle first touch for simplicity
    const t = e.touches[0];
    if (t) addRipple(t.clientX, t.clientY);
    // prevent scrolling while touching the canvas
    e.preventDefault();
  }, { passive: false });

  // Optional: pointer events unify mouse & touch (uncomment to use pointer API)
  // oceanBox.addEventListener('pointermove', (e) => {
  //   if (e.pointerType === 'touch' || e.pointerType === 'mouse') {
  //     addRipple(e.clientX, e.clientY);
  //   }
  // });

  // animation
  function draw() {
    // clear & background
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
