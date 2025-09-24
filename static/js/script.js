const span = document.querySelector(".typing");

const roles = [
  span.dataset.text
];

let i = 0;     
let j = 0;     

function typeOnce() {
  const current = roles[i];
  span.textContent = current.substring(0, j + 1);
  j++;

  if (j < current.length) {
    setTimeout(typeOnce, 30);
  }
}

window.addEventListener("DOMContentLoaded", typeOnce);



document.addEventListener('DOMContentLoaded', () => {

    //  Smooth Scroll
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    //  Fade-in on Scroll
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    //  Project Card Hover Effect
    const projectCards = document.querySelectorAll('.card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.03)';
            card.style.transition = 'all 0.3s ease';
            card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
        });
    });

    //  Footer Year Update
    const footer = document.querySelector('.copyright');
    if (footer) {
        const year = new Date().getFullYear();
        footer.innerHTML = `&copy; ${year} Serkan Demirtaş — All Rights Reserved.`;
    }


});

document.addEventListener("DOMContentLoaded", function() {
    lottie.loadAnimation({
        container: document.getElementById('hero-animation'), 
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: "{% static 'animation/hero.json' %}" 
    });
});


document.addEventListener("DOMContentLoaded", function() {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
      return new bootstrap.Toast(toastEl, { delay: 4000 }) // 4 saniye
    });
    toastList.forEach(toast => toast.show());
  });



 






