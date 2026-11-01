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
