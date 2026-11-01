import type { IconType } from "react-icons"
import { FaHtml5, FaCss3, FaJs, FaReact, FaFigma } from "react-icons/fa"
import { SiTailwindcss, SiNextdotjs, SiTypescript, SiMui } from "react-icons/si"
import { TbBrandFramerMotion } from "react-icons/tb"
import {
  FaFacebookF,
  FaFacebookMessenger,
  FaLinkedinIn,
  FaTelegramPlane,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa"

export type NavLink = { name: string; path: string }

export const navLinks: NavLink[] = [
  { name: "home", path: "/" },
  { name: "profile", path: "/profile" },
  { name: "projects", path: "/projects" },
  { name: "contact", path: "/contact" },
]

export const intro =
  "Frontend Web Developer building scalable web applications using React, Next.js, Tailwind, and MUI. Skilled in creating responsive UIs, optimizing user experience, and ensuring quality with Jest and Cypress testing."

export type Project = {
  slug: string
  num: string
  category: string
  title: string
  description: string
  stack: { name: string }[]
  image: string
  live: string
  github: string
}

export const projects: Project[] = [
  {
    slug: "cryptoweb-app",
    num: "01",
    category: "frontend",
    title: "Cryptoweb App",
    description:
      "A personal practice project built with Next.js, Tailwind CSS, and animation libraries, showcasing my learning in modern frontend development and smooth UI interactions.",
    stack: [{ name: "Next.js" }, { name: "Tailwindcss" }],
    image: "/assets/profile/projects/cryptowebapp.svg",
    live: "https://cryptowebapp-six.vercel.app/",
    github: "https://github.com/jorenbagadiong/cryptowebapp",
  },
  {
    slug: "pet-grooming",
    num: "02",
    category: "frontend",
    title: "Pet grooming",
    description:
      "A personal practice project — a pet grooming landing page — built with Next.js and Tailwind CSS while exploring modern frontend development techniques.",
    stack: [{ name: "Next.js" }, { name: "Tailwindcss" }],
    image: "/assets/profile/projects/petgrooming.svg",
    live: "https://jorenbagadiong.github.io/petgrooming",
    github: "https://github.com/jorenbagadiong/petgrooming",
  },
  {
    slug: "cryptolist",
    num: "03",
    category: "frontend",
    title: "CryptoList",
    description:
      "A personal practice project — CryptoList, a web app displaying a list of cryptocurrency tokens — built while learning React and API data fetching.",
    stack: [{ name: "React.js" }, { name: "Axios" }],
    image: "/assets/profile/projects/cryptolist.svg",
    live: "https://jorenbagadiong.github.io/CryptoList/",
    github: "https://github.com/jorenbagadiong/CryptoList",
  },
  {
    slug: "portfolio-v1",
    num: "04",
    category: "frontend",
    title: "Portfolio v1",
    description:
      "My first portfolio website, built with Next.js, Tailwind CSS, and EmailJS for contact form integration.",
    stack: [
      { name: "Next.js" },
      { name: "Tailwindcss" },
      { name: "Axios" },
      { name: "Emailjs" },
    ],
    image: "/assets/profile/projects/portfoliov1.svg",
    live: "https://portfolio-jorenbagadiong.vercel.app/",
    github: "https://github.com/jorenbagadiong/portfolio",
  },
]

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

export type SkillItem = {
  icon: IconType
  name: string
}

export type CertificationItem = {
  college: string
  degree: string
  duration: string
}

export type ProficiencyItem = {
  name: string
  percentage: number
}

export const experience = {
  icon: "/assets/profile/globe.svg",
  title: "My Experience",
  items: [
    {
      company: "TDH International Inc",
      position: "Frontend Web Developer",
      duration: "February 2022 - Present",
      responsibilities: [
        "Developed responsive, high-performance web apps, including secure payment platforms and back-office systems.",
        "Converted Figma UI/UX designs into clean, reusable code for seamless, pixel-perfect experiences.",
        "Optimized application speed and scalability through advanced performance techniques.",
        "Ensured cross-browser and cross-device compatibility for consistent user experiences.",
        "Collaborated with designers and back-end teams to integrate APIs and dynamic content.",
        "Applied best practices in accessibility, SEO, and responsive design.",
        "Maintained code quality via Git workflows and peer reviews.",
        "Conducted unit testing with Jest and end-to-end testing with Cypress.",
        "Troubleshot and resolved technical issues to improve system reliability.",
        "Adopted emerging technologies to keep products competitive and innovative.",
      ],
    },
    {
      company: "MadTech Geek",
      position: "Frontend Web Developer",
      duration: "July 2021 - October 2021",
      responsibilities: [
        "Develop, test, and maintain responsive websites and web applications.",
        "Ensure cross-browser and cross-device compatibility.",
        "Collaborate with designers and back-end developers to integrate APIs and dynamic content.",
        "Troubleshoot, debug, and improve existing applications.",
        "Stay updated with emerging technologies, frameworks, and design trends.",
      ],
    },
    {
      company: "OLE Elite Software Philippines Inc",
      position: "Frontend Web Developer",
      duration: "October 2020 - June 2021",
      responsibilities: [
        "Develop, test, and maintain responsive websites and web applications.",
        "Collaborate with designers and back-end developers to integrate APIs and dynamic content.",
        "Troubleshoot, debug, and improve existing applications.",
        "Stay updated with emerging technologies, frameworks, and design trends.",
      ],
    },
    {
      company: "H.R.D Singapore Pte Ltd",
      position: "Senior Staff",
      duration: "February 2013 - March 2020",
      responsibilities: [
        "In-charge in innovating, developing and maintenance of the system in 2 years as Full Stack Developer",
        "Handling technical feedback from user",
        "Research and exploration of web system for its development and usefulness",
      ],
    },
  ] as ExperienceItem[],
}

export const education = {
  icon: "/assets/profile/globe.svg",
  title: "My Education",
  items: [
    {
      college: "International Electronics and Technical Institute",
      degree: "Associate in Information and Communication Technology",
      duration: "2006 - 2008",
    },
    {
      college: "Emiliano Tria Tirona Memorial National High School",
      degree: "Highschool",
      duration: "2008 - 2002",
    },
  ] as EducationItem[],
}

export const certifications = {
  icon: "/assets/profile/globe.svg",
  title: "My Certification",
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
      degree: "React - The Complete Guide 2025 (incl. Next.js, Redux)",
      duration: "2022",
    },
  ] as CertificationItem[],
}

export const proficiency = {
  title: "My Proficiency",
  items: [
    {
      name: "Frontend Web Development",
      percentage: 93,
    },
    {
      name: "React.js | Next.js",
      percentage: 85,
    },
    {
      name: "Unit Testing(Jest) and End-to-End Testing(Cypress)",
      percentage: 80,
    },
    {
      name: "Tailwindcss | MaterialUI - Component Styling",
      percentage: 85,
    },
    {
      name: "Framer Motion - Animation",
      percentage: 75,
    },
    {
      name: "Problem Solving",
      percentage: 98,
    },
  ] as ProficiencyItem[],
}

export const skills = {
  icon: "/assets/profile/globe.svg",
  title: "My Skills",
  skillList: [
    { icon: FaReact, name: "React.js" },
    { icon: SiNextdotjs, name: "Next.js" },
    { icon: SiTailwindcss, name: "Tailwindcss" },
    { icon: SiMui, name: "MUI" },
    { icon: FaHtml5, name: "HTML5" },
    { icon: FaCss3, name: "CSS3" },
    { icon: FaJs, name: "Javascript" },
    { icon: SiTypescript, name: "Typescript" },
    { icon: TbBrandFramerMotion, name: "Framer Motion" },
    { icon: FaFigma, name: "Figma" },
  ] as SkillItem[],
}

export type SocialItem = { icon: IconType; path: string }

export const socials: SocialItem[] = [
  {
    icon: FaLinkedinIn,
    path: "https://www.linkedin.com/in/joren-bagadiong-8943a3213",
  },
  { icon: FaTelegramPlane, path: "https://t.me/jorenbagadiong" },
  { icon: FaFacebookMessenger, path: "https://m.me/jorenbagadiong" },
  { icon: FaFacebookF, path: "https://www.facebook.com/jorenbagadiong" },
]

export const contactInfo: {
  icon: IconType
  title: string
  description: string
}[] = [
  { icon: FaPhoneAlt, title: "Phone", description: "+63 915 395 4186" },
  {
    icon: FaEnvelope,
    title: "Email",
    description: "joren.bagadiong14@gmail.com",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Address",
    description: "Micara Estates, Sahud-Ulan, Tanza, Cavite",
  },
]
