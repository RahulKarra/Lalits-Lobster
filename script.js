/* ============================================================
   LALIT'S — script.js  v3 Polished
   – Glassmorphism navbar on scroll
   – Proper client marquee pause/highlight
   – Smooth scroll with easing
   – Touch-friendly carousel
   – Refined scroll-reveal
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // NAVBAR — glass effect on scroll + active link highlight
  // ============================================================
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  let lastScroll = 0;

  const onScroll = () => {
    const y = window.scrollY;
    // Glass effect
    navbar.classList.toggle('scrolled', y > 50);
    // Scroll-to-top button
    scrollTopBtn.classList.toggle('show', y > 400);
    // Highlight active nav link
    highlightActiveNav();
    lastScroll = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // ACTIVE SECTION HIGHLIGHT
  // ============================================================
  function highlightActiveNav() {
    const sections = ['home', 'about', 'categories', 'catalogue', 'clients', 'testimonials', 'contact'];
    let active = 'home';
    const scrollPos = window.scrollY + 120;
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && scrollPos >= el.offsetTop) active = id;
    }
    document.querySelectorAll('#desktopNav .nav-link, #desktopNav .dropdown-trigger').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + active) link.classList.add('active');
    });
  }

  // ============================================================
  // HAMBURGER — animated toggle
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    // Prevent body scroll when menu open
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Mobile catalogue dropdown
  const mobCatalogueBtn = document.getElementById('mobCatalogueBtn');
  const mobCatalogueContent = document.getElementById('mobCatalogueContent');
  if (mobCatalogueBtn) {
    mobCatalogueBtn.addEventListener('click', () => {
      mobCatalogueContent.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mob-link, .mob-sub-link, .mob-cta').forEach(el => {
    el.addEventListener('click', () => {
      if (el.classList.contains('mob-drop-btn')) return;
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ============================================================
  // DESKTOP DROPDOWN — hover + click hybrid
  // ============================================================
  const catalogueBtn = document.getElementById('catalogueBtn');
  const catalogueMenu = document.getElementById('catalogueMenu');

  if (catalogueBtn && catalogueMenu) {
    catalogueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      catalogueMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!catalogueBtn.contains(e.target) && !catalogueMenu.contains(e.target)) {
        catalogueMenu.classList.remove('open');
      }
    });
  }

  // ============================================================
  // SMOOTH SCROLL — custom easing
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // SCROLL REVEAL — Intersection Observer with stagger
  // ============================================================
  const revealEls = document.querySelectorAll('.slide-from-left, .slide-from-right, .fade-up');

  revealEls.forEach(el => {
    const delay = el.style.getPropertyValue('--delay');
    if (delay) el.style.transitionDelay = delay;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small RAF delay for smoother paint
        requestAnimationFrame(() => {
          entry.target.classList.add('visible');
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ============================================================
  // STAT COUNTERS — animate numbers on first view
  // ============================================================
  const statNums = document.querySelectorAll('.stat-num');
  let countersRan = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersRan) {
        countersRan = true;
        statNums.forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          if (isNaN(target)) return;
          let current = 0;
          const duration = 1800; // ms
          const steps = 70;
          const increment = target / steps;
          const stepTime = duration / steps;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) { current = target; clearInterval(interval); }
            el.textContent = Math.floor(current).toLocaleString('en-IN');
          }, stepTime);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.getElementById('home');
  if (heroSection) counterObserver.observe(heroSection);

  // ============================================================
  // CATALOGUE FILTER — with smooth fade-in/out
  // ============================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  function applyFilter(filter) {
    // Set active button
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    // Animate cards
    productCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      if (show) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s, transform 0.4s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => { card.style.display = 'none'; }, 350);
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Handle catalogue dropdown links + mobile sub-links
  document.querySelectorAll('.dropdown-item, .mob-sub-link').forEach(link => {
    link.addEventListener('click', () => {
      const filter = link.dataset.filter;
      if (filter) {
        setTimeout(() => applyFilter(filter), 500);
      }
    });
  });

  // Category card click
  document.querySelectorAll('.cat-card[data-filter]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const filter = card.dataset.filter;
      setTimeout(() => applyFilter(filter), 500);
    });
  });

  // ============================================================
  // CLIENT MARQUEE — JS-driven pause on hover
  // ============================================================
  const clientsTrack = document.getElementById('clientsTrack');
  const clientsWrap = clientsTrack ? clientsTrack.parentElement : null;

  if (clientsTrack && clientsWrap) {
    // Pause on hover (add class so CSS dims non-hovered cards)
    clientsWrap.addEventListener('mouseenter', () => {
      clientsTrack.classList.add('paused');
    });
    clientsWrap.addEventListener('mouseleave', () => {
      clientsTrack.classList.remove('paused');
    });

    // Touch: pause while touching
    clientsWrap.addEventListener('touchstart', () => {
      clientsTrack.classList.add('paused');
    }, { passive: true });
    clientsWrap.addEventListener('touchend', () => {
      setTimeout(() => clientsTrack.classList.remove('paused'), 2000);
    });
  }

  // ============================================================
  // TESTIMONIALS CAROUSEL — swipe + auto-play
  // ============================================================
  const carousel = document.getElementById('testiCarousel');
  const testiCards = carousel ? carousel.querySelectorAll('.testi-card') : [];
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (carousel && testiCards.length > 0) {
    let current = 0;
    const total = testiCards.length;

    // Build dots
    testiCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    const goToSlide = (index) => {
      current = ((index % total) + total) % total;
      carousel.style.transform = `translateX(-${current * 100}%)`;
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    };

    prevBtn.addEventListener('click', () => goToSlide(current - 1));
    nextBtn.addEventListener('click', () => goToSlide(current + 1));

    // Auto-play
    let autoTimer = setInterval(() => goToSlide(current + 1), 5500);
    const pauseAuto = () => clearInterval(autoTimer);
    const resumeAuto = () => { pauseAuto(); autoTimer = setInterval(() => goToSlide(current + 1), 5500); };

    carousel.addEventListener('mouseenter', pauseAuto);
    carousel.addEventListener('mouseleave', resumeAuto);

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;
    carousel.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      pauseAuto();
    }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      // Only swipe if horizontal movement > vertical
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        goToSlide(dx > 0 ? current + 1 : current - 1);
      }
      resumeAuto();
    });
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        formMsg.classList.remove('hidden');
        setTimeout(() => formMsg.classList.add('hidden'), 5000);
      }, 1600);
    });
  }

  // ============================================================
  // PARALLAX EFFECT (subtle on hero bg)
  // ============================================================
  const heroBg = document.querySelector('.hero-bg-blur');
  if (heroBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          heroBg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // DONE
  // ============================================================
  console.log('%cLalit\'s Premium Clothing 🧵', 'color:#C8102E;font-size:16px;font-weight:bold;');
});
