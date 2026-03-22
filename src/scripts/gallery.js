// src/scripts/gallery.js

export function initGalleries() {
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const thumbs = gallery.querySelectorAll('[data-gallery-index]');
    const lightbox = gallery.querySelector('[data-gallery-lightbox]');
    const img = gallery.querySelector('[data-gallery-img]');
    const caption = gallery.querySelector('[data-gallery-caption]');
    const counter = gallery.querySelector('[data-gallery-counter]');
    const closeBtn = gallery.querySelector('[data-gallery-close]');
    const prevBtn = gallery.querySelector('[data-gallery-prev]');
    const nextBtn = gallery.querySelector('[data-gallery-next]');

    if (!lightbox || !thumbs.length) return;

    const images = Array.from(thumbs).map((thumb) => {
      const imgEl = thumb.querySelector('img');
      return { url: imgEl.src, alt: imgEl.alt };
    });

    let currentIndex = 0;
    let previousFocus = null;

    function showImage(index) {
      currentIndex = ((index % images.length) + images.length) % images.length;
      img.src = images[currentIndex].url;
      img.alt = images[currentIndex].alt;
      caption.textContent = images[currentIndex].alt;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function openLightbox(index) {
      previousFocus = document.activeElement;
      showImage(index);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (previousFocus) previousFocus.focus();
    }

    // Click thumbnails to open
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        openLightbox(parseInt(thumb.dataset.galleryIndex));
      });
    });

    // Navigation
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    closeBtn.addEventListener('click', closeLightbox);

    // Click overlay to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);

      // Focus trap
      if (e.key === 'Tab') {
        const focusable = lightbox.querySelectorAll('button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showImage(currentIndex + 1);
        else showImage(currentIndex - 1);
      }
    }, { passive: true });
  });
}
