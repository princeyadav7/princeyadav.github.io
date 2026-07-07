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


/* ─── 2. NAVIGATION SCROLL BEHAVIOUR + PROGRESS BAR ── */
const navEl      = document.getElementById('nav');
const scrollBtn  = document.getElementById('scroll-top');
const navProgress = document.getElementById('nav-progress');

function updateNavScroll() {
  const scrollY   = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress  = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

  // Frosted pill class after 50px scroll
  navEl.classList.toggle('scrolled', scrollY > 50);
  // Show scroll-to-top button after 400px
  scrollBtn.classList.toggle('show', scrollY > 400);
  // Scroll progress bar
  if (navProgress) navProgress.style.width = progress + '%';
}

window.addEventListener('scroll', updateNavScroll, { passive: true });


/* ─── 3. SCROLL-TO-TOP BUTTON ─────────────────────── */
scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });


/* ─── 4. MOBILE DRAWER NAVIGATION ─────────────────── */
const hamburger   = document.getElementById('ham');
const mobileNav   = document.getElementById('mob-nav');
const mobileClose = document.getElementById('mob-close');
const mobileBg    = document.getElementById('mob-bg');

function openDrawer() {
  mobileNav.classList.add('open');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (hamburger)   hamburger.addEventListener('click', openDrawer);
if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
if (mobileBg)    mobileBg.addEventListener('click', closeDrawer);

// Close drawer on link click
if (mobileNav) {
  mobileNav.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
    closeDrawer();
  }
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
const mobLinks = document.querySelectorAll('.mob-link');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
  mobLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


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


/* ─── 11. ZOHO ARCHITECTURE DASHBOARD ANIMATION ─────
   Simulates live enterprise automation flow and telemetry updates
   ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const nodes = [
    { id: 'node-leads', progress: 0 },
    { id: 'node-crm', progress: 33 },
    { id: 'node-creator', progress: 66 },
    { id: 'node-books', progress: 100 }
  ];
  const progressBar = document.getElementById('pipeline-progress');
  const delayVal = document.getElementById('val-delay');
  
  if (!progressBar) return;
  
  let currentStep = 0;
  
  function updatePipeline() {
    // If currentStep equals nodes.length, it means all nodes are success
    if (currentStep === nodes.length) {
      nodes.forEach(node => {
        const el = document.getElementById(node.id);
        if (el) el.className = 'pipeline-node success';
      });
      progressBar.style.width = '100%';
      currentStep = 0;
      setTimeout(updatePipeline, 3000); // Hold success state longer
      return;
    }

    nodes.forEach((node, idx) => {
      const el = document.getElementById(node.id);
      if (!el) return;
      
      if (idx < currentStep) {
        el.className = 'pipeline-node success';
      } else if (idx === currentStep) {
        el.className = 'pipeline-node active';
      } else {
        el.className = 'pipeline-node';
      }
    });
    
    // Set progress bar width
    const targetProgress = nodes[currentStep].progress;
    progressBar.style.width = `${targetProgress}%`;
    
    currentStep++;
    setTimeout(updatePipeline, 2200);
  }
  
  // Start simulation
  setTimeout(updatePipeline, 1000);
  
  // Telemetry fluctuation simulator
  if (delayVal) {
    setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 8) + 11; // 11ms to 18ms
      delayVal.innerHTML = `${randomDelay}<span class="unit">ms</span>`;
    }, 2500);
  }
});


/* ─── 12. ABOUT SECTION INTERACTIVE TABS & SKILLS ────
   Handles profile tabs switching and runs skill bar animations
   ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.about-tab-btn');
  const tabPanes   = document.querySelectorAll('.about-tab-pane');
  
  if (!tabButtons.length) return;
  
  // Function to animate skill progress bars
  function animateSkillBars() {
    const skillFills = document.querySelectorAll('#pane-skills .skill-fill');
    skillFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-width') || '0%';
      // Reset width first to allow animation re-play
      fill.style.width = '0%';
      // Use setTimeout to allow browser layout calculation before animating
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 50);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(`pane-${targetTab}`);
      
      if (!targetPane) return;
      
      // Remove active class from all buttons and panes
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Activate clicked button and matching pane
      btn.classList.add('active');
      targetPane.classList.add('active');
      
      // If skills tab is selected, trigger the progress bars animation
      if (targetTab === 'skills') {
        animateSkillBars();
      }
    });
  });
});


/* ─── 13. TECH STACK INTERACTIVE SANDBOX ──────────────
   Handles category filtering of tech items and updates
   the live Architect Sandbox terminal detail panel.
   ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const stackData = {
    crm: {
      name: "Zoho CRM",
      role: "Core Sales Ledger",
      desc: "Acts as the central master repository for commercial and operational data. Prince designs security policies, pipeline stages, custom layouts, and automated assignment rules.",
      flow: ["Lead Ingest", "Zoho CRM", "Zoho Books"],
      tip: "Always enforce strict layout rules & validation scripts (Page Layout Rules) to keep CRM data clean, and use phone/email hashing inside Deluge hooks for custom lead deduplication before record creation."
    },
    creator: {
      name: "Zoho Creator",
      role: "Low-Code ERP Engine",
      desc: "Used to build customized applications and extensions that Zoho One does not cover out of the box. Excellent for inventory audits, crew logistics, and specialized client portals.",
      flow: ["Web Portal", "Zoho Creator", "SQL Data Sync"],
      tip: "Leverage HTML/CSS in Creator Page Builders to deliver premium, client-facing portals, and always handle complex DB loops in batch records using Deluge search queries to avoid execution limits."
    },
    books: {
      name: "Zoho Books",
      role: "Central Ledger & Finance",
      desc: "Core accounting engine managing invoicing, revenue recognition, tax compliance, and automated payment gateways.",
      flow: ["Closed Deal", "Zoho Books", "Payment Gateways"],
      tip: "Use Custom Fields & Custom Buttons in Books to trigger automated tax validation via external API webhooks (like ZATCA / VAT / GST) before finalizing invoices."
    },
    analytics: {
      name: "Zoho Analytics",
      role: "BI & Executive Intelligence",
      desc: "Combines data from CRM, Books, Creator, and custom SQL databases to generate live operational dashboards, compliance reports, and sales forecasts.",
      flow: ["Raw Data", "SQL Queries", "Analytics Dashboard"],
      tip: "Use Query Tables (SQL JOINs) rather than native Auto-Join features for large datasets; this dramatically improves dashboard load speeds and keeps report logic transparent."
    },
    flow: {
      name: "Zoho Flow",
      role: "Integration Orchestrator",
      desc: "Visually routes data payloads between Zoho modules and external SaaS applications (Slack, HubSpot, Twilio) with minimal code.",
      flow: ["App Event", "Zoho Flow", "Webhook Dispatch"],
      tip: "Use Zoho Flow for high-level event triggers, but switch to Deluge-driven REST API calls inside CRM/Creator if the integration requires deep conditional logic or array manipulation."
    },
    campaigns: {
      name: "Zoho Campaigns",
      role: "Marketing Automation",
      desc: "Drives outbound email marketing, newsletters, and lead-nurturing drip campaigns based on prospect scoring.",
      flow: ["Ad Form", "Campaigns Drip", "CRM Lead Sync"],
      tip: "Always synchronize Campaigns lists bidirectionally with CRM using contact custom views so unsubscribes and lead statuses match perfectly in real time."
    },
    desk: {
      name: "Zoho Desk",
      role: "Support & Customer Care",
      desc: "Handles customer support tickets, service level agreements (SLAs), and self-service knowledge base portals.",
      flow: ["Client Email", "Zoho Desk", "CRM Contact Sync"],
      tip: "Implement Desk-CRM ticket mapping so account executives can instantly see open tickets on a contact record before booking upsell calls."
    },
    people: {
      name: "Zoho People",
      role: "HR & Compliance Ledger",
      desc: "Manages employee onboarding, timesheets, compliance certificates, and leave requests globally.",
      flow: ["Hired Candidate", "Zoho People", "Payroll Sync"],
      tip: "Write custom Deluge triggers on employee record updates to automatically spin up a personal Workspace, email account, and access rights in external modules."
    },
    sign: {
      name: "Zoho Sign",
      role: "Secure eSignature",
      desc: "Streamlines electronic signatures for NDAs, client contracts, and vendor agreements, ensuring GDPR/HIPAA compliance.",
      flow: ["Deal Approved", "Zoho Sign", "Secure Contract"],
      tip: "Use Zoho Sign's API with dynamic text tags inside CRM templates to auto-populate and dispatch contracts without manual document assembly."
    },
    inventory: {
      name: "Zoho Inventory",
      role: "Inventory Control & Logistics",
      desc: "Tracks raw materials, batch numbers, warehouses, and handles purchase/sales orders in real time.",
      flow: ["Sales Order", "Inventory Allocation", "Carrier Dispatch"],
      tip: "Implement multi-warehouse stock checks inside Creator workflows before a sales order is pushed to Zoho Inventory to prevent order fulfillment backlogs."
    },
    lms: {
      name: "Zoho LMS",
      role: "Roster & Training Academy",
      desc: "Powers internal employee training modules and customer onboarding academies.",
      flow: ["New Onboarding", "LMS Course Assign", "Compliance Check"],
      tip: "Connect LMS course completions to Zoho People profiles so employee compliance databases reflect new certifications automatically."
    },
    recruit: {
      name: "Zoho Recruit",
      role: "ATS & Recruitment",
      desc: "Manages job openings, resumes, candidates, interviews, and background checks.",
      flow: ["Job Portal", "Recruit Parsing", "Interview Roster"],
      tip: "Configure Zoho Sign integrations directly in Zoho Recruit to send offer letters and legal agreements directly from candidate profiles."
    },
    projects: {
      name: "Zoho Projects",
      role: "Project Delivery Ledger",
      desc: "Manages project tasks, Gantt charts, milestones, and logs project billable hours into Zoho Books.",
      flow: ["Closed Deal", "Project Template", "Task Assignments"],
      tip: "Automate project creation in Zoho Projects via CRM Blueprint transitions to ensure tasks, milestones, and budgets are generated from client specifications instantly."
    },
    expense: {
      name: "Zoho Expense",
      role: "Expense & Audit Control",
      desc: "Automates employee expense report generation, corporate credit card feeds, and travel approvals.",
      flow: ["Receipt Scan", "Expense Report", "Books Reconciliation"],
      tip: "Integrate Google Maps API inside Zoho Expense mileage claims to auto-verify travel distances, preventing inflated expense claims."
    },
    social: {
      name: "Zoho Social",
      role: "Social Media Management",
      desc: "Schedules social posts, monitors brand mentions, and generates engagement reports.",
      flow: ["Post Schedule", "Multi-Channel Post", "Analytics Sync"],
      tip: "Use Lead Generation integrations in Social to automatically push Facebook Lead Ads and LinkedIn Lead Gen form submissions into Zoho CRM within 60 seconds."
    },
    webhooks: {
      name: "REST / Webhooks",
      role: "External Data Integration",
      desc: "Standardized protocol used to push real-time events and data between Zoho One and non-Zoho systems.",
      flow: ["SaaS Event", "Webhook Payload", "Deluge Script"],
      tip: "Always use OAuth 2.0 rather than static API keys for webhooks, and implement header token verification on incoming webhooks to secure endpoint exposure."
    },
    deluge: {
      name: "Deluge Scripting",
      role: "Business Logic Language",
      desc: "Zoho's native coding language. Prince writes clean, high-performance Deluge scripts to engineer custom logic, loop controls, and API calls.",
      flow: ["Workflow Trigger", "Deluge Script", "DB Action"],
      tip: "Utilize Maps and Lists efficiently in Deluge to execute bulk API requests (e.g. up to 200 records at once) to avoid hitting daily execution limits."
    },
    whatsapp: {
      name: "WhatsApp API",
      role: "Omnichannel Messaging",
      desc: "Delivers instant notifications, invoices, and updates directly to client phones, boosting customer engagement.",
      flow: ["Books Invoice", "WhatsApp Cloud API", "Client Phone"],
      tip: "Always verify Meta WhatsApp template statuses before calling the API, and handle opt-out responses (STOP) directly in a webhook receiver to ensure GDPR compliance."
    },
    googleads: {
      name: "Google Ads API",
      role: "Marketing ROI Tracking",
      desc: "Connects ad spend data and landing page click events directly to customer lifecycles inside Zoho.",
      flow: ["Ad Click", "GCLID Capture", "CRM Conversion Sync"],
      tip: "Pass the GCLID (Google Click ID) through your web forms to Zoho CRM. Prince updates Google Offline Conversions when sales close in CRM for 100% accurate ad matching."
    },
    sql: {
      name: "SQL & ETL",
      role: "Data Engineering",
      desc: "Structured Query Language and Extract, Transform, Load pipelines used to clean, join, and analyze complex multi-app datasets.",
      flow: ["DB Sources", "ETL Job", "Data Warehouse"],
      tip: "Always stage raw ETL data into intermediate schemas before transforming it, ensuring any transmission errors can be retried without database corruption."
    }
  };

  const filterButtons = document.querySelectorAll('.stack-filter-btn');
  const stackItems = document.querySelectorAll('.stack-item');
  const sandboxContent = document.querySelector('.sandbox-content');

  // DOM Elements for terminal detail panel
  const sandboxTitle = document.getElementById('sandbox-title');
  const sandboxCmdId = document.getElementById('sandbox-cmd-id');
  const sandboxIcon = document.getElementById('sandbox-icon');
  const sandboxIconWrap = document.getElementById('sandbox-icon-wrap');
  const sandboxToolName = document.getElementById('sandbox-tool-name');
  const sandboxRole = document.getElementById('sandbox-role');
  const sandboxDesc = document.getElementById('sandbox-desc');
  const sandboxFlowChart = document.getElementById('sandbox-flow-chart');
  const sandboxTip = document.getElementById('sandbox-tip');

  if (!stackItems.length || !sandboxToolName) return;

  // 1. FILTERING FUNCTIONALITY
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      stackItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Smooth fade-in
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 30);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          // Delay display change to match opacity transition
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 2. CARD CLICK & DETAILS UPDATE FUNCTIONALITY
  function updateSandbox(id) {
    const data = stackData[id];
    if (!data) return;

    const item = document.querySelector(`.stack-item[data-id="${id}"]`);
    if (!item) return;

    // Get color and brand glow values from style attributes
    const color = item.style.getPropertyValue('--brand-color') || '#6366f1';
    const glow = item.style.getPropertyValue('--brand-glow') || 'rgba(99, 102, 241, 0.15)';
    const iconClass = item.querySelector('i').className;

    // Trigger update animation on terminal body
    sandboxContent.classList.add('updating');

    setTimeout(() => {
      // Update terminal text values
      sandboxTitle.textContent = `Architect Console · ${id}.sys`;
      sandboxCmdId.textContent = id;
      sandboxToolName.textContent = data.name;
      sandboxRole.textContent = data.role;
      sandboxDesc.textContent = data.desc;
      sandboxTip.textContent = data.tip;

      // Update icon and container style colors
      sandboxIcon.className = iconClass;
      sandboxIconWrap.style.color = color;
      sandboxIconWrap.style.backgroundColor = glow;

      // Update terminal accent colors in CSS custom properties
      document.querySelector('.sandbox-console').style.setProperty('--accent-theme', color);
      document.querySelector('.sandbox-console').style.setProperty('--accent-theme-glow', glow);

      // Render Integration Flow Chart
      sandboxFlowChart.innerHTML = '';
      data.flow.forEach((step, idx) => {
        // Create Node
        const node = document.createElement('div');
        node.className = `flow-node ${idx === 1 ? 'active' : ''}`;
        node.textContent = step;
        sandboxFlowChart.appendChild(node);

        // Create Arrow if not last node
        if (idx < data.flow.length - 1) {
          const arrow = document.createElement('div');
          arrow.className = 'flow-arrow';
          arrow.innerHTML = '<i class="fas fa-long-arrow-alt-right"></i>';
          sandboxFlowChart.appendChild(arrow);
        }
      });

      // Finish update animation
      sandboxContent.classList.remove('updating');
    }, 200);
  }

  // Bind click handlers to cards
  stackItems.forEach(item => {
    item.addEventListener('click', () => {
      // Toggle active states on cards
      stackItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const toolId = item.getAttribute('data-id');
      updateSandbox(toolId);
    });
  });

  // 3. INTERACTIVE CHIP LINKING FROM SERVICES TO TECH STACK
  const interactiveChips = document.querySelectorAll('.interactive-chip[data-stack-id]');
  interactiveChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const stackId = chip.getAttribute('data-stack-id');
      const targetStackItem = document.querySelector(`.stack-item[data-id="${stackId}"]`);
      
      if (targetStackItem) {
        // 1. Smooth scroll to the stack section
        const stackSection = document.getElementById('stack');
        if (stackSection) {
          stackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // 2. Select category filter first to make sure it's visible
        const category = targetStackItem.getAttribute('data-category');
        const filterBtn = document.querySelector(`.stack-filter-btn[data-filter="${category}"]`) || 
                          document.querySelector('.stack-filter-btn[data-filter="all"]');
        if (filterBtn) {
          filterBtn.click();
        }

        // 3. Activate the stack item
        stackItems.forEach(i => i.classList.remove('active'));
        targetStackItem.classList.add('active');

        // 4. Update the console
        updateSandbox(stackId);

        // 5. Add a visual pulse animation to guide the user's eye
        const brandColor = targetStackItem.style.getPropertyValue('--brand-color') || '#6366f1';
        
        // Remove animation class if already present to restart it
        targetStackItem.classList.remove('pulse-glow-highlight');
        const consolePanel = document.querySelector('.sandbox-console');
        if (consolePanel) {
          consolePanel.classList.remove('pulse-glow-highlight');
        }

        // Trigger reflow to restart CSS animation
        void targetStackItem.offsetWidth;

        targetStackItem.style.setProperty('--pulse-color', brandColor);
        targetStackItem.classList.add('pulse-glow-highlight');
        
        if (consolePanel) {
          consolePanel.style.setProperty('--pulse-color', brandColor);
          consolePanel.classList.add('pulse-glow-highlight');
        }

        // Clean up animation classes after completion
        setTimeout(() => {
          targetStackItem.classList.remove('pulse-glow-highlight');
          if (consolePanel) {
            consolePanel.classList.remove('pulse-glow-highlight');
          }
        }, 1200);
      }
    });
  });

  // Initialize with Zoho CRM details on page load
  updateSandbox('crm');
});


