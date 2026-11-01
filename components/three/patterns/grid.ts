import { mulberry32 } from "@/lib/random"
import { clamp, type PatternFn } from "./types"

export const grid: PatternFn = (count, seed) => {
  const r = mulberry32(seed)
  const out = new Float32Array(count * 3)
  if (count === 0) return out
  // Columns sized to the 12:8 aspect ratio of the plane.
  const cols = Math.max(1, Math.ceil(Math.sqrt(count * 1.5)))
  const rows = Math.max(1, Math.ceil(count / cols))
  const dx = 12 / cols
  const dy = 8 / rows
  for (let i = 0; i < count; i++) {
    const cx = i % cols
    const cy = Math.floor(i / cols)
    out[i * 3] = clamp(-6 + (cx + 0.5) * dx + (r() - 0.5) * dx * 0.6)
    out[i * 3 + 1] = clamp(-4 + (cy + 0.5) * dy + (r() - 0.5) * dy * 0.6)
    out[i * 3 + 2] = clamp(-1 + (r() - 0.5) * 0.2)
  }
  return out
}
