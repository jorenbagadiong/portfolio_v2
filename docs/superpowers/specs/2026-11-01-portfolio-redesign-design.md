# Portfolio v2 redesign: 3D particles, motion, light/dark mode

**Date:** 2026-11-01
**Branch:** `redesign`
**Status:** Approved in brainstorming, pending spec review

## Goal

Redesign the portfolio so it impresses three audiences at once:

- **Recruiters** scan experience fast and grab the CV in one click.
- **Clients** browse projects, link to a specific one, and get in touch.
- **Everyone** sees the site itself as proof of frontend skill.

### Success criteria

- Every page's content is readable and usable before any 3D loads.
- Lighthouse performance is at least 90 on desktop and at least 75 on mobile. Layout shift from the background is 0.
- The CV download is above the fold on Home.
- Everything works by keyboard. Reduced-motion users get no animation, only the final states.
- Light and dark themes both pass WCAG AA contrast for body text and buttons.

### Non-goals

- No content changes. Experience, projects, socials, CV and the EmailJS form keep their current data.
- No CMS and no new backend.
- No single-page scroll layout.
- No project filter chips for now (only 4 projects). Add them later when there are more.
- No changes to the `/motionlab` and `/pokelab` rewrites.

## Decisions made

| Topic | Decision |
|---|---|
| 3D intensity | A persistent 3D background across all pages |
| Visual direction | A particle constellation: glowing points joined by thin lines, in the current dark + `#00ff99` palette |
| Structure | Keep 4 pages. Rename **Work → Projects** (`/work` → `/projects`, with a permanent redirect) |
| Layouts | All four pages fully redesigned (see Pages) |
| 3D tech | React Three Fiber + drei, one persistent canvas in the root layout |
| Motion libraries | Framer Motion (React-driven motion) + Anime.js v4 (timelines, SVG, text, counters) |
| "Hire me" button | In the header on every page **except** `/contact`, on desktop and in the mobile menu |
| Themes | Light + dark through next-themes. Defaults to the system setting and remembers the user's choice |

## Architecture

### Layers (back to front)

1. **Static fallback.** A CSS radial gradient plus a dot pattern, with one version per theme. It's always rendered, so it shows before and instead of WebGL.
2. **`<ParticleBackground />`.** A fixed, full-viewport R3F `<Canvas>` with `pointer-events: none` and `aria-hidden`. It loads with `next/dynamic({ ssr: false })` and mounts after first paint. It stays mounted across route changes.
3. **Content.** The header, then each page wrapped in a Framer Motion `AnimatePresence` fade/slide transition. This replaces `PageTransition`'s current behavior and removes `StairTransition` and `Stairs`.

### Route → pattern

Configured in `components/three/patterns/config.ts`:

| Route | Pattern | Notes |
|---|---|---|
| `/` | `cloud` | A loose 3D cloud that drifts and leans toward the cursor |
| `/profile` | `column` | A vertical column that echoes the timeline |
| `/projects`, `/projects/[slug]` | `grid` | A grid that echoes the cards |
| `/contact` | `sphere` | A sphere that bursts outward on a successful send |
| anything else | `cloud` | Default |

`ParticleBackground` reads `usePathname()` and morphs to the mapped pattern. Pages need no wiring.

One-off effects go through a tiny store (`lib/particle-store.ts`, built on `useSyncExternalStore`, with no new dependency). Its API is `particles.pulse(kind: "burst")`. Contact calls it on a successful send.

### Particle system

- **Pattern functions** are pure. `(count: number, seed: number) => Float32Array` returns `count * 3` positions. There's one function per pattern in `components/three/patterns/`.
- **Count:** about 1,500 on desktop and about 600 on phones (when `matchMedia("(max-width: 768px)")` matches or `navigator.hardwareConcurrency <= 4`).
- **Rendering:** one `THREE.Points` with a custom `ShaderMaterial`.
  - The attributes are `aFrom` and `aTo` (positions) plus `aSeed`.
  - The uniforms are `uMorph` (0→1), `uTime`, `uPointer` (vec2, world space), `uBurst`, `uColor`, `uOpacity` and `uAdditive`.
  - The vertex shader mixes `aFrom` → `aTo` with an ease, adds noise drift from `aSeed` and `uTime`, adds a cursor attraction falloff, and adds a radial burst offset.
- **Morph:** on a route change, the current displayed positions are copied into `aFrom`, the new pattern goes into `aTo`, and `uMorph` tweens 0→1 over about 1.2s.
- **Lines:** `LineSegments` connect a fixed subset (about 150 points). Neighbor pairs are recomputed on the CPU after each morph completes and on a throttled interval. The work is capped at a small budget per frame.
- **Frame loop:**
  - `frameloop="demand"` while idle. The loop runs continuously while morphing, while the pointer moves, or while drift is enabled.
  - Paused when `document.hidden` or when the canvas isn't intersecting.
  - DPR is capped at `[1, 1.5]`.
- **Reduced motion:** renders one frame with the current pattern and never animates (no drift, no pointer, no morph). The pattern for the new route is applied instantly.
- **Failure:** an error boundary around the canvas, plus a WebGL availability check, falls back to the static layer only.

### Theming

- **next-themes** with `attribute="class"`, `defaultTheme="system"` and `enableSystem`. Tailwind uses `darkMode: "class"`.
- **Color tokens** are CSS variables in `app/globals.css` (`:root` for light, `.dark` for dark), exposed in `tailwind.config.ts`:

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#1c1c22` | `#f5f7f6` |
| `--surface` (glass) | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.7)` |
| `--border` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.08)` |
| `--text` | `#ffffff` | `#111317` |
| `--muted` | `rgba(255,255,255,0.6)` | `#5b6370` |
| `--accent` | `#00ff99` | `#00a86b` |
| `--accent-hover` | `#00e187` | `#008f5b` |
| `--particle` | `#00ff99` | `#00a86b` |

- Hardcoded colors such as `text-white`, `bg-primary` and `#1c1c22` are replaced with the token classes throughout.
- Particles read `--particle` from computed style when the theme changes. They tween `uColor` over about 400ms and switch to additive blending in dark mode and normal blending in light mode.
- **`ThemeToggle`** is a sun/moon button in the header (desktop) and in the mobile menu, with an animated icon swap and `aria-label="Switch to light/dark theme"`. It renders a same-size placeholder until mounted, to avoid a hydration mismatch.

### Motion responsibilities

| Library | Used for |
|---|---|
| **Framer Motion** | Route transitions, `Reveal` (scroll-in), `Tilt` (3D card tilt toward the cursor), the shared-layout card→detail expansion, mobile menu and theme icon animation |
| **Anime.js v4** (`animejs`) | The hero name letter animation, the photo ring SVG drawing, timeline line drawing linked to scroll, stat counters (replaces `react-countup`), staggered skill icons |
| **R3F** | The particle background only |

Each library gets a reduced-motion-aware wrapper in `components/motion/`. All of them use one shared `usePrefersReducedMotion()` hook from `lib/hooks/`.

### Content data

Content moves out of the page files into `lib/site-data.ts`, which holds typed exports: `experience`, `education`, `certifications`, `skills`, `proficiency`, `projects`, `stats`, `socials`, `contactInfo` and `navLinks`. Each project gets a `slug`. The values are copied verbatim from the current files.

## Pages

### Header (all pages)

The logo, the nav (Home · Profile · Projects · Contact), the `ThemeToggle`, and **Hire me** (a link to `/contact`, hidden when `pathname === "/contact"`). The mobile menu (Radix Sheet) includes the same links, the toggle and Hire me with the same rule. The active link shows an accent underline, animated with a Framer `layoutId`.

### Home `/`

- **Left:**
  - The role ("Frontend Web Developer")
  - "Hello, I'm" with the name animated letter by letter (Anime.js). The real text stays in the DOM for screen readers and SEO, and the per-letter spans are `aria-hidden`.
  - The intro line
  - The **Download CV** button (primary, above the fold)
  - The social icons
- **Right:** the photo with an SVG ring that draws on load (Anime.js) and rotates slowly.
- **Below:** 4 glass stat tiles (5 years, 18 projects, 16 technologies, 500 commits) that count up once in view.

### Profile `/profile`

- **Main column:** an experience timeline.
  - A vertical accent line draws as you scroll (Anime.js, tied to scroll progress).
  - Each entry is a glass card with the date, role and company, and it reveals as the line reaches it.
  - Responsibilities collapse behind "Show responsibilities" (keyboard-operable, `aria-expanded`).
  - Education and certifications follow as timeline groups.
- **Side column** (stacks under the timeline on mobile):
  - Skills as an icon grid with staggered reveal and hover lift. Each icon has a tooltip with its name.
  - Proficiency bars that fill once in view.

### Projects `/projects` and `/projects/[slug]`

- A grid of glass cards with a thumbnail, title and stack tags. They tilt toward the cursor (Framer). Tilt is off for touch and for reduced motion.
- Clicking a card expands it into a detail view through a Framer shared `layoutId`.
  - The detail view has a large image, description, stack, **Live ↗** and **GitHub ↗** links, and close.
  - It's implemented as an intercepting route. The `app/projects/@modal/(.)[slug]` folder renders the overlay during in-app navigation, and `app/projects/[slug]/page.tsx` renders the full page on a direct visit or refresh.
  - Focus is trapped (Radix Dialog). Esc closes it and focus returns to the card.
- An unknown slug calls `notFound()`.
- `generateStaticParams` uses `projects` and `generateMetadata` uses each project's title and description.
- `next.config.ts` adds permanent redirects `/work` → `/projects` and `/work/:path*` → `/projects`.

### Contact `/contact`

- **Left:** the headline "Let's build something together.", a line about availability, and phone, email and address (current values).
- **Right:** a glass form with the current fields (full name, email, subject, message), using react-hook-form + Zod as today. Fields get an accent glow on focus and inline errors.
- **Success:** a sonner toast, the form resets, and `particles.pulse("burst")` fires.
- **Failure:** an error toast, and no burst.
- **Missing EmailJS env vars:** the submit shows a clear error toast and logs which variable is missing. No silent failure.

## Dependencies

- **Add:** `three`, `@react-three/fiber` (v9, for React 19), `@react-three/drei`, `animejs` (v4), `next-themes`.
- **Dev add:** `@types/three`, `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@playwright/test`.
- **Remove:** `swiper`, `react-countup`, `axios`, `notiflix`. `axios` and `notiflix` aren't imported anywhere today.
- **Remove files:** `components/StairTransition.tsx`, `components/Stairs.tsx`, `components/WorkSliderBtns.tsx`, `app/work/`.

## File layout (new and changed)

```
app/
  layout.tsx                    ThemeProvider, static fallback, ParticleBackground, Header, transitions
  globals.css                   theme tokens
  page.tsx                      Home
  profile/page.tsx
  projects/
    layout.tsx                  renders {children} + {modal}
    page.tsx                    grid
    [slug]/page.tsx             full detail page
    @modal/default.tsx          returns null
    @modal/(.)[slug]/page.tsx   overlay detail
  contact/page.tsx
components/
  three/
    ParticleBackground.tsx      dynamic import target, error boundary, WebGL check
    ParticleField.tsx           Points + LineSegments, morph/pointer/burst logic
    shaders.ts
    patterns/{cloud,column,grid,sphere,config}.ts
  motion/
    Reveal.tsx  Tilt.tsx  AnimatedName.tsx  DrawRing.tsx  CountUp.tsx  ScrollLine.tsx
  ThemeToggle.tsx
  Header.tsx  Nav.tsx  MobileNav.tsx  (updated)
  projects/ProjectCard.tsx  ProjectDetail.tsx
lib/
  site-data.ts
  particle-store.ts
  hooks/usePrefersReducedMotion.ts
tests/
  unit/ (Vitest)   e2e/ (Playwright)
```

## Error handling summary

| Failure | Behavior |
|---|---|
| No WebGL or a canvas runtime error | Static fallback layer only. The site works fully |
| Slow 3D chunk | Content is already visible. The canvas fades in when ready |
| EmailJS send error | Error toast, no burst, form values kept |
| Missing EmailJS env var | Error toast plus a console message naming the variable |
| Unknown project slug | 404 |
| Theme not yet resolved | next-themes inline script sets the class before paint. The toggle shows a placeholder until mounted |

## Testing

**Unit (Vitest):**

- Each pattern returns `count * 3` finite numbers, and the same seed gives the same output.
- The route → pattern mapping covers all routes plus the default.
- Project slug lookup and `generateStaticParams` output.
- The `particle-store` pulse subscription.
- `usePrefersReducedMotion` responds to `matchMedia`.

**End-to-end (Playwright, against `next build && next start`):**

- Each route loads and shows its heading.
- Hire me is visible on `/`, `/profile` and `/projects`, and absent on `/contact` (desktop and mobile viewport).
- `/work` redirects to `/projects`.
- A project card opens the overlay, Esc closes it, and focus returns. A direct visit to `/projects/<slug>` renders the full page.
- The theme toggle switches the `html` class, and the choice persists after reload.
- The contact form shows validation errors. A successful submit with EmailJS stubbed through route interception shows the success toast.
- With reduced motion emulated, the pages render with no errors.

**Manual:**

- Visual check in both themes on desktop and on a phone-size viewport.
- Lighthouse on desktop and mobile against the targets.
- Contrast check on accent text in light mode.

## Delivery stages

Each stage ends with the site building and working:

1. **Foundation:** theme tokens and next-themes, `ThemeToggle`, `site-data.ts`, the Hire me rule, the Work→Projects rename and redirect, test tooling.
2. **3D background:** patterns, shaders, the morph by route, the fallback, reduced motion, the burst store.
3. **Home** redesign.
4. **Profile** redesign.
5. **Projects** grid and detail view (intercepting route).
6. **Contact** redesign and the burst.
7. **Cleanup:** remove Swiper, countup, stairs and unused dependencies. Do the Lighthouse and contrast pass, and update the README.
