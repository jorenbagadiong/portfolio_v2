"use client"

import { useId, useState } from "react"
import { Reveal } from "@/components/motion/Reveal"
import { ScrollLine } from "@/components/motion/ScrollLine"

export type TimelineItem = {
  date: string
  title: string
  subtitle: string
  details?: string[]
}

export type TimelineGroup = { title: string; items: TimelineItem[] }

function Entry({ item }: { item: TimelineItem }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const hasDetails = !!item.details?.length

  return (
    <Reveal as="li">
      <div className="relative pl-8 md:pl-10">
        <span
          aria-hidden="true"
          className="absolute left-0 top-7 h-3 w-3 -translate-x-1/2 rounded-full bg-accent"
        />
        <div className="bg-surface backdrop-blur-md border border-border rounded-xl p-5 xl:p-6 flex flex-col gap-2">
          <span className="text-accent text-sm">{item.date}</span>
          <h3 className="text-xl font-bold text-text">{item.title}</h3>
          <p className="text-muted">{item.subtitle}</p>
          {hasDetails && (
            <>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((o) => !o)}
                className="self-start text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded"
              >
                {open ? "Hide responsibilities" : "Show responsibilities"}
              </button>
              <ul
                id={panelId}
                className={open ? "flex flex-col gap-2 mt-1" : "hidden"}
              >
                {item.details!.map((d, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                    <p className="text-muted">{d}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export function Timeline({ groups }: { groups: TimelineGroup[] }) {
  return (
    <div className="flex flex-col gap-14">
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold">{group.title}</h2>
          <div className="relative ml-1.5">
            <ScrollLine className="absolute inset-y-0 left-0 text-accent" />
            <ul className="flex flex-col gap-6">
              {group.items.map((item, i) => (
                <Entry key={i} item={item} />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  )
}
