"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Reveal } from "@/components/motion/Reveal"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type {
  skills as Skills,
  proficiency as Proficiency,
} from "@/lib/site-data"

type Props = { skills: typeof Skills; proficiency: typeof Proficiency }

function Bar({
  name,
  percentage,
  index,
}: {
  name: string
  percentage: number
  index: number
}) {
  const reduced = usePrefersReducedMotion()
  // observe the unscaled track: a scaleX(0) bar has zero width and never intersects
  const track = useRef<HTMLDivElement>(null)
  const inView = useInView(track, { once: true })
  return (
    <Reveal as="li" delay={index * 0.08}>
      <div className="flex justify-between items-baseline gap-4 mb-2">
        <h3 className="font-medium text-text">{name}</h3>
        <span className="text-lg font-medium text-text">{percentage}%</span>
      </div>
      <div
        ref={track}
        className="w-full bg-border rounded-full h-2.5 overflow-hidden"
      >
        <motion.div
          className="h-full w-full origin-left bg-accent rounded-full"
          initial={{ scaleX: reduced ? percentage / 100 : 0 }}
          animate={{ scaleX: reduced || inView ? percentage / 100 : 0 }}
          transition={{
            duration: reduced ? 0 : 1,
            ease: "easeOut",
            delay: index * 0.08,
          }}
        />
      </div>
    </Reveal>
  )
}

export function SkillsPanel({ skills, proficiency }: Props) {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold">{skills.title}</h2>
        <TooltipProvider delayDuration={100}>
          <ul className="grid grid-cols-3 sm:grid-cols-5 xl:grid-cols-3 gap-4">
            {skills.skillList.map((skill, i) => (
              <Reveal as="li" key={skill.name} delay={i * 0.05}>
                <Tooltip>
                  <TooltipTrigger
                    aria-label={skill.name}
                    className="w-full aspect-square bg-surface backdrop-blur-md border border-border rounded-xl flex justify-center items-center text-4xl text-text transition-all duration-300 hover:-translate-y-1 hover:text-accent-text focus-visible:-translate-y-1 focus-visible:text-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <skill.icon aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{skill.name}</p>
                  </TooltipContent>
                </Tooltip>
              </Reveal>
            ))}
          </ul>
        </TooltipProvider>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold">{proficiency.title}</h2>
        <ul className="flex flex-col gap-6 bg-surface backdrop-blur-md border border-border rounded-xl p-5">
          {proficiency.items.map((item, i) => (
            <Bar key={item.name} {...item} index={i} />
          ))}
        </ul>
      </section>
    </div>
  )
}
