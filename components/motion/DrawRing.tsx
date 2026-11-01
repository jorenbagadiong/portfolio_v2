"use client"

import { useEffect, useRef } from "react"
import { animate, svg } from "animejs"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type DrawRingProps = {
  size: number
  className?: string
}

export function DrawRing({ size, className }: DrawRingProps) {
  const reduced = usePrefersReducedMotion()
  const circleRef = useRef<SVGCircleElement>(null)
  const spinRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const circle = circleRef.current
    const spinner = spinRef.current
    if (reduced || !circle || !spinner) return
    const drawable = svg.createDrawable(circle)
    const anim = animate(drawable, {
      draw: ["0 0", "0 1"],
      duration: 1600,
      ease: "inOutQuad",
      onComplete: () =>
        spinner.classList.add("animate-[spin_40s_linear_infinite]"),
    })
    return () => {
      anim.revert()
      spinner.classList.remove("animate-[spin_40s_linear_infinite]")
    }
  }, [reduced])

  const stroke = 2
  const r = size / 2 - stroke

  return (
    <svg
      ref={spinRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle
        ref={circleRef}
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  )
}
