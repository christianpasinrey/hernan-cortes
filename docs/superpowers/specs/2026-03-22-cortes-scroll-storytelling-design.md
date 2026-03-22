# Cortés — La Conquista del Nuevo Mundo

## Scroll Storytelling Design Spec

**Fecha:** 2026-03-22
**Tipo:** Proyecto nuevo — sitio web estático
**Referencia visual:** [Elimar by LMI Group](https://elimar.lmigroupintl.com/)

---

## 1. Visión General

Sitio web de scroll storytelling cinematográfico que narra la historia de Hernán Cortés y la conquista de México en 7 capítulos. El usuario hace scroll y la historia se despliega con animaciones parallax, transiciones de color, elementos interactivos y navegación por capítulos.

**Tono:** Cinematográfico/épico — narración dramática enfocada en momentos clave.
**Audiencia:** Público general interesado en historia.

---

## 2. Stack Técnico

| Tecnología | Propósito |
|---|---|
| **Astro 5** | Framework — static site, zero JS por defecto, islands architecture |
| **GSAP + ScrollTrigger** | Animaciones scroll-driven (parallax, pin, scrub) |
| **CSS vanilla + custom properties** | Estilos a medida, sin frameworks CSS |
| **JavaScript vanilla** | Interactividad (galerías, mapas, tooltips) |
| **Google Fonts (self-hosted)** | Cinzel, Inter, Cormorant Garamond — descargadas a `public/fonts/`, servidas con `font-display: swap` |

**Sin framework reactivo.** No se necesita React/Vue. Los elementos interactivos se manejan con JS vanilla + GSAP.

---

## 3. Arquitectura de Archivos

```
hernan-cortes/
├── src/
│   ├── pages/
│   │   └── index.astro              # Página principal (única)
│   ├── components/
│   │   ├── Hero.astro               # Intro cinematográfica
│   │   ├── ChapterNav.astro         # Navegación lateral por capítulos
│   │   ├── Chapter.astro            # Wrapper reutilizable por capítulo
│   │   ├── ParallaxImage.astro      # Imagen con efecto parallax
│   │   ├── Timeline.astro           # Línea temporal interactiva
│   │   ├── Gallery.astro            # Galería expandible (lightbox)
│   │   ├── MapRoute.astro           # Mapa de ruta SVG interactivo
│   │   └── Quote.astro              # Citas de cronistas
│   ├── layouts/
│   │   └── Base.astro               # Layout base (meta, fonts, scripts)
│   ├── styles/
│   │   └── global.css               # Variables, tipografía, estilos base
│   └── data/
│       └── chapters.json            # Contenido narrativo de los 7 capítulos
├── public/
│   └── fonts/                       # Tipografías locales (fallback)
├── astro.config.mjs
└── package.json
```

---

## 4. Diseño Visual

### 4.1 Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `--bg-primary` | `#0a0a0a` | Fondo principal (negro profundo) |
| `--bg-warm` | `#1a1510` | Fondo capítulos aztecas |
| `--text-primary` | `#f5f0e8` | Texto principal (crema) |
| `--accent-gold` | `#c9a84c` | Títulos, bordes, elementos destacados |
| `--accent-stone` | `#8b7355` | Subtítulos, líneas decorativas |
| `--accent-blood` | `#8b1a1a` | Momentos dramáticos (batallas) |
| `--accent-turquoise` | `#2d8b8b` | Elementos mexicas/aztecas |

### 4.2 Tipografía

| Fuente | Uso |
|---|---|
| **Cinzel** (serif) | Títulos de capítulo, hero |
| **Inter** (sans) | Cuerpo de texto |
| **Cormorant Garamond** (itálica) | Citas de cronistas, fechas |

### 4.3 Motivos Decorativos

- Grecas mesoamericanas en SVG para secciones aztecas
- Líneas finas doradas como separadores en secciones españolas
- Números de capítulo grandes y semitransparentes como fondo editorial

---

## 5. Los 7 Capítulos

### Hero / Intro
- Pantalla completa negra
- "CORTÉS" se revela letra por letra con efecto blur→clear
- Subtítulo "La Conquista del Nuevo Mundo" en fade
- "1485 — 1547" en oro
- Indicador de scroll animado

### Cap 1 — "El hijo de Extremadura" (1485-1511)
- **Contenido:** Nacimiento en Medellín, familia hidalga, estudios en Salamanca, viaje a La Española
- **Efecto:** Parallax con castillo de Medellín, texto entra desde los lados
- **Interactivo:** Mapa SVG Extremadura → Caribe con ruta animada

### Cap 2 — "La isla y la ambición" (1511-1519)
- **Contenido:** Cuba bajo Velázquez, Cortés alcalde, gestación de la expedición
- **Efecto:** Secciones que se revelan como pergaminos
- **Interactivo:** Timeline eventos en Cuba

### Cap 3 — "Quemando el camino atrás" (1519)
- **Contenido:** Salida de Cuba, Cozumel, Aguilar, Veracruz, La Malinche, quema de naves
- **Efecto:** Imagen de naves que se oscurece con tinte rojo. Sección pinned donde naves "se hunden" con parallax vertical
- **Interactivo:** Galería de grabados

### Cap 4 — "Camino al corazón del imperio" (1519)
- **Contenido:** Alianza Tlaxcala, masacre Cholula, volcanes, primera vista de Tenochtitlán
- **Efecto:** Transición de color — fondo pasa de tonos españoles cálidos a turquesa/piedra azteca. Parallax de volcanes con Tenochtitlán revelándose
- **Interactivo:** Mapa ruta Veracruz → Tenochtitlán con paradas

### Cap 5 — "En la ciudad de los dioses" (1519-1520)
- **Contenido:** Encuentro con Moctezuma, descripción de Tenochtitlán, captura de Moctezuma
- **Efecto:** Sección dorada — acento oro dominante, códices con zoom lento, tipografía grande para citas épicas
- **Interactivo:** Comparativa Tenochtitlán vs ciudades europeas

### Cap 6 — "La Noche Triste" (1520)
- **Contenido:** Masacre del Templo Mayor, muerte de Moctezuma, huida del 30 de junio
- **Efecto:** Acento sangre domina, fondo oscurece, texto fragmentado con efecto "temblor", imágenes con grain
- **Interactivo:** Galería de pinturas históricas

### Cap 7 — "Cenizas y gloria" (1520-1547)
- **Contenido:** Reagrupamiento, sitio con bergantines, caída 13 agosto 1521, gobernador, declive, muerte 1547
- **Efecto:** De épico a melancólico. Oro se apaga, colores se desaturan. Última imagen en sepia/gris
- **Interactivo:** Timeline de los últimos años

---

## 6. Navegación e Interactividad

### 6.1 ChapterNav (barra lateral)
- Posición fija derecha, vertical, 7 dots
- Hover muestra número + título del capítulo
- Dot activo se resalta en oro según sección visible (via ScrollTrigger `onEnter`/`onLeave`)
- Click → smooth scroll al capítulo
- Oculta en Hero, visible desde Cap 1

### 6.2 Elementos Interactivos

| Componente | Comportamiento |
|---|---|
| **Gallery** | Click → expand fullscreen con overlay oscuro, flechas nav, ESC cierra |
| **MapRoute** | SVG con stroke-dashoffset animado por scroll, tooltips en hover |
| **Timeline** | Horizontal, scroll-driven, puntos que se iluminan, click muestra detalle |
| **Quote** | Fade elegante con atribución al cronista |

### 6.3 Performance
- `loading="lazy"` + `decoding="async"` en imágenes
- GSAP ScrollTrigger con `scrub: true`
- Componentes Astro zero-JS por defecto
- Fuentes self-hosted con `font-display: swap` y `<link rel="preload">`
- Imágenes externas con `width`/`height` explícitos para evitar CLS

---

## 7. Imágenes

Todas las imágenes serán de dominio público desde Wikimedia Commons. Se hotlinkean directamente desde `upload.wikimedia.org`. Cada `<img>` lleva `width`/`height` explícitos para evitar layout shift (CLS). Si una imagen falla, se oculta con CSS (`img[src] { ... }` + `onerror`).

---

## 8. Responsive

| Breakpoint | Comportamiento |
|---|---|
| **Desktop** (>1024px) | Experiencia completa: parallax, ChapterNav lateral, galerías grid |
| **Tablet** (768-1024px) | Parallax reducido, ChapterNav se convierte en barra superior compacta |
| **Mobile** (<768px) | Parallax desactivado (`ScrollTrigger.matchMedia`), ChapterNav se convierte en menú hamburguesa con overlay, Timeline pasa de horizontal a vertical, Gallery con swipe táctil |

Todas las animaciones respetan `prefers-reduced-motion: reduce` — se desactivan y el contenido se muestra estático.

---

## 9. Accesibilidad

- `prefers-reduced-motion: reduce` → desactiva todas las animaciones GSAP
- Gallery: focus trap activo, navegación con flechas de teclado, ESC cierra
- ChapterNav dots: `role="navigation"`, `aria-label` por capítulo, `aria-current` en el activo
- Todas las imágenes con `alt` descriptivo
- Contraste mínimo WCAG AA: `--accent-stone` se usa solo para elementos decorativos, nunca como color de texto sobre fondo oscuro
- Semántica HTML: `<article>` por capítulo, `<figure>`/`<figcaption>` para imágenes, `<blockquote>` para citas

---

## 10. SEO y Meta

- `<title>`: "Cortés — La Conquista del Nuevo Mundo"
- `<meta name="description">`: Resumen de la narrativa
- Open Graph tags (og:title, og:description, og:image)
- HTML semántico para que el contenido sea legible sin JS (Astro renderiza server-side)
- `<html lang="es">`

---

## 11. Detalles Técnicos de Animación

- **Easing por defecto:** `power2.inOut`
- **Scrub:** `scrub: 1` (1 segundo de suavizado)
- **Pin spacing:** `pinSpacing: true` por defecto, las secciones no se solapan
- **Hero letter-by-letter:** Cada letra en un `<span>`, animación CSS `filter: blur()` + `opacity` controlada por ScrollTrigger. No requiere GSAP SplitText (plugin de pago).
- **ChapterNav sync:** Usa callbacks de ScrollTrigger (`onEnter`/`onLeave`) en vez de Intersection Observer separado, para evitar desincronización.
- **Efecto pergamino (Cap 2):** `clip-path: inset()` animado con ScrollTrigger — revela el contenido de arriba hacia abajo como un pergamino que se desenrolla.
- **Efecto temblor (Cap 6):** `transform: translate()` con valores aleatorios pequeños (±2px) vía GSAP, aplicado a bloques de texto durante el scrub de la sección.
- **Comparativa Tenochtitlán (Cap 5):** Infografía estática con números de población superpuestos: Tenochtitlán ~200k vs París ~100k vs Londres ~50k. No es un componente interactivo nuevo, se implementa con HTML/CSS dentro del Chapter.

---

## 12. Schema de `chapters.json`

```json
{
  "chapters": [
    {
      "id": "chapter-1",
      "number": 1,
      "title": "El hijo de Extremadura",
      "subtitle": "1485 — 1511",
      "accentColor": "--accent-gold",
      "bgColor": "--bg-primary",
      "narrative": ["párrafo 1...", "párrafo 2..."],
      "quotes": [
        {
          "text": "cita textual...",
          "author": "Bernal Díaz del Castillo",
          "source": "Historia verdadera..."
        }
      ],
      "keyDates": [
        { "year": "1485", "event": "Nace en Medellín" }
      ],
      "images": [
        {
          "url": "https://upload.wikimedia.org/...",
          "alt": "Descripción",
          "usage": "hero|parallax|inline|gallery",
          "width": 1200,
          "height": 800
        }
      ]
    }
  ]
}
```

---

## 13. Fuera de Alcance

- No hay backend ni base de datos
- No hay sistema de autenticación
- No hay CMS
- No hay internacionalización (solo español)
- No hay modo oscuro/claro toggle (siempre oscuro)
- No hay Three.js/3D (a diferencia de Elimar, mantenemos 2D con parallax)
- No hay analytics (se puede añadir después)
- No hay PWA/manifest
