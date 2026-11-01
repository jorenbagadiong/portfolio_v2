/**
 * Connects each of the first `subsetCount` points to its nearest neighbours
 * (up to `maxPerPoint` links per point, closer than `maxDist`).
 * Index pairs go into `outPairs` (sized >= subsetCount * maxPerPoint * 2),
 * pair distances into `outDist` (>= subsetCount * maxPerPoint), and `counts`
 * (length >= subsetCount) is scratch. Returns the pair count. Allocation-free.
 */
export function computePairs(
  positions: Float32Array,
  subsetCount: number,
  maxDist: number,
  maxPerPoint: number,
  outPairs: Uint16Array,
  counts: Uint8Array,
  outDist: Float32Array
): number {
  const n = subsetCount
  const max2 = maxDist * maxDist
  counts.fill(0, 0, n)
  let pairs = 0
  for (let i = 0; i < n; i++) {
    const ix = positions[i * 3]
    const iy = positions[i * 3 + 1]
    const iz = positions[i * 3 + 2]
    let lastD = -1
    let lastJ = -1
    while (counts[i] < maxPerPoint) {
      // Next-nearest j > i after the previous pick (by distance, then index).
      let bestD = Infinity
      let bestJ = -1
      for (let j = i + 1; j < n; j++) {
        if (counts[j] >= maxPerPoint) continue
        const dx = ix - positions[j * 3]
        const dy = iy - positions[j * 3 + 1]
        const dz = iz - positions[j * 3 + 2]
        const d = dx * dx + dy * dy + dz * dz
        if (d >= max2 || d > bestD) continue
        if (d < lastD || (d === lastD && j <= lastJ)) continue
        if (d < bestD || j < bestJ) {
          bestD = d
          bestJ = j
        }
      }
      if (bestJ < 0) break
      outPairs[pairs * 2] = i
      outPairs[pairs * 2 + 1] = bestJ
      outDist[pairs] = Math.sqrt(bestD)
      pairs++
      counts[i]++
      counts[bestJ]++
      lastD = bestD
      lastJ = bestJ
    }
  }
  return pairs
}
