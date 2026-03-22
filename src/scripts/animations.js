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

function initChapterNav() {
  const nav = document.getElementById('chapter-nav');
  const dots = document.querySelectorAll('[data-chapter-nav]');

  if (!nav || !dots.length) return;

  // Show/hide nav based on hero visibility
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom 80%',
    onLeave: () => nav.classList.add('visible'),
    onEnterBack: () => nav.classList.remove('visible'),
  });

  // Sync active dot with visible chapter
  document.querySelectorAll('[data-chapter]').forEach((section) => {
    const chapterNum = section.dataset.chapter;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveDot(chapterNum),
      onEnterBack: () => setActiveDot(chapterNum),
    });
  });

  function setActiveDot(num) {
    dots.forEach((dot) => {
      const isActive = dot.dataset.chapterNav === num;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  // Mobile hamburger toggle
  const toggle = document.getElementById('chapter-nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar navegación' : 'Abrir navegación');
    });

    // Close on link click
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll via scrollIntoView (not CSS scroll-behavior)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// Export init function
export function initAnimations() {
  initHeroAnimation();
  initChapterAnimations();
  initChapterNav();
}
