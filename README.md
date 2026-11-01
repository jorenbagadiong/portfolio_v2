# Joren Bagadiong — Portfolio v2

Personal portfolio site for Joren Bagadiong, frontend web developer. Built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS, with a persistent 3D particle background, light and dark themes, and stair-wipe page transitions.

## Tech stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, Turbopack in dev)
- **UI:** React 19, TypeScript, Tailwind CSS 3, [shadcn/ui](https://ui.shadcn.com) components on Radix UI primitives
- **Animation:** Framer Motion (transitions, reveals, tilt), [Anime.js](https://animejs.com) v4 (name, rings, timeline)
- **3D:** three, React Three Fiber and drei (particle background)
- **Theming:** next-themes (light, dark, system)
- **Forms:** react-hook-form + Zod validation, sent through [EmailJS](https://www.emailjs.com)
- **Notifications:** sonner
- **Icons:** react-icons, lucide-react

## Pages

| Route              | File                                                         | Content                                                    |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------------------------- |
| `/`                | [app/page.tsx](app/page.tsx)                                 | Intro, photo, CV download, social links, experience badge  |
| `/profile`         | [app/profile/page.tsx](app/profile/page.tsx)                 | Experience and education timelines, skills, certifications |
| `/projects`        | [app/projects/page.tsx](app/projects/page.tsx)               | Project grid with tilt cards and a detail overlay          |
| `/projects/[slug]` | [app/projects/[slug]/page.tsx](app/projects/[slug]/page.tsx) | Shareable project detail page                              |
| `/contact`         | [app/contact/page.tsx](app/contact/page.tsx)                 | Contact form (EmailJS)                                     |

`/work` permanently redirects to `/projects`.

`/motionlab` and `/pokelab` are not part of this codebase. [next.config.ts](next.config.ts) rewrites them to separate Vercel deployments, so they're served under this domain.

## Getting started

Requirements: Node.js 18.18 or later, and Yarn (the repo ships a `yarn.lock`).

```bash
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

The contact form needs EmailJS credentials. Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

You can find these values in the EmailJS dashboard. Every other page works without them; only form submission will fail.

## Scripts

| Command         | What it does                        |
| --------------- | ----------------------------------- |
| `yarn dev`      | Start the dev server with Turbopack |
| `yarn build`    | Build for production                |
| `yarn start`    | Serve the production build          |
| `yarn lint`     | Run ESLint (`next lint`)            |
| `yarn format`   | Format the codebase with Prettier   |
| `yarn test`     | Run unit tests (Vitest)             |
| `yarn test:e2e` | Run end-to-end tests (Playwright)   |

## Project structure

```
app/                 Routes (App Router), root layout, global styles
components/          Site components (Header, Nav, MobileNav, Social, Photo, transitions, ...)
components/ui/       shadcn/ui components (button, form, input, sheet, ...)
lib/                 Site data, hooks, helpers
components/three/    Particle background (React Three Fiber)
components/motion/   Reduced-motion-aware motion wrappers
public/assets/       Profile photo, project thumbnails, resume PDFs
```

## Testing

```bash
yarn test                      # unit tests (Vitest)
npx playwright install chromium  # one-time browser download
yarn test:e2e                  # builds, serves and runs Playwright specs
E2E_PORT=3260 yarn test:e2e    # use another port if 3100 is busy
```

E2E specs import from `tests/e2e/fixtures.ts`, which marks the first-load intro as played so it does not race the tests.

## Particle background

The background is one page-independent constellation, rendered by a single persistent canvas in the root layout. The point pattern lives in [components/three/patterns](components/three/patterns), the field and shaders in [components/three/ParticleField.tsx](components/three/ParticleField.tsx) and [components/three/shaders.ts](components/three/shaders.ts). There is no per-route pattern: the same constellation shows on every page. The first visit plays an assembling intro ([components/IntroLoader.tsx](components/IntroLoader.tsx)).

## Updating content

Content lives in one data file. You don't need a CMS:

- **Experience, education, skills, certifications, projects, socials:** [lib/site-data.ts](lib/site-data.ts)
- **Nav links:** `navLinks` in [lib/site-data.ts](lib/site-data.ts)
- **Resume:** drop the PDF in `public/assets/files/` and update the `href` in [components/DownloadCVButton.tsx](components/DownloadCVButton.tsx)
- **Theme colors:** CSS variables in [app/globals.css](app/globals.css). Use `text-accent-text` for small accent text (AA contrast in both themes)
- **SEO metadata:** `metadata` in [app/layout.tsx](app/layout.tsx)

## Deployment

The site is deployed on [Vercel](https://vercel.com). Add the three `NEXT_PUBLIC_EMAILJS_*` variables in the Vercel project settings before you deploy. The `/motionlab` and `/pokelab` rewrites need those external deployments to stay live.
