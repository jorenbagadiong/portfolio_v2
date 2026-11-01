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
  "inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-text"

export function ProjectDetail({ project, variant }: Props) {
  // The modal's title is an h2 (Dialog.Title), the page's an h1.
  const SectionHeading = variant === "page" ? "h2" : "h3"
  const sections = [
    { title: "Problem", body: project.problem },
    { title: "My role", body: project.role },
    { title: "Outcome", body: project.outcome },
  ]
  return (
    <div className="flex flex-col gap-6">
      {project.image && (
        <motion.div
          layoutId={`project-${project.slug}`}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/10"
        >
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            priority
          />
        </motion.div>
      )}
      <div className="flex flex-col gap-4">
        <span className="font-primary text-sm text-accent-text">
          {project.num}
        </span>
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
              className="rounded-full border border-border px-3 py-1 text-xs text-accent-text"
            >
              {s.name}
            </li>
          ))}
        </ul>
        {(project.live || project.github) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Live <BsArrowUpRight aria-hidden />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <BsGithub aria-hidden /> GitHub <BsArrowUpRight aria-hidden />
              </a>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5 border-t border-border pt-6">
        {sections.map((s) => (
          <section key={s.title} className="flex flex-col gap-1">
            <SectionHeading className="text-xl font-bold text-text">
              {s.title}
            </SectionHeading>
            <p className="text-muted">{s.body}</p>
          </section>
        ))}
        {project.highlights?.length ? (
          <section className="flex flex-col gap-2">
            <SectionHeading className="text-xl font-bold text-text">
              Highlights
            </SectionHeading>
            <ul className="flex flex-col gap-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                  />
                  <p className="text-muted">{h}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  )
}
