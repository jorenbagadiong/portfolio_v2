import { expect, test } from "vitest"
import { nearestPoints } from "@/components/three/cursor"

const pos = new Float32Array([3, 0, 0, 1, 0, 0, 2, 0, 0, 0.5, 0, 0, 9, 0, 0])

test("returns at most k, nearest first, within radius", () => {
  const idx = new Int16Array(4)
  const n = nearestPoints(pos, 5, 0, 0, 2.5, 3, idx)
  expect(n).toBe(3)
  expect(Array.from(idx.slice(0, n))).toEqual([3, 1, 2])
})

test("excludes points beyond the radius", () => {
  const idx = new Int16Array(4)
  const n = nearestPoints(pos, 5, 0, 0, 0.8, 4, idx)
  expect(n).toBe(1)
  expect(idx[0]).toBe(3)
})
