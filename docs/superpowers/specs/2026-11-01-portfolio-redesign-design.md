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
| Visual direction | A sparse particle constellation (as in the approved mockup), the same on every page, with an assembling intro on first visit. Glowing points joined by thin lines, in the current dark + `#00ff99` palette |
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
3. **Content.** The header, then each page wrapped in a Framer Motion `AnimatePresence` fade/slide transition. The original stair transition is restored and enhanced as the "stair wipe" (see Route transition).

### Particle system (revised 2026-11-01)

> **Revision.** After seeing the first build, the user asked for one sparse constellation that matches the approved mockup and is **the same on every page**, plus an assembling intro. The per-route patterns (cloud, column, grid, sphere) and the route morph are removed.

- **One pattern, `constellation`.** `constellation(count, seed) => Float32Array` returns normalized positions with x, y and z in [−1, 1]. They're spread evenly with no clumps, using best-candidate or Poisson-style sampling with a fixed seed. `ParticleField` scales them to the visible viewport (`useThree().viewport`) × 1.1 in x and y, and to ±1.5 world units in z, so the field always fills the screen at any aspect ratio.
- **Count:** 260 on desktop and 140 on phones (`matchMedia("(max-width: 768px)")` or `navigator.hardwareConcurrency <= 4`), decided once on mount.
- **Motion runs on the CPU** so the lines follow the points exactly. Every frame, each point's displayed position is its base position plus:
  - **drift:** a slow per-point sinusoidal wander, amplitude about 0.12 world units
  - **cursor pull:** points within 2.5 units of the pointer lean toward it, up to 0.35, with smoothstep falloff
  - **burst ripple:** after `particles.pulse("burst")`, a ring wave travels outward from the screen center over about 1.2s and pushes points radially, with amplitude decaying to 0
  - **scroll parallax:** the whole field shifts by `−scrollY × 0.0015` world units in y, clamped to ±1.5, and tilts up to ±0.05 rad toward the pointer
- **Lines:** every frame, pairs closer than 2.2 units are connected, with at most 3 per point. Each line's opacity fades linearly from full at distance 0 to 0 at 2.2, so connections fade in and out instead of popping. **Cursor lines:** faint lines join the pointer to its nearest 4 points within 2.5 units. Everything runs on preallocated buffers with no per-frame allocation.
- **Points:** a `THREE.Points` with a custom shader that draws soft round glowing dots, with sizes varying ±30% per point and a gentle twinkle (alpha modulated by `sin(uTime + seed)`). Color and blending follow the theme as before.
- **Same on every page:** route changes don't affect the field. Only the page content transitions.
- **Intro, "particles assemble":** see Loading intro below. On the intro, every point starts near the center and flies to its base position over 1.4s through the existing morph controller. Line opacity ramps from 0 starting at 70% of the morph.
- **Frame loop:** continuous while visible and motion is allowed. Paused when `document.hidden`. DPR is capped at `[1, 1.5]`.
- **Reduced motion:** the constellation renders once in its final state. There's no drift, cursor pull, cursor lines, parallax, twinkle, burst or intro.
- **Failure:** the error boundary and WebGL check fall back to the static layer, as before.

One-off effects still go through `lib/particle-store.ts`, `particles.pulse("burst")`, which Contact calls on a successful send.

### Loading intro

- **When it plays:** on the first page load of a browser session, when JS is running, motion is allowed, WebGL is available, and `sessionStorage["intro-played"]` isn't set. Otherwise it never plays.
- **No flash:** a tiny inline script in `<head>` adds the class `intro` to `<html>` before first paint when the session flag is unset and `prefers-reduced-motion` isn't `reduce`. CSS hides `header` and `main` (opacity 0) while `html.intro` is set.
- **Safety net:** a pure-CSS fallback animation reveals `header` and `main` after 3s even if JS never runs the intro. Content can never get stuck hidden.
- **Sequence**, capped at 2.0s:
  1. Particles assemble from the center (1.4s).
  2. A centered "Joren." animates in with `AnimatedName` at the same time.
  3. A 0.3s hold.
  4. The overlay logo fades out and the class is removed, so header and main fade in over 0.3s.
  5. The session flag is set.
- **Skip:** any click, keypress or touch ends the intro immediately. The particles jump to their final positions.
- **WebGL unsupported:** the intro ends immediately and content shows.
- **Component:** `components/IntroLoader.tsx`, a client component in the root layout. The overlay is `fixed inset-0 z-50`, with a transparent background so the assembling particles stay visible, and `aria-hidden`. The real content is not hidden from screen readers.
- **Performance note:** the intro delays the visible hero by up to about 2s on the first visit only. The Lighthouse desktop target of 90 or higher still applies, so measure it in Task 12.

### Route transition, "stair wipe" (added 2026-11-01)

The user asked to bring back the original stair page transition, enhanced, and to keep the loading intro for first load only.

- **When it plays:** on every client-side route change. It never plays on the initial page load, whether or not the intro runs, and never with reduced motion. Reduced motion swaps the page instantly.
- **Bars:** 6 full-height vertical bars (`fixed inset-0 z-40 flex pointer-events-none`), filled with the theme `surface`/`bg` color so they look dark in dark mode and light in light mode. Each bar's bottom edge has a 2px `accent` line with a soft glow (`box-shadow` in the accent color).
- **Motion:** the bars start covering the screen (`top: 0%`) and slide down to `top: 100%`. Each takes 0.45s with an `easeInOut` ease, staggered 0.06s from right to left, matching the original's reversed order. The whole wipe finishes in about 0.8s.
- **Destination label:** while the bars cover the screen, the destination page name is centered in the mono font ("Home", "Profile", "Projects" or "Contact", from `navLinks`). For `/projects/[slug]` it shows "Projects". The letters stagger in with Anime.js, then the label fades out as the bars leave, about 0.35s in all. It's `aria-hidden`.
- **Particles:** each route change sends `particles.pulse("ripple")`, a gentler, smaller version of the burst ripple at about 40% amplitude.
- **Content:** the new page renders immediately underneath, and the existing `PageTransition` fade continues. The bars never block clicks (`pointer-events: none`), and keyboard focus isn't trapped.
- **Component:** `components/StairTransition.tsx` (restored and rewritten) in the root layout.

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
    patterns/constellation.ts  (revised: single pattern)
    ../IntroLoader.tsx       (loading intro)
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

- `constellation` returns `count * 3` values in [−1, 1], is deterministic per seed, and is evenly spread.
- The intro decision logic, the CPU displacement, and the cursor nearest-points helper.
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
