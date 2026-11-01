export const INTRO_FLAG = "intro-played"

export function shouldPlayIntro(e: {
  jsEnabled: boolean
  reducedMotion: boolean
  webgl: boolean
  played: boolean
}): boolean {
  return e.jsEnabled && !e.reducedMotion && e.webgl && !e.played
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas")
    return !!(c.getContext("webgl2") ?? c.getContext("webgl"))
  } catch {
    return false
  }
}

/** Shared by IntroLoader and the particle field so both run on one clock. */
export const introClock = { t0: 0 }
export const INTRO_SKIP_EVENT = "intro:skip"
export const INTRO_MORPH_MS = 1400
