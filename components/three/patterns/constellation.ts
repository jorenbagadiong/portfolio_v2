import type { PatternFn } from "./types"

const CANDIDATES = 14

function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Evenly spread points in [-1, 1]^3 using best-candidate (Mitchell) sampling:
 * each new point is the random candidate farthest from every placed point in
 * xy, which avoids clumps and keeps the spacing close to uniform.
 */
export const constellation: PatternFn = (count, seed) => {
  const out = new Float32Array(count * 3)
  const rand = rng(seed)
  for (let i = 0; i < count; i++) {
    let bx = 0
    let by = 0
    let best = -1
    for (let c = 0; c < CANDIDATES; c++) {
      const x = rand() * 2 - 1
      const y = rand() * 2 - 1
      let nearest = Infinity
      for (let j = 0; j < i; j++) {
        const dx = x - out[j * 3]
        const dy = y - out[j * 3 + 1]
        const d = dx * dx + dy * dy
        if (d < nearest) nearest = d
      }
      if (nearest > best) {
        best = nearest
        bx = x
        by = y
      }
    }
    out[i * 3] = bx
    out[i * 3 + 1] = by
    out[i * 3 + 2] = rand() * 2 - 1
  }
  return out
}
