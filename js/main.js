/* =====================================================
   main.js — All JavaScript for Prince Yadav Portfolio
   =====================================================
   Sections:
     1. Typing Animation (hero headline)
     2. Navigation Scroll Behaviour
     3. Scroll-To-Top Button
     4. Mobile Navigation Toggle
     5. Scroll Reveal (IntersectionObserver)
     6. Active Nav Link Highlight
     7. Contact Form Handler
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

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  // TODO: replace setTimeout with fetch() to your form endpoint
  setTimeout(() => {
    success.style.display = 'block';
    btn.innerHTML         = '<i class="fas fa-check"></i> Sent';
    btn.style.background  = 'var(--teal)';
  }, 1100);
}
