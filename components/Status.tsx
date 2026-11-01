import { CountUp } from "@/components/motion/CountUp"
import { Reveal } from "@/components/motion/Reveal"
import { stats as STATS } from "@/lib/site-data"

const Status = () => {
  return (
    <section className="pt-4 pb-12 xl:pt-0 xl:pb-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
          {STATS.map(({ num, text }) => (
            <Reveal key={text}>
              <div className="h-full flex flex-col xl:flex-row items-center gap-1 xl:gap-4 justify-center rounded-xl border border-border bg-surface backdrop-blur px-4 py-4 text-center xl:text-left">
                <CountUp
                  to={num}
                  className="text-4xl xl:text-5xl font-extrabold text-accent"
                />
                <p className="leading-snug text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Status
