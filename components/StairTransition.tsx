"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { animate, stagger } from "animejs"

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"
import { particles } from "@/lib/particle-store"
import { routeLabel } from "@/lib/route-label"

const BARS = 6
const BAR_MS = 450
const BAR_STAGGER_MS = 60

type Wipe = { key: string; label: string }

/**
 * "Stair wipe": 6 bars cover the screen on every client-side route change and
 * slide down to reveal the new page, right to left. Never plays on the first
 * render, never with reduced motion, and never intercepts input.
 */
export default function StairTransition() {
  const pathname = usePathname()
  const reduced = usePrefersReducedMotion()
  const prev = useRef(pathname)
  const [wipe, setWipe] = useState<Wipe | null>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  // Start (or restart) the wipe when the pathname changes after first render.
  useEffect(() => {
    if (prev.current === pathname) return
    prev.current = pathname
    if (reduced || document.documentElement.classList.contains("intro")) return
    particles.pulse("ripple")
    setWipe({ key: pathname, label: routeLabel(pathname) })
  }, [pathname, reduced])

  // Drive the animation. A new key remounts the bars; cleanup reverts the old
  // wipe so two never stack.
  useEffect(() => {
    if (!wipe || !barsRef.current) return
    const bars = barsRef.current.querySelectorAll("[data-bar]")
    const letters = labelRef.current?.querySelectorAll("[data-letter]") ?? []
    const key = wipe.key
    const anims = [
      animate(bars, {
        top: ["0%", "100%"],
        duration: BAR_MS,
        ease: "inOutQuad",
        delay: stagger(BAR_STAGGER_MS, { reversed: true }),
        onComplete: () => setWipe((w) => (w?.key === key ? null : w)),
      }),
      animate(letters, {
        opacity: [0, 1],
        translateY: ["0.5em", 0],
        duration: 220,
        ease: "outExpo",
        delay: stagger(22),
      }),
    ]
    if (labelRef.current) {
      anims.push(
        animate(labelRef.current, {
          opacity: [1, 0],
          duration: 170,
          delay: 190,
          ease: "inQuad",
        })
      )
    }
    return () => anims.forEach((a) => a.revert())
  }, [wipe])

  if (reduced || !wipe) return null

  return (
    <div
      key={wipe.key}
      data-stair-transition=""
      aria-hidden="true"
      className="fixed inset-0 z-40 flex pointer-events-none"
    >
      <div ref={barsRef} className="absolute inset-0 flex">
        {Array.from({ length: BARS }, (_, i) => (
          <div
            key={i}
            data-bar=""
            className="relative h-full flex-1 bg-bg"
            style={{ top: 0, marginRight: i < BARS - 1 ? -1 : 0 }}
          >
            <div className="absolute inset-0 bg-surface" />
            <div
              className="absolute inset-x-0 top-0 h-[2px] bg-accent"
              style={{ boxShadow: "0 0 14px 2px rgb(var(--accent) / 0.6)" }}
            />
          </div>
        ))}
      </div>
      <div
        ref={labelRef}
        className="absolute inset-0 flex items-center justify-center font-primary text-4xl xl:text-6xl font-semibold tracking-wide text-text"
      >
        {Array.from(wipe.label).map((ch, i) => (
          <span
            key={i}
            data-letter=""
            className="inline-block"
            style={{ opacity: 0 }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  )
}
