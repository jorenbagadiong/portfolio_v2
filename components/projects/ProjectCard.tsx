"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { Tilt } from "@/components/motion/Tilt"
import type { Project } from "@/lib/site-data"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Tilt className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        scroll={false}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface backdrop-blur-md transition-colors hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <motion.div
          layoutId={`project-${project.slug}`}
          className="relative aspect-[16/10] w-full overflow-hidden bg-black/10"
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="font-primary text-sm text-accent">
            {project.num}
          </span>
          <h2 className="text-2xl font-bold leading-tight text-text transition-colors group-hover:text-accent">
            {project.title}
          </h2>
          <ul className="mt-auto flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s.name}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </Tilt>
  )
}
