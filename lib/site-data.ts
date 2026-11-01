import type { IconType } from "react-icons"
import {
  FaGithub,
  FaLinkedinIn,
  FaTelegramPlane,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa"

// Text in [square brackets] is a placeholder still to be filled in.

export type NavLink = { name: string; path: string }

export const navLinks: NavLink[] = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "projects", path: "/projects" },
  { name: "contact", path: "/contact" },
]

export const headline = "Frontend Developer | React & Next.js"

export const intro = [
  "I'm a Frontend Developer with 5+ years of experience building responsive, maintainable, and production-ready web applications using React, Next.js, and TypeScript.",
  "I specialize in turning complex business requirements into intuitive interfaces, integrating REST APIs, and building reusable components that make applications easier to maintain and scale.",
]

export type Project = {
  slug: string
  num: string
  title: string
  /** One line, shown on cards. */
  pitch: string
  description: string
  stack: { name: string }[]
  image?: string
  imageAlt?: string
  live?: string
  github?: string
  tier: "main" | "earlier"
  /** Drafts are left out of listings and only render outside production. */
  draft?: boolean
  problem: string
  role: string
  outcome: string
  highlights?: string[]
}

const allProjects: Project[] = [
  {
    slug: "motionlab",
    num: "01",
    title: "MotionLab",
    pitch:
      "Animated React component library: 24 accessible components with live playgrounds, copy-ready Motion/Anime.js code, keyboard and reduced-motion support.",
    description:
      "An animated React component library: 24 accessible components, each with a live playground for tuning the animation and copy-ready code for Motion or Anime.js. Supports keyboard use and reduced motion, and has light and dark themes.",
    stack: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Motion" },
      { name: "Anime.js" },
      { name: "Zod" },
    ],
    image: "/assets/profile/projects/motionlab.png",
    imageAlt:
      "MotionLab home page: the headline “Animated components you can actually ship” beside a live text-highlight demo in a carousel.",
    live: "https://www.jorenbagadiong.dev/motionlab",
    github: "https://github.com/jorenbagadiong/motionlab",
    tier: "main",
    problem:
      "Animated UI is easy to make look good and hard to make usable. Most animation snippets online ignore keyboard users, skip prefers-reduced-motion, and come as one-off demos that need reworking before they're usable in a real project. I wanted a library where every component is accessible by default, can be tuned live before you copy it, and works with either Motion or Anime.js, so developers don't have to choose between polished motion and inclusive UX.",
    role: "Personal project, built on my own.",
    outcome:
      "Shipped 24 accessible, animated components, each with a live playground and copy-ready code for Motion or Anime.js, in light and dark themes.",
  },
  {
    slug: "pokelab",
    num: "02",
    title: "PokeLab",
    pitch:
      "Interactive Pokédex for all 1,025 Pokémon: search, stat comparison, evolution chains, favorites, and a 3D WebGL showcase.",
    description:
      "An interactive Pokédex covering all 1,025 Pokémon, powered by PokéAPI. Search by name or number, compare base stats, trace evolution chains, browse by type, save favorites, and view Pokémon in a 3D WebGL showcase.",
    stack: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Three.js" },
      { name: "Anime.js" },
    ],
    image: "/assets/profile/projects/pokelab.png",
    imageAlt:
      "PokeLab home page in dark mode: a Pokédex search bar beside a large Pikachu artwork, with quick links to Charizard, Gengar, and Pikachu.",
    live: "https://www.jorenbagadiong.dev/pokelab",
    github: "https://github.com/jorenbagadiong/pokelab",
    tier: "main",
    problem:
      "Most Pokédex sites are static lists or cluttered with ads, which makes it slow to look up a Pokémon, compare stats, or follow an evolution chain. With 1,025 Pokémon and data spread across many API endpoints, the challenge was keeping search instant and the interface responsive, while still adding richer features like side-by-side stat comparison, saved favorites, and a 3D WebGL showcase that doesn't slow the page down.",
    role: "Personal project, built on my own.",
    outcome:
      "Covers all 1,025 Pokémon with live PokéAPI data: search by name or number, stat comparison, evolution chains, type browsing, favorites, and a 3D WebGL showcase.",
  },
  {
    slug: "cryptoweb-app",
    num: "03",
    title: "CryptoWeb App",
    pitch:
      "Landing page for a crypto investment platform, built to practice layout and UI animation.",
    description:
      "A personal practice project built with Next.js, Tailwind CSS, and animation libraries, showcasing my learning in modern frontend development and smooth UI interactions.",
    stack: [{ name: "Next.js" }, { name: "Tailwind CSS" }],
    image: "/assets/profile/projects/cryptowebapp.svg",
    imageAlt:
      "CryptoWeb App landing page: a dark hero reading “Fastest & secure platform to invest in crypto” next to an isometric coin illustration.",
    live: "https://cryptowebapp-six.vercel.app/",
    github: "https://github.com/jorenbagadiong/cryptowebapp",
    tier: "earlier",
    problem:
      "Practice building a polished, animated marketing page with Next.js and Tailwind CSS.",
    role: "Personal practice project, built on my own.",
    outcome:
      "A responsive landing page with smooth UI interactions, deployed on Vercel.",
  },
  {
    slug: "pet-grooming",
    num: "04",
    title: "Pet Grooming",
    pitch: "Landing page for a pet grooming business with a hero carousel.",
    description:
      "A personal practice project — a pet grooming landing page — built with Next.js and Tailwind CSS while exploring modern frontend development techniques.",
    stack: [{ name: "Next.js" }, { name: "Tailwind CSS" }],
    image: "/assets/profile/projects/petgrooming.svg",
    imageAlt:
      "Pet Grooming landing page: the headline “We take care of your pet.” beside a photo of a small long-haired dog.",
    live: "https://jorenbagadiong.github.io/petgrooming",
    github: "https://github.com/jorenbagadiong/petgrooming",
    tier: "earlier",
    problem:
      "Practice turning a landing-page design into a responsive site with Next.js and Tailwind CSS.",
    role: "Personal practice project, built on my own.",
    outcome: "A responsive landing page deployed on GitHub Pages.",
  },
  {
    slug: "cryptolist",
    num: "05",
    title: "CryptoList",
    pitch: "Live cryptocurrency price table built while learning React.",
    description:
      "A personal practice project — CryptoList, a web app displaying a list of cryptocurrency tokens — built while learning React and API data fetching.",
    stack: [{ name: "React" }, { name: "Axios" }],
    image: "/assets/profile/projects/cryptolist.svg",
    imageAlt:
      "CryptoList “Coin Search” table listing coins such as BTC, ETH, and XRP with price, 24-hour change, volume, and market cap.",
    live: "https://jorenbagadiong.github.io/CryptoList/",
    github: "https://github.com/jorenbagadiong/CryptoList",
    tier: "earlier",
    problem: "Learn React and fetching live data from an API.",
    role: "Personal practice project, built on my own.",
    outcome:
      "A table of cryptocurrency tokens with price, 24-hour change, volume, and market cap, fetched with Axios.",
  },
  {
    slug: "portfolio-v1",
    num: "06",
    title: "Portfolio v1",
    pitch:
      "My first portfolio website, with a contact form powered by EmailJS.",
    description:
      "My first portfolio website, built with Next.js, Tailwind CSS, and EmailJS for contact form integration.",
    stack: [
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Axios" },
      { name: "EmailJS" },
    ],
    image: "/assets/profile/projects/portfoliov1.svg",
    imageAlt:
      "Portfolio v1 home page: “Hi, I’m Joren, Frontend Developer” with Download CV and Contact Me buttons beside an illustration of a developer on a laptop.",
    live: "https://portfolio-jorenbagadiong.vercel.app/",
    github: "https://github.com/jorenbagadiong/portfolio",
    tier: "earlier",
    problem: "Put my work and contact details online in one place.",
    role: "Personal project, built on my own.",
    outcome:
      "A deployed portfolio with a working contact form, later replaced by this site.",
  },
  {
    slug: "tdh-payments",
    num: "Case study",
    title: "[Payment platform & back-office systems]",
    pitch:
      "[One line: what the platform does and who uses it, without naming confidential clients.]",
    description:
      "Frontend work at TDH International Inc (February 2022 – present). [Two or three sentences on the product: what it is, who uses it, and the scale, e.g. [number] merchants or [number] transactions a month, if you're allowed to share.]",
    stack: [
      { name: "[Framework, e.g. React / Next.js]" },
      { name: "[Styling, e.g. Tailwind CSS / Material UI]" },
      { name: "Jest" },
      { name: "Cypress" },
    ],
    tier: "main",
    draft: true,
    problem:
      "[The problem: e.g. a slow or hard-to-maintain checkout flow, manual back-office tasks, or a redesign. Keep it general enough for your NDA: no client names, internal URLs, or figures you can't share.]",
    role: "Frontend Web Developer. [Team size and who you worked with, e.g. [number] frontend devs, designers, and back-end teams. Which parts you owned.]",
    outcome:
      "[Measurable results: e.g. page load cut by [X%], conversion or completion rate up [X%], [number] screens shipped, test coverage at [X%]. Use approximate or relative numbers if exact ones are confidential.]",
    highlights: [
      "Built a custom React icon library that turns SVG files into reusable icon components, shared across all of our applications.",
      "Added dark mode to our applications. [How: e.g. theme tokens, CSS variables.]",
      "Built a landing page from Figma designs. [What it was for, without naming confidential clients.]",
      "Shipped enhancements from the UI/UX and Business Analyst teams, and fixed bugs daily.",
      "[Optional: a screenshot you're allowed to share, with sensitive data blurred, saved to /public/assets/profile/projects/ and set as image + imageAlt above.]",
    ],
  },
]

const showDrafts = process.env.NODE_ENV !== "production"

export const projects: Project[] = allProjects.filter(
  (p) => !p.draft || showDrafts
)

/** Projects shown in listings: never drafts. */
export const listedProjects = allProjects.filter((p) => !p.draft)
export const mainProjects = listedProjects.filter((p) => p.tier === "main")
export const earlierProjects = listedProjects.filter(
  (p) => p.tier === "earlier"
)

export const getProjectBySlug = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

export type ExperienceItem = {
  company: string
  position: string
  duration: string
  responsibilities: string[]
}

export type EducationItem = {
  college: string
  degree: string
  duration: string
}

export type CertificationItem = {
  college: string
  degree: string
  duration: string
}

export const experience = {
  title: "My Experience",
  items: [
    {
      company: "TDH International Inc",
      position: "Frontend Web Developer",
      duration: "February 2022 - Present",
      responsibilities: [
        "Built a custom React icon library that turns SVG files into reusable icon components, shared across all of our applications.",
        "Added dark mode to our applications.",
        "Built a landing page from Figma designs, with clean, reusable components.",
        "Shipped enhancements requested by the UI/UX and Business Analyst teams.",
        "Fixed bugs daily across the payment platform and back-office systems to keep them reliable.",
        "Tested features with Jest unit tests and Cypress end-to-end tests, and kept code quality high through Git workflows and peer reviews.",
      ],
    },
    {
      company: "MadTech Geek",
      position: "Frontend Web Developer",
      duration: "July 2021 - October 2021",
      responsibilities: [
        "Built and tested responsive websites and web apps that work across browsers and devices.",
        "Debugged and improved existing applications.",
      ],
    },
    {
      company: "OLE Elite Software Philippines Inc",
      position: "Frontend Web Developer",
      duration: "October 2020 - June 2021",
      responsibilities: [
        "Started my frontend career developing and maintaining responsive websites and web applications.",
        "Worked with designers and back-end developers to integrate APIs and dynamic content.",
      ],
    },
    {
      company: "H.R.D Singapore Pte Ltd",
      position: "CAD Operator → Full Stack Developer",
      duration: "February 2013 - March 2020",
      responsibilities: [
        "Worked as a CAD Operator for five years (2013–2018), then moved into full stack development for my last two years (2018–2020).",
        "Built a company video portal, similar to YouTube, that brings all of the company's videos together in one place.",
        "Added global search across the company rulebook.",
        "Built tools that automated repetitive calculations and tasks.",
        "Wrote a training manual for new hires.",
      ],
    },
  ] as ExperienceItem[],
}

export const education = {
  title: "My Education",
  items: [
    {
      college: "International Electronics and Technical Institute",
      degree: "Associate in Information and Communication Technology",
      duration: "2006 - 2008",
    },
    {
      college: "Emiliano Tria Tirona Memorial National High School",
      degree: "High school",
      duration: "2002 - 2006",
    },
  ] as EducationItem[],
}

export const certifications = {
  title: "Certifications",
  items: [
    {
      college: "UX+",
      degree: "Certification of Attendance in UX+ Conference 2024",
      duration: "2024",
    },
    {
      college: "UX+",
      degree: "Certification of Attendance in UX+ Conference 2023",
      duration: "2023",
    },
    {
      college: "Udemy",
      degree: "React – The Complete Guide (incl. Next.js, Redux)",
      duration: "2022",
    },
  ] as CertificationItem[],
}

export type SkillGroup = { category: string; items: string[] }

export const skills: { title: string; groups: SkillGroup[] } = {
  title: "My Skills",
  groups: [
    {
      category: "Frameworks",
      items: ["React", "Next.js", "TypeScript", "JavaScript"],
    },
    {
      category: "Styling",
      items: ["Tailwind CSS", "Material UI", "HTML5", "CSS3"],
    },
    { category: "Testing", items: ["Jest", "Cypress", "Vitest", "Playwright"] },
    {
      category: "Animation",
      items: ["Framer Motion", "Anime.js", "Three.js"],
    },
    { category: "Tools", items: ["Git", "Figma", "Axios", "EmailJS"] },
  ],
}

export type SocialItem = {
  icon: IconType
  path: string
  name: string
  label: string
}

export const socials: SocialItem[] = [
  {
    name: "GitHub",
    label: "GitHub profile",
    icon: FaGithub,
    path: "https://github.com/jorenbagadiong",
  },
  {
    name: "LinkedIn",
    label: "LinkedIn profile",
    icon: FaLinkedinIn,
    path: "https://www.linkedin.com/in/joren-bagadiong-8943a3213",
  },
  {
    name: "Telegram",
    label: "Telegram",
    icon: FaTelegramPlane,
    path: "https://t.me/jorenbagadiong",
  },
]

export const contactInfo: {
  icon: IconType
  title: string
  description: string
  href?: string
}[] = [
  {
    icon: FaPhoneAlt,
    title: "Phone",
    description: "+63 915 395 4186",
    href: "tel:+639153954186",
  },
  {
    icon: FaEnvelope,
    title: "Email",
    description: "joren.bagadiong14@gmail.com",
    href: "mailto:joren.bagadiong14@gmail.com",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Address",
    description: "Cavite, Philippines",
  },
]
