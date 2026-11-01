import { expect, test } from "vitest"
import { blendPositions, createMorphController } from "@/components/three/morph"

const A = new Float32Array([0, 0, 0, 1, 1, 1])
const B = new Float32Array([10, 20, 30, 5, 5, 5])
const C = new Float32Array([-4, -4, -4, 9, 8, 7])

test("update returns target after 1200ms", () => {
  const c = createMorphController(A)
  c.start(B, 0)
  expect(c.isMorphing(600)).toBe(true)
  expect(Array.from(c.update(1200))).toEqual(Array.from(B))
  expect(c.isMorphing(1200)).toBe(false)
})

test("starts new morph from displayed positions", () => {
  const c = createMorphController(A)
  c.start(B, 0)
  const expected = blendPositions(A, B, 600 / 1200, new Float32Array(6))
  c.start(C, 600)
  const at600 = c.update(600)
  expect(Array.from(at600)).toEqual(Array.from(expected))
  expect(Array.from(at600)).not.toEqual(Array.from(A))
  expect(Array.from(at600)).not.toEqual(Array.from(B))
  expect(Array.from(c.update(1800))).toEqual(Array.from(C))
})
