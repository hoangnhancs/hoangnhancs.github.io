/* ============================================
   NAV — scroll shadow & mobile menu
   ============================================ */
const nav = document.getElementById('nav');
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('navMobile');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ============================================
   TYPED TEXT EFFECT
   ============================================ */
const roles = [
  'Software Engineer',
  'Backend .NET Developer',
  'Fullstack Developer (React + .NET)',
  'Clean Architecture Advocate',
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 80);
}

if (typedEl) {
  typeLoop();
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

/* ============================================
   ANIMATED COUNTER
   ============================================ */
const counters = document.querySelectorAll('.stat-card__number');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (entries.some(e => e.isIntersecting) && !countersStarted) {
    countersStarted = true;
    counters.forEach(el => {
      const target = +el.dataset.target;
      const duration = 1400;
      const step = target / (duration / 16);
      let current = 0;
      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (target >= 100 ? '+' : '+');
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
    });
  }
}, { threshold: 0.3 });

if (counters.length) {
  counterObserver.observe(counters[0].closest('.about__stats'));
}

/* ============================================
   CONTACT FORM (demo)
   ============================================ */
const form = document.getElementById('contactForm');
const notice = document.getElementById('formNotice');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"] span');
    const original = btn.textContent;
    btn.textContent = 'Sending...';

    await new Promise(r => setTimeout(r, 1200));

    notice.textContent = 'Thank you! I will get back to you as soon as possible.';
    notice.className = 'form-notice success';
    form.reset();
    btn.textContent = original;

    setTimeout(() => {
      notice.textContent = '';
      notice.className = 'form-notice';
    }, 5000);
  });
}

/* ============================================
   SMOOTH ACTIVE NAV LINK
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--c-accent-2)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));
