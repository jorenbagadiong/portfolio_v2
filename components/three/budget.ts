/** Small-device budget: the same condition that picks the 140-particle count. */
export const SMALL_FRAME_MS = 1000 / 30

export function isSmallDevice(): boolean {
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    (navigator.hardwareConcurrency ?? 8) <= 4
  )
}

/** How long to wait before requesting the next frame (0 = immediately). */
export function nextFrameDelay(small: boolean, elapsedMs: number): number {
  return small ? Math.max(0, SMALL_FRAME_MS - elapsedMs) : 0
}
