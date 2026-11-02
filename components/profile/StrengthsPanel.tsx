import { Reveal } from "@/components/motion/Reveal"
import type { about } from "@/lib/site-data"

type Props = { strengths: (typeof about)["strengths"] }

export function StrengthsPanel({ strengths }: Props) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold">{strengths.title}</h2>
      <ul className="flex flex-col gap-5 bg-surface backdrop-blur-md border border-border rounded-xl p-5">
        {strengths.items.map(({ icon: Icon, title, description }, i) => (
          <Reveal as="li" key={title} delay={i * 0.08}>
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="w-9 h-9 shrink-0 border border-accent rounded-full flex justify-center items-center text-accent-text text-base"
              >
                <Icon />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium text-text">{title}</h3>
                <p className="text-sm text-muted">{description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
