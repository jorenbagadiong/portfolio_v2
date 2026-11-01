"use client"

import { useEffect, useRef, useState } from "react"
import { animate } from "animejs"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type CountUpProps = {
  to: number
  duration?: number
  suffix?: string
  className?: string
}

export function CountUp({
  to,
  duration = 1600,
  suffix = "",
  className,
}: CountUpProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(to)

  useEffect(() => {
    const el = ref.current
    if (reduced || !el) {
      setValue(to)
      return
    }
    let anim: ReturnType<typeof animate> | undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()
        const counter = { v: 0 }
        setValue(0)
        anim = animate(counter, {
          v: to,
          duration,
          ease: "outExpo",
          modifier: Math.round,
          onUpdate: () => setValue(Math.round(counter.v)),
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      anim?.revert()
    }
  }, [reduced, to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
