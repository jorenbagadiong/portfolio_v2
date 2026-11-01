import { Reveal } from "@/components/motion/Reveal"
import type { skills as Skills } from "@/lib/site-data"

type Props = { skills: typeof Skills }

export function SkillsPanel({ skills }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold">{skills.title}</h2>
      <ul className="flex flex-col gap-6 bg-surface backdrop-blur-md border border-border rounded-xl p-5">
        {skills.groups.map((group, i) => (
          <Reveal as="li" key={group.category} delay={i * 0.08}>
            <h3 className="mb-3 font-medium text-text">{group.category}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
