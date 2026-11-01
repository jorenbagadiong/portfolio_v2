function dist2(positions: Float32Array, i: number, px: number, py: number) {
  const dx = positions[i * 3] - px
  const dy = positions[i * 3 + 1] - py
  return dx * dx + dy * dy
}

/**
 * Writes up to `k` indices of points within `radius` (xy) of (px, py) into
 * `outIdx`, nearest first. Returns how many were written. Allocation-free.
 */
export function nearestPoints(
  positions: Float32Array,
  count: number,
  px: number,
  py: number,
  radius: number,
  k: number,
  outIdx: Int16Array
): number {
  const r2 = radius * radius
  let n = 0
  for (let i = 0; i < count; i++) {
    const d = dist2(positions, i, px, py)
    if (d >= r2) continue
    if (n === k && d >= dist2(positions, outIdx[n - 1], px, py)) continue
    let j = n < k ? n : n - 1
    while (j > 0 && dist2(positions, outIdx[j - 1], px, py) > d) {
      outIdx[j] = outIdx[j - 1]
      j--
    }
    outIdx[j] = i
    if (n < k) n++
  }
  return n
}
