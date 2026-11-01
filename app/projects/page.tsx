import type { Metadata } from "next"

import { Reveal } from "@/components/motion/Reveal"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { earlierProjects, mainProjects } from "@/lib/site-data"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Frontend projects by Joren Bagadiong, including MotionLab, an animated React component library, and PokeLab, an interactive Pokédex.",
  path: "/projects",
})

export default function ProjectsPage() {
  return (
    <section className="container mx-auto py-12">
      <h1 className="sr-only">Projects</h1>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {mainProjects.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
      <section aria-labelledby="earlier-work" className="mt-16">
        <h2 id="earlier-work" className="mb-6 text-2xl font-bold">
          Earlier work
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {earlierProjects.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={i * 0.06}>
              <ProjectCard project={project} size="sm" />
            </Reveal>
          ))}
        </ul>
      </section>
    </section>
  )
}
