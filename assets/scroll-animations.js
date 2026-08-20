/**
 * ONE9 Luxury Streetwear - Scroll Reveal Animations Engine
 * Uses GSAP ScrollTrigger for hardware-accelerated, buttery smooth staggered reveals.
 * Falls back to IntersectionObserver if GSAP is unavailable.
 */
(function() {
  'use strict';

  function initScrollReveals() {
    const gsap = /** @type {any} */ (window).gsap;
    const ScrollTrigger = /** @type {any} */ (window).ScrollTrigger;
    
    // If GSAP and ScrollTrigger are loaded, use them for luxury staggered entrance reveals!
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // 1. Reveal Section Headings & Header Titles
      const headings = document.querySelectorAll(
        '.section-heading, .rich-text__heading, .footwear-picks__header, ' +
        '.best-sellers__header, .zodiac-strip__header, .trust-badges__header'
      );
      headings.forEach(heading => {
        gsap.fromTo(heading, 
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      // 2. Staggered Card Grid reveals (Products, Badges, Reviews, Bento grid, Zodiac)
      const grids = document.querySelectorAll(
        '.footwear-picks__grid, .trust-badges__grid, .bento-box, ' +
        '[class*="why-choose-grid"], [class*="reviews-grid"], .insta-grid, .zodiac-strip__items'
      );
      grids.forEach(grid => {
        // Detect section block items
        const items = grid.querySelectorAll(
          '.footwear-picks__card, .product-card, .trust-badge__item, ' +
          '.bento-box__item, .why-choose-card-item, .review-card-item, ' +
          '.insta-card, .zodiac-strip__item'
        );

        if (items.length > 0) {
          gsap.fromTo(items, 
            { opacity: 0, y: 40, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.08, // Premium cinematic stagger sequence
              ease: "power2.out",
              scrollTrigger: {
                trigger: grid,
                start: "top 88%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      });

      // 3. Single standing blocks (Glass panels, rich text paragraphs, static banners)
      const blocks = document.querySelectorAll(
        '.glass-panel, .rich-text__wrapper, .banner__content, ' +
        '.footer__content, .newsletter__wrapper'
      );
      blocks.forEach(block => {
        gsap.fromTo(block,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: block,
              start: "top 86%",
              toggleActions: "play none none none"
            }
          }
        );
      });

      return; // GSAP successfully initialized, skip fallback
    }

    // Fallback: IntersectionObserver for lightweight CSS transition reveals
    const animElements = document.querySelectorAll(
      '.product-card, .why-choose-card-item, .review-card-item, .insta-card, ' +
      '.section-heading, .glass-panel, .trust-badge__item, .bento-box__item, .zodiac-strip__item'
    );
    if (!animElements.length) return;

    animElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });

    animElements.forEach(el => observer.observe(el));
  }

  // Bind to page loads
  if (document.readyState === 'complete') {
    setTimeout(initScrollReveals, 100);
  } else {
    window.addEventListener('load', initScrollReveals);
  }

  // Shopify Customizer Support
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', () => {
      setTimeout(initScrollReveals, 150);
    });
  }
})();
