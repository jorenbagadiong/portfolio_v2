import { mulberry32 } from "@/lib/random"
import { clamp, type PatternFn } from "./types"

export const column: PatternFn = (count, seed) => {
  const r = mulberry32(seed)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = clamp(-4 + (r() * 2 - 1) * 0.8)
    out[i * 3 + 1] = clamp((r() * 2 - 1) * 6)
    out[i * 3 + 2] = clamp((r() * 2 - 1) * 0.8)
  }
  return out
}
