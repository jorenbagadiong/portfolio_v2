"use client"

import { useEffect, useRef } from "react"
import { animate, stagger } from "animejs"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"
import { useIntroDone } from "@/lib/hooks/useIntroDone"

type AnimatedNameProps = {
  text: string
  className?: string
  /** Hold the animation until the loading intro has ended (hero use). */
  waitForIntro?: boolean
}

export function AnimatedName({
  text,
  className,
  waitForIntro = false,
}: AnimatedNameProps) {
  const reduced = usePrefersReducedMotion()
  const introDone = useIntroDone()
  const ready = !waitForIntro || introDone
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced || !ready || !ref.current) return
    const letters = ref.current.querySelectorAll("span")
    const anim = animate(letters, {
      opacity: [0, 1],
      translateY: ["0.6em", 0],
      delay: stagger(40),
      duration: 600,
      ease: "outExpo",
    })
    return () => {
      anim.revert()
    }
  }, [reduced, ready, text])

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="motion-hidden-letters">
        {Array.from(text).map((ch, i) => (
          <span key={i} className="inline-block">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  )
}
