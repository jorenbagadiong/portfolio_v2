import { expect, test } from "vitest"
import { blendPositions, easeInOutCubic } from "@/components/three/morph"

test("t=0 gives from, t=1 gives to, t clamps", () => {
  const f = new Float32Array([0, 0, 0])
  const to = new Float32Array([2, 4, 6])
  const out = new Float32Array(3)
  expect(Array.from(blendPositions(f, to, 0, out))).toEqual([0, 0, 0])
  expect(Array.from(blendPositions(f, to, 1, out))).toEqual([2, 4, 6])
  expect(Array.from(blendPositions(f, to, 2, out))).toEqual([2, 4, 6])
  expect(Array.from(blendPositions(f, to, 0.5, out))).toEqual([1, 2, 3])
})

test("easing is monotonic", () => {
  let p = -1
  for (let t = 0; t <= 1; t += 0.05) {
    const v = easeInOutCubic(t)
    expect(v).toBeGreaterThanOrEqual(p)
    p = v
  }
})
