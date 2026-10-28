/**
 * HERBALBOLT LLP — WEBSITE JAVASCRIPT
 * Lenis smooth scroll, GSAP ScrollTrigger reveals, animated cards,
 * navigation, product enquiry and contact form handling.
 */

let lenisInstance = null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initGSAPAnimations();
  initCardSpotlight();
  initNavigation();
  initScrollSpy();
  initProductInteractions();
  initContactForm();
});

// ============================================================================
// 1. Lenis Smooth Scrolling Setup
// ============================================================================
function getNavOffset() {
  return window.innerWidth <= 640 ? -68 : -76;
}

function initLenis() {
  if (typeof Lenis === 'undefined' || prefersReducedMotion) return;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      lenisInstance.scrollTo(targetEl, { offset: getNavOffset(), duration: 1.1 });
    });
  });
}

// ============================================================================
// 2. GSAP ScrollTrigger Reveals
// ============================================================================
// Reveals use fromTo with explicit end values: plain from() re-reads the
// "current" style on ScrollTrigger refresh, which can capture opacity 0.
const REVEAL_END = { x: 0, y: 0, scale: 1, opacity: 1, clearProps: 'all' };

const REVEAL_FROM = {
  up: { y: 40, opacity: 0 },
  left: { x: -40, opacity: 0 },
  right: { x: 40, opacity: 0 },
  zoom: { scale: 0.94, opacity: 0 }
};

function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) {
    initCounters(false);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
    .fromTo('.hero-eyebrow', { y: 20, opacity: 0 }, { ...REVEAL_END, duration: 0.6 })
    .fromTo('.hero-line', { y: 60, opacity: 0 }, { ...REVEAL_END, stagger: 0.12, duration: 0.9 }, '-=0.3')
    .fromTo('.hero-description', { y: 20, opacity: 0 }, REVEAL_END, '-=0.5')
    .fromTo('.hero-cta-group .btn', { y: 20, opacity: 0 }, { ...REVEAL_END, stagger: 0.1 }, '-=0.5')
    .fromTo('.hero-stats .stat', { y: 20, opacity: 0 }, { ...REVEAL_END, stagger: 0.08 }, '-=0.5')
    .fromTo('.hero-image-wrapper', { scale: 0.92, opacity: 0 }, { ...REVEAL_END, duration: 1.1 }, 0.2)
    .fromTo('.float-card', { scale: 0.8, opacity: 0 }, { ...REVEAL_END, stagger: 0.15, ease: 'back.out(1.7)' }, 0.8);

  gsap.to('.hero-image', {
    yPercent: 6,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  // Single elements
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const from = REVEAL_FROM[el.dataset.reveal] || REVEAL_FROM.up;
    gsap.fromTo(el, from, {
      ...REVEAL_END,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Card groups
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    gsap.fromTo(group.children, { y: 50, opacity: 0, scale: 0.96 }, {
      ...REVEAL_END,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%', once: true }
    });
  });

  // Product bottle float
  gsap.to('.product-img', { y: -14, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  initCounters(true);
}

// ============================================================================
// 3. Count-up Numbers
// ============================================================================
function initCounters(animate) {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    if (!animate) {
      el.textContent = target;
      return;
    }

    const counter = { value: 0 };
    el.textContent = '0';
    gsap.to(counter, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(counter.value); },
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }
    });
  });
}

// ============================================================================
// 4. Card Cursor Spotlight
// ============================================================================
function initCardSpotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.querySelectorAll('.fx-card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// ============================================================================
// 5. Navigation & Mobile Drawer
// ============================================================================
function initNavigation() {
  const header = document.getElementById('navbar');
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu-cta a');

  // Sticky Navbar Scroll Listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle
  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });

    // Close on mobile link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu(false);
        toggleBtn.focus();
      }
    });
  }

  function toggleMobileMenu(open) {
    if (open) {
      mobileMenu.classList.add('open');
      toggleBtn.classList.add('active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }
}

// ============================================================================
// 6. Play Bull & Product Enquiry Interactions
// ============================================================================
function initProductInteractions() {
  const enquireBtn = document.getElementById('btn-playbull-enquire');
  if (enquireBtn) {
    enquireBtn.addEventListener('click', () => {
      handleProductEnquiry('Herbal Bolt Play Bull African Herbs (Power X Capsule)');
    });
  }
}

function handleProductEnquiry(productName) {
  const subjectInput = document.getElementById('enquiry-subject');
  const messageInput = document.getElementById('message-text');
  const contactSection = document.getElementById('contact');

  if (subjectInput) {
    subjectInput.value = `Distribution & Product Enquiry: ${productName}`;
  }
  if (messageInput) {
    messageInput.value = `Hello Herbalbolt LLP,\n\nI am interested in distribution / commercial purchasing for "${productName}". Please share terms, pricing, and availability.\n\nThank you.`;
  }

  if (contactSection) {
    if (lenisInstance) {
      lenisInstance.scrollTo(contactSection, { offset: getNavOffset(), duration: 1.2 });
    } else {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      const fullNameInput = document.getElementById('full-name');
      if (fullNameInput) fullNameInput.focus();
    }, 600);
  }
}

// ============================================================================
// 7. ScrollSpy (Active Section Highlight)
// ============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -55% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveLink(id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));

  function updateActiveLink(activeId) {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ============================================================================
// 8. Contact Form Validation & Direct Mailto Handling
// ============================================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email-address');
  const subjectInput = document.getElementById('enquiry-subject');
  const messageInput = document.getElementById('message-text');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset errors
    nameError.textContent = '';
    emailError.textContent = '';
    messageError.textContent = '';

    let isValid = true;

    // Validate Name
    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      nameError.textContent = 'Please enter your full name.';
      isValid = false;
    }

    // Validate Email
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Message
    const msgVal = messageInput.value.trim();
    if (!msgVal) {
      messageError.textContent = 'Please enter your message.';
      isValid = false;
    }

    if (!isValid) return;

    // Direct mailto link to herbalbolt7@gmail.com
    const recipient = 'herbalbolt7@gmail.com';
    const subject = encodeURIComponent(subjectInput.value.trim() || 'Website Enquiry for Herbalbolt LLP');
    const bodyContent = `Name: ${nameVal}
Email: ${emailVal}

Message:
${msgVal}

---
Sent via Herbalbolt LLP Corporate Portal`;

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    // Open user's default email client
    window.location.href = mailtoUrl;

    // Feedback on button
    const submitBtn = document.getElementById('btn-submit-message');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span>Opening Email Client...</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
    `;
    submitBtn.style.backgroundColor = '#5DB83A';

    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.style.backgroundColor = '';
    }, 4000);
  });
}
