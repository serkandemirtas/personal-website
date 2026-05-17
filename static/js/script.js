// ---- Custom futuristic cursor (desktop/mouse only) ----
document.addEventListener('DOMContentLoaded', function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  // Signal CSS to hide native cursor
  document.documentElement.classList.add('custom-cursor');

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';

  // Start off-screen so no flash at 0,0
  dot.style.cssText  = 'left:-300px;top:-300px';
  ring.style.cssText = 'left:-300px;top:-300px';

  document.body.append(dot, ring);

  let mx = -300, my = -300, rx = -300, ry = -300;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    spawnTrail(mx, my);
  }, { passive: true });

  // ring follows with smooth lag
  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // hover effect
  const interactive = 'a, button, .btn, label, .nav-link, .social-icon, #scroll-top';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    }
  });

  // click feedback
  document.addEventListener('mousedown', () => {
    dot.classList.add('clicking');
    ring.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('clicking');
    ring.classList.remove('clicking');
  });

  // click ripple
  document.addEventListener('click', e => {
    const r = document.createElement('div');
    r.className = 'cursor-ripple';
    r.style.left = e.clientX + 'px';
    r.style.top  = e.clientY + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });

  // throttled trail particles
  let lastTrail = 0, trailToggle = 0;
  const COLORS = ['rgba(0,229,255,', 'rgba(140,220,254,', 'rgba(0,255,157,'];

  function spawnTrail(x, y) {
    const now = Date.now();
    if (now - lastTrail < 30) return;
    lastTrail = now;
    trailToggle = (trailToggle + 1) % COLORS.length;
    const size = (Math.random() * 4 + 2).toFixed(1);
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${COLORS[trailToggle]}0.6)`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 600);
  }
});

// Typing animation
const span = document.querySelector(".typing");
if (span) {
  let j = 0;
  const text = span.dataset.text || span.textContent;
  span.textContent = '';

  function typeOnce() {
    span.textContent = text.substring(0, j + 1);
    j++;
    if (j < text.length) setTimeout(typeOnce, 45);
  }

  window.addEventListener("DOMContentLoaded", typeOnce);
}

// Neural Network Canvas
(function () {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let nodes = [], conns = [], signals = [], layerArrays = [];

  function init() {
    const W = canvas.width  = canvas.parentElement.offsetWidth;
    const H = canvas.height = canvas.parentElement.offsetHeight;

    nodes = []; conns = []; signals = []; layerArrays = [];

    const LAYERS = W < 600 ? [3, 5, 5, 3] : [4, 6, 8, 7, 5, 3];

    LAYERS.forEach((count, li) => {
      const xFrac = (li + 1) / (LAYERS.length + 1);
      const x = W * xFrac;
      const yStep = H / (count + 1);
      const layer = [];

      for (let ni = 0; ni < count; ni++) {
        layer.push({
          x: x + (Math.random() - 0.5) * W * 0.04,
          y: yStep * (ni + 1) + (Math.random() - 0.5) * yStep * 0.35,
          r: 2.8 + Math.random() * 2,
          pulse: 0,
          col: Math.random() < 0.28 ? '0,255,140' : '0,210,255',
        });
      }
      layerArrays.push(layer);
      nodes.push(...layer);
    });

    for (let l = 0; l < layerArrays.length - 1; l++) {
      for (const a of layerArrays[l]) {
        for (const b of layerArrays[l + 1]) {
          if (Math.random() < 0.78) {
            conns.push({ a, b, w: 0.1 + Math.random() * 0.55 });
          }
        }
      }
    }
  }

  init();

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(init, 250);
  }, { passive: true });

  function fire() {
    if (!conns.length) return;
    const c = conns[Math.floor(Math.random() * conns.length)];
    signals.push({ c, t: 0, spd: 0.007 + Math.random() * 0.009 });
  }

  function cascade() {
    if (!layerArrays.length) return;
    const li = Math.floor(Math.random() * (layerArrays.length - 1));
    const src = layerArrays[li][Math.floor(Math.random() * layerArrays[li].length)];
    src.pulse = 1;
    for (const c of conns) {
      if (c.a === src) signals.push({ c, t: 0, spd: 0.007 + Math.random() * 0.008 });
    }
  }

  function frame() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Resting connections
    for (const c of conns) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,200,255,${c.w * 0.038})`;
      ctx.lineWidth = 0.4;
      ctx.moveTo(c.a.x, c.a.y);
      ctx.lineTo(c.b.x, c.b.y);
      ctx.stroke();
    }

    // Signals
    signals = signals.filter(s => {
      s.t += s.spd;
      if (s.t >= 1) { s.c.b.pulse = Math.min(1, s.c.b.pulse + 0.75); return false; }

      const x = s.c.a.x + (s.c.b.x - s.c.a.x) * s.t;
      const y = s.c.a.y + (s.c.b.y - s.c.a.y) * s.t;

      // Light up the connection while signal travels
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,230,255,${0.25 * (1 - s.t * 0.5)})`;
      ctx.lineWidth = 0.9;
      ctx.moveTo(s.c.a.x, s.c.a.y);
      ctx.lineTo(s.c.b.x, s.c.b.y);
      ctx.stroke();

      // Signal glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
      g.addColorStop(0,   'rgba(0,240,255,0.95)');
      g.addColorStop(0.35,'rgba(0,240,255,0.35)');
      g.addColorStop(1,   'rgba(0,240,255,0)');
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();

      return true;
    });

    // Nodes
    for (const n of nodes) {
      n.pulse = Math.max(0, n.pulse - 0.016);

      const gR = n.r * 2 + n.pulse * 12;
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gR);
      g.addColorStop(0, `rgba(${n.col},${0.18 + n.pulse * 0.45})`);
      g.addColorStop(0.5,`rgba(${n.col},${0.04 + n.pulse * 0.14})`);
      g.addColorStop(1, `rgba(${n.col},0)`);
      ctx.beginPath(); ctx.arc(n.x, n.y, gR, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${n.col},${0.1 + n.pulse * 0.5})`;
      ctx.lineWidth = 0.6; ctx.stroke();

      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.col},${0.38 + n.pulse * 0.4})`; ctx.fill();
    }

    if (Math.random() < 0.08)  fire();
    if (Math.random() < 0.022) cascade();

    requestAnimationFrame(frame);
  }

  // Warm up with initial signals
  for (let i = 0; i < 10; i++) setTimeout(fire, i * 150);
  frame();
})();

// ---- Photo build-in effect ----
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('photo-build-canvas');
  const inner   = overlay && overlay.closest('.hero-photo-inner');
  if (!overlay || !inner) return;

  const SIZE = inner.offsetWidth || 360;
  overlay.width  = SIZE;
  overlay.height = SIZE;
  const ctx = overlay.getContext('2d');

  // Cover photo with dark fill
  ctx.fillStyle = '#080c12';
  ctx.fillRect(0, 0, SIZE, SIZE);

  const CELL  = Math.max(5, Math.round(SIZE / 60));
  const cx = SIZE / 2, cy = SIZE / 2, R = cx;
  const cells = [];

  for (let c = 0; c * CELL < SIZE; c++) {
    for (let r = 0; r * CELL < SIZE; r++) {
      const px = c * CELL + CELL / 2, py = r * CELL + CELL / 2;
      if (Math.hypot(px - cx, py - cy) < R) {
        cells.push({ x: c * CELL, y: r * CELL,
                     dist: Math.hypot(px - cx, py - cy) });
      }
    }
  }

  // Reveal inside-out: nearest centre first
  cells.sort((a, b) => a.dist - b.dist);

  const TOTAL  = 3200;  // ms for full reveal
  const OFFSET = 600;   // delay before starting

  cells.forEach((cell, i) => {
    const t = OFFSET + (i / cells.length) * TOTAL;
    setTimeout(() => {
      // Brief cyan flash → then clear to reveal photo
      const alpha = 0.5 + Math.random() * 0.4;
      ctx.fillStyle = `rgba(0,229,255,${alpha})`;
      ctx.fillRect(cell.x, cell.y, CELL, CELL);
      setTimeout(() => {
        ctx.clearRect(cell.x - 1, cell.y - 1, CELL + 2, CELL + 2);
      }, 55 + Math.random() * 70);
    }, t);
  });

  // Fade out overlay after all cells are revealed
  setTimeout(() => {
    overlay.style.transition = 'opacity 0.9s ease';
    overlay.style.opacity    = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 950);
  }, OFFSET + TOTAL + 200);
});

document.addEventListener('DOMContentLoaded', () => {

  // Toast notifications
  document.querySelectorAll('.toast').forEach(el => {
    new bootstrap.Toast(el, { delay: 4000 }).show();
  });

  // Footer year
  const footer = document.querySelector('.copyright');
  if (footer) {
    footer.innerHTML = `&copy; ${new Date().getFullYear()} Serkan Demirtaş — All Rights Reserved.`;
  }

  // Fade-in on scroll
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  faders.forEach(el => observer.observe(el));

  // Navbar scrolled + active section
  const navbar = document.querySelector('header nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

  function onScroll() {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 110) current = s.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    document.getElementById('scroll-top')?.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Close mobile nav on link click
  const bsCollapse = document.getElementById('navbarNav');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // close mobile menu
        if (bsCollapse?.classList.contains('show')) {
          bootstrap.Collapse.getInstance(bsCollapse)?.hide();
        }
        setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    });
  });

  // Scroll-to-top button
  document.getElementById('scroll-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll down indicator
  const scrollDown = document.querySelector('.scroll-down-indicator');
  scrollDown?.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(scrollDown.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });

});
