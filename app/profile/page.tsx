"use client"

import {
  experience,
  education,
  certifications,
  proficiency,
  skills,
} from "@/lib/site-data"
import { Timeline, type TimelineGroup } from "@/components/profile/Timeline"
import { SkillsPanel } from "@/components/profile/SkillsPanel"

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

export default function Profile() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="sr-only">Profile</h1>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-14">
        <Timeline groups={groups} />
        <SkillsPanel skills={skills} proficiency={proficiency} />
      </div>
    </div>
  )
}
