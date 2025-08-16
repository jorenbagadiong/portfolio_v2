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

    setTotal(swiper.slides.length)
    setActiveIndex(swiper.activeIndex)

    const handleSlideChange = () => {
      setActiveIndex(swiper.activeIndex)
    }

    swiper.on("slideChange", handleSlideChange)
    return () => {
      swiper.off("slideChange", handleSlideChange)
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
