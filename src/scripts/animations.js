// src/scripts/animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

function initHeroAnimation() {
  const letters = document.querySelectorAll('.hero__letter');
  const subtitle = document.querySelector('.hero__subtitle');
  const dates = document.querySelector('.hero__dates');
  const scrollIndicator = document.querySelector('.hero__scroll-indicator');

  if (!letters.length) return;

  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Initial reveal timeline (plays on load, not scroll-based)
  const tl = gsap.timeline({ delay: 0.5 });

  tl.to(letters, {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
  })
  .to(subtitle, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  }, '-=0.3')
  .to(dates, {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  }, '-=0.7')
  .to(scrollIndicator, {
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
  }, '-=0.5');

  // Scroll-driven fade out of hero
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      gsap.set('.hero__content', {
        opacity: 1 - progress * 2,
        y: -progress * 100,
      });
      gsap.set('.hero__scroll-indicator', {
        opacity: 1 - progress * 3,
      });
    },
  });
}

function initChapterAnimations() {
  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Fade-up animations for paragraphs, quotes, headers
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1,
      },
    });
  });

  // Parallax effect on images
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const img = el.querySelector('img');
    if (!img) return;

    gsap.to(img, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

// Export init function
export function initAnimations() {
  initHeroAnimation();
  initChapterAnimations();
}
