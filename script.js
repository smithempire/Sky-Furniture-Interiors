/* =====================================================================
   SKY FURNITURES & INTERIOR — SCRIPT.JS
   Vanilla ES6. No dependencies.
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- PRELOADER ---------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 300);
  });
  // fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 300);
  }

  /* ---------------- STICKY / TRANSPARENT NAV ---------------- */
  const header = document.querySelector('.site-header');
  const toggleScrolled = () => {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });

  /* ---------------- MOBILE MENU ---------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  /* ---------------- ACTIVE NAV LINK ---------------- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------------- RIPPLE BUTTONS ---------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-zoom');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- HERO SLIDESHOW ---------------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slide-dots button');
  let slideIndex = 0;
  let slideTimer;

  function showSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slideIndex = (i + slides.length) % slides.length;
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
  }

  function startSlideshow() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(slideIndex + 1), 5500);
  }

  if (slides.length) {
    showSlide(0);
    startSlideshow();
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startSlideshow();
      });
    });
  }

  /* ---------------- HERO TYPING ANIMATION ---------------- */
  const typeTarget = document.querySelector('[data-typing]');
  if (typeTarget) {
    const phrases = JSON.parse(typeTarget.getAttribute('data-typing'));
    let pIndex = 0, cIndex = 0, deleting = false;
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    cursor.innerHTML = '&nbsp;';

    function typeLoop() {
      const phrase = phrases[pIndex];
      if (!deleting) {
        cIndex++;
        typeTarget.textContent = phrase.slice(0, cIndex);
        if (cIndex === phrase.length) {
          deleting = true;
          setTimeout(typeLoop, 1800);
          return;
        }
      } else {
        cIndex--;
        typeTarget.textContent = phrase.slice(0, cIndex);
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      typeTarget.appendChild(cursor);
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
  }

  /* ---------------- COUNTER ANIMATION ---------------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1600;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;
        const tick = () => {
          current += increment;
          if (current >= target) {
            el.textContent = target + suffix;
          } else {
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(() => setTimeout(tick, stepTime));
          }
        };
        tick();
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------------- TESTIMONIAL SLIDER ---------------- */
  const tTrack = document.querySelector('.t-track');
  if (tTrack) {
    const tSlides = tTrack.querySelectorAll('.t-slide');
    let tIndex = 0;
    const update = () => { tTrack.style.transform = `translateX(-${tIndex * 100}%)`; };
    document.querySelector('.t-next')?.addEventListener('click', () => {
      tIndex = (tIndex + 1) % tSlides.length; update();
    });
    document.querySelector('.t-prev')?.addEventListener('click', () => {
      tIndex = (tIndex - 1 + tSlides.length) % tSlides.length; update();
    });
    setInterval(() => { tIndex = (tIndex + 1) % tSlides.length; update(); }, 6000);
  }

  /* ---------------- FAQ ACCORDION ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- GALLERY FILTER ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        const match = filter === 'all' || cat === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------------- LIGHTBOX ---------------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbTile = lightbox.querySelector('.lb-tile');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    let visibleItems = [];
    let lbIndex = 0;

    function refreshVisible() {
      visibleItems = Array.from(galleryItems).filter(i => !i.classList.contains('hide'));
    }

    function openLightbox(item) {
      refreshVisible();
      lbIndex = visibleItems.indexOf(item);
      renderLightbox();
      lightbox.classList.add('open');
      document.body.classList.add('menu-open');
    }

    function renderLightbox() {
      const item = visibleItems[lbIndex];
      if (!item) return;
      lbTile.className = 'tile lb-tile ' + item.querySelector('.tile').className.replace('tile', '').trim();
      lbTile.innerHTML = item.querySelector('.tile').innerHTML;
      lbCaption.textContent = item.getAttribute('data-title') || '';
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });

    lightbox.querySelector('.lightbox-close')?.addEventListener('click', () => {
      lightbox.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
    lightbox.querySelector('.lightbox-arrow.next')?.addEventListener('click', () => {
      refreshVisible();
      lbIndex = (lbIndex + 1) % visibleItems.length;
      renderLightbox();
    });
    lightbox.querySelector('.lightbox-arrow.prev')?.addEventListener('click', () => {
      refreshVisible();
      lbIndex = (lbIndex - 1 + visibleItems.length) % visibleItems.length;
      renderLightbox();
    });
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.classList.remove('menu-open');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-arrow.next')?.click();
      if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-arrow.prev')?.click();
    });
  }

  /* ---------------- FORM VALIDATION + SUCCESS POPUP ---------------- */
  function validateField(field) {
    const input = field.querySelector('input, textarea, select');
    if (!input) return true;
    let valid = true;
    if (input.hasAttribute('required') && !input.value.trim()) valid = false;
    if (input.type === 'email' && input.value.trim()) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(input.value.trim())) valid = false;
    }
    if (input.type === 'tel' && input.value.trim()) {
      const re = /^[0-9+()\-\s]{7,}$/;
      if (!re.test(input.value.trim())) valid = false;
    }
    field.classList.toggle('error', !valid);
    return valid;
  }

  function showModal(title, message) {
    const overlay = document.getElementById('popupOverlay');
    const modal = document.getElementById('modalSuccess');
    if (!overlay || !modal) return;
    modal.querySelector('h3').textContent = title;
    modal.querySelector('p').textContent = message;
    overlay.classList.add('show');
    modal.classList.add('show');
  }

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('popupOverlay')?.classList.remove('show');
      document.getElementById('modalSuccess')?.classList.remove('show');
    });
  });
  document.getElementById('popupOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'popupOverlay') {
      e.target.classList.remove('show');
      document.getElementById('modalSuccess')?.classList.remove('show');
    }
  });

  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      form.querySelectorAll('.field').forEach(field => {
        const input = field.querySelector('input, textarea, select');
        if (input && (input.hasAttribute('required') || input.value.trim())) {
          if (!validateField(field)) allValid = false;
        }
      });
      if (!allValid) return;

      const successTitle = form.getAttribute('data-success-title') || 'Message sent!';
      const successMsg = form.getAttribute('data-success-msg') || 'Thank you — our team will be in touch shortly.';
      showModal(successTitle, successMsg);
      form.reset();
    });

    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => validateField(input.closest('.field')));
    });
  });

  /* ---------------- FLOATING BACK TO TOP ---------------- */
  const backTop = document.querySelector('.fab-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});
