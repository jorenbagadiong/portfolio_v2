import { mulberry32 } from "@/lib/random"
import { clamp, type PatternFn } from "./types"

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

export const sphere: PatternFn = (count, seed) => {
  const r = mulberry32(seed)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2
    const ring = Math.sqrt(1 - y * y)
    const theta = GOLDEN_ANGLE * i
    const radius = 3.5 + (r() - 0.5) * 0.2
    out[i * 3] = clamp(Math.cos(theta) * ring * radius)
    out[i * 3 + 1] = clamp(y * radius)
    out[i * 3 + 2] = clamp(Math.sin(theta) * ring * radius)
  }
  return out
}
