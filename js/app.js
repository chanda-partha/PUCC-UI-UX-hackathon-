/**
 * PUCC Core JavaScript Framework
 * Chittagong, Bangladesh
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initCanvasParticles();
  initStatsCounters();
  initScrollAnimations();
  initTestimonialCarousel();
  initFormsAndInteractions();
});

/* ==========================================================================
   1. Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('pucc-theme') || 'dark'; // default to premium dark mode

  // Set initial theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleIcons(savedTheme);

  themeToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pucc-theme', newTheme);
      updateThemeToggleIcons(newTheme);
    });
  });
}

function updateThemeToggleIcons(theme) {
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
  toggleButtons.forEach(btn => {
    if (theme === 'dark') {
      // Show Sun Icon for switching to light mode
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      // Show Moon Icon for switching to dark mode
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  });
}

/* ==========================================================================
   2. Navbar Scroll Effects & Active Page Mapping
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Initial check in case page is refreshed while scrolled
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    }
  }

  // Active Link Mapping based on URL
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link-custom');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === 'index.html' && href === '#') || (href === 'index.html' && pageName === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   3. Animated Particle System for Hero
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];

  // Set dimensions
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.color = Math.random() > 0.5 ? '#00BCD4' : '#0EA5A4'; // cyan or teal
      this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Connect particles with thin lines if they are close
    ctx.save();
    ctx.strokeStyle = '#00BCD4';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    animationFrameId = requestAnimationFrame(animate);
  }

  createParticles();
  animate();
}

/* ==========================================================================
   4. Scroll-Triggered Animated Counters
   ========================================================================== */
function initStatsCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (counterElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const targetText = el.getAttribute('data-target');
    const targetVal = parseInt(targetText, 10);
    const suffix = targetText.replace(/[0-9]/g, '');
    let count = 0;
    const duration = 2000; // 2 seconds
    const intervalTime = 20;
    const increment = Math.ceil(targetVal / (duration / intervalTime));

    const interval = setInterval(() => {
      count += increment;
      if (count >= targetVal) {
        el.innerText = targetVal + suffix;
        clearInterval(interval);
      } else {
        el.innerText = count + suffix;
      }
    }, intervalTime);
  }
}

/* ==========================================================================
   5. Scroll Fade Up Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-up-init');
  if (fadeElements.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.05,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. Custom Testimonials Carousel
   ========================================================================== */
function initTestimonialCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  if (slides.length === 0) return;

  let currentIdx = 0;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === index ? 'block' : 'none';
      if (idx === index) {
        slide.classList.add('fade-in-quick');
      } else {
        slide.classList.remove('fade-in-quick');
      }
    });
  }

  // Set initial display
  showSlide(currentIdx);

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + slides.length) % slides.length;
      showSlide(currentIdx);
    });

    nextBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % slides.length;
      showSlide(currentIdx);
    });
  }

  // Auto play
  setInterval(() => {
    currentIdx = (currentIdx + 1) % slides.length;
    showSlide(currentIdx);
  }, 8000);
}

/* ==========================================================================
   7. Form Actions and Page-Specific Interactive Features
   ========================================================================== */
function initFormsAndInteractions() {
  // Join Us Multi-step Form
  const interestForm = document.getElementById('puccInterestForm');
  if (interestForm) {
    const nextBtn = document.getElementById('formNextBtn');
    const prevBtn = document.getElementById('formPrevBtn');
    const step1 = document.getElementById('formStep1');
    const step2 = document.getElementById('formStep2');
    const indicator1 = document.getElementById('stepIndicator1');
    const indicator2 = document.getElementById('stepIndicator2');

    if (nextBtn && prevBtn && step1 && step2) {
      nextBtn.addEventListener('click', () => {
        // Basic input validation on Step 1
        const inputs = step1.querySelectorAll('input, select');
        let valid = true;
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            input.reportValidity();
            valid = false;
          }
        });

        if (valid) {
          step1.classList.add('d-none');
          step2.classList.remove('d-none');
          indicator1.classList.remove('active');
          indicator2.classList.add('active');
        }
      });

      prevBtn.addEventListener('click', () => {
        step2.classList.add('d-none');
        step1.classList.remove('d-none');
        indicator2.classList.remove('active');
        indicator1.classList.add('active');
      });
    }

    interestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Show success alert
      alert('Thank you for your interest in PUCC! Your submission was successful. We will contact you soon for step 2 (Membership Verification & Payment).');
      interestForm.reset();
      if (step2 && step1) {
        step2.classList.add('d-none');
        step1.classList.remove('d-none');
        indicator2.classList.remove('active');
        indicator1.classList.add('active');
      }
    });
  }

  // Contact Form Submission
  const contactForm = document.getElementById('puccContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting PUCC! We have received your message and will get back to you shortly.');
      contactForm.reset();
    });
  }

  // Events filter
  const filterButtons = document.querySelectorAll('.event-filter-btn');
  const eventCards = document.querySelectorAll('.event-item-col');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(b => b.classList.remove('active', 'btn-primary-custom'));
      filterButtons.forEach(b => b.classList.add('btn-secondary-custom'));
      btn.classList.add('active', 'btn-primary-custom');
      btn.classList.remove('btn-secondary-custom');

      const filter = btn.getAttribute('data-filter');

      eventCards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (filter === 'all' || type === filter) {
          card.style.display = 'block';
          card.classList.add('fade-in-quick');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
