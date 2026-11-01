"use client"

import type { PointerEvent, ReactNode } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type TiltProps = {
  max?: number
  className?: string
  children: ReactNode
}

export function Tilt({ max = 8, className, children }: TiltProps) {
  const reduced = usePrefersReducedMotion()
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 200, damping: 20 })

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || window.matchMedia("(hover: none)").matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ry.set(px * 2 * max)
    rx.set(-py * 2 * max)
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
