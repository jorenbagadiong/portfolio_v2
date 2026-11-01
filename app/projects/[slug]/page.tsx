import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProjectDetail } from "@/components/projects/ProjectDetail"
import { getProjectBySlug, projects } from "@/lib/site-data"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} | Joren Bagadiong`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  return (
    <section className="container mx-auto max-w-3xl py-12">
      <Link
        href="/projects"
        className="mb-6 inline-block text-sm text-muted transition-colors hover:text-accent-text"
      >
        &larr; All projects
      </Link>
      <div className="rounded-2xl border border-border bg-surface p-5 backdrop-blur-md sm:p-8">
        <ProjectDetail project={project} variant="page" />
      </div>
    </section>
  )
}
