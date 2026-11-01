"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BsArrowUpRight, BsGithub } from "react-icons/bs"

import type { Project } from "@/lib/site-data"

type Props = {
  project: Project
  variant: "page" | "modal"
}

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"

export function ProjectDetail({ project, variant }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <motion.div
        layoutId={`project-${project.slug}`}
        className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/10"
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(min-width: 1024px) 800px, 100vw"
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="flex flex-col gap-4">
        <span className="font-primary text-sm text-accent">{project.num}</span>
        {variant === "page" ? (
          <h1 className="text-3xl font-bold leading-tight text-text xl:text-4xl">
            {project.title}
          </h1>
        ) : null}
        <p className="text-muted">{project.description}</p>
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s.name}
              className="rounded-full border border-border px-3 py-1 text-xs text-accent"
            >
              {s.name}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Live <BsArrowUpRight aria-hidden />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <BsGithub aria-hidden /> GitHub <BsArrowUpRight aria-hidden />
          </a>
        </div>
      </div>
    </div>
  )
}
