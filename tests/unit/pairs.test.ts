import { expect, test } from "vitest"
import { computePairs } from "@/components/three/pairs"

const bufs = () => ({
  out: new Uint16Array(150 * 3 * 2),
  counts: new Uint8Array(150),
})

test("points farther apart than maxDist give 0 pairs", () => {
  const pos = new Float32Array([0, 0, 0, 5, 0, 0, 10, 0, 0])
  const { out, counts } = bufs()
  expect(computePairs(pos, 3, 1.6, 3, out, counts)).toBe(0)
})

test("cluster gives expected pairs, capped at maxPerPoint", () => {
  // 5 points all within 1.6 of each other
  const pos = new Float32Array(15)
  for (let i = 0; i < 5; i++) pos[i * 3] = i * 0.1
  const { out, counts } = bufs()
  const n = computePairs(pos, 5, 1.6, 2, out, counts)
  const deg = new Array(5).fill(0)
  for (let k = 0; k < n * 2; k++) deg[out[k]]++
  expect(n).toBeGreaterThan(0)
  expect(Math.max(...deg)).toBeLessThanOrEqual(2)
  expect(out[0]).toBe(0)
  expect(out[1]).toBe(1)
})

test("repeated calls reuse the same buffers", () => {
  const pos = new Float32Array([0, 0, 0, 1, 0, 0])
  const { out, counts } = bufs()
  const a = computePairs(pos, 2, 1.6, 3, out, counts)
  const b = computePairs(pos, 2, 1.6, 3, out, counts)
  expect(a).toBe(1)
  expect(b).toBe(1)
  expect(counts[0]).toBe(1)
})
