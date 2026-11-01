# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's presentation with a persistent 3D particle background, redesigned pages (Home, Profile, Projects, Contact), Framer Motion + Anime.js motion, and light/dark themes. Content stays the same.

**Architecture:** One React Three Fiber canvas lives in the root layout. It morphs a GPU particle field between per-route patterns, keyed off `usePathname()`. Content renders above it and never depends on it, and a static CSS layer is always underneath. Content data moves to `lib/site-data.ts`. Theme colors are CSS variables switched by next-themes, and the particles read the same variables.

**Tech Stack:** Next.js 15.4 (App Router), React 19.1, TypeScript, Tailwind 3, three + @react-three/fiber v9 + @react-three/drei, framer-motion 12, animejs v4, next-themes, Radix (existing shadcn ui), react-hook-form + Zod, EmailJS, sonner. Tests: Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-01-portfolio-redesign-design.md`. Read it before starting any task. Its tables (route→pattern, color tokens, error handling) are normative.

## Global Constraints

- Package manager is **yarn** (a `yarn.lock` is committed). Never add a `package-lock.json`.
- Code style is the existing Prettier config: no semicolons, double quotes. Run `yarn format` before each commit.
- The import alias is `@/*` → repo root.
- Content copy (experience, education, certifications, skills, proficiency, projects, stats, socials, contact info, the intro paragraph) is copied **verbatim** from the current files. Never reword it.
- Color tokens are exactly as in the spec table. Dark: bg `#1c1c22`, accent `#00ff99`, hover `#00e187`. Light: bg `#f5f7f6`, accent `#00a86b`, hover `#008f5b`, text `#111317`, muted `#5b6370`.
- Particle count: 1500 on desktop, 600 when `(max-width: 768px)` matches or `navigator.hardwareConcurrency <= 4`. DPR is `[1, 1.5]`.
- Morph duration is 1.2s and the theme color tween is 400ms.
- Route → pattern: `/` cloud, `/profile` column, `/projects` and `/projects/*` grid, `/contact` sphere, anything else cloud.
- "Hire me" links to `/contact` and is hidden when the pathname is `/contact`. This applies on desktop and in the mobile menu.
- `/work` and `/work/:path*` permanently redirect to `/projects`.
- Every animated component must render its final state with no animation when `prefers-reduced-motion: reduce` is set.
- The particle canvas is `aria-hidden`, `pointer-events: none`, and loaded via `next/dynamic` with `ssr: false`.
- The `/motionlab` and `/pokelab` rewrites in `next.config.ts` stay untouched.

## Review Focus

1. **Rapid navigation mid-morph** (the user clicks Profile and then Projects within 1.2s). The particles should continue from where they currently are toward the newest pattern, without snapping. Pinned by `blendPositions` tests in Task 5 and the "starts new morph from displayed positions" test in Task 6.
2. **Back, forward and refresh on a project overlay.** Back should close the overlay and return to the grid. Refresh on `/projects/<slug>` should render the full page. Forward should reopen it. Pinned by e2e tests in Task 10.
3. **WebGL unavailable** (old devices, GPU blocklisted, privacy browsers). The content and static background should show with no console errors. Pinned by an e2e test in Task 6.
4. **Double-clicking Send** on the contact form. Only one EmailJS request should go out, and the button should be disabled while sending. Pinned by an e2e test in Task 11.
5. **Narrow phones (320px wide).** No horizontal scrolling on any page, and the header (logo, theme toggle, menu) should fit. Pinned by an e2e test in Task 12.

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/site-data.ts` | Typed content and nav data, `getProjectBySlug` |
| `lib/nav.ts` | `shouldShowHireMe(pathname)` |
| `lib/hooks/usePrefersReducedMotion.ts` | Shared reduced-motion hook |
| `lib/particle-store.ts` | `particles.pulse()` / `subscribe()` external store |
| `lib/emailjs-config.ts` | Reads and validates EmailJS env vars |
| `components/three/patterns/*.ts` | Pure position generators + route mapping |
| `components/three/morph.ts` | `blendPositions`, `easeInOutCubic` (pure) |
| `components/three/shaders.ts` | GLSL strings |
| `components/three/ParticleField.tsx` | Points + LineSegments, morph/pointer/burst/theme |
| `components/three/ParticleBackground.tsx` | Canvas host, WebGL check, error boundary |
| `components/StaticBackground.tsx` | CSS fallback layer |
| `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx` | Theming |
| `components/motion/*.tsx` | Reveal, Tilt, AnimatedName, DrawRing, CountUp, ScrollLine |
| `components/projects/ProjectCard.tsx`, `ProjectDetail.tsx`, `ProjectModal.tsx` | Projects UI |
| `components/profile/Timeline.tsx`, `SkillsPanel.tsx` | Profile UI |
| `components/contact/ContactForm.tsx` | Form logic, moved out of the page |
| `tests/unit/**`, `tests/e2e/**` | Vitest and Playwright |

---

### Task 1: Test tooling and content data module

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `lib/site-data.ts`, `tests/unit/site-data.test.ts`
- Modify: `package.json` (scripts and devDeps), `app/profile/page.tsx`, `app/work/page.tsx`, `app/contact/page.tsx`, `components/Status.tsx`, `components/Social.tsx`, `components/Nav.tsx`, `components/MobileNav.tsx` (import from `site-data` instead of local constants)

**Interfaces:**
- Produces, in `lib/site-data.ts`:
  - `type NavLink = { name: string; path: string }`
  - `navLinks: NavLink[]`, in this order: home `/`, profile `/profile`, projects `/projects`, contact `/contact`
  - `type Project = { slug: string; num: string; category: string; title: string; description: string; stack: { name: string }[]; image: string; live: string; github: string }`
  - `projects: Project[]`
  - `getProjectBySlug(slug: string): Project | undefined`
  - `experience`, `education`, `certifications`, `proficiency`, `skills`, with the same shapes as the current constants in `app/profile/page.tsx`, except that a skill's `icon` becomes `icon: IconType` (the component from `react-icons`, e.g. `FaReact`) instead of a rendered `ReactNode`, so the file stays plain `.ts`. The consumers render `<skill.icon />`.
  - `stats: { num: number; text: string }[]`
  - `socials`, the same shape as `SOCIALS` today
  - `contactInfo`, the same shape as `INFO` in contact
  - `intro: string`, the Home paragraph

- [ ] **Step 1: Install test deps and add scripts**

Run: `yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
Add scripts `"test": "vitest run"` and `"test:watch": "vitest"`.

- [ ] **Step 2: Create `vitest.config.ts`**

Use the jsdom environment, `@vitejs/plugin-react`, `resolve.alias` `@` → the repo root, `include: ["tests/unit/**/*.test.{ts,tsx}"]`, and `setupFiles: ["tests/setup.ts"]`. The setup file imports `@testing-library/jest-dom/vitest`.

- [ ] **Step 3: Write the failing test** `tests/unit/site-data.test.ts`

```ts
import { navLinks, projects, getProjectBySlug, stats } from "@/lib/site-data"

test("nav links are home, profile, projects, contact", () => {
  expect(navLinks.map((l) => l.path)).toEqual(["/", "/profile", "/projects", "/contact"])
})
test("project slugs are unique kebab-case", () => {
  const slugs = projects.map((p) => p.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
  slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/))
})
test("getProjectBySlug finds and misses", () => {
  expect(getProjectBySlug("cryptoweb-app")?.title).toBe("Cryptoweb App")
  expect(getProjectBySlug("nope")).toBeUndefined()
})
test("stats keep current values", () => {
  expect(stats.map((s) => s.num)).toEqual([5, 18, 16, 500])
})
```

- [ ] **Step 4: Run it and confirm it fails**

Run: `yarn test tests/unit/site-data.test.ts`
Expected: FAIL because the module can't be resolved.

- [ ] **Step 5: Create `lib/site-data.ts` by moving the constants verbatim**

The slugs are `cryptoweb-app`, `pet-grooming`, `cryptolist` and `portfolio-v1`. Fix the double slash in the Portfolio v1 `live` URL (`…vercel.app//` → `…vercel.app/`). Update the listed components and pages to import from it. Leave the nav path as `/projects` for now; Task 2 adds the route.

- [ ] **Step 6: Run the tests, then check types and build**

Run: `yarn test && yarn build`
Expected: the tests PASS and the build succeeds.

- [ ] **Step 7: Commit**

`git commit -m "refactor: move site content into lib/site-data and add vitest"`

---

### Task 2: Projects route rename, redirect, Hire me rule, Playwright

**Files:**
- Create: `lib/nav.ts`, `tests/unit/nav.test.ts`, `playwright.config.ts`, `tests/e2e/nav.spec.ts`, `app/projects/page.tsx` (the current work page moved here; unchanged UI for now)
- Delete: `app/work/`
- Modify: `next.config.ts` (add `redirects()`), `components/Header.tsx`, `components/MobileNav.tsx`, `.gitignore` (`/test-results`, `/playwright-report`)

**Interfaces:**
- Consumes: `navLinks` (Task 1)
- Produces: `shouldShowHireMe(pathname: string): boolean`

- [ ] **Step 1: Write the failing unit test**

```ts
import { shouldShowHireMe } from "@/lib/nav"
test.each([["/", true], ["/profile", true], ["/projects", true], ["/projects/cryptolist", true], ["/contact", false]])(
  "%s → %s", (p, v) => expect(shouldShowHireMe(p)).toBe(v))
```

- [ ] **Step 2: Run it and confirm it fails.** Run `yarn test tests/unit/nav.test.ts` and expect FAIL.

- [ ] **Step 3: Implement `shouldShowHireMe`.** Move `app/work/page.tsx` → `app/projects/page.tsx`. Add redirects with `permanent: true` for `/work` and `/work/:path*` → `/projects`. Render Hire me in `Header` (desktop) and inside the `MobileNav` sheet, gated by `shouldShowHireMe(usePathname())`. Header must become a client component or wrap the button in a small client component; prefer a small `HireMeButton` client component. In `Nav`, render the active-link underline as a `motion.span` with `layoutId="nav-underline"` so it slides between links (no animation with reduced motion). Mark the active link with `aria-current="page"`.

- [ ] **Step 4: Run the unit tests.** Run `yarn test` and expect PASS.

- [ ] **Step 5: Set up Playwright**

Run: `yarn add -D @playwright/test && npx playwright install chromium`

`playwright.config.ts` settings:
- `testDir: "tests/e2e"`
- projects `desktop` (1280×800) and `mobile` (devices["Pixel 7"])
- `use.baseURL: "http://localhost:3100"`
- `webServer: { command: "yarn build && yarn start -p 3100", port: 3100, reuseExistingServer: !process.env.CI, env: { NEXT_PUBLIC_EMAILJS_SERVICE_ID: "test_service", NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "test_template", NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "test_key" } }`

Add the script `"test:e2e": "playwright test"`.

- [ ] **Step 6: Write the e2e tests** `tests/e2e/nav.spec.ts`

- `"/work redirects to /projects"`: `goto("/work")` then `expect(page).toHaveURL(/\/projects$/)`.
- `"hire me visible except on contact"`: for `/`, `/profile` and `/projects`, expect `getByRole("link", { name: /hire me/i })` to be visible. On mobile, open the menu with `getByRole("button", { name: /open menu/i })` first; give the SheetTrigger that `aria-label`. On `/contact`, the count is 0.
- `"each route loads"`: `/`, `/profile`, `/projects` and `/contact` respond with status 200 and show a level-1 or level-2 heading.

- [ ] **Step 7: Run e2e.** Run `yarn test:e2e` and expect all PASS on both projects.

- [ ] **Step 8: Commit.** `git commit -m "feat: rename work to projects, add redirect and hire-me rule"`

---

### Task 3: Theme system and toggle

**Files:**
- Create: `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`, `tests/e2e/theme.spec.ts`
- Modify: `app/globals.css` (tokens), `tailwind.config.ts`, `app/layout.tsx` (`<html suppressHydrationWarning>`, wrap in provider), `components/Header.tsx`, `components/MobileNav.tsx`, and every file the grep below finds

**Interfaces:**
- Produces:
  - Tailwind color names `bg`, `surface`, `border`, `text`, `muted`, `accent` (DEFAULT, hover) and `particle`, each `rgb(var(--x) / <alpha-value>)` or `var(--x)` for the rgba tokens
  - CSS vars `--bg --surface --border --text --muted --accent --accent-hover --particle` on `:root` (light) and `.dark` (dark)
  - `<ThemeToggle className?: string />`

- [ ] **Step 1: Install and wire next-themes**

Run `yarn add next-themes`. `ThemeProvider` is a client wrapper around `NextThemesProvider` with `attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange`.

- [ ] **Step 2: Define the tokens with the spec values exactly**

Keep a `primary` alias pointing at `--bg` so shadcn ui components keep working. Store hex tokens as space-separated RGB channels so the `/opacity` modifiers work.

- [ ] **Step 3: Replace hardcoded colors**

Run: `grep -rn "#1c1c22\|bg-primary\|text-white\|#00ff99\|text-primary\|white/" app components`
Replace each hit with the token classes (`bg-bg`, `text-text`, `text-muted`, `text-accent`, `border-border`, `bg-surface`). Inline SVG strokes use `currentColor` plus `text-accent`. Expected: this grep returns no results afterwards, except inside `components/ui/` where shadcn's own variables apply.

- [ ] **Step 4: Implement `ThemeToggle`**

- Uses `useTheme()`. It toggles between `resolvedTheme` light and dark.
- `aria-label` is "Switch to light theme" or "Switch to dark theme".
- The sun/moon icon swaps through Framer `AnimatePresence`.
- Until it's mounted, render a same-size `<span aria-hidden>` so nothing hydrates wrong.
- Place it in the Header next to Hire me, and in the MobileNav sheet.

- [ ] **Step 5: Write the e2e tests** `tests/e2e/theme.spec.ts`

- `"toggle switches and persists"`:
  1. Set `colorScheme: "dark"`.
  2. Expect `html` to have class `dark`.
  3. Click the button `/switch to light theme/i`.
  4. Expect `html` not to have `dark`.
  5. Reload, and expect it still not to have `dark`.
- `"follows system when unset"`: with `colorScheme: "light"`, `html` has no `dark` class. With `"dark"`, it does.

- [ ] **Step 6: Run the checks.** Run `yarn test:e2e tests/e2e/theme.spec.ts` and expect PASS. Then look at `/` in both themes with `yarn dev`. Text must be readable in both.

- [ ] **Step 7: Commit.** `git commit -m "feat: add light/dark themes with css tokens and toggle"`

---

### Task 4: Reduced-motion hook and particle store

**Files:**
- Create: `lib/hooks/usePrefersReducedMotion.ts`, `lib/particle-store.ts`, `tests/unit/reduced-motion.test.tsx`, `tests/unit/particle-store.test.ts`

**Interfaces:**
- Produces:
  - `usePrefersReducedMotion(): boolean`. It's `false` on the server and in the first render, then reflects `matchMedia("(prefers-reduced-motion: reduce)")` and updates on change.
  - `type PulseKind = "burst"`
  - `particles.pulse(kind: PulseKind): void`
  - `particles.subscribe(listener: (kind: PulseKind) => void): () => void`

  The store is an event emitter, not state. Listeners fire synchronously in subscription order.

- [ ] **Step 1: Write the failing tests**

```ts
// particle-store.test.ts
test("pulse notifies subscribers and unsubscribe stops it", () => {
  const fn = vi.fn()
  const off = particles.subscribe(fn)
  particles.pulse("burst"); expect(fn).toHaveBeenCalledWith("burst")
  off(); particles.pulse("burst"); expect(fn).toHaveBeenCalledTimes(1)
})
```

In `reduced-motion.test.tsx`, stub `window.matchMedia` with a controllable `MediaQueryList`. `renderHook(usePrefersReducedMotion)` returns `true` when `matches` starts true. It flips to `false` after dispatching a `change` event with `matches: false`, wrapped in `act`.

- [ ] **Step 2: Run them and confirm they fail.** Run `yarn test tests/unit/particle-store.test.ts tests/unit/reduced-motion.test.tsx` and expect FAIL.
- [ ] **Step 3: Implement both modules.** The hook uses `useSyncExternalStore` with a server snapshot of `false`.
- [ ] **Step 4: Run them and confirm they pass.** Expect PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat: add reduced-motion hook and particle pulse store"`

---

### Task 5: Particle patterns and morph math

**Files:**
- Create: `components/three/patterns/cloud.ts`, `column.ts`, `grid.ts`, `sphere.ts`, `config.ts`, `index.ts`, `components/three/morph.ts`, `lib/random.ts`, `tests/unit/patterns.test.ts`, `tests/unit/morph.test.ts`

**Interfaces:**
- Produces:
  - `type PatternName = "cloud" | "column" | "grid" | "sphere"`
  - `type PatternFn = (count: number, seed: number) => Float32Array`. The length is `count * 3`, it's deterministic per seed, and all coordinates fall within ±6 world units, so the camera from Task 6 frames it.
  - `patterns: Record<PatternName, PatternFn>`
  - `patternForPath(pathname: string): PatternName`
  - `mulberry32(seed: number): () => number` (in `lib/random.ts`)
  - `easeInOutCubic(t: number): number`
  - `blendPositions(from: Float32Array, to: Float32Array, t: number, out: Float32Array): Float32Array`. It writes `from + (to - from) * easeInOutCubic(clamp(t, 0, 1))` into `out` and returns `out`.

Pattern shapes:
- **cloud:** a gaussian-ish blob with x spread 6, y 3.5, z 3, offset to the right (+1.5 x) so it sits behind the photo side.
- **column:** points in a thin vertical band (|x| ≤ 0.8 around x = −4, y ∈ [−6, 6]), echoing the timeline.
- **grid:** a jittered lattice on the z = −1 plane across x ∈ [−6, 6] and y ∈ [−4, 4].
- **sphere:** uniform points on the surface of a radius-3.5 sphere, using a Fibonacci sphere plus small radial jitter.

- [ ] **Step 1: Write the failing tests**

```ts
// patterns.test.ts
const names = ["cloud", "column", "grid", "sphere"] as const
test.each(names)("%s returns count*3 finite values within bounds", (n) => {
  const a = patterns[n](1500, 1)
  expect(a.length).toBe(4500)
  a.forEach((v) => { expect(Number.isFinite(v)).toBe(true); expect(Math.abs(v)).toBeLessThanOrEqual(6) })
})
test.each(names)("%s is deterministic per seed", (n) => {
  expect(patterns[n](50, 7)).toEqual(patterns[n](50, 7))
})
test.each([["/", "cloud"], ["/profile", "column"], ["/projects", "grid"], ["/projects/cryptolist", "grid"], ["/contact", "sphere"], ["/whatever", "cloud"]])(
  "patternForPath(%s) = %s", (p, n) => expect(patternForPath(p)).toBe(n))
test("works for count 0 and 1", () => { expect(patterns.sphere(0, 1).length).toBe(0); expect(patterns.grid(1, 1).length).toBe(3) })
```

```ts
// morph.test.ts
test("t=0 gives from, t=1 gives to, t clamps", () => {
  const f = new Float32Array([0, 0, 0]), to = new Float32Array([2, 4, 6]), out = new Float32Array(3)
  expect(Array.from(blendPositions(f, to, 0, out))).toEqual([0, 0, 0])
  expect(Array.from(blendPositions(f, to, 1, out))).toEqual([2, 4, 6])
  expect(Array.from(blendPositions(f, to, 2, out))).toEqual([2, 4, 6])
  expect(Array.from(blendPositions(f, to, 0.5, out))).toEqual([1, 2, 3]) // easeInOutCubic(0.5) = 0.5
})
test("easing is monotonic", () => { let p = -1; for (let t = 0; t <= 1; t += 0.05) { const v = easeInOutCubic(t); expect(v).toBeGreaterThanOrEqual(p); p = v } })
```

- [ ] **Step 2: Run them and confirm they fail.** Run `yarn test tests/unit/patterns.test.ts tests/unit/morph.test.ts` and expect FAIL.
- [ ] **Step 3: Implement the modules.** Use `mulberry32(seed)` for all randomness. Clamp every coordinate to ±6.
- [ ] **Step 4: Run them and confirm they pass.** Expect PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat: add particle patterns and morph math"`

---

### Task 6: Particle background in the layout

**Files:**
- Create: `components/three/shaders.ts`, `components/three/ParticleField.tsx`, `components/three/ParticleBackground.tsx`, `components/three/useParticleCount.ts`, `components/StaticBackground.tsx`, `tests/unit/particle-field.test.ts`, `tests/e2e/background.spec.ts`
- Modify: `app/layout.tsx`, `components/PageTransition.tsx`
- Delete: `components/StairTransition.tsx`, `components/Stairs.tsx`

**Interfaces:**
- Consumes: `patterns`, `patternForPath`, `blendPositions` (Task 5); `particles.subscribe` (Task 4); `usePrefersReducedMotion` (Task 4); the `--particle` CSS var (Task 3)
- Produces: `<ParticleBackground />` (a default export, rendered only through `next/dynamic` from the layout)

- [ ] **Step 1: Install the 3D deps**

Run: `yarn add three @react-three/fiber @react-three/drei && yarn add -D @types/three`

- [ ] **Step 2: Extract the morph-controller logic as a pure class and test it**

Write `createMorphController(initial: Float32Array)` in `components/three/morph.ts` with this interface:
- `{ start(to: Float32Array, now: number): void; update(now: number): Float32Array; isMorphing(now: number): boolean }`
- The duration is 1200ms.

Its test file is `tests/unit/particle-field.test.ts`:
- `"update returns target after 1200ms"`
- `"starts new morph from displayed positions"`: start A→B at t=0. At t=600, call `start(C)`. Then `update(600)` must equal the blended A→B position at 600ms, not A and not B. `update(1800)` must equal C.

Run `yarn test tests/unit/particle-field.test.ts`. It should FAIL first, then PASS after you implement the controller.

- [ ] **Step 3: Write the shaders** in `shaders.ts`

The vertex shader takes the attribute `position` (the CPU-blended position from the controller) and `aSeed`. Its uniforms are `uTime`, `uPointer` (vec3), `uBurst` (0..1), `uSize` and `uPixelRatio`. It applies three effects:
- **Drift:** `sin/cos(uTime * 0.2 + aSeed * 6.28) * 0.15`
- **Cursor attraction:** within radius 2.0, pull up to 0.4 toward `uPointer` with smoothstep falloff.
- **Burst:** push outward along `normalize(pos) * uBurst * 2.5`.

The fragment shader draws a round soft point (discard outside radius 0.5 from `gl_PointCoord`), with uniforms `uColor` and `uOpacity`.

- [ ] **Step 4: Implement `ParticleField`**

- **Count:** read it from `useParticleCount()`. It returns 600 or 1500, decided once on mount.
- **Morph:** on a `usePathname()` change, call `controller.start(patterns[patternForPath(p)](count, seed), now)`.
- **Each frame:**
  - Call `controller.update(now)` and write the result into the geometry's `position`.
  - Update the uniforms.
  - Ease `uBurst` back to 0 over about 900ms.
- **Pointer:** project the pointer into the z = 0 plane.
- **Lines:** a `LineSegments` over the first 150 points connects pairs closer than 1.6 units, with at most 3 per point. Recompute pairs when a morph ends and every 500ms while drifting.
- **Burst:** `particles.subscribe` with kind `"burst"` sets `uBurst = 1`.
- **Theme:** on a `resolvedTheme` change, read `getComputedStyle(document.documentElement).getPropertyValue("--particle")` and tween `uColor` over 400ms. Use `THREE.AdditiveBlending` in dark mode and `NormalBlending` in light mode. Line opacity is 0.25 in dark mode and 0.35 in light mode.
- **Reduced motion:** apply the target positions directly, set `uTime` to a constant, ignore the pointer and bursts, and call `invalidate()` once per change.
- **Frame loop:** `<Canvas frameloop="demand">`. Call `invalidate()` from `useFrame` while drifting or morphing, and stop when `document.hidden` or the canvas is not intersecting, using an `IntersectionObserver` on the canvas parent.

- [ ] **Step 5: Implement `ParticleBackground`**

- It renders a `<div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">`.
- It checks WebGL with `document.createElement("canvas").getContext("webgl2") ?? getContext("webgl")`. If that's null, it renders nothing.
- An error boundary class wraps `<Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: false, alpha: true }}>`. On error it renders null.
- The wrapper fades in with opacity 0 → 1 over 600ms once the canvas is created.

- [ ] **Step 6: Implement `StaticBackground` and update the layout**

`StaticBackground` is a `fixed inset-0 -z-20` div with a radial gradient and a dot pattern made from tokens, in both themes. It's the same look as the brainstorm mockup.

In `app/layout.tsx`, render `<StaticBackground />` and `const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground"), { ssr: false })`. Because `ssr: false` isn't allowed in a server component, put the `dynamic` call in a tiny client file `components/three/ParticleBackgroundLazy.tsx`.

Remove `StairTransition`. Rewrite `PageTransition` as `AnimatePresence mode="wait"` keyed by pathname: `motion.div` goes from opacity 0, y 12 to opacity 1, y 0, with an exit to opacity 0 over 0.25s. With reduced motion, skip it. Delete `Stairs.tsx` and `StairTransition.tsx`.

- [ ] **Step 7: Write the e2e tests** `tests/e2e/background.spec.ts`

- `"no console errors on any route"`: collect `page.on("console")` errors and `pageerror` while visiting the four routes. Expect the list to be empty.
- `"canvas mounts and is hidden from a11y"`: `locator("canvas")` is attached, and its ancestor has `aria-hidden="true"`.
- `"falls back when WebGL is unavailable"`:
  1. `page.addInitScript` overrides `HTMLCanvasElement.prototype.getContext` to return null for `webgl` and `webgl2`.
  2. Visit `/`.
  3. Expect the heading to be visible, `canvas` count to be 0, and no page errors.
- `"reduced motion renders without errors"`: `page.emulateMedia({ reducedMotion: "reduce" })`, then visit all routes and expect no errors.

- [ ] **Step 8: Run all the checks**

Run: `yarn test && yarn test:e2e tests/e2e/background.spec.ts`
Expected: PASS.

Then do a manual check with `yarn dev`:
- The particles morph between each pair of routes in about 1.2s.
- The cursor pull works.
- Both themes look right.
- Clicking Profile and then Projects quickly doesn't snap.

- [ ] **Step 9: Commit.** `git commit -m "feat: add persistent 3D particle background with route morphing"`

---

### Task 7: Motion primitives

**Files:**
- Create: `components/motion/Reveal.tsx`, `Tilt.tsx`, `AnimatedName.tsx`, `DrawRing.tsx`, `CountUp.tsx`, `ScrollLine.tsx`, `tests/unit/motion.test.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (Task 4)
- Produces:
  - `<Reveal as?: "div" | "li" | "section"; delay?: number; y?: number = 24; children />`. It uses Framer `whileInView` with `once: true` and `amount: 0.2`. With reduced motion it renders statically.
  - `<Tilt max?: number = 8; className?; children />`. It uses Framer `useMotionValue` and `useSpring`, with `rotateX/rotateY` from the pointer position and perspective 900px. It's disabled when `(hover: none)` or reduced motion.
  - `<AnimatedName text: string; className? />`. It renders `<span className="sr-only">{text}</span>` plus `aria-hidden` letter spans animated with Anime.js `animate(letters, { opacity: [0, 1], translateY: ["0.6em", 0], delay: stagger(40), duration: 600, ease: "outExpo" })`.
  - `<DrawRing size: number; className? />`. It's an SVG circle with stroke `currentColor`. Anime.js `svg.createDrawable` draws from 0 to 1 over 1600ms, then rotates slowly (a CSS `animate-spin` at 40s).
  - `<CountUp to: number; duration?: number = 1600; suffix?: string; className? />`. Anime.js animates a plain object `{ v: 0 }` to `to`, rounding to an integer, and starts when it's in view (IntersectionObserver).
  - `<ScrollLine className? />`. It's a vertical bar whose `scaleY` follows the scroll progress of its parent, through Framer `useScroll({ target, offset: ["start 80%", "end 60%"] })`.

  Every primitive renders its final state immediately with reduced motion. Anime.js imports come from `"animejs"` (v4 named exports).

- [ ] **Step 1: Install Anime.js.** Run `yarn add animejs`.

- [ ] **Step 2: Write the failing tests** in `tests/unit/motion.test.tsx`

Mock `matchMedia` to return reduced motion true.

- `"CountUp shows final value under reduced motion"`: render `<CountUp to={18} />` and expect the text `"18"`.
- `"AnimatedName exposes full name to screen readers"`: render `<AnimatedName text="Joren Bagadiong" />`. `getByText("Joren Bagadiong")` has the `sr-only` class, and the letter container has `aria-hidden="true"`.
- `"Reveal renders children"`: render `<Reveal><p>hi</p></Reveal>` and expect "hi" to be in the document.

- [ ] **Step 3: Run them and confirm they fail.** Run `yarn test tests/unit/motion.test.tsx` and expect FAIL.
- [ ] **Step 4: Implement the six components.** Each one cleans up its Anime.js animation (`anim.revert()`) on unmount.
- [ ] **Step 5: Run them and confirm they pass.** Expect PASS.
- [ ] **Step 6: Commit.** `git commit -m "feat: add framer and anime.js motion primitives"`

---

### Task 8: Home redesign

**Files:**
- Modify: `app/page.tsx`, `components/Photo.tsx` (use `DrawRing`), `components/Status.tsx` (glass tiles with `CountUp`)
- Create: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: `intro`, `stats`, `socials` (Task 1); `AnimatedName`, `DrawRing`, `CountUp`, `Reveal` (Task 7); `DownloadCVButton` (existing)

The layout follows spec "Pages → Home". Keep the copy "Hello, I'm" and change it from "Hi, I'm" to match the approved wireframe. The `h1` contains the `AnimatedName` for "Joren Bagadiong". Stats are 4 `bg-surface border-border backdrop-blur` tiles using `CountUp`.

- [ ] **Step 1: Write the e2e tests**

- `"CV download is above the fold"`: at the desktop and mobile sizes, the link `/download cv/i` is in the viewport (check `boundingBox().y + height <= viewport.height`), and its `href` ends with `Joren_Bagadiong_Resume_ATS.pdf`.
- `"heading names Joren"`: `getByRole("heading", { level: 1 })` contains the text "Joren Bagadiong".
- `"stats reach final values"`: scroll the stats into view, wait 2s, and expect the texts 5, 18, 16 and 500 to be visible.

- [ ] **Step 2: Run them.** Run `yarn test:e2e tests/e2e/home.spec.ts`. These are regression guards for the redesign, and some may already pass against the old Home. Record which ones pass now, and make sure all of them pass after Step 3.
- [ ] **Step 3: Implement the redesign.**
- [ ] **Step 4: Run e2e plus a manual check of both themes.** Expect PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat: redesign home with animated name, ring and count-up stats"`

---

### Task 9: Profile redesign

**Files:**
- Create: `components/profile/Timeline.tsx`, `components/profile/SkillsPanel.tsx`, `tests/e2e/profile.spec.ts`
- Modify: `app/profile/page.tsx` (drop the Tabs and compose the new components)

**Interfaces:**
- Consumes: `experience`, `education`, `certifications`, `skills`, `proficiency` (Task 1); `ScrollLine`, `Reveal` (Task 7); the existing `components/ui/tooltip`
- Produces:
  - `<Timeline groups: { title: string; items: TimelineItem[] }[] />`, where `type TimelineItem = { date: string; title: string; subtitle: string; details?: string[] }`
  - `<SkillsPanel skills proficiency />`

Map the data to timeline items like this:
- Experience is `{date: duration, title: position, subtitle: company, details: responsibilities}`.
- Education and certifications are `{date: duration, title: degree, subtitle: college}`.

The details are collapsed behind a `<button aria-expanded aria-controls>` labeled "Show responsibilities" or "Hide responsibilities". Proficiency bars fill through `Reveal` + Framer `scaleX` from 0 to `percentage / 100`.

- [ ] **Step 1: Write the e2e tests**

- `"timeline shows all experience entries"`: "TDH International Inc" and "MadTech Geek" are visible.
- `"responsibilities toggle"`:
  1. The first button `/show responsibilities/i` has `aria-expanded="false"`.
  2. Click it.
  3. `aria-expanded="true"`, and the text "Converted Figma UI/UX designs" is visible.
  4. Press Enter on it again, and expect the text to be hidden.
- `"skill names available"`: hovering or focusing the React skill shows the tooltip "React". Use the skill name as it appears in `skills`.

- [ ] **Step 2: Run them and confirm they fail.** Run `yarn test:e2e tests/e2e/profile.spec.ts` and expect FAIL.
- [ ] **Step 3: Implement the components.**
- [ ] **Step 4: Run e2e plus a manual check of both themes.** Expect PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat: redesign profile as scroll timeline with skills panel"`

---

### Task 10: Projects grid and detail view

**Files:**
- Create: `components/projects/ProjectCard.tsx`, `ProjectDetail.tsx`, `ProjectModal.tsx`, `app/projects/layout.tsx`, `app/projects/[slug]/page.tsx`, `app/projects/@modal/default.tsx`, `app/projects/@modal/(.)[slug]/page.tsx`, `tests/e2e/projects.spec.ts`
- Modify: `app/projects/page.tsx` (grid replaces Swiper)
- Delete: `components/WorkSliderBtns.tsx`

**Interfaces:**
- Consumes: `projects`, `getProjectBySlug` (Task 1); `Tilt`, `Reveal` (Task 7); `@radix-ui/react-dialog` (existing dependency)
- Produces:
  - `<ProjectCard project: Project />`. It's a `Link` to `/projects/${slug}` (`scroll={false}`) wrapped in `Tilt`, with a Framer `layoutId={"project-" + slug}` on the image container.
  - `<ProjectDetail project: Project; variant: "page" | "modal" />`. It shows the image with the same `layoutId`, num, title, description, stack, and the Live ↗ and GitHub ↗ links (`target="_blank" rel="noopener noreferrer"`).
  - `<ProjectModal project: Project />`. It's a Radix `Dialog` that's open by default. Its `onOpenChange(false)` calls `router.back()`. The title is a `Dialog.Title`, and the close button is labeled "Close".

Route details:
- `app/projects/layout.tsx` receives `{ children, modal }` and renders both.
- `@modal/default.tsx` returns `null`.
- `[slug]/page.tsx` exports `generateStaticParams()` from `projects` and `generateMetadata()` with `title: \`${project.title} | Joren Bagadiong\`` and the project description. It calls `notFound()` for an unknown slug.
- In Next 15, `params` is a Promise: `{ params }: { params: Promise<{ slug: string }> }`.

- [ ] **Step 1: Write the e2e tests**

- `"grid lists all four projects"`: Cryptoweb App, Pet grooming, CryptoList and Portfolio v1 are visible.
- `"card opens overlay; Esc closes and returns focus"`:
  1. Click the Cryptoweb App card. The URL becomes `/projects/cryptoweb-app` and the `dialog` is visible.
  2. Press Escape. The URL becomes `/projects`, the dialog count is 0, and the Cryptoweb App card link is focused.
- `"back closes, forward reopens"`: open the card, `goBack()` and expect no dialog with the URL `/projects`, then `goForward()` and expect the dialog to be visible.
- `"direct visit renders full page"`: `goto("/projects/cryptolist")`. There's no `dialog`, the heading "CryptoList" is visible, and the link `/github/i` has an `href` that contains `github.com/jorenbagadiong/CryptoList`.
- `"unknown slug 404s"`: `goto("/projects/nope")` returns status 404.

- [ ] **Step 2: Run them and confirm they fail.** Run `yarn test:e2e tests/e2e/projects.spec.ts` and expect FAIL.
- [ ] **Step 3: Implement the grid, the detail views and the intercepting route.**
- [ ] **Step 4: Run e2e plus a manual check** of the expand animation and the tilt, in both themes. Expect PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat: projects grid with tilt cards and shareable detail overlay"`

---

### Task 11: Contact redesign, EmailJS guard and burst

**Files:**
- Create: `lib/emailjs-config.ts`, `components/contact/ContactForm.tsx`, `tests/unit/emailjs-config.test.ts`, `tests/e2e/contact.spec.ts`
- Modify: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `contactInfo` (Task 1); `particles.pulse` (Task 4); `Reveal` (Task 7)
- Produces: `getEmailJsConfig(env?: Record<string, string | undefined>): { ok: true; serviceId: string; templateId: string; publicKey: string } | { ok: false; missing: string[] }`. It defaults to reading the three `NEXT_PUBLIC_EMAILJS_*` values. Access them as literal `process.env.NEXT_PUBLIC_…` expressions so Next inlines them.

Form behavior:
- The fields and the Zod schema stay as they are today (fullname, email, subject, message).
- Submit is disabled and shows "Sending…" while `formState.isSubmitting`.
- On success: `toast.success`, `form.reset()`, `particles.pulse("burst")`.
- On failure: `toast.error`, and the values are kept.
- If the config is not ok: `toast.error("Contact form is not configured")` and `console.error("Missing EmailJS env vars:", missing)`, without calling EmailJS.
- Headline copy: "Let's build" / "something together." Availability line: "Open to full-time roles and freelance work."

- [ ] **Step 1: Write the failing unit test**

```ts
test("reports missing vars", () => {
  expect(getEmailJsConfig({ NEXT_PUBLIC_EMAILJS_SERVICE_ID: "s" })).toEqual({
    ok: false, missing: ["NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"] })
})
test("returns config when complete", () => {
  expect(getEmailJsConfig({ NEXT_PUBLIC_EMAILJS_SERVICE_ID: "s", NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "t", NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "k" }))
    .toEqual({ ok: true, serviceId: "s", templateId: "t", publicKey: "k" })
})
test("treats empty strings as missing", () => {
  expect(getEmailJsConfig({ NEXT_PUBLIC_EMAILJS_SERVICE_ID: "", NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "t", NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "k" }))
    .toEqual({ ok: false, missing: ["NEXT_PUBLIC_EMAILJS_SERVICE_ID"] })
})
```

- [ ] **Step 2: Run it and confirm it fails.** Run `yarn test tests/unit/emailjs-config.test.ts` and expect FAIL.
- [ ] **Step 3: Implement `getEmailJsConfig`, then `ContactForm` and the page layout** per spec "Pages → Contact".
- [ ] **Step 4: Run the unit tests and confirm they pass.** Expect PASS.

- [ ] **Step 5: Write the e2e tests** `tests/e2e/contact.spec.ts`

Stub `**/api.emailjs.com/api/v1.0/email/send` with `page.route`, responding 200 with body "OK" and counting the calls.

- `"validation errors show"`: submit the empty form and expect "Email is required" and the other existing messages to be visible.
- `"successful send toasts and resets"`: fill in valid values and submit. Expect the success toast to be visible, the fields to be empty, and 1 call.
- `"double click sends once"`: delay the stub response by 800ms, double-click Send, expect the button to be disabled during the request, and expect exactly 1 call.
- `"failed send keeps values"`: respond 500 instead. Expect the error toast, and the message field to still hold its value.

- [ ] **Step 6: Run e2e plus a manual check.** Run `yarn test:e2e tests/e2e/contact.spec.ts` and expect PASS. Manually, with dev env vars set to junk and the stub not applied, the error path should show. With a stubbed success, the sphere should burst.
- [ ] **Step 7: Commit.** `git commit -m "feat: redesign contact with glass form, env guard and particle burst"`

---

### Task 12: Cleanup, layout hardening, docs

**Files:**
- Modify: `package.json` (remove deps), `README.md`, any page that overflows at 320px
- Create: `tests/e2e/layout.spec.ts`

- [ ] **Step 1: Write the e2e test** `tests/e2e/layout.spec.ts`

- `"no horizontal scroll at 320px"`: set the viewport to 320×640. For each of `/`, `/profile`, `/projects`, `/projects/cryptoweb-app` and `/contact`, check that `document.documentElement.scrollWidth <= window.innerWidth`.
- `"header fits at 320px"`: the logo, the theme toggle and the open-menu button are all visible and their bounding boxes don't overlap.

- [ ] **Step 2: Run it.** Run `yarn test:e2e tests/e2e/layout.spec.ts`. Fix overflow (most likely sources: the hero `h1` size, the photo size, the stats grid) until it passes.

- [ ] **Step 3: Remove dead dependencies**

Run: `yarn remove swiper react-countup axios notiflix`
Then: `grep -rn "swiper\|react-countup\|axios\|notiflix\|StairTransition\|Stairs" app components lib`
Expected: no output.

- [ ] **Step 4: Update the README**

- Update the stack list: add three, R3F, drei, Anime.js and next-themes, and remove Swiper and react-countup.
- Rename the route from `/work` to `/projects`, and add `/projects/[slug]`.
- Add a Testing section covering `yarn test`, `yarn test:e2e` and `npx playwright install chromium`.
- Add a short "Particle background" section saying where the patterns and the route mapping live.

- [ ] **Step 5: Run the full verification**

Run: `yarn lint && yarn test && yarn test:e2e && yarn build`
Expected: all of them pass with no errors.

Then do the manual pass:
- Run Lighthouse in Chrome DevTools against `yarn start`. Desktop performance should be at least 90 and mobile at least 75, with CLS 0. Record the numbers in the PR description.
- Check contrast in DevTools for the accent text and the buttons in light mode. They should meet WCAG AA (4.5:1 for body text). If light-mode accent text fails, darken `--accent` in light mode only, and note it in the PR.

- [ ] **Step 6: Commit.** `git commit -m "chore: remove unused deps, harden small screens, update README"`
