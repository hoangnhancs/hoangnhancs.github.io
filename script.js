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
// Tự động nhận diện môi trường: Nếu chạy ở local thì gọi đến Backend (.NET), khi lên Vercel chạy cùng domain sẽ dùng relative path
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000' // Thay port backend local của bạn tại đây (ví dụ: http://localhost:5000 hoặc http://localhost:5088)
  : 'https://contact.ec.io.vn';

const form = document.getElementById('contactForm');
const notice = document.getElementById('formNotice');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Basic Validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showNotice('Vui lòng điền đầy đủ các thông tin bắt buộc.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showNotice('Email không hợp lệ. Vui lòng kiểm tra lại.', 'error');
      return;
    }

    // Get Turnstile token
    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value
      || window.turnstile?.getResponse();

    if (!turnstileToken) {
      showNotice('Vui lòng hoàn thành xác minh bảo mật (Turnstile).', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('span');
    const original = btnText.textContent;
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          subject: subjectInput.value.trim() || 'No Subject',
          message: messageInput.value.trim(),
          turnstileToken: turnstileToken
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotice(data.message || 'Gửi tin nhắn thành công!', 'success');
        form.reset();
        if (window.turnstile) {
          window.turnstile.reset();
        }
      } else {
        showNotice(data.message || 'Gửi thất bại. Vui lòng thử lại sau.', 'error');
        if (window.turnstile) {
          window.turnstile.reset();
        }
      }
    } catch (err) {
      console.error('Error sending email:', err);
      showNotice('Đã xảy ra lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.', 'error');
      if (window.turnstile) {
        window.turnstile.reset();
      }
    } finally {
      btnText.textContent = original;
      submitBtn.disabled = false;
    }
  });
}

function showNotice(text, type) {
  notice.textContent = text;
  notice.className = `form-notice ${type}`;

  setTimeout(() => {
    if (notice.textContent === text) {
      notice.textContent = '';
      notice.className = 'form-notice';
    }
  }, 5000);
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
