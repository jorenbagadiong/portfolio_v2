export const INTRO_FLAG = "intro-played"

export function shouldPlayIntro(e: {
  jsEnabled: boolean
  reducedMotion: boolean
  webgl: boolean
  played: boolean
}): boolean {
  return e.jsEnabled && !e.reducedMotion && e.webgl && !e.played
}

/** Shared by IntroLoader and the particle field so both run on one clock. */
export const introClock: { ready: number | null } = { ready: null }
export const INTRO_READY_EVENT = "intro:ready"
export const INTRO_SKIP_EVENT = "intro:skip"
/** Fired once when the intro ends (played or skipped); see useIntroDone. */
export const INTRO_END_EVENT = "intro:end"
export const INTRO_MORPH_MS = 1400
export const INTRO_HOLD_MS = 300
export const INTRO_CAP_MS = 2600

/**
 * When the intro should end, in performance.now() time. The morph starts when
 * the canvas is ready; without it the intro ends 1.7s after load. Never later
 * than the cap, so it always finishes before the 3s CSS safety net.
 */
export function introEndAt(loadT: number, readyT: number | null): number {
  if (readyT === null) return loadT + INTRO_MORPH_MS + INTRO_HOLD_MS
  return Math.min(readyT + INTRO_MORPH_MS + INTRO_HOLD_MS, loadT + INTRO_CAP_MS)
}
