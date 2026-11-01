import { notFound } from "next/navigation"

import { ProjectModal } from "@/components/projects/ProjectModal"
import { getProjectBySlug } from "@/lib/site-data"

export default async function ProjectModalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()
  return <ProjectModal project={project} />
}
