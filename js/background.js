/**
 * TiBAl Tech - Futuristic Background Animation (js/background.js)
 * Features:
 * - Subtle tech grid
 * - Ambient glowing orbs with soft radial gradients
 * - Floating glowing cyan particles with network connections
 * - Smooth desktop mouse parallax interaction
 * - Mobile device orientation support with graceful fallback
 * - High performance & text-readability protection
 */

(function () {
  'use strict';

  let canvas = document.getElementById('bg-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Interaction tracking with lerping
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    vx: 0,
    vy: 0,
    isActive: false
  };

  // Device orientation tilt
  const tilt = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  // Resize handler
  function handleResize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initOrbs();
  }

  window.addEventListener('resize', handleResize, { passive: true });

  // Mouse move handler
  window.addEventListener(
    'mousemove',
    (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    },
    { passive: true }
  );

  window.addEventListener(
    'mouseleave',
    () => {
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
      mouse.isActive = false;
    },
    { passive: true }
  );

  // Device Orientation for mobile
  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      'deviceorientation',
      (e) => {
        if (e.gamma !== null && e.beta !== null) {
          tilt.targetX = Math.min(Math.max(e.gamma, -45), 45) / 45; // -1 to 1
          tilt.targetY = Math.min(Math.max(e.beta - 30, -45), 45) / 45;
        }
      },
      { passive: true }
    );
  }

  // 1. Ambient Glowing Orbs
  let orbs = [];
  function initOrbs() {
    orbs = [
      {
        baseX: width * 0.2,
        baseY: height * 0.25,
        radius: Math.min(width, height) * 0.45,
        color: 'rgba(22, 131, 255, 0.08)',
        speed: 0.0006,
        offset: 0,
        factor: 35
      },
      {
        baseX: width * 0.8,
        baseY: height * 0.35,
        radius: Math.min(width, height) * 0.4,
        color: 'rgba(32, 217, 255, 0.06)',
        speed: 0.0008,
        offset: 2.1,
        factor: -30
      },
      {
        baseX: width * 0.5,
        baseY: height * 0.75,
        radius: Math.min(width, height) * 0.5,
        color: 'rgba(22, 131, 255, 0.06)',
        speed: 0.0005,
        offset: 4.2,
        factor: 25
      },
      {
        baseX: width * 0.15,
        baseY: height * 0.85,
        radius: Math.min(width, height) * 0.35,
        color: 'rgba(32, 217, 255, 0.05)',
        speed: 0.0007,
        offset: 1.5,
        factor: -20
      }
    ];
  }

  initOrbs();

  // 2. Floating Cyan Particles
  const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 1.8 + 0.8;
      this.baseSpeedX = (Math.random() - 0.5) * 0.35;
      this.baseSpeedY = -Math.random() * 0.45 - 0.2;
      this.alpha = Math.random() * 0.45 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.pulseAngle += this.pulseSpeed;
      this.currentAlpha = this.alpha + Math.sin(this.pulseAngle) * 0.15;

      this.x += this.baseSpeedX;
      this.y += this.baseSpeedY;

      // Mouse repulsion/attraction subtle influence
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= (dx / dist) * force * 0.8;
        this.y -= (dy / dist) * force * 0.8;
      }

      if (this.y < -20 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(32, 217, 255, ${Math.max(0.1, this.currentAlpha)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(32, 217, 255, 0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // 3. Grid Drawing
  let gridOffset = 0;
  function drawGrid(parallaxX, parallaxY) {
    const gridSize = 64;
    gridOffset = (gridOffset + 0.15) % gridSize;

    ctx.save();
    ctx.strokeStyle = 'rgba(32, 217, 255, 0.035)';
    ctx.lineWidth = 1;

    const startX = (parallaxX * 0.03) % gridSize;
    const startY = (gridOffset + parallaxY * 0.03) % gridSize;

    // Vertical lines
    for (let x = startX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Main Render Loop
  let lastTime = 0;
  let isTabVisible = true;

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  });

  function render(time) {
    if (!isTabVisible) {
      requestAnimationFrame(render);
      return;
    }

    // Smooth lerp mouse & tilt
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    tilt.x += (tilt.targetX - tilt.x) * 0.05;
    tilt.y += (tilt.targetY - tilt.y) * 0.05;

    const parallaxX = (mouse.x - width / 2) + tilt.x * 60;
    const parallaxY = (mouse.y - height / 2) + tilt.y * 60;

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Tech Grid
    drawGrid(parallaxX, parallaxY);

    // Draw Glowing Orbs with mouse shift
    orbs.forEach((orb) => {
      const timeOffset = time * orb.speed + orb.offset;
      const x = orb.baseX + Math.sin(timeOffset) * 40 + (parallaxX / width) * orb.factor;
      const y = orb.baseY + Math.cos(timeOffset) * 40 + (parallaxY / height) * orb.factor;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, orb.radius);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(0.6, orb.color.replace(/[\d\.]+\)$/, '0.02)'));
      grad.addColorStop(1, 'rgba(3, 7, 18, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Particles and connection lines
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      // Proximity connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 85) {
          const alpha = (1 - dist / 85) * 0.12;
          ctx.strokeStyle = `rgba(32, 217, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
