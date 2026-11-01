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
  const d2 = (i: number) => {
    const dx = positions[i * 3] - px
    const dy = positions[i * 3 + 1] - py
    return dx * dx + dy * dy
  }
  let n = 0
  for (let i = 0; i < count; i++) {
    const d = d2(i)
    if (d >= r2) continue
    if (n === k && d >= d2(outIdx[n - 1])) continue
    let j = n < k ? n : n - 1
    while (j > 0 && d2(outIdx[j - 1]) > d) {
      outIdx[j] = outIdx[j - 1]
      j--
    }
    outIdx[j] = i
    if (n < k) n++
  }
  return n
}
