"use client"

import { useSwiper } from "swiper/react"
import { useEffect, useState } from "react"
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi"

type WorkSliderBtnsProps = {
  containerStyles?: string
  btnStyles?: string
  iconStyles?: string
}

const WorkSliderBtns = ({
  containerStyles = "",
  btnStyles = "",
  iconStyles = "",
}: WorkSliderBtnsProps) => {
  const swiper = useSwiper()
  const [activeIndex, setActiveIndex] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!swiper) return

    // Swiper may not be initialized yet, so slides can be undefined on first run
    const sync = () => {
      setTotal(swiper.slides?.length ?? 0)
      setActiveIndex(swiper.activeIndex ?? 0)
    }

    sync()

    swiper.on("init", sync)
    swiper.on("slideChange", sync)
    swiper.on("slidesLengthChange", sync)
    return () => {
      swiper.off("init", sync)
      swiper.off("slideChange", sync)
      swiper.off("slidesLengthChange", sync)
    }
  }, [swiper])

  return (
    <div className={containerStyles}>
      {/* Prev Button */}
      <button
        disabled={activeIndex === 0}
        onClick={() => swiper.slidePrev()}
        className={`${btnStyles} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <PiCaretLeftBold className={iconStyles} />
      </button>

      {/* Next Button */}
      <button
        disabled={activeIndex === total - 1}
        onClick={() => swiper.slideNext()}
        className={`${btnStyles} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <PiCaretRightBold className={iconStyles} />
      </button>
    </div>
  )
}

export default WorkSliderBtns
