"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"
import { useIntroDone } from "@/lib/hooks/useIntroDone"

type RevealProps = {
  as?: "div" | "li" | "section"
  delay?: number
  y?: number
  children: ReactNode
}

/**
 * The element type is stable (always motion[as]) so a reduced-motion flip
 * never remounts children. Server markup carries no inline opacity; the hidden
 * state comes from the CSS-gated `motion-hidden` class (JS present + motion
 * allowed). After mount we take over with animate values, revealing once in view.
 */
export function Reveal({
  as = "div",
  delay = 0,
  y = 24,
  children,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [mounted, setMounted] = useState(false)
  const introDone = useIntroDone()
  const armed = mounted && introDone

  useEffect(() => setMounted(true), [])

  const MotionTag = motion[as]

  let animate
  if (!armed) animate = undefined
  else if (reduced) animate = { opacity: 1, y: 0, transition: { duration: 0 } }
  else if (inView)
    animate = {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
    }
  else animate = { opacity: 0, y, transition: { duration: 0 } }

  return (
    <MotionTag
      ref={ref as never}
      initial={false}
      animate={animate}
      className="motion-hidden"
    >
      {children}
    </MotionTag>
  )
}
