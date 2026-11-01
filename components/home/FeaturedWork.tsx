import Image from "next/image"
import Link from "next/link"
import { BsArrowUpRight, BsGithub } from "react-icons/bs"

import { Reveal } from "@/components/motion/Reveal"
import { mainProjects } from "@/lib/site-data"

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-text"

export function FeaturedWork() {
  return (
    <section
      aria-labelledby="featured-work"
      className="container mx-auto py-12"
    >
      <h2 id="featured-work" className="mb-8 text-3xl font-bold">
        Featured work
      </h2>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {mainProjects.slice(0, 3).map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 0.08}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface backdrop-blur-md">
              {project.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
                  <Image
                    src={project.image}
                    alt={project.imageAlt ?? ""}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="text-2xl font-bold leading-tight text-text">
                  {project.title}
                </h3>
                <p className="text-muted">{project.pitch}</p>
                <ul aria-label="Tech stack" className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li
                      key={s.name}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap gap-3 pt-2">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      Live demo
                      <span className="sr-only"> of {project.title}</span>
                      <BsArrowUpRight aria-hidden />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      <BsGithub aria-hidden /> GitHub
                      <span className="sr-only">
                        {" "}
                        repository for {project.title}
                      </span>
                      <BsArrowUpRight aria-hidden />
                    </a>
                  )}
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Case study: ${project.title}`}
                    className={linkClass}
                  >
                    Case study
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
