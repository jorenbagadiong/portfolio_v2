import { mulberry32 } from "@/lib/random"
import { clamp, type PatternFn } from "./types"

// Sum of three uniforms approximates a gaussian in [-1, 1].
const gauss = (r: () => number) => (r() + r() + r() - 1.5) / 1.5

export const cloud: PatternFn = (count, seed) => {
  const r = mulberry32(seed)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = clamp(1.5 + gauss(r) * 4.5)
    out[i * 3 + 1] = clamp(gauss(r) * 3.5)
    out[i * 3 + 2] = clamp(gauss(r) * 3)
  }
  return out
}
