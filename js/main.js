/* =====================================================
   main.js — Editorial Micro-Interactions & UI Handlers
   Prince Yadav — Independent Zoho Systems Consultant
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─── 1. NAVBAR SCROLL EFFECT ─────────────────────────
  const header = document.querySelector('.site-header');

  function handleScroll() {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── 2. MOBILE NAVIGATION DRAWER ──────────────────────
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-nav-close');

  if (mobileMenuBtn && mobileOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    const mobileLinks = mobileOverlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── 3. FAQ ACCORDION HANDLER ────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const body = item.querySelector('.faq-body');

    if (trigger && body) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other FAQs in the list
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('active')) {
            other.classList.remove('active');
            const otherBody = other.querySelector('.faq-body');
            if (otherBody) otherBody.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = null;
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
  });

  // ─── 4. EMBEDDED CTA CONTACT FORM (RESEND INTEGRATION) ────
  const contactForms = document.querySelectorAll('.cta-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('.cta-submit-btn');
      const statusDiv = form.parentElement.querySelector('.cta-form-status') || form.querySelector('.cta-form-status');
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const reqInput = form.querySelector('[name="requirement"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const requirement = reqInput ? reqInput.value.trim() : '';

      if (!name || !email || !requirement) return;

      // Update Button State to Loading
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Project Inquiry &rarr;';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block; vertical-align:middle; margin-right:6px; animation: spin 0.8s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Sending Inquiry...
        `;
      }

      if (statusDiv) {
        statusDiv.className = 'cta-form-status';
        statusDiv.style.display = 'none';
      }

      try {
        const payload = {
          name: name,
          email: email,
          requirement: requirement
        };

        // Determine endpoint: use local endpoint if on localhost/127.0.0.1, otherwise Cloudflare Worker
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const WORKER_URL = isLocal
          ? '/api/contact'
          : 'https://prince-portfolio-contact.princeyadav7.workers.dev/api/contact';

        const res = await fetch(WORKER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && (data.success === true || data.success === 'true' || data.id)) {
          const formCard = form.closest('.cta-form-card');
          if (formCard) {
            function escapeHtml(str) {
              if (!str) return '';
              return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }

            formCard.innerHTML = `
              <div class="cta-success-card">
                <div class="cta-success-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 class="cta-success-title">Inquiry Sent Successfully</h3>
                  <p class="cta-success-desc" style="margin-top: 6px;">
                    Thank you <strong>${escapeHtml(name)}</strong>. Your requirement has been delivered directly to Prince Yadav.
                  </p>
                </div>
                
                <div class="cta-success-receipt">
                  <div class="cta-receipt-row">
                    <span class="cta-receipt-label">Direct Recipient</span>
                    <span class="cta-receipt-val">princeyadav841@gmail.com</span>
                  </div>
                  <div class="cta-receipt-row">
                    <span class="cta-receipt-label">Reply-To</span>
                    <span class="cta-receipt-val">${escapeHtml(email)}</span>
                  </div>
                  <div class="cta-receipt-row">
                    <span class="cta-receipt-label">Expected Response</span>
                    <span class="cta-receipt-val" style="color:#4ADE80; font-weight:600;">Within 24 Hours</span>
                  </div>
                </div>

                <button type="button" class="cta-reset-btn" onclick="location.reload();">
                  &larr; Send another project requirement
                </button>
              </div>
            `;
          }
        } else {
          throw new Error(data.error || data.message || `Server responded with status ${res.status}`);
        }
      } catch (err) {
        console.error('Form submission error:', err);

        if (statusDiv) {
          statusDiv.className = 'cta-form-status error';
          statusDiv.innerHTML = `
            <strong>Unable to send directly from browser:</strong>
            <p style="margin: 6px 0 8px 0; font-size: 0.9em; line-height: 1.5; color: #FCA5A5;">
              Please send your requirement directly via email or WhatsApp:
            </p>
            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 4px;">
              <a href="mailto:princeyadav841@gmail.com?subject=Project%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent('Hi Prince,\n\n' + requirement + '\n\nFrom: ' + name + ' (' + email + ')')}" style="color:#FFFFFF; text-decoration:underline; font-weight:600;">
                📧 Email Prince (princeyadav841@gmail.com) &rarr;
              </a>
              <a href="https://wa.me/919794571928?text=${encodeURIComponent('Hi Prince, I would like to discuss a Zoho project:\n' + requirement)}" target="_blank" rel="noopener noreferrer" style="color:#4ADE80; text-decoration:underline; font-weight:600;">
                💬 WhatsApp (+91 97945 71928) &rarr;
              </a>
            </div>
          `;
          statusDiv.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  });

  // ─── 6. FOOTER BACK-TO-TOP TRIGGER ───────────────────
  const backToTopBtns = document.querySelectorAll('.footer-back-to-top, .scroll-top, .footer-top-trigger');
  backToTopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
