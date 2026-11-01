"use client"
import {
  experience as EXPERIENCE,
  education as EDUCATION,
  certifications as CERTIFICATION,
  proficiency as PROFICIENCY,
  skills as SKILLS,
} from "@/lib/site-data"
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
            <TabsTrigger value="certification">Certification</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="proficiency">Proficiency</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
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
                                  <skill.icon />
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
