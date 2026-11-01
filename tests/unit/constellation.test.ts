import { expect, test } from "vitest"
import { constellation } from "@/components/three/patterns/constellation"

test("length, bounds and empty case", () => {
  const a = constellation(260, 1)
  expect(a.length).toBe(780)
  a.forEach((v) => expect(Math.abs(v)).toBeLessThanOrEqual(1))
  expect(constellation(0, 1).length).toBe(0)
})

test("deterministic per seed, differs between seeds", () => {
  expect(constellation(260, 7)).toEqual(constellation(260, 7))
  expect(constellation(260, 1)).not.toEqual(constellation(260, 2))
})

test("evenly spread over a 4x4 grid", () => {
  const a = constellation(260, 1)
  const cells = new Array(16).fill(0)
  for (let i = 0; i < a.length; i += 3) {
    const cx = Math.min(3, Math.floor(((a[i] + 1) / 2) * 4))
    const cy = Math.min(3, Math.floor(((a[i + 1] + 1) / 2) * 4))
    cells[cy * 4 + cx]++
  }
  cells.forEach((n) => expect(n).toBeGreaterThanOrEqual(8))
})

test("no two points nearly coincide in xy", () => {
  const a = constellation(260, 1)
  let min = Infinity
  for (let i = 0; i < 260; i++)
    for (let j = i + 1; j < 260; j++)
      min = Math.min(
        min,
        Math.hypot(a[i * 3] - a[j * 3], a[i * 3 + 1] - a[j * 3 + 1])
      )
  expect(min).toBeGreaterThan(0.03)
})
