import type { Metadata } from "next"

import { experience, education, certifications, skills } from "@/lib/site-data"
import { pageMetadata } from "@/lib/metadata"
import { Timeline, type TimelineGroup } from "@/components/profile/Timeline"
import { SkillsPanel } from "@/components/profile/SkillsPanel"

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Experience, education, and skills of Joren Bagadiong, a frontend developer since 2020 working with React, Next.js, TypeScript, and Tailwind CSS.",
  path: "/about",
})

const groups: TimelineGroup[] = [
  {
    title: experience.title,
    items: experience.items.map((e) => ({
      date: e.duration,
      title: e.position,
      subtitle: e.company,
      details: e.responsibilities,
    })),
  },
  {
    title: education.title,
    items: education.items.map((e) => ({
      date: e.duration,
      title: e.degree,
      subtitle: e.college,
    })),
  },
  {
    title: certifications.title,
    items: certifications.items.map((e) => ({
      date: e.duration,
      title: e.degree,
      subtitle: e.college,
    })),
  },
]

export default function About() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="sr-only">About</h1>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-14">
        <Timeline groups={groups} />
        <SkillsPanel skills={skills} />
      </div>
    </div>
  )
}
