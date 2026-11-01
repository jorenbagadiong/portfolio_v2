# Joren Bagadiong — Portfolio v2

Personal portfolio site for Joren Bagadiong, frontend web developer. Built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS, with page and stair transitions done in Framer Motion.

## Tech stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router, Turbopack in dev)
- **UI:** React 19, TypeScript, Tailwind CSS 3, [shadcn/ui](https://ui.shadcn.com) components on Radix UI primitives
- **Animation:** Framer Motion, Swiper (project slider), react-countup (stats)
- **Forms:** react-hook-form + Zod validation, sent through [EmailJS](https://www.emailjs.com)
- **Notifications:** sonner
- **Icons:** react-icons, lucide-react

## Pages

| Route      | File                                             | Content                                                      |
| ---------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `/`        | [app/page.tsx](app/page.tsx)                     | Intro, photo, CV download, social links, stats               |
| `/profile` | [app/profile/page.tsx](app/profile/page.tsx)     | Tabs for experience, education, skills, and certifications   |
| `/work`    | [app/work/page.tsx](app/work/page.tsx)           | Project slider with live demo and GitHub links               |
| `/contact` | [app/contact/page.tsx](app/contact/page.tsx)     | Contact form (EmailJS)                                       |

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

| Command       | What it does                              |
| ------------- | ----------------------------------------- |
| `yarn dev`    | Start the dev server with Turbopack       |
| `yarn build`  | Build for production                      |
| `yarn start`  | Serve the production build                |
| `yarn lint`   | Run ESLint (`next lint`)                  |
| `yarn format` | Format the codebase with Prettier         |

## Project structure

```
app/                 Routes (App Router), root layout, global styles
components/          Site components (Header, Nav, MobileNav, Social, Photo, transitions, ...)
components/ui/       shadcn/ui components (button, tabs, form, input, sheet, ...)
lib/utils.ts         cn() class-name helper
public/assets/       Profile photo, project thumbnails, resume PDFs
```

## Updating content

Most of the content lives as constants at the top of each page file. You don't need a CMS:

- **Experience, education, skills, certifications:** the constants in [app/profile/page.tsx](app/profile/page.tsx)
- **Projects:** the `projects` array in [app/work/page.tsx](app/work/page.tsx). Add the thumbnail to `public/assets/profile/projects/`
- **Social links:** `SOCIALS` in [components/Social.tsx](components/Social.tsx)
- **Nav links:** [components/Nav.tsx](components/Nav.tsx) and [components/MobileNav.tsx](components/MobileNav.tsx)
- **Resume:** drop the PDF in `public/assets/files/` and update the `href` in [components/DownloadCVButton.tsx](components/DownloadCVButton.tsx)
- **SEO metadata:** `metadata` in [app/layout.tsx](app/layout.tsx)

## Deployment

The site is deployed on [Vercel](https://vercel.com). Add the three `NEXT_PUBLIC_EMAILJS_*` variables in the Vercel project settings before you deploy. The `/motionlab` and `/pokelab` rewrites need those external deployments to stay live.
