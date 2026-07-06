/* =====================================================
   main.js — All JavaScript for Prince Yadav Portfolio
   =====================================================
   Sections:
     1.  Typing Animation (hero headline)
     2.  Navigation Scroll Behaviour
     3.  Scroll-To-Top Button
     4.  Mobile Navigation Toggle
     5.  Scroll Reveal (IntersectionObserver)
     6.  Active Nav Link Highlight
     7.  Contact Form Handler
     8.  Dynamic Currency & Region Toggler
     9.  Case Study Moving Sliding Carousel (continuous loop)
     10. Hero Stats Count-Up Animation
   ===================================================== */

/* ─── 1. TYPING ANIMATION ────────────────────────────
   Edit `words` array to change the rotating text.
   ─────────────────────────────────────────────────── */
const words = [
  'Enterprise Automation',
  'Zoho CRM',
  'Zoho Creator',
  'Deluge & APIs'
];
let wordIndex  = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typed');

function typeLoop() {
  const current = words[wordIndex];
  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
      setTimeout(typeLoop, 350);
      return;
    }
  }
  setTimeout(typeLoop, isDeleting ? 55 : 100);
}
document.addEventListener('DOMContentLoaded', () => setTimeout(typeLoop, 600));


/* ─── 2. NAVIGATION SCROLL BEHAVIOUR ───────────────── */
const navEl     = document.getElementById('nav');
const scrollBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  // Add frosted-glass class after 50px scroll
  navEl.classList.toggle('scrolled', window.scrollY > 50);
  // Show scroll-to-top button after 400px
  scrollBtn.classList.toggle('show', window.scrollY > 400);
});


/* ─── 3. SCROLL-TO-TOP BUTTON ─────────────────────── */
scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });


/* ─── 4. MOBILE NAVIGATION TOGGLE ────────────────── */
const hamburger  = document.getElementById('ham');
const mobileNav  = document.getElementById('mob-nav');
const mobileClose= document.getElementById('mob-close');

hamburger.onclick   = () => mobileNav.classList.add('open');
mobileClose.onclick = () => mobileNav.classList.remove('open');
mobileNav.querySelectorAll('a').forEach(link => {
  link.onclick = () => mobileNav.classList.remove('open');
});


/* ─── 5. SCROLL REVEAL ────────────────────────────────
   Elements with class .rv / .rv-l / .rv-r animate in
   when they enter the viewport.
   ─────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.rv, .rv-l, .rv-r');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('on'), i * 45);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObs.observe(el));


/* ─── 6. ACTIVE NAV LINK HIGHLIGHT ────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-l');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + current;
    link.style.color = isActive ? 'var(--blue)' : '';
  });
});


/* ─── 7. CONTACT FORM HANDLER ──────────────────────
   Replace this mock handler with a real backend call
   (Formspree, Netlify Forms, or your own API).
   ─────────────────────────────────────────────────── */
function handleForm(e) {
  e.preventDefault();
  const btn     = document.getElementById('f-btn');
  const success = document.getElementById('f-success');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  btn.disabled  = true;

  // ── Zoho Forms submission URL (from HTML & CSS embed) ──
  const zohoUrl = 'https://forms.zohopublic.in/adminmicro1/form/StartaProjectEnquiry/formperma/hSofY-7FRWAjTpM_skXRH3o5seXYyDnVgcFzSgaB3xw/htmlRecords/submit';

  // Build hidden form with EXACT Zoho field names
  const hf = document.createElement('form');
  hf.method  = 'POST';
  hf.action  = zohoUrl;
  hf.target  = 'zf_hidden';
  hf.style.display = 'none';
  hf.acceptCharset = 'UTF-8';

  const fields = {
    'SingleLine'      : document.getElementById('f-name').value.trim(),
    'SingleLine1'     : document.getElementById('f-co').value.trim(),
    'Email'           : document.getElementById('f-email').value.trim(),
    'Dropdown'        : document.getElementById('f-svc').value,
    'Dropdown1'       : document.getElementById('f-bud').value,
    'MultiLine'       : document.getElementById('f-msg').value.trim(),
    'zf_referrer_name': window.location.href,
    'zf_redirect_url' : '',
    'zc_gad'          : ''
  };

  Object.entries(fields).forEach(([k, v]) => {
    const inp = document.createElement('input');
    inp.type  = 'hidden';
    inp.name  = k;
    inp.value = v;
    hf.appendChild(inp);
  });

  document.body.appendChild(hf);
  hf.submit();
  document.body.removeChild(hf);

  // Show success after Zoho processes
  setTimeout(() => {
    success.style.display = 'block';
    success.innerHTML     = '<i class="fas fa-check-circle"></i> Message sent! I\'ll respond within 24 hours.';
    success.style.color   = '';
    btn.innerHTML         = '<i class="fas fa-check"></i> Sent';
    btn.style.background  = 'var(--teal)';
    document.getElementById('cf-form').reset();
  }, 1800);
}

/* ─── 8. DYNAMIC CURRENCY & REGION TOGGLER ─────────
   Enables international recruiters/clients to see project
   metrics and budgets in their home currencies.
   ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const toggler = document.getElementById('currency-toggler');
  if (!toggler) return;

  const buttons = toggler.querySelectorAll('.curr-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Remove active state from all toggles, apply to clicked
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const currency = btn.getAttribute('data-currency'); // usd, eur, gbp, aud, aed

      // 2. Transmute Case Studies Metrics
      const metrics = document.querySelectorAll('[data-curr-metric]');
      metrics.forEach(node => {
        const val = node.getAttribute(`data-val-${currency}`);
        if (val) {
          node.classList.add('transmuting');
          setTimeout(() => {
            node.textContent = val;
            node.classList.remove('transmuting');
          }, 120);
        }
      });

      // 3. Transmute Narrative Dollar Values in Case Study Text
      const narratives = document.querySelectorAll('[data-curr-narrative]');
      narratives.forEach(node => {
        const val = node.getAttribute(`data-val-${currency}`);
        if (val) {
          node.textContent = val;
        }
      });

      // 4. Transmute Form Budget Select Box Options
      const options = document.querySelectorAll('#f-bud option[data-bud-usd]');
      options.forEach(opt => {
        const val = opt.getAttribute(`data-bud-${currency}`);
        if (val) {
          opt.textContent = val;
          opt.value = val; // ensures matching currency string is emailed in backend
        }
      });
    });
  });
});

/* ─── 9. CASE STUDY MOVING SLIDING CAROUSEL ──────────
   Handles horizontal sliding between the 6 corporate
   case studies using tabs, arrow buttons, and touch swiping.
   ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('case-carousel-track');
  if (!track) return;

  const originalSlides = Array.from(track.querySelectorAll('.case-card'));
  if (originalSlides.length === 0) return;

  // 1. Clone last slide and prepend to track
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
  lastClone.id = 'card-clone-last';
  lastClone.classList.add('carousel-clone');
  track.insertBefore(lastClone, originalSlides[0]);

  // 2. Clone first slide and append to track
  const firstClone = originalSlides[0].cloneNode(true);
  firstClone.id = 'card-clone-first';
  firstClone.classList.add('carousel-clone');
  track.appendChild(firstClone);

  // Keep slides referencing the original array of slide cards
  const slides = originalSlides;

  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dots = document.querySelectorAll('#carousel-dots .carousel-dot');
  const tabBtns = document.querySelectorAll('#case-tabs .case-tab-btn');

  let currentIndex = 0;
  let startX = 0;
  let autoScrollTimer = null;

  function goToSlide(index, manual = false) {
    if (manual) {
      stopAutoScroll();
    }

    // Ensure transition is restored in case it was disabled previously
    track.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';

    // Infinite wrapping transitions
    if (index < 0) {
      currentIndex = slides.length - 1;
      // Slide smoothly backward to index 0 on track (the prepended clone)
      track.style.transform = `translateX(0%)`;
    } else if (index >= slides.length) {
      currentIndex = 0;
      // Slide smoothly forward to the appended clone (index slides.length + 1 on track)
      track.style.transform = `translateX(-${(slides.length + 1) * 100}%)`;
    } else {
      currentIndex = index;
      track.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    }

    // Update active tab buttons immediately for snappiness
    tabBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIndex);
    });

    // Update active dots immediately
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Enable all navigation buttons since it's infinite!
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;

    // Force scroll reveal active class on current slide card
    slides[currentIndex].classList.add('on');

    if (manual) {
      startAutoScroll();
    }
  }

  // Native transitionend event listener for seamless infinite jumps
  track.addEventListener('transitionend', () => {
    // When transition to the appended clone ends, instantly jump to real first slide at index 1
    if (currentIndex === 0 && track.style.transform.includes(`-${(slides.length + 1) * 100}%`)) {
      track.style.transition = 'none';
      track.style.transform = 'translateX(-100%)';
      track.offsetHeight; // force reflow
      track.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
    }
    // When transition to the prepended clone ends, instantly jump to real last slide at index 6
    if (currentIndex === slides.length - 1 && (track.style.transform === 'translateX(0px)' || track.style.transform === 'translateX(0%)')) {
      track.style.transition = 'none';
      track.style.transform = `translateX(-${slides.length * 100}%)`;
      track.offsetHeight; // force reflow
      track.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
    }
  });

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); // 5.0s — enough time to read dense case study text
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  // Prev & Next navigation button clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1, true));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1, true));
  }

  // Indicator Dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      goToSlide(idx, true);
    });
  });

  // Segmented Tab clicks
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      goToSlide(idx, true);
    });
  });

  // Touch swiping gestures for mobile
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // threshold: 50px swipe distance
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToSlide(currentIndex + 1, true);
      } else {
        goToSlide(currentIndex - 1, true);
      }
    }
  }, { passive: true });

  // Hover states to pause auto-scroll
  const container = document.querySelector('.case-carousel-container');
  if (container) {
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);
  }

  // ── Keyboard arrow key support (accessibility) ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  goToSlide(currentIndex - 1, true);
    if (e.key === 'ArrowRight') goToSlide(currentIndex + 1, true);
  });

  // Initialize the carousel slider
  goToSlide(0);
  startAutoScroll();
});


/* ─── 10. HERO STATS COUNT-UP ANIMATION ──────────────
   Animates the numeric stats in the hero section when
   they first scroll into view using IntersectionObserver.
   ─────────────────────────────────────────────────── */
function animateCounter(el, target, suffix, duration = 1200) {
  const start    = performance.now();
  const isFloat  = target % 1 !== 0;

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target * 10) / 10;
    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-n');
  if (!statNumbers.length) return;

  const countUpObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Extract numeric value and suffix from original text content
      const raw    = el.textContent.trim();          // e.g. "15+" or "4+"
      const num    = parseFloat(raw);                // 15 or 4
      const suffix = raw.replace(/[\d.]/g, '');      // "+" or "+"
      if (!isNaN(num)) animateCounter(el, num, suffix);
      countUpObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countUpObs.observe(el));
});
