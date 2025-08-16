"use client"

import { useEffect, useState } from "react"
import { useSwiper } from "swiper/react"
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi"

const WorkSliderBtns = () => {
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
    <div className="absolute bottom-4 right-4 flex gap-2 z-10">
      <div className="flex gap-2">
        {/* Prev button (disabled on first) */}
        <button
          disabled={activeIndex === 0}
          className="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[30px] h-[30px] flex justify-center items-center transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => swiper.slidePrev()}
        >
          <PiCaretLeftBold className="text-xl" />
        </button>

        {/* Next button (disabled on last) */}
        <button
          disabled={activeIndex === total - 1}
          className="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[30px] h-[30px] flex justify-center items-center transition-all 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => swiper.slideNext()}
        >
          <PiCaretRightBold className="text-xl" />
        </button>
      </div>
    </div>
  )
}

export default WorkSliderBtns
