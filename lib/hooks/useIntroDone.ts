"use client"

import { useEffect, useState } from "react"

import { INTRO_END_EVENT } from "@/lib/intro"

/**
 * True once the loading intro is over: immediately when `html.intro` is absent
 * (repeat visit, reduced motion, client navigation), otherwise on `intro:end`.
 * Entrance animations gate on this so they do not play behind the hidden page.
 */
export function useIntroDone(): boolean {
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!document.documentElement.classList.contains("intro")) {
      setDone(true)
      return
    }
    const onEnd = () => setDone(true)
    window.addEventListener(INTRO_END_EVENT, onEnd)
    return () => window.removeEventListener(INTRO_END_EVENT, onEnd)
  }, [])
  return done
}
