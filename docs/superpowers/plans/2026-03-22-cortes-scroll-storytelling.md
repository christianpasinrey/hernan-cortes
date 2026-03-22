# Cortés — Scroll Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematographic scroll storytelling website about Hernán Cortés using Astro 5 + GSAP ScrollTrigger, with 7 chapters, parallax animations, interactive elements, and chapter navigation.

**Architecture:** Single-page Astro static site. All content driven from `chapters.json`. GSAP ScrollTrigger controls all scroll-based animations (parallax, pin, fade, color transitions). Vanilla JS for interactive elements (gallery lightbox, timelines). No reactive framework.

**Tech Stack:** Astro 5, GSAP + ScrollTrigger (free tier), CSS custom properties, vanilla JS, self-hosted Google Fonts (Cinzel, Inter, Cormorant Garamond)

**Spec:** `docs/superpowers/specs/2026-03-22-cortes-scroll-storytelling-design.md`
**Content JSON:** `hernan-cortes-content.json` (root of www/) — narrative is a single string per chapter, must be split by `\n\n` into array
**Images:** 35 Wikimedia Commons images collected by research agent — must be merged into chapters.json during Task 3

**IMPORTANT — GSAP in Astro:** Always import GSAP as ES module (`import { gsap } from 'gsap'`) directly in each script file. Astro deduplicates imports. Do NOT use `window.gsap` globals or custom events.

**IMPORTANT — Data shape:** `chapters.json` wraps the array in `{ "chapters": [...] }`. When imported, access via `data.chapters` (not `data` directly).

---

## File Map

| File | Responsibility |
|---|---|
| `astro.config.mjs` | Astro config — static output |
| `package.json` | Dependencies: astro, gsap |
| `src/pages/index.astro` | Single page — imports all chapters, wires GSAP |
| `src/layouts/Base.astro` | HTML shell: meta, fonts, global CSS, GSAP script |
| `src/styles/global.css` | CSS custom properties, typography, base styles, responsive |
| `src/data/chapters.json` | All narrative content, images, quotes, dates per chapter |
| `src/components/Hero.astro` | Full-screen intro with letter-by-letter blur reveal |
| `src/components/Chapter.astro` | Reusable chapter wrapper (number, title, accent, bg color) |
| `src/components/ChapterNav.astro` | Fixed sidebar navigation dots |
| `src/components/Quote.astro` | Blockquote with cronista attribution |
| `src/components/ParallaxImage.astro` | Image with parallax y-offset via GSAP |
| `src/components/Gallery.astro` | Clickable image grid + fullscreen lightbox |
| `src/components/Timeline.astro` | Horizontal timeline with scroll-driven illumination |
| `src/scripts/animations.js` | All GSAP ScrollTrigger setup (hero, chapters, parallax, nav sync) |
| `src/scripts/gallery.js` | Lightbox open/close/navigate logic |
| `src/scripts/timeline.js` | Timeline interaction logic |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/pages/index.astro` (placeholder)
- Create: `src/layouts/Base.astro` (placeholder)

- [ ] **Step 1: Initialize Astro project**

```bash
cd C:/laragon/www/hernan-cortes
npm create astro@latest . -- --template minimal --no-install --no-git
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install gsap
```

- [ ] **Step 3: Configure Astro for static output**

Edit `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
});
```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: Astro dev server running on localhost:4321

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.astro/
.DS_Store
```

- [ ] **Step 6: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Astro project with GSAP"
```

---

## Task 2: Global Styles & Fonts

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Install fontsource packages and copy fonts to public/fonts/**

Use fontsource npm packages (the standard way to self-host Google Fonts):

```bash
npm install @fontsource/cinzel @fontsource/inter @fontsource/cormorant-garamond
mkdir -p public/fonts
```

Then copy the woff2 files from `node_modules/@fontsource/*/files/` to `public/fonts/`. Specifically:
- `cinzel-latin-400-normal.woff2` → `public/fonts/Cinzel-Regular.woff2`
- `cinzel-latin-700-normal.woff2` → `public/fonts/Cinzel-Bold.woff2`
- `inter-latin-400-normal.woff2` → `public/fonts/Inter-Regular.woff2`
- `inter-latin-500-normal.woff2` → `public/fonts/Inter-Medium.woff2`
- `inter-latin-600-normal.woff2` → `public/fonts/Inter-SemiBold.woff2`
- `cormorant-garamond-latin-400-italic.woff2` → `public/fonts/CormorantGaramond-Italic.woff2`
- `cormorant-garamond-latin-600-italic.woff2` → `public/fonts/CormorantGaramond-SemiBoldItalic.woff2`

```bash
cp node_modules/@fontsource/cinzel/files/cinzel-latin-400-normal.woff2 public/fonts/Cinzel-Regular.woff2
cp node_modules/@fontsource/cinzel/files/cinzel-latin-700-normal.woff2 public/fonts/Cinzel-Bold.woff2
cp node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2 public/fonts/Inter-Regular.woff2
cp node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2 public/fonts/Inter-Medium.woff2
cp node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2 public/fonts/Inter-SemiBold.woff2
cp node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2 public/fonts/CormorantGaramond-Italic.woff2
cp node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2 public/fonts/CormorantGaramond-SemiBoldItalic.woff2
```

- [ ] **Step 2: Create global.css with custom properties and font-faces**

Create `src/styles/global.css`:
```css
/* === Font Faces === */
@font-face {
  font-family: 'Cinzel';
  src: url('/fonts/Cinzel-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Cinzel';
  src: url('/fonts/Cinzel-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/fonts/CormorantGaramond-SemiBoldItalic.woff2') format('woff2');
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}

/* === Custom Properties === */
:root {
  --bg-primary: #0a0a0a;
  --bg-warm: #1a1510;
  --text-primary: #f5f0e8;
  --text-secondary: #b8b0a0;
  --accent-gold: #c9a84c;
  --accent-stone: #8b7355;
  --accent-blood: #8b1a1a;
  --accent-turquoise: #2d8b8b;

  --font-heading: 'Cinzel', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-quote: 'Cormorant Garamond', Georgia, serif;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --max-width: 1200px;
}

/* === Reset & Base === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  /* Do NOT use scroll-behavior: smooth — it conflicts with GSAP ScrollTrigger scrub calculations */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  overflow-x: hidden;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Image error fallback */
img.error {
  display: none;
}

/* === Typography === */
h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.04em;
}

h1 { font-size: clamp(3rem, 8vw, 8rem); }
h2 { font-size: clamp(2rem, 5vw, 4rem); }
h3 { font-size: clamp(1.2rem, 3vw, 1.8rem); }

p {
  max-width: 720px;
  margin-bottom: 1.5em;
}

blockquote {
  font-family: var(--font-quote);
  font-style: italic;
  font-size: clamp(1.2rem, 2.5vw, 1.6rem);
  line-height: 1.6;
  border-left: 2px solid var(--accent-gold);
  padding-left: 1.5rem;
  max-width: 680px;
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* === Responsive === */
@media (max-width: 768px) {
  body { font-size: 16px; }
}
```

- [ ] **Step 3: Create Base.astro layout**

Create `src/layouts/Base.astro`:
```astro
---
interface Props {
  title?: string;
  description?: string;
}

const {
  title = 'Cortés — La Conquista del Nuevo Mundo',
  description = 'La historia de Hernán Cortés y la conquista del imperio mexica, contada en 7 capítulos a través de scroll storytelling cinematográfico.'
} = Astro.props;
---

<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:image" content="https://upload.wikimedia.org/wikipedia/commons/0/03/LastDaysofTenochtitlanB.jpg" />

  <!-- Preload fonts -->
  <link rel="preload" href="/fonts/Cinzel-Bold.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
<body>
  <slot />

  <!-- No GSAP script here — each script file imports GSAP as ES module directly -->
  <!-- Astro deduplicates imports, so multiple files importing gsap share one instance -->
</body>
</html>
```

- [ ] **Step 4: Update index.astro to use Base layout**

```astro
---
import Base from '../layouts/Base.astro';
---

<Base>
  <main>
    <p style="color: var(--text-primary); padding: 2rem;">Cortés — coming soon</p>
  </main>
</Base>
```

- [ ] **Step 5: Verify styles render correctly in browser**

```bash
npm run dev
```

Check: dark background, cream text, correct fonts loading.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add global styles, font-faces, Base layout with GSAP"
```

---

## Task 3: Content Data File

**Files:**
- Create: `src/data/chapters.json`

- [ ] **Step 1: Create a build script to merge content + images into chapters.json**

Create a Node script `scripts/build-chapters.js` that:
1. Reads `C:/laragon/www/hernan-cortes-content.json` (narrative, quotes, keyDates, curiosities)
2. Embeds the Wikimedia image URLs (hardcoded in the script, from the research agent output)
3. Splits `narrative` strings by `\n\n` into arrays: `chapter.narrative.split('\n\n').map(p => p.trim()).filter(Boolean)`
4. Adds `id`, `accentColor`, `bgColor` per chapter
5. Writes to `src/data/chapters.json`

The output JSON must have this structure: `{ "chapters": [...] }` — when imported in Astro, access via `data.chapters`.

Color assignments:
- Ch1: `--accent-gold`, `--bg-primary`
- Ch2: `--accent-gold`, `--bg-primary`
- Ch3: `--accent-gold`, `--bg-primary`
- Ch4: `--accent-turquoise`, `--bg-warm` (transition chapter)
- Ch5: `--accent-gold`, `--bg-warm`
- Ch6: `--accent-blood`, `--bg-primary`
- Ch7: `--accent-stone`, `--bg-primary`

Each chapter's `images` array must include objects with: `url`, `alt`, `usage` ("hero"|"parallax"|"inline"|"gallery"), `width`, `height`.

Image URLs per chapter (from Wikimedia Commons research):

**Ch1:** Castillo de Medellín (`https://upload.wikimedia.org/wikipedia/commons/d/da/Castillo_de_Medellin1.JPG`), retrato de Cortés, grabado de Cortés
**Ch2:** Mapa del Caribe De Bry 1594, Diego Velázquez retrato, biombo Conquista
**Ch3:** Galeón español, Cortés y La Malinche (Códice Durán), llegada de Cortés
**Ch4:** Volcanes Iztaccíhuatl-Popocatépetl, guerreros tlaxcaltecas, Lienzo de Tlaxcala, masacre Cholula
**Ch5:** La Gran Tenochtitlán (Rivera), mapa 1524, encuentro Cortés-Moctezuma, retrato Moctezuma II
**Ch6:** Pintura Noche Triste, conquistadores en retirada, aztecas vs conquistadores, árbol de la Noche Triste
**Ch7:** Últimos días de Tenochtitlán, bergantines en el sitio, Códice Florentino, tumba de Cortés

(Full URLs are in the research agent output file — use all 35 images)

- [ ] **Step 2: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/data/chapters.json','utf8')); console.log('Valid JSON')"
```

- [ ] **Step 3: Commit**

```bash
git add src/data/chapters.json && git commit -m "feat: add chapters.json with narrative content, images, and quotes"
```

---

## Task 4: Hero Component

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/scripts/animations.js` (hero section only for now)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero.astro**

Full-screen section with:
- "CORTÉS" title where each letter is wrapped in a `<span>` for individual blur animation
- Subtitle "La Conquista del Nuevo Mundo"
- "1485 — 1547" in gold
- Scroll indicator arrow at bottom

```astro
---
---

<section class="hero" id="hero" aria-label="Introducción">
  <div class="hero__content">
    <h1 class="hero__title" aria-label="Cortés">
      {'CORTÉS'.split('').map((letter) => (
        <span class="hero__letter">{letter}</span>
      ))}
    </h1>
    <p class="hero__subtitle">La Conquista del Nuevo Mundo</p>
    <p class="hero__dates">1485 — 1547</p>
  </div>
  <div class="hero__scroll-indicator" aria-hidden="true">
    <span>Scroll</span>
    <div class="hero__scroll-line"></div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }

  .hero__content {
    z-index: 1;
  }

  .hero__title {
    display: flex;
    justify-content: center;
    gap: 0.05em;
    text-transform: uppercase;
    color: var(--text-primary);
  }

  .hero__letter {
    display: inline-block;
    filter: blur(20px);
    opacity: 0;
  }

  .hero__subtitle {
    font-family: var(--font-quote);
    font-style: italic;
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
    color: var(--text-secondary);
    margin-top: 1rem;
    opacity: 0;
  }

  .hero__dates {
    font-family: var(--font-heading);
    font-size: clamp(1rem, 2vw, 1.4rem);
    color: var(--accent-gold);
    margin-top: 0.5rem;
    letter-spacing: 0.3em;
    opacity: 0;
  }

  .hero__scroll-indicator {
    position: absolute;
    bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0;
  }

  .hero__scroll-line {
    width: 1px;
    height: 40px;
    background: var(--accent-gold);
    transform-origin: top;
    animation: scrollPulse 2s ease-in-out infinite;
  }

  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(1); opacity: 1; }
    50% { transform: scaleY(0.5); opacity: 0.5; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__letter {
      filter: none;
      opacity: 1;
    }
    .hero__subtitle,
    .hero__dates,
    .hero__scroll-indicator {
      opacity: 1;
    }
  }
</style>
```

- [ ] **Step 2: Create src/scripts/animations.js with hero animation**

```js
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

  // Initial reveal timeline (not scroll-based, plays on load)
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

// Export init function
export function initAnimations() {
  initHeroAnimation();
}
```

- [ ] **Step 3: Update index.astro to import Hero**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
---

<Base>
  <main>
    <Hero />
  </main>

  <script>
    import { initAnimations } from '../scripts/animations.js';
    initAnimations();
  </script>
</Base>
```

- [ ] **Step 4: Verify hero renders and animates**

Open browser, check:
- Letters blur-reveal on page load
- Subtitle and dates fade in
- Scroll indicator pulses
- Content fades out on scroll

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Hero component with letter-by-letter blur reveal animation"
```

---

## Task 5: Chapter Component & First Chapter

**Files:**
- Create: `src/components/Chapter.astro`
- Create: `src/components/Quote.astro`
- Create: `src/components/ParallaxImage.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/scripts/animations.js`

- [ ] **Step 1: Create Quote.astro**

```astro
---
interface Props {
  text: string;
  author: string;
  source: string;
}

const { text, author, source } = Astro.props;
---

<figure class="quote" data-animate="fade-up">
  <blockquote>
    <p>"{text}"</p>
  </blockquote>
  <figcaption class="quote__attribution">
    <span class="quote__author">— {author}</span>
    <cite class="quote__source">{source}</cite>
  </figcaption>
</figure>

<style>
  .quote {
    margin: 3rem 0;
    opacity: 0;
    transform: translateY(30px);
  }

  .quote__attribution {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .quote__author {
    font-family: var(--font-heading);
    font-size: 0.9rem;
    color: var(--accent-gold);
    letter-spacing: 0.1em;
  }

  .quote__source {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-style: normal;
  }

  @media (prefers-reduced-motion: reduce) {
    .quote { opacity: 1; transform: none; }
  }
</style>
```

- [ ] **Step 2: Create ParallaxImage.astro**

```astro
---
interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  class?: string;
}

const { src, alt, width = 1200, height = 800, class: className = '' } = Astro.props;
---

<div class={`parallax-image ${className}`} data-parallax>
  <figure>
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onerror="this.classList.add('error')"
    />
    <figcaption class="parallax-image__caption">{alt}</figcaption>
  </figure>
</div>

<style>
  .parallax-image {
    overflow: hidden;
    border-radius: 2px;
  }

  .parallax-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
  }

  .parallax-image__caption {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-style: italic;
  }
</style>
```

- [ ] **Step 3: Create Chapter.astro wrapper**

```astro
---
interface Props {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  accentColor?: string;
  bgColor?: string;
}

const {
  id,
  number,
  title,
  subtitle,
  accentColor = '--accent-gold',
  bgColor = '--bg-primary',
} = Astro.props;
---

<article
  class="chapter"
  id={id}
  data-chapter={number}
  style={`--chapter-accent: var(${accentColor}); --chapter-bg: var(${bgColor});`}
  aria-label={`Capítulo ${number}: ${title}`}
>
  <div class="chapter__header" data-animate="fade-up">
    <span class="chapter__number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
    <div class="chapter__title-group">
      <h2 class="chapter__title">{title}</h2>
      <p class="chapter__subtitle">{subtitle}</p>
    </div>
    <div class="chapter__separator" aria-hidden="true"></div>
  </div>

  <div class="chapter__content">
    <slot />
  </div>
</article>

<style>
  .chapter {
    position: relative;
    min-height: 100vh;
    padding: 8rem 2rem 6rem;
    background-color: var(--chapter-bg);
  }

  .chapter__header {
    max-width: var(--max-width);
    margin: 0 auto 4rem;
    position: relative;
    opacity: 0;
    transform: translateY(40px);
  }

  .chapter__number {
    font-family: var(--font-heading);
    font-size: clamp(6rem, 15vw, 12rem);
    color: var(--chapter-accent);
    opacity: 0.08;
    position: absolute;
    top: -3rem;
    left: -1rem;
    line-height: 1;
    pointer-events: none;
    user-select: none;
  }

  .chapter__title-group {
    position: relative;
    z-index: 1;
  }

  .chapter__title {
    color: var(--chapter-accent);
  }

  .chapter__subtitle {
    font-family: var(--font-quote);
    font-style: italic;
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    letter-spacing: 0.15em;
  }

  .chapter__separator {
    width: 60px;
    height: 2px;
    background: var(--chapter-accent);
    margin-top: 1.5rem;
    opacity: 0.6;
  }

  .chapter__content {
    max-width: var(--max-width);
    margin: 0 auto;
  }

  @media (prefers-reduced-motion: reduce) {
    .chapter__header { opacity: 1; transform: none; }
  }
</style>
```

- [ ] **Step 4: Wire Chapter 1 into index.astro**

Import chapters.json, render Chapter 1 with its narrative, quotes, and a parallax image.

- [ ] **Step 5: Add chapter animation to animations.js**

Add `initChapterAnimations()` that targets `[data-animate="fade-up"]` elements with ScrollTrigger fade-in, and `[data-parallax]` elements with y-offset parallax.

- [ ] **Step 6: Verify Chapter 1 renders with animations**

Check: chapter number bg, title in gold, narrative text, quote with attribution, parallax image, all fade in on scroll.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add Chapter, Quote, ParallaxImage components with Chapter 1 content"
```

---

## Task 6: ChapterNav Component

**Files:**
- Create: `src/components/ChapterNav.astro`
- Modify: `src/scripts/animations.js`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create ChapterNav.astro**

Fixed sidebar with 7 dots. Each dot has `data-chapter-nav="N"`, shows tooltip on hover with chapter title. Uses `role="navigation"`, `aria-label`, `aria-current`.

```astro
---
import chapters from '../data/chapters.json';
---

<nav class="chapter-nav" id="chapter-nav" role="navigation" aria-label="Navegación por capítulos">
  <!-- Mobile hamburger toggle -->
  <button class="chapter-nav__toggle" id="chapter-nav-toggle" aria-label="Abrir navegación" aria-expanded="false">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
  <ul class="chapter-nav__list">
    {chapters.chapters.map((ch) => (
      <li class="chapter-nav__item">
        <a
          href={`#${ch.id}`}
          class="chapter-nav__dot"
          data-chapter-nav={ch.number}
          aria-label={`Capítulo ${ch.number}: ${ch.title}`}
        >
          <span class="chapter-nav__tooltip">
            <span class="chapter-nav__tooltip-number">{String(ch.number).padStart(2, '0')}</span>
            {ch.title}
          </span>
        </a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .chapter-nav {
    position: fixed;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s var(--ease-default);
  }

  .chapter-nav.visible {
    opacity: 1;
    pointer-events: all;
  }

  .chapter-nav__list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .chapter-nav__dot {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid var(--accent-stone);
    background: transparent;
    position: relative;
    cursor: pointer;
    transition: all 0.3s var(--ease-default);
    text-decoration: none;
  }

  .chapter-nav__dot.active,
  .chapter-nav__dot[aria-current="true"] {
    background: var(--accent-gold);
    border-color: var(--accent-gold);
    transform: scale(1.3);
  }

  .chapter-nav__tooltip {
    position: absolute;
    right: calc(100% + 1rem);
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    font-size: 0.8rem;
    color: var(--text-primary);
    background: rgba(10, 10, 10, 0.9);
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s;
  }

  .chapter-nav__tooltip-number {
    color: var(--accent-gold);
    margin-right: 0.5rem;
    font-family: var(--font-heading);
    font-size: 0.7rem;
  }

  .chapter-nav__dot:hover .chapter-nav__tooltip,
  .chapter-nav__dot:focus .chapter-nav__tooltip {
    opacity: 1;
  }

  /* Tablet: top bar */
  @media (max-width: 1024px) {
    .chapter-nav {
      right: auto;
      top: 0;
      left: 0;
      width: 100%;
      transform: none;
      padding: 0.5rem 1rem;
      background: rgba(10, 10, 10, 0.95);
      backdrop-filter: blur(10px);
    }
    .chapter-nav__list {
      flex-direction: row;
      justify-content: center;
      gap: 0.75rem;
    }
    .chapter-nav__tooltip { display: none; }
    .chapter-nav__dot { width: 10px; height: 10px; }
  }

  .chapter-nav__toggle {
    display: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 101;
    background: rgba(10, 10, 10, 0.9);
    border: 1px solid var(--accent-stone);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    color: var(--text-primary);
    cursor: pointer;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .chapter-nav__toggle { display: flex; }
    .chapter-nav {
      display: none;
    }
    .chapter-nav.mobile-open {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 10, 0.98);
      padding: 4rem 2rem;
    }
    .chapter-nav.mobile-open .chapter-nav__list {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    .chapter-nav.mobile-open .chapter-nav__tooltip {
      position: static;
      transform: none;
      opacity: 1;
      background: none;
      font-size: 1rem;
    }
    .chapter-nav.mobile-open .chapter-nav__dot {
      width: auto;
      height: auto;
      border: none;
      border-radius: 0;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
</style>
```

- [ ] **Step 2: Add nav sync to animations.js**

Use ScrollTrigger `onEnter`/`onLeave` callbacks on each chapter section to update the active dot. Show/hide nav based on hero visibility.

```js
function initChapterNav() {
  const nav = document.getElementById('chapter-nav');
  const dots = document.querySelectorAll('[data-chapter-nav]');

  if (!nav || !dots.length) return;

  // Show/hide nav based on hero
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

  // Smooth scroll via scrollIntoView (not CSS scroll-behavior, which conflicts with GSAP)
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
```

- [ ] **Step 3: Add ChapterNav to index.astro**

- [ ] **Step 4: Verify nav appears after scrolling past hero, dots highlight correctly**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add ChapterNav with ScrollTrigger sync and responsive layout"
```

---

## Task 7: All 7 Chapters Content

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/scripts/animations.js`

- [ ] **Step 1: Render all 7 chapters from chapters.json**

Loop through `chapters.json` in `index.astro`, rendering each Chapter with its narrative paragraphs, quotes, and parallax hero image.

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import ChapterNav from '../components/ChapterNav.astro';
import Chapter from '../components/Chapter.astro';
import Quote from '../components/Quote.astro';
import ParallaxImage from '../components/ParallaxImage.astro';
import chapters from '../data/chapters.json';
---

<Base>
  <main>
    <Hero />
    <ChapterNav />

    {chapters.chapters.map((ch) => (
      <Chapter
        id={ch.id}
        number={ch.number}
        title={ch.title}
        subtitle={ch.subtitle}
        accentColor={ch.accentColor}
        bgColor={ch.bgColor}
      >
        {ch.images?.filter(img => img.usage === 'hero' || img.usage === 'parallax').slice(0, 1).map(img => (
          <ParallaxImage
            src={img.url}
            alt={img.alt}
            width={img.width}
            height={img.height}
          />
        ))}

        {ch.narrative.map((para) => (
          <p data-animate="fade-up">{para}</p>
        ))}

        {ch.quotes?.map(q => (
          <Quote text={q.text} author={q.author} source={q.source} />
        ))}
      </Chapter>
    ))}
  </main>

  <script>
    import { initAnimations } from '../scripts/animations.js';
    initAnimations();
  </script>
</Base>
```

- [ ] **Step 2: Verify all 7 chapters render with content, images, and quotes**

- [ ] **Step 3: Add per-chapter color transitions to animations.js**

For Chapter 4 (transition to Aztec), animate `body` background from `--bg-primary` to `--bg-warm`. For Chapter 6, add blood accent. For Chapter 7, add desaturation.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: render all 7 chapters with content, quotes, images, and color transitions"
```

---

## Task 8: Gallery Component

**Files:**
- Create: `src/components/Gallery.astro`
- Create: `src/scripts/gallery.js`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Gallery.astro**

Grid of clickable thumbnails. Each image has `data-gallery-index`. Lightbox overlay at the end with prev/next buttons, close button. ARIA: `role="dialog"`, `aria-modal="true"`, focus trap.

- [ ] **Step 2: Create gallery.js**

Handles:
- Click thumbnail → open lightbox at that index
- Arrow keys / click arrows → navigate
- ESC / click overlay → close
- Focus trap inside lightbox
- Touch swipe on mobile (pointerdown/pointermove/pointerup)

- [ ] **Step 3: Add galleries to chapters 3 and 6 (grabados and pinturas)**

Filter images with `usage === 'gallery'` from chapters.json for those chapters.

- [ ] **Step 4: Verify gallery opens, navigates, closes, keyboard works**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Gallery component with lightbox, keyboard nav, and touch swipe"
```

---

## Task 9: Timeline Component

**Files:**
- Create: `src/components/Timeline.astro`
- Create: `src/scripts/timeline.js`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Timeline.astro**

Horizontal layout with a line, dots at each date. Each dot has year label and event text. `data-timeline-item` for GSAP targeting. On mobile: vertical layout.

```astro
---
interface Props {
  dates: Array<{ year: string; event: string }>;
}

const { dates } = Astro.props;
---

<div class="timeline" data-timeline>
  <div class="timeline__track">
    <div class="timeline__line" data-timeline-line></div>
    {dates.map((d, i) => (
      <div class="timeline__item" data-timeline-item={i}>
        <div class="timeline__dot"></div>
        <div class="timeline__content">
          <span class="timeline__year">{d.year}</span>
          <p class="timeline__event">{d.event}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

With CSS for horizontal (desktop) and vertical (mobile) layouts.

- [ ] **Step 2: Create timeline.js**

ScrollTrigger-driven: as the timeline section scrolls, dots illuminate progressively. The line fills left-to-right (or top-to-bottom on mobile).

- [ ] **Step 3: Add Timeline to Chapter 2 (Cuba events) and Chapter 7 (last years)**

- [ ] **Step 4: Verify timeline animates on scroll, responsive works**

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Timeline component with scroll-driven illumination"
```

---

## Task 10: Chapter-Specific Effects

**Files:**
- Modify: `src/scripts/animations.js`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Chapter 3 — Ships sinking effect**

Pinned section where the ship image translates down with a red overlay fading in via ScrollTrigger scrub.

- [ ] **Step 2: Chapter 2 — Parchment reveal**

`clip-path: inset(100% 0 0 0)` animating to `inset(0 0 0 0)` on scroll for the chapter content.

- [ ] **Step 3: Chapter 4 — Background color transition**

ScrollTrigger animates `background-color` from `--bg-primary` to `--bg-warm` as user scrolls through this chapter.

- [ ] **Step 4: Chapter 5 — Golden section**

Larger text for key quotes, gold border treatments, slow zoom on Tenochtitlán images.

- [ ] **Step 5: Chapter 5 — City comparison infographic**

Static HTML/CSS infographic: 3 columns (Tenochtitlán, París, Londres) with population bars and numbers.

- [ ] **Step 6: Chapter 6 — Blood theme + shake effect**

Red accent colors, CSS grain overlay (`background-image` with noise SVG), GSAP shake on text blocks (random ±2px translate on scrub).

- [ ] **Step 7: Chapter 7 — Desaturation**

CSS `filter: saturate()` decreasing from 1 to 0.3 as user scrolls through the chapter, controlled by ScrollTrigger.

- [ ] **Step 8: Verify all chapter-specific effects**

Scroll through entire page, check each chapter's unique visual treatment.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add chapter-specific scroll effects (ships, parchment, color transitions, shake, desaturation)"
```

---

## Task 11: MapRoute Component

**Files:**
- Create: `src/components/MapRoute.astro`
- Modify: `src/scripts/animations.js`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create simplified SVG maps**

Two SVG maps as inline SVGs in the component:
1. Chapter 1: Extremadura → Caribbean (simplified Atlantic crossing)
2. Chapter 4: Veracruz → Tenochtitlán (inland route with stops)

Each route is a `<path>` with `stroke-dasharray` and `stroke-dashoffset` for draw animation. Key stops are `<circle>` elements with tooltip `<text>`.

- [ ] **Step 2: Create MapRoute.astro**

Takes a `mapId` prop to select which SVG to render. Route path has `data-map-route` for GSAP targeting.

- [ ] **Step 3: Add scroll-driven route drawing to animations.js**

ScrollTrigger animates `stroke-dashoffset` from full length to 0, drawing the route as user scrolls. Stop circles fade in as the path reaches them.

- [ ] **Step 4: Add tooltips on hover for stops**

CSS tooltips that appear on hover/focus showing location name and brief description.

- [ ] **Step 5: Add MapRoute to chapters 1 and 4**

- [ ] **Step 6: Verify maps draw on scroll, tooltips work**

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add MapRoute component with SVG route drawing animation"
```

---

## Task 12: Polish & Responsive

**Files:**
- Modify: `src/styles/global.css`
- Modify: multiple components
- Modify: `src/scripts/animations.js`

- [ ] **Step 1: Add decorative separators**

Gold line separators between Spanish chapters. SVG mesoamerican grecas for chapters 4-5. Implement as CSS `::before`/`::after` pseudo-elements or inline SVGs.

- [ ] **Step 2: Mobile responsive pass**

Test all components at 375px width:
- Verify ChapterNav mobile hamburger works
- Timeline is vertical
- Gallery uses swipe
- Text is readable
- Images scale correctly

- [ ] **Step 3: Tablet responsive pass**

Test at 768px:
- ChapterNav is top bar
- Parallax is reduced
- Layouts adapt

- [ ] **Step 4: Disable parallax on mobile**

Use `ScrollTrigger.matchMedia` to only enable parallax effects on `(min-width: 768px)`.

```js
ScrollTrigger.matchMedia({
  '(min-width: 768px)': function() {
    // Desktop/tablet parallax animations
  },
  '(max-width: 767px)': function() {
    // Mobile: simpler fade-in only animations
  }
});
```

- [ ] **Step 5: Verify prefers-reduced-motion**

Test with `prefers-reduced-motion: reduce` — all content should be visible without animation.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: responsive layout, decorative separators, reduced-motion support"
```

---

## Task 13: Final Build & Verification

**Files:**
- Possibly modify: various

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Clean build, no errors, static files in `dist/`.

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Test the full experience end-to-end:
- Hero animation plays
- All 7 chapters render with content
- ChapterNav syncs correctly
- Galleries open/close
- Timelines animate
- Maps draw
- Chapter-specific effects work
- Mobile responsive works
- Reduced motion works

- [ ] **Step 3: Check HTML semantics**

Verify:
- `<html lang="es">`
- `<article>` per chapter
- `<figure>`/`<figcaption>` for images
- `<blockquote>` for quotes
- `role="navigation"` on ChapterNav
- All images have `alt`

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "chore: production build verification and final polish"
```
