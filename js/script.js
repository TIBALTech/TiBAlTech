/**
 * TiBAl Tech - Main Interactive Script (js/script.js)
 * Clean, production-ready vanilla JavaScript:
 * - Navbar scroll transformation
 * - Responsive mobile navigation toggle & dismiss
 * - Active page link highlighting
 * - IntersectionObserver scroll reveal animations
 * - Back to top button controller
 * - WhatsApp contact form handling & interactive confirmation
 * - Interactive card 3D tilt effects
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Navbar glassmorphism
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 320) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close on navigation link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Highlight Active Page Link in Navbar
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 5. Interactive 3D Card Hover / Tilt Effect
  const interactiveCards = document.querySelectorAll('.tilt-card, .service-card, .project-card');
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 6. Contact Form - WhatsApp Link Dispatcher & Modal Feedback
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const service = document.getElementById('service')?.value || 'General Inquiry';
      const message = document.getElementById('message')?.value.trim();

      if (!name || !email || !message) {
        alert('Please fill in your Name, Email, and Project Message.');
        return;
      }

      // WhatsApp format
      const whatsappNumber = '+918610535961';
      const whatsappText = `*New Project Inquiry - TiBAl Tech*%0A%0A` +
        `*Name:* ${encodeURIComponent(name)}%0A` +
        `*Email:* ${encodeURIComponent(email)}%0A` +
        `*Phone:* ${encodeURIComponent(phone || 'Not provided')}%0A` +
        `*Service Requested:* ${encodeURIComponent(service)}%0A` +
        `*Message:* ${encodeURIComponent(message)}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Show sleek frontend confirmation modal
      showContactSuccessModal(name, service);

      contactForm.reset();
    });
  }

  function showContactSuccessModal(name, service) {
    let modal = document.getElementById('contact-success-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'contact-success-modal';
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(3, 7, 18, 0.85);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        display: flex; align-items: center; justify-content: center;
        z-index: 2000; opacity: 0; pointer-events: none;
        transition: opacity 0.3s ease; padding: 1.5rem;
      `;
      modal.innerHTML = `
        <div style="background: rgba(7, 17, 31, 0.95); border: 1px solid rgba(32, 217, 255, 0.35); border-radius: 20px; max-width: 480px; width: 100%; padding: 2.5rem; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(32, 217, 255, 0.25);">
          <div style="width: 64px; height: 64px; margin: 0 auto 1.5rem; border-radius: 50%; background: rgba(32, 217, 255, 0.15); border: 1px solid #20d9ff; display: flex; align-items: center; justify-content: center; color: #20d9ff; font-size: 1.8rem;">
            <i class="fa-solid fa-paper-plane"></i>
          </div>
          <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; color: #ffffff; margin-bottom: 0.75rem;">Message Prepared!</h3>
          <p id="modal-msg" style="color: #a9b7c9; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.8rem;"></p>
          <button id="modal-close-btn" class="btn btn-primary" style="width: 100%;">Return to TiBAl Tech</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#modal-close-btn').addEventListener('click', () => {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.opacity = '0';
          modal.style.pointerEvents = 'none';
        }
      });
    }

    const modalMsg = modal.querySelector('#modal-msg');
    modalMsg.textContent = `Thank you, ${name}! Your request regarding "${service}" has been prepared and WhatsApp has been launched to connect with our team directly.`;

    modal.style.pointerEvents = 'auto';
    modal.style.opacity = '1';
  }
});
