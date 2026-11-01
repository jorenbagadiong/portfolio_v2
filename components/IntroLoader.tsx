"use client"

import { useEffect, useState } from "react"

import { AnimatedName } from "@/components/motion/AnimatedName"
import {
  hasWebGL,
  INTRO_FLAG,
  INTRO_MORPH_MS,
  INTRO_SKIP_EVENT,
  introClock,
  shouldPlayIntro,
} from "@/lib/intro"

const HOLD_MS = 300
const FADE_MS = 300

/**
 * Centered "Joren." over the assembling particles. The overlay is always
 * server-rendered but only displayed while `html.intro` is set (see
 * globals.css), so there is no flash. The overlay is transparent so the
 * particles stay visible behind it.
 */
export default function IntroLoader() {
  const [phase, setPhase] = useState<"idle" | "fading" | "done">("idle")

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains("intro")) {
      setPhase("done")
      return
    }

    let ended = false
    const timers: number[] = []
    const events = ["pointerdown", "keydown", "touchstart"] as const

    const end = (skipped: boolean) => {
      if (ended) return
      ended = true
      timers.forEach(window.clearTimeout)
      events.forEach((e) => window.removeEventListener(e, onSkip))
      root.classList.remove("intro")
      try {
        sessionStorage.setItem(INTRO_FLAG, "1")
      } catch {}
      if (skipped) window.dispatchEvent(new Event(INTRO_SKIP_EVENT))
      setPhase(skipped ? "done" : "fading")
      if (!skipped)
        timers.push(window.setTimeout(() => setPhase("done"), FADE_MS))
    }
    const onSkip = () => end(true)

    let played = false
    try {
      played = !!sessionStorage.getItem(INTRO_FLAG)
    } catch {}
    const play = shouldPlayIntro({
      jsEnabled: true,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      webgl: hasWebGL(),
      played,
    })
    if (!play) {
      end(true)
      return
    }

    introClock.t0 = performance.now()
    events.forEach((e) => window.addEventListener(e, onSkip, { passive: true }))
    timers.push(window.setTimeout(() => end(false), INTRO_MORPH_MS + HOLD_MS))
    return () => {
      ended = true
      timers.forEach(window.clearTimeout)
      events.forEach((e) => window.removeEventListener(e, onSkip))
    }
  }, [])

  if (phase === "done") return null

  return (
    <div
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-50 pointer-events-none items-center justify-center"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <AnimatedName
        text="Joren."
        className="text-6xl xl:text-8xl font-semibold text-text"
      />
    </div>
  )
}
