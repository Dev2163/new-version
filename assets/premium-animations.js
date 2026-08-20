/**
 * Horizon Premium Streetwear - Interactive Animations Engine
 * Handles 3D Hover Tilt, ScrollTrigger Initializations, and Shopify Theme Customizer Support.
 */

(function() {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 0. Initialize Lenis Smooth Scroll Globally
  function initSmoothScroll() {
    const Lenis = /** @type {any} */ (window).Lenis;
    const ScrollTrigger = /** @type {any} */ (window).ScrollTrigger;

    if (typeof Lenis !== 'undefined') {
      if (window.hasOwnProperty('globalLenis')) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: /** @param {number} t */ (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1.0,
        smoothTouch: false,
        infinite: false
      });

      Object.defineProperty(window, 'globalLenis', {
        value: lenis,
        writable: true,
        configurable: true
      });

      /** @param {number} time */
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
      }
      
      console.log('Horizon Premium Animations: Global Lenis smooth scroll initialized.');
    }
  }

  // Initialize all interactive components
  function initPremiumAnimations() {
    if (prefersReducedMotion) {
      console.log('Premium Animations: Reduced motion preferred, skipping advanced transitions.');
      return;
    }

    initSmoothScroll();
    init3DTilt();
    initMagneticButtons();
    initHeaderScrollEffect();
  }

  // 1. 3D Tilt Effect for Product Cards
  function init3DTilt() {
    const cards = document.querySelectorAll('.product-card, .ph-thumb, .story-carousel-card, .best-sellers__card, .thumbnail-strip-card, .thumbnail-strip__card, .why-choose-card-item, .review-card-item, .insta-card');
    
    cards.forEach(element => {
      if (!(element instanceof HTMLElement)) return;
      const card = element;
      
      // Ensure perspective container setup
      card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.willChange = 'transform, box-shadow';

      card.addEventListener('mousemove', (event) => {
        const e = /** @type {MouseEvent} */ (event);
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        // Calculate offsets (-1 to 1)
        const dx = (x - xc) / xc;
        const dy = (y - yc) / yc;

        // Apply tilts (max 8 degrees)
        const tiltX = -dy * 8;
        const tiltY = dx * 8;

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;
        
        // Dynamic glossy spotlight coordinate
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // 2. Magnetic and Hover reactions for CTA buttons
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.ph-btn, .button, .btn');
    
    buttons.forEach(element => {
      if (!(element instanceof HTMLElement)) return;
      const btn = element;

      btn.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.addEventListener('mousemove', (event) => {
        const e = /** @type {MouseEvent} */ (event);
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        const dx = (x - xc) * 0.18; // Magnet intensity factor
        const dy = (y - yc) * 0.18;

        btn.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
      });
    });
  }

  // 3. Header Transparent to Frosted Sticky Transition
  function initHeaderScrollEffect() {
    const header = document.querySelector('header-component, #header-group');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled-header');
      } else {
        header.classList.remove('scrolled-header');
      }
    }, { passive: true });
  }

  // Initial Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumAnimations);
  } else {
    initPremiumAnimations();
  }

  // Shopify Customizer Compatibility
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', () => {
      // Re-run bindings on editor updates
      setTimeout(() => {
        initPremiumAnimations();
        const globalWindow = /** @type {any} */ (window);
        if (typeof globalWindow.ScrollTrigger !== 'undefined') {
          globalWindow.ScrollTrigger.refresh();
        }
      }, 200);
    });
  }
})();
