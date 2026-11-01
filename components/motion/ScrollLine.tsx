"use client"

import { useRef } from "react"
import { motion, useScroll } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type ScrollLineProps = {
  className?: string
}

export function ScrollLine({ className }: ScrollLineProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  })

  return (
    <div ref={ref} className={`w-px ${className ?? ""}`} aria-hidden="true">
      <motion.div
        className="h-full w-full origin-top bg-current"
        style={{ scaleY: reduced ? 1 : scrollYProgress }}
      />
    </div>
  )
}
