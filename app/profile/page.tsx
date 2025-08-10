"use client"
import { ReactNode } from "react"
import { FaHtml5, FaCss3, FaJs, FaReact, FaFigma } from "react-icons/fa"
import { SiTailwindcss, SiNextdotjs, SiTypescript, SiMui } from "react-icons/si"
import { TbBrandFramerMotion } from "react-icons/tb"

// Type Definitions
type ExperienceItem = {
  company: string
  position: string
  duration: string
  responsibilities: string[]
}

type EducationItem = {
  college: string
  degree: string
  duration: string
}

type SkillItem = {
  icon: ReactNode
  name: string
}

type CertificationItem = {
  college: string
  degree: string
  duration: string
}

type ProficiencyItem = {
  name: string
  percentage: number
}

const EXPERIENCE = {
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

const EDUCATION = {
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

const CERTIFICATION = {
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

const PROFICIENCY = {
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

const SKILLS = {
  icon: "/assets/profile/globe.svg",
  title: "My Skills",
  skillList: [
    { icon: <FaReact />, name: "React.js" },
    { icon: <SiNextdotjs />, name: "Next.js" },
    { icon: <SiTailwindcss />, name: "Tailwindcss" },
    { icon: <SiMui />, name: "MUI" },
    { icon: <FaHtml5 />, name: "HTML5" },
    { icon: <FaCss3 />, name: "CSS3" },
    { icon: <FaJs />, name: "Javascript" },
    { icon: <SiTypescript />, name: "Typescript" },
    { icon: <TbBrandFramerMotion />, name: "Framer Motion" },
    { icon: <FaFigma />, name: "Figma" },
  ] as SkillItem[],
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import ProgressBar from "@/components/ProgressBar"

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[70vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs
          defaultValue="experience"
          className="flex flex-col xl:flex-row gap-[60px]"
        >
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="certification">Certification</TabsTrigger>
            <TabsTrigger value="proficiency">Proficiency</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <div className="min-h-[70vh] w-full">
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{EXPERIENCE.title}</h3>
                <ScrollArea className="h-[60vh]">
                  <ul className="grid grid-cols-1 gap-[30px]">
                    {EXPERIENCE.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-auto py-6 px-5 xl:px-6 rounded-xl flex flex-col justify-center items-start gap-2"
                        >
                          <div className="flex flex-col xl:flex-row justify-between w-full">
                            <h3 className="text-xl text-left font-bold">
                              {item.company}
                            </h3>
                            <span className="text-accent text-left xl:text-right">
                              {item.duration}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-white text-l font-semibold">
                              {item.position}
                            </p>
                          </div>
                          <ul className="flex flex-col gap-2">
                            {item.responsibilities.map((resp, i) => (
                              <li className="flex items-start gap-5" key={i}>
                                <span className="w-[10px] h-[10px] rounded-full bg-accent mt-3" />
                                <p className="text-white/60 text-left">
                                  {resp}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="education" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{EDUCATION.title}</h3>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 gap-[30px]">
                    {EDUCATION.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] py-6 px-10 rounded-xl flex flex-col justify-center items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl min-h-[60px] text-left">
                            {item.degree}
                          </h3>
                          <div className="flex items-start gap-5">
                            <span className="w-[10px] h-[10px] rounded-full bg-accent mt-3" />
                            <p className="text-white/60 text-left">
                              {item.college}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="certification" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{CERTIFICATION.title}</h3>

                <ul className="grid grid-cols-1 gap-[30px]">
                  {CERTIFICATION.items.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="bg-[#232329] py-6 px-10 rounded-xl flex flex-col justify-center items-start gap-1"
                      >
                        <span className="text-accent">{item.duration}</span>
                        <h3 className="text-xl min-h-[60px] text-left">
                          {item.degree}
                        </h3>
                        <div className="flex items-start gap-5">
                          <span className="w-[10px] h-[10px] rounded-full bg-accent mt-3" />
                          <p className="text-white/60 text-left">
                            {item.college}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="proficiency" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{PROFICIENCY.title}</h3>

                <ul className="grid grid-cols-1 gap-[50px]">
                  {PROFICIENCY.items.map((item, index) => {
                    return (
                      <li key={index}>
                        <ProgressBar
                          name={item.name}
                          percentage={item.percentage}
                          index={index}
                        />
                      </li>
                    )
                  })}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="skills" className="w-full h-full">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h3 className="text-4xl font-bold">{SKILLS.title}</h3>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 xl:gap-[30px]">
                    {SKILLS.skillList.map((skill, index) => {
                      return (
                        <li key={index}>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group">
                                <div className="text-6xl group-hover:text-accent transition-all duration-300 ">
                                  {skill.icon}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="capitalize">{skill.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  )
}

export default Profile
