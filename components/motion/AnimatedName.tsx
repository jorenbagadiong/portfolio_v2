"use client"

import { useEffect, useRef } from "react"
import { animate, stagger } from "animejs"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type AnimatedNameProps = {
  text: string
  className?: string
}

export function AnimatedName({ text, className }: AnimatedNameProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduced || !ref.current) return
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
  }, [reduced, text])

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
