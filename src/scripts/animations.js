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
    const pathLength = route.getTotalLength();
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

// Export init function
export function initAnimations() {
  initHeroAnimation();
  initChapterAnimations();
  initChapterNav();
  initChapterEffects();
  initMapRoutes();
}
