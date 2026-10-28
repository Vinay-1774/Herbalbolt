/**
 * HERBALBOLT LLP — OFFICIAL CORPORATE JAVASCRIPT
 * Performance: Lenis Smooth Scroll & GSAP ScrollTrigger Integration
 * Features: Responsive Navigation, Parallax Micro-Animations, Form Handling
 */

// Global Lenis Instance
let lenisInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initGSAPAnimations();
  initNavigation();
  initScrollSpy();
  initProductInteractions();
  initContactForm();
});

// ============================================================================
// 1. Lenis Smooth Scrolling Setup
// ============================================================================
function initLenis() {
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis not loaded; proceeding with native smooth scrolling.');
    return;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false, // Maintain native responsive touch feel on mobile
    touchMultiplier: 2
  });

  // Sync with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Handle Internal Anchor Links with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        
        // Offset for sticky navbar
        const navOffset = window.innerWidth <= 680 ? -70 : -85;
        
        lenisInstance.scrollTo(targetEl, {
          offset: navOffset,
          duration: 1.1,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });
}

// ============================================================================
// 2. GSAP ScrollTrigger Micro-Animations
// ============================================================================
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded; falling back to clean layout.');
    return;
  }

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Hero Content Entrance (on page load)
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7, delay: 0.1 })
    .from('.hero-title', { y: 25, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.hero-description', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero-cta-group .btn', { y: 15, opacity: 0, stagger: 0.12, duration: 0.6 }, '-=0.4')
    .from('.hero-trust-bar .trust-item', { y: 12, opacity: 0, stagger: 0.08, duration: 0.5 }, '-=0.3')
    .from('.hero-image-wrapper', { scale: 0.94, opacity: 0, duration: 0.9 }, '-=0.7');

  // Subtle Parallax on Hero Image on Scroll
  gsap.to('.hero-image', {
    y: 35,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // 2. Section Headers Reveal
  gsap.utils.toArray('.gsap-fade-up').forEach((header) => {
    gsap.from(header, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 3. About Section Animations
  gsap.from('.about-lead-card', {
    x: -30,
    opacity: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.about-pillars .pillar-card', {
    x: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.75,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.about-pillars',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // 4. Why Trust Us Section Animations
  gsap.from('.trust-visual-wrapper', {
    scale: 0.95,
    opacity: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.trust-showcase-layout',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.trust-features-grid .trust-feature-card', {
    y: 25,
    opacity: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.trust-features-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });

  // 5. Featured Product (Play Bull) Reveal
  gsap.from('.featured-product-card', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.featured-product-card',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // Subtle floating motion for product bottle
  gsap.to('.featured-product-img', {
    y: -8,
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // 6. Doctor Reviews Staggered Cards Reveal
  gsap.from('.doctor-reviews-grid .doctor-card', {
    y: 35,
    opacity: 0,
    stagger: 0.18,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.doctor-reviews-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });

  // 7. Contact Section Reveal
  gsap.from('.contact-details-col', {
    x: -25,
    opacity: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-fluid-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });

  gsap.from('.contact-form-col', {
    x: 25,
    opacity: 0,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.contact-fluid-grid',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });
}

// ============================================================================
// 3. Navigation & Mobile Drawer
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
// 4. Play Bull & Product Enquiry Interactions
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
      const navOffset = window.innerWidth <= 680 ? -70 : -85;
      lenisInstance.scrollTo(contactSection, { offset: navOffset, duration: 1.2 });
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
// 5. ScrollSpy (Active Section Highlight)
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
// 6. Contact Form Validation & Direct Mailto Handling
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
    submitBtn.style.backgroundColor = '#70B52F';

    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.style.backgroundColor = '';
    }, 4000);
  });
}
