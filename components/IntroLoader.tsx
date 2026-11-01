"use client"

import { useEffect, useState } from "react"
import { flushSync } from "react-dom"

import { AnimatedName } from "@/components/motion/AnimatedName"
import {
  INTRO_END_EVENT,
  INTRO_FLAG,
  INTRO_SKIP_EVENT,
  INTRO_READY_EVENT,
  introClock,
  introEndAt,
  shouldPlayIntro,
} from "@/lib/intro"
import { hasWebGL } from "@/lib/webgl"

const FADE_MS = 300

/**
 * The pointerdown/touchstart that skips the intro is followed by a click. Keep
 * the page non-interactive until that click has passed so it cannot land on
 * content that just became visible. Falls back to a timer (keyboard skips and
 * cancelled gestures never produce a click).
 */
function lockPointer(root: HTMLElement) {
  root.classList.add("intro-lock")
  let t = 0
  const release = () => {
    window.clearTimeout(t)
    window.removeEventListener("click", onClick, true)
    window.removeEventListener("pointercancel", release, true)
    root.classList.remove("intro-lock")
  }
  const onClick = () => {
    window.setTimeout(release, 0)
  }
  window.addEventListener("click", onClick, true)
  window.addEventListener("pointercancel", release, true)
  t = window.setTimeout(release, 1500)
}

/**
 * Centered full name over the assembling particles. The overlay is always
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
      // Commit the fading phase before dropping html.intro so the overlay
      // never has a frame where neither selector displays it.
      if (!skipped) flushSync(() => setPhase("fading"))
      root.classList.remove("intro")
      if (skipped) lockPointer(root)
      try {
        sessionStorage.setItem(INTRO_FLAG, "1")
      } catch {}
      if (skipped) window.dispatchEvent(new Event(INTRO_SKIP_EVENT))
      window.dispatchEvent(new Event(INTRO_END_EVENT))
      if (skipped) setPhase("done")
      else timers.push(window.setTimeout(() => setPhase("done"), FADE_MS))
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

    // Page load is performance.now() = 0. The end follows the canvas ready
    // time when it arrives, otherwise a fixed fallback from load.
    let endTimer = 0
    const schedule = () => {
      window.clearTimeout(endTimer)
      const delay = introEndAt(0, introClock.ready) - performance.now()
      endTimer = window.setTimeout(() => end(false), Math.max(0, delay))
      timers.push(endTimer)
    }
    const onReady = () => schedule()
    window.addEventListener(INTRO_READY_EVENT, onReady)
    events.forEach((e) => window.addEventListener(e, onSkip, { passive: true }))
    schedule()
    return () => {
      window.removeEventListener(INTRO_READY_EVENT, onReady)
      ended = true
      timers.forEach(window.clearTimeout)
      events.forEach((e) => window.removeEventListener(e, onSkip))
    }
  }, [])

  if (phase === "done") return null

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="intro-overlay fixed inset-0 z-50 pointer-events-none items-center justify-center"
      style={{
        opacity: phase === "fading" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <AnimatedName
        text="Joren D. Bagadiong"
        decorative
        className="whitespace-nowrap text-[clamp(1.5rem,8vw,6rem)] font-semibold text-text"
      />
    </div>
  )
}
