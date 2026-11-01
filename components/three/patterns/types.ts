export type PatternName = "cloud" | "column" | "grid" | "sphere"
export type PatternFn = (count: number, seed: number) => Float32Array

export const LIMIT = 6
export const clamp = (v: number, lim = LIMIT) =>
  Math.max(-lim, Math.min(lim, v))
