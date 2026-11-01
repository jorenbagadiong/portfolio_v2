import type { Metadata } from "next"

import { Reveal } from "@/components/motion/Reveal"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { projects } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Projects | Joren Bagadiong",
  description: "Selected frontend projects by Joren Bagadiong.",
}

export default function ProjectsPage() {
  return (
    <section className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-text xl:text-5xl">
        Projects
      </h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
