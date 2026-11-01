import Social from "@/components/Social"
import Photo from "@/components/Photo"
import DownloadCVButton from "@/components/DownloadCVButton"
import { AnimatedName } from "@/components/motion/AnimatedName"
import { Reveal } from "@/components/motion/Reveal"
import { intro } from "@/lib/site-data"

const Home = () => {
  return (
    <section>
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-16">
          <div className="text-center xl:text-left order-2 xl:order-none max-xl:rounded-xl max-xl:bg-bg/60 max-xl:p-3">
            <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
              <span className="text-xl text-muted">Frontend Web Developer</span>
              <span className="inline-flex items-center rounded-full border border-accent px-3 py-1 font-primary text-xs uppercase tracking-wider text-accent-text">
                5+ years
              </span>
            </div>
            <h1 className="text-[28px] min-[400px]:text-[34px] sm:text-[48px] xl:text-[60px] leading-[1.1] font-semibold mb-6">
              Hello, I&apos;m <br />
              <AnimatedName
                text="Joren D. Bagadiong"
                waitForIntro
                className="text-accent-text"
              />
            </h1>
            <p className="max-w-[500px] mb-9 text-muted">{intro}</p>
            <Reveal delay={0.4}>
              <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-8">
                <DownloadCVButton />
                <div className="mb-8 xl:mb-0">
                  <Social
                    containerStyles="flex gap-6"
                    iconStyles="w-9 h-9 border border-accent rounded-full flex justify-center items-center text-accent-text text-base hover:bg-accent hover:text-on-accent hover:transition-all duration-500"
                  />
                </div>
              </div>
            </Reveal>
          </div>
          <div className="order-1 xl:order-none mb-6 xl:mb-0">
            <Photo />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
