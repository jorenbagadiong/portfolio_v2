export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function blendPositions(
  from: Float32Array,
  to: Float32Array,
  t: number,
  out: Float32Array
): Float32Array {
  const k = easeInOutCubic(Math.min(1, Math.max(0, t)))
  for (let i = 0; i < out.length; i++) out[i] = from[i] + (to[i] - from[i]) * k
  return out
}

export const MORPH_DURATION_MS = 1200

export type MorphController = {
  start(to: Float32Array, now: number): void
  update(now: number): Float32Array
  isMorphing(now: number): boolean
}

export function createMorphController(
  initial: Float32Array,
  durationMs: number = MORPH_DURATION_MS
): MorphController {
  let from = new Float32Array(initial)
  let to = new Float32Array(initial)
  let startedAt = -Infinity
  const out = new Float32Array(initial)

  const progress = (now: number) =>
    Math.min(1, Math.max(0, (now - startedAt) / durationMs))

  return {
    start(target, now) {
      // New morph begins from whatever is currently displayed.
      from = new Float32Array(blendPositions(from, to, progress(now), out))
      to = new Float32Array(target)
      startedAt = now
    },
    update(now) {
      return blendPositions(from, to, progress(now), out)
    },
    isMorphing(now) {
      return progress(now) < 1
    },
  }
}
