"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import { BsArrowUpRight, BsGithub } from "react-icons/bs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import WorkSliderBtns from "@/components/WorkSliderBtns"

type Project = {
  num: string
  category: string
  title: string
  description: string
  stack: { name: string }[]
  image: string
  live: string
  github: string
}

const PROJECTS: Project[] = [
  {
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
    live: "https://portfolio-jorenbagadiong.vercel.app//",
    github: "https://github.com/jorenbagadiong/portfolio",
  },
]

const Work = () => {
  const [project, setProject] = useState(PROJECTS[0])

  const handleSlideChange = (swiper: SwiperType) => {
    const currentIndex = swiper.activeIndex
    setProject(PROJECTS[currentIndex])
  }
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row xl:gap-[30px]">
          <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
            <div className="flex flex-col gap-[30px] h-[50%]">
              <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                {project.num}
              </div>
              <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                {project.title}
              </h2>
              <p className="text-white/60">{project.description}</p>
              <ul className="flex gap-4">
                {project.stack.map((item, index) => {
                  return (
                    <li key={index} className="text-xl text-accent">
                      {item.name}
                      {index !== project.stack.length - 1 && ","}
                    </li>
                  )
                })}
              </ul>
              <div className="border border-white/20"></div>
              <div className="flex items-center gap-4">
                <Link
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                        <BsArrowUpRight className="text-white text-3xl group-hover:text-accent" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Live Project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
                <Link
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                        <BsGithub className="text-white text-3xl group-hover:text-accent" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Github repo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
              </div>
            </div>
          </div>
          <div className="h-full w-full xl:w-[50%]">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              className="xl:h-[520px] mb-12"
              onSlideChange={handleSlideChange}
            >
              {PROJECTS.map((_, index) => {
                return (
                  <SwiperSlide key={index} className="w-full">
                    <div className="h-[350px] xl:h-full relative group flex justify-center items-center">
                      <div className="absolute top-0 bottom-0 w-full h-full z-10"></div>
                      <div className="relative w-full h-full">
                        <Image
                          src={project.image}
                          fill
                          className="object-fit"
                          alt=""
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
              <WorkSliderBtns />
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Work
