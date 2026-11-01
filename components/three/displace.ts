export type DisplaceState = {
  time: number
  pointer: { x: number; y: number } | null
  /** Seconds since the burst pulse; null when no burst is running. */
  burstAge: number | null
  scale: { x: number; y: number; z: number }
  /** Burst amplitude multiplier (1 = burst, RIPPLE_GAIN = ripple). */
  burstGain?: number
}

export const DRIFT_AMPLITUDE = 0.12
export const PULL_RADIUS = 2.5
export const PULL_MAX = 0.35
export const BURST_DURATION = 1.2
const BURST_SPEED = 9
const BURST_WIDTH = 2.2
const BURST_PUSH = 0.9
export const RIPPLE_GAIN = 0.4

// Each axis contributes at most DRIFT_AXIS, so the vector is <= DRIFT_AMPLITUDE.
const DRIFT_AXIS = DRIFT_AMPLITUDE / Math.sqrt(3)

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

/**
 * Writes displayed positions into `out` from normalized `base` positions:
 * base * scale, plus drift, cursor pull and the burst ripple. Pure and
 * allocation-free so it can run every frame.
 */
export function displace(
  base: Float32Array,
  out: Float32Array,
  count: number,
  s: DisplaceState
): void {
  const { time, pointer, burstAge, scale, burstGain = 1 } = s
  const burstOn =
    burstAge !== null && burstAge >= 0 && burstAge < BURST_DURATION
  const ring = burstOn ? burstAge * BURST_SPEED : 0
  const push = burstOn
    ? BURST_PUSH * burstGain * (1 - burstAge / BURST_DURATION)
    : 0

  for (let i = 0; i < count; i++) {
    const k = i * 3
    let x = base[k] * scale.x
    let y = base[k + 1] * scale.y
    let z = base[k + 2] * scale.z

    x += Math.sin(time * 0.31 + i * 1.7) * DRIFT_AXIS
    y += Math.cos(time * 0.27 + i * 2.3) * DRIFT_AXIS
    z += Math.sin(time * 0.19 + i * 3.1) * DRIFT_AXIS

    if (pointer) {
      const dx = pointer.x - x
      const dy = pointer.y - y
      const d = Math.hypot(dx, dy)
      if (d < PULL_RADIUS && d > 1e-6) {
        const f = (1 - smoothstep(0, PULL_RADIUS, d)) * PULL_MAX
        x += (dx / d) * f
        y += (dy / d) * f
      }
    }

    if (burstOn) {
      const d = Math.hypot(x, y)
      if (d > 1e-6) {
        const w = (d - ring) / BURST_WIDTH
        const f = push * Math.exp(-w * w)
        x += (x / d) * f
        y += (y / d) * f
      }
    }

    out[k] = x
    out[k + 1] = y
    out[k + 2] = z
  }
}
