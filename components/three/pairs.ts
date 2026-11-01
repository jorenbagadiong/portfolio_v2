/**
 * Finds neighbor pairs among the first `subsetCount` points, writing index
 * pairs into `outPairs` (caller-owned, sized subsetCount * maxPerPoint * 2)
 * and using `counts` (length >= subsetCount) as scratch. Returns pair count.
 * Allocation-free.
 */
export function computePairs(
  positions: Float32Array,
  subsetCount: number,
  maxDist: number,
  maxPerPoint: number,
  outPairs: Uint16Array,
  counts: Uint8Array
): number {
  const n = subsetCount
  const max2 = maxDist * maxDist
  counts.fill(0, 0, n)
  let pairs = 0
  for (let i = 0; i < n; i++) {
    if (counts[i] >= maxPerPoint) continue
    for (let j = i + 1; j < n; j++) {
      if (counts[j] >= maxPerPoint) continue
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      if (dx * dx + dy * dy + dz * dz < max2) {
        outPairs[pairs * 2] = i
        outPairs[pairs * 2 + 1] = j
        pairs++
        counts[i]++
        counts[j]++
        if (counts[i] >= maxPerPoint) break
      }
    }
  }
  return pairs
}
