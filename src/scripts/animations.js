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

  // Parallax effect on images — desktop only (disabled on mobile for performance)
  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function() {
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
    },
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
    });
  }

  // Handle ALL dot clicks — smooth scroll to target chapter
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const href = dot.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (!target) return;

      // Close mobile menu if open
      if (nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }

      // Scroll to the target
      const top = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initChapterEffects() {
  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Chapter 3: Ships sinking
  const ch3 = document.querySelector('#chapter-3');
  if (ch3) {
    const ch3Img = ch3.querySelector('[data-parallax] img');
    if (ch3Img) {
      // Add a red overlay div dynamically
      const overlay = document.createElement('div');
      overlay.className = 'ships-overlay';
      ch3Img.parentElement.appendChild(overlay);

      gsap.to(overlay, {
        opacity: 0.6,
        scrollTrigger: {
          trigger: ch3,
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
      });

      gsap.to(ch3Img, {
        y: 80,
        scrollTrigger: {
          trigger: ch3,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      });
    }
  }

  // Chapter 2: Parchment reveal
  const ch2Content = document.querySelector('#chapter-2 .chapter__content');
  if (ch2Content) {
    gsap.fromTo(ch2Content,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        scrollTrigger: {
          trigger: '#chapter-2',
          start: 'top 60%',
          end: 'center center',
          scrub: 1,
        },
      }
    );
  }

  // Chapter 4: Color transition (already handled by bgColor in Chapter.astro)
  // Add a smooth body-level transition effect
  const ch4 = document.querySelector('#chapter-4');
  if (ch4) {
    ScrollTrigger.create({
      trigger: ch4,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        // Gradually shift the body tint
        const progress = self.progress;
        document.body.style.backgroundColor = progress > 0.5
          ? 'var(--bg-warm)'
          : 'var(--bg-primary)';
      },
    });
  }

  // Chapter 5: Slow zoom on hero image
  const ch5Img = document.querySelector('#chapter-5 [data-parallax] img');
  if (ch5Img) {
    gsap.fromTo(ch5Img,
      { scale: 1 },
      {
        scale: 1.15,
        scrollTrigger: {
          trigger: '#chapter-5',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
  }

  // Chapter 6: Shake effect on text
  const ch6 = document.querySelector('#chapter-6');
  if (ch6) {
    const ch6Texts = ch6.querySelectorAll('p[data-animate]');
    ch6Texts.forEach((el) => {
      ScrollTrigger.create({
        trigger: ch6,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
        onUpdate: () => {
          const shakeX = (Math.random() - 0.5) * 4;
          const shakeY = (Math.random() - 0.5) * 4;
          gsap.set(el, { x: shakeX, y: shakeY });
        },
      });
    });
  }

  // Chapter 7: Progressive desaturation
  const ch7 = document.querySelector('#chapter-7');
  if (ch7) {
    gsap.to(ch7, {
      filter: 'saturate(0.3)',
      scrollTrigger: {
        trigger: ch7,
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
    });
  }
}

function initMapRoutes() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-map-route-container]').forEach((container) => {
    const route = container.querySelector('[data-map-route]');
    const stops = container.querySelectorAll('[data-map-stop]');
    const tooltips = container.querySelectorAll('[data-map-tooltip]');

    if (!route) return;

    // Get the total path length and set dasharray
    let pathLength;
    try {
      pathLength = route.getTotalLength();
    } catch (e) {
      return; // SVG not ready
    }
    route.style.strokeDasharray = pathLength;
    route.style.strokeDashoffset = pathLength;

    // Animate route drawing
    gsap.to(route, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 1,
      },
    });

    // Animate stops appearing as path reaches them
    stops.forEach((stop, i) => {
      const delay = (i + 1) / (stops.length + 1);

      gsap.to(stop, {
        opacity: 1,
        scale: 1.2,
        duration: 0.3,
        scrollTrigger: {
          trigger: container,
          start: `top ${70 - delay * 40}%`,
          toggleActions: 'play none none reverse',
        },
      });

      // Show tooltip when stop appears
      if (tooltips[i]) {
        gsap.to(tooltips[i], {
          opacity: 1,
          duration: 0.3,
          scrollTrigger: {
            trigger: container,
            start: `top ${70 - delay * 40}%`,
            toggleActions: 'play none none reverse',
          },
        });
      }
    });
  });
}

// === NEW: Fullscreen Hero Animations ===
function initFullscreenHeroes() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-fs-hero]').forEach((hero) => {
    const number = hero.querySelector('.fs-hero__number');
    const title = hero.querySelector('.fs-hero__title');
    const subtitle = hero.querySelector('.fs-hero__subtitle');
    const image = hero.querySelector('.fs-hero__image');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
    });

    tl.to(number, { opacity: 1, duration: 0.3 })
      .to(title, { opacity: 1, y: 0, duration: 0.5 }, '-=0.1')
      .to(subtitle, { opacity: 1, duration: 0.3 }, '-=0.2');

    // Slow zoom on the hero image
    if (image) {
      gsap.to(image, {
        scale: 1.1,
        scrollTrigger: {
          trigger: hero,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  });
}

// === NEW: Pinned Quote word-by-word reveal ===
function initPinnedQuotes() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-pinned-quote]').forEach((section) => {
    const words = section.querySelectorAll('[data-word]');
    const attribution = section.querySelector('.pinned-quote__attribution');

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalWords = words.length;

        words.forEach((word, i) => {
          const wordThreshold = i / totalWords;
          const wordProgress = (progress * 1.5) - wordThreshold;
          if (wordProgress > 0) {
            word.classList.add('revealed');
          } else {
            word.classList.remove('revealed');
          }
        });

        // Show attribution after 80% of words are revealed
        if (attribution) {
          if (progress > 0.7) {
            attribution.classList.add('visible');
          } else {
            attribution.classList.remove('visible');
          }
        }
      },
    });
  });
}

// === NEW: Image Reveal (mouse-driven clip-path) ===
function initImageReveal() {
  document.querySelectorAll('[data-image-reveal]').forEach((container) => {
    const topLayer = container.querySelector('[data-reveal-top]');
    if (!topLayer) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      topLayer.style.clipPath = `circle(120px at ${x}px ${y}px)`;
    });

    container.addEventListener('mouseleave', () => {
      topLayer.style.clipPath = 'circle(0px at 50% 50%)';
    });
  });
}

// === NEW: Chapter Transition line-draw effect ===
function initChapterTransitions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.chapter-transition').forEach((transition) => {
    const line = transition.querySelector('.chapter-transition__line');
    if (!line) return;

    gsap.fromTo(line,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: transition,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
      }
    );
  });
}

// Export init function — each wrapped in try/catch so one failure doesn't block others
export function initAnimations() {
  const fns = [
    initChapterNav,        // Nav FIRST — most critical for interactivity
    initHeroAnimation,
    initFullscreenHeroes,
    initChapterAnimations,
    initChapterEffects,
    initMapRoutes,
    initPinnedQuotes,
    initImageReveal,
    initChapterTransitions,
  ];

  fns.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`[animations] ${fn.name} failed:`, err);
    }
  });
}
