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
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  faders.forEach(el => observer.observe(el));

  // Navbar: scrolled style + active section highlight
  const navbar = document.querySelector('header nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Scroll-to-top button
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth scroll for nav links
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById('scroll-top');
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll down indicator
  const scrollDown = document.querySelector('.scroll-down-indicator');
  scrollDown?.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(scrollDown.getAttribute('href'));
    target?.scrollIntoView({ behavior: 'smooth' });
  });

});
