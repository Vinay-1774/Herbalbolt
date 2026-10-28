/**
 * HERBALBOLT LLP — OFFICIAL CORPORATE JAVASCRIPT
 * Typography: Brandon Grotesque
 * Interactions: Responsive Navigation, Play Bull Product Actions, Contact Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollSpy();
  initProductInteractions();
  initContactForm();
});

// ============================================================================
// 1. Navigation & Mobile Drawer
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
// 2. Play Bull & Product Enquiry Interactions
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
    contactSection.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const fullNameInput = document.getElementById('full-name');
      if (fullNameInput) fullNameInput.focus();
    }, 500);
  }
}

// ============================================================================
// 3. ScrollSpy (Active Section Highlight)
// ============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
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
// 4. Contact Form Validation & Mailto Action
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
Sent via Herbalbolt LLP Official Corporate Portal`;

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
