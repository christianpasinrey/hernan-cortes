// src/scripts/timeline.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initTimelines() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-timeline]').forEach((timeline) => {
    const items = timeline.querySelectorAll('[data-timeline-item]');
    const fill = timeline.querySelector('[data-timeline-fill]');

    if (!items.length) return;

    ScrollTrigger.create({
      trigger: timeline,
      start: 'top 80%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Fill the line
        if (fill) {
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            fill.style.height = `${progress * 100}%`;
          } else {
            fill.style.width = `${progress * 100}%`;
          }
        }

        // Activate items based on progress
        items.forEach((item, i) => {
          const threshold = i / items.length;
          if (progress > threshold) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      },
    });
  });
}
