/**
 * ONE9 Luxury Streetwear - Scroll Reveal Animations Engine
 * Uses IntersectionObserver & requestIdleCallback for 60fps hardware-accelerated transitions without forced reflow.
 */
(function() {
  // Inject helper style once
  const style = document.createElement('style');
  style.textContent = `
    .sa-animate {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .sa-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  function initScrollAnimations() {
    const animElements = document.querySelectorAll('.product-card, .why-choose-card, .review-card, .insta-card, .section-heading, .glass-panel');
    if (!animElements.length) return;

    animElements.forEach(el => el.classList.add('sa-animate'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sa-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    animElements.forEach(el => observer.observe(el));
  }

  if (document.readyState === 'complete') {
    initScrollAnimations();
  } else {
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initScrollAnimations, { timeout: 1000 });
      } else {
        setTimeout(initScrollAnimations, 300);
      }
    });
  }
})();
