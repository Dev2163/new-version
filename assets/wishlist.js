/**
 * ONE9 Luxury Streetwear - Client-Side Wishlist Manager
 * Manages wishlist state in localStorage and updates UI badges dynamically.
 */
(function () {
  const STORAGE_KEY = 'one9_wishlist_items';

  function getWishlist() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * @param {any[]} items
   */
  function saveWishlist(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      updateWishlistBadges();
      window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { items } }));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }

  /**
   * @param {any} product
   */
  function toggleWishlist(product) {
    let items = getWishlist();
    const index = items.findIndex((/** @type {any} */ item) => item.id === product.id || item.handle === product.handle);

    if (index > -1) {
      items.splice(index, 1);
    } else {
      items.push({
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: product.price,
        image: product.image,
        url: product.url
      });
    }

    saveWishlist(items);
    updateButtonsState();
    return index === -1;
  }

  /**
   * @param {any} handle
   */
  function isInWishlist(handle) {
    const items = getWishlist();
    return items.some((/** @type {any} */ item) => item.handle === handle || item.id === handle);
  }

  function updateWishlistBadges() {
    const items = getWishlist();
    const count = items.length;
    const badges = document.querySelectorAll('.wishlist-count-badge, [data-wishlist-count]');
    badges.forEach(badge => {
      if (badge instanceof HTMLElement) {
        badge.textContent = String(count);
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
    });
  }

  function updateButtonsState() {
    const buttons = document.querySelectorAll('.wishlist-btn[data-product-handle]');
    buttons.forEach(btn => {
      const handle = btn.getAttribute('data-product-handle');
      if (isInWishlist(handle)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from wishlist');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Add to wishlist');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadges();
    updateButtonsState();

    document.addEventListener('click', (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const btn = target ? target.closest('.wishlist-btn[data-product-handle]') : null;
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const handle = btn.getAttribute('data-product-handle');
        const id = btn.getAttribute('data-product-id') || handle;
        const card = btn.closest('.product-card, [data-product-id], .card, .product-information, .product') || btn.parentElement;
        const title = btn.getAttribute('data-product-title') || card?.querySelector('.product-title, .card__heading, [role="heading"], h1, h2, h3')?.textContent?.trim() || 'Product';
        const price = btn.getAttribute('data-product-price') || card?.querySelector('.price, .price-item')?.textContent?.trim() || '';
        const image = btn.getAttribute('data-product-image') || card?.querySelector('img')?.src || '';
        const url = btn.getAttribute('data-product-url') || `/products/${handle}`;

        toggleWishlist({ id, handle, title, price, image, url });
      }
    });
  });

  /** @type {any} */ (window).ONE9Wishlist = {
    get: getWishlist,
    toggle: toggleWishlist,
    isInWishlist: isInWishlist,
    updateBadges: updateWishlistBadges
  };
})();
