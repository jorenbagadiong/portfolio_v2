"use client"
import { ReactNode } from "react"
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaFigma,
  FaNodeJs,
} from "react-icons/fa"
import { SiTailwindcss, SiNextdotjs } from "react-icons/si"

// Type Definitions
type ExperienceItem = {
  company: string
  position: string
  duration: string
}

type AboutInfoItem = {
  fieldName: string
  fieldValue: string
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

const EXPERIENCE = {
  icon: "/assets/profile/globe.svg",
  title: "My Experience",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
  items: [
    {
      company: "TDH International Inc",
      position: "Frontend Web Developer",
      duration: "February 2022 - Present",
    },
    {
      company: "MadTech Geek",
      position: "Frontend Web Developer",
      duration: "July 2021 - October 2021",
    },
    {
      company: "OLE Elite Software Philippines Inc",
      position: "Frontend Web Developer",
      duration: "October 2020 - June 2021",
    },
    {
      company: "H.R.D Singapore Pte Ltd",
      position: "Senior Staff",
      duration: "February 2013 - March 2020",
    },
    {
      company: "JMJ Auction",
      position: "Data Encoder",
      duration: "February 2012 - August 2012",
    },
    {
      company: "House Technology Industries Pte Ltd",
      position: "Production Operator",
      duration: "February 2013 - March 2020",
    },
  ] as ExperienceItem[],
}

const ABOUT = {
  title: "About me",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
  info: [
    { fieldName: "Name", fieldValue: "Joren Bagadiong" },
    { fieldName: "Phone", fieldValue: "(+63) 915 395 4186" },
    { fieldName: "Email", fieldValue: "joren.bagadiong14@gmail.com" },
    { fieldName: "Telegram", fieldValue: "@jorenbagadiong" },
    { fieldName: "Experience", fieldValue: "5+ years" },
    { fieldName: "Nationality", fieldValue: "Filipino" },
    { fieldName: "Language", fieldValue: "English, Tagalog" },
  ] as AboutInfoItem[],
}

const EDUCATION = {
  icon: "/assets/profile/globe.svg",
  title: "My Education",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
  items: [
    {
      college: "Udemy",
      degree: "React - The Complete Guide 2025 (incl. Next.js, Redux)",
      duration: "2022",
    },
    {
      college: "International Electronics and Technical Institute",
      degree: "Associate in Information and Communication Technology",
      duration: "2006 - 2008",
    },
  ] as EducationItem[],
}

const SKILLS = {
  icon: "/assets/profile/globe.svg",
  title: "My Skills",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.",
  skillList: [
    { icon: <FaHtml5 />, name: "HTML 5" },
    { icon: <FaCss3 />, name: "CSS 3" },
    { icon: <FaJs />, name: "Javascript" },
    { icon: <FaReact />, name: "React.js" },
    { icon: <SiNextdotjs />, name: "Next.js" },
    { icon: <SiTailwindcss />, name: "Tailwind.css" },
    { icon: <FaNodeJs />, name: "Node.js" },
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
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="about">About Me</TabsTrigger>
          </TabsList>

          <div className="min-h-[70vh] w-full">
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">{EXPERIENCE.title}</h3>
                <p className="max-w-[600px] text-white">
                  {EXPERIENCE.description}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {EXPERIENCE.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-left">
                            {item.position}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
                            <p className="text-white/60">{item.company}</p>
                          </div>
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
                <p className="max-w-[600px] text-white">
                  {EDUCATION.description}
                </p>
                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 gap-[30px]">
                    {EDUCATION.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl flex flex-col justify-center items-start gap-1"
                        >
                          <span className="text-accent">{item.duration}</span>
                          <h3 className="text-xl min-h-[60px] text-left">
                            {item.degree}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="w-[6px] h-[6px] rounded-full bg-accent"></span>
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

            <TabsContent value="skills" className="w-full h-full">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h3 className="text-4xl font-bold">{SKILLS.title}</h3>
                  <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                    {SKILLS.description}
                  </p>
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

            <TabsContent
              value="about"
              className="w-full text-center xl:text-left "
            >
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">{ABOUT.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {ABOUT.description}
                </p>
                <ul className="flex flex-col gap-4 max-w-[620px] mx-auto xl:mx-0">
                  {ABOUT.info.map((item, index) => {
                    return (
                      <li key={index} className="flex gap-4">
                        <span className="text-white/60">{item.fieldName}</span>
                        <span className="text-xl ">{item.fieldValue}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  )
}

export default Profile
