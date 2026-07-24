/**
 * ONE9 Luxury Streetwear - Scroll Reveal Animations Engine
 * Uses IntersectionObserver for 60fps hardware-accelerated transitions.
 */
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const animElements = document.querySelectorAll('.product-card, .why-choose-card, .review-card, .insta-card, .section-heading, .glass-panel');

    animElements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
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
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    animElements.forEach(el => observer.observe(el));
  });
})();
