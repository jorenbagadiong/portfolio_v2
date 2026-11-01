"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type RevealProps = {
  as?: "div" | "li" | "section"
  delay?: number
  y?: number
  children: ReactNode
}

export function Reveal({
  as = "div",
  delay = 0,
  y = 24,
  children,
}: RevealProps) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    const Tag = as
    return <Tag>{children}</Tag>
  }

  const MotionTag = motion[as]
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  )
}
