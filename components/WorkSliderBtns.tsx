"use client"

import { useEffect, useState } from "react"
import { useSwiper } from "swiper/react"
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

    // ensure slides exist before setting total
    const slidesCount = swiper.slides?.length || 0
    setTotal(slidesCount)
    setActiveIndex(swiper.activeIndex || 0)

    // update on slide change
    const handleSlideChange = () => {
      setActiveIndex(swiper.activeIndex || 0)
    }

    swiper.on("slideChange", handleSlideChange)

    return () => {
      swiper.off("slideChange", handleSlideChange)
    }
  }, [swiper])

  return (
    <div className="absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 flex justify-end w-full">
      <div className="flex gap-2">
        {/* Prev button (invisible if first) */}
        <button
          className={`bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all ${
            activeIndex === 0 ? "invisible" : ""
          }`}
          onClick={() => swiper.slidePrev()}
        >
          <PiCaretLeftBold className="text-xl" />
        </button>

        {/* Next button (invisible if last) */}
        <button
          className={`bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all ${
            activeIndex === total - 1 ? "invisible" : ""
          }`}
          onClick={() => swiper.slideNext()}
        >
          <PiCaretRightBold className="text-xl" />
        </button>
      </div>
    </div>
  )
}

export default WorkSliderBtns
