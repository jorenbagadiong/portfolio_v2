"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { IoMdClose } from "react-icons/io"

import { ProjectDetail } from "@/components/projects/ProjectDetail"
import type { Project } from "@/lib/site-data"

export function ProjectModal({ project }: { project: Project }) {
  const router = useRouter()

  // The route change unmounts the dialog before Radix can restore focus, so
  // hand focus back to the originating card ourselves.
  useEffect(() => {
    return () => {
      setTimeout(() => {
        const active = document.activeElement
        if (active && active !== document.body) return
        document
          .querySelector<HTMLElement>(`a[href="/projects/${project.slug}"]`)
          ?.focus()
      }, 0)
    }
  }, [project.slug])

  return (
    <Dialog.Root
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-bg/90 p-5 shadow-2xl backdrop-blur-md sm:p-8"
        >
          <Dialog.Title className="mb-4 pr-12 text-3xl font-bold leading-tight text-text xl:text-4xl">
            {project.title}
          </Dialog.Title>
          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-2 text-accent-text outline-none transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <IoMdClose className="text-2xl" />
          </Dialog.Close>
          <ProjectDetail project={project} variant="modal" />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
