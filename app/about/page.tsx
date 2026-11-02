import type { Metadata } from "next"

import {
  about,
  experience,
  education,
  certifications,
  skills,
} from "@/lib/site-data"
import { pageMetadata } from "@/lib/metadata"
import { Timeline, type TimelineGroup } from "@/components/profile/Timeline"
import { SkillsPanel } from "@/components/profile/SkillsPanel"
import { StrengthsPanel } from "@/components/profile/StrengthsPanel"

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Experience, education, and skills of Joren Bagadiong, a frontend developer since 2020 working with React, Next.js, TypeScript, and Tailwind CSS.",
  path: "/about",
})

const groups: TimelineGroup[] = [
  {
    title: experience.title,
    items: experience.items.map((e, i) => ({
      date: e.duration,
      title: e.position,
      subtitle: e.company,
      details: e.responsibilities,
      // Recent roles are open for quick scanning; older ones stay compact.
      expanded: i < 2,
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
      <header className="max-w-[640px] mb-14 flex flex-col gap-4">
        <h1 className="text-4xl xl:text-5xl font-bold">
          About <span className="text-accent-text">Me</span>
        </h1>
        {about.intro.map((p) => (
          <p key={p} className="text-muted leading-relaxed">
            {p}
          </p>
        ))}
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-14">
        <Timeline groups={groups} />
        <div className="flex flex-col gap-14">
          <StrengthsPanel strengths={about.strengths} />
          <SkillsPanel skills={skills} />
        </div>
      </div>
    </div>
  )
}
