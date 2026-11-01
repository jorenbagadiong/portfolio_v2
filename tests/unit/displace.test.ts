import { expect, test } from "vitest"
import { displace, RIPPLE_GAIN } from "@/components/three/displace"

const scale = { x: 7, y: 4, z: 1.5 }
const base = new Float32Array([0.1, 0.2, 0.3, -0.5, 0.4, -0.2, 0.35, 0, 0])
const state = (over = {}) => ({
  time: 0,
  pointer: null,
  burstAge: null,
  scale,
  ...over,
})
const run = (s: ReturnType<typeof state>) => {
  const out = new Float32Array(base.length)
  displace(base, out, 3, s as never)
  return out
}
const offset = (out: Float32Array, i: number) =>
  Math.hypot(
    out[i * 3] - base[i * 3] * scale.x,
    out[i * 3 + 1] - base[i * 3 + 1] * scale.y,
    out[i * 3 + 2] - base[i * 3 + 2] * scale.z
  )

test("drift only stays within 0.12", () => {
  for (const time of [0, 3.3, 17]) {
    const out = run(state({ time }))
    for (let i = 0; i < 3; i++) expect(offset(out, i)).toBeLessThanOrEqual(0.12)
  }
})

test("near point leans toward pointer, far point only drifts", () => {
  const px = base[0] * scale.x + 1
  const py = base[1] * scale.y
  const out = run(state({ pointer: { x: px, y: py } }))
  const before = Math.hypot(base[0] * scale.x - px, base[1] * scale.y - py)
  const after = Math.hypot(out[0] - px, out[1] - py)
  expect(after).toBeLessThan(before - 0.1)
  const far = run(state({ pointer: { x: px + 20, y: py } }))
  expect(offset(far, 0)).toBeLessThanOrEqual(0.12)
})

test("burst pushes outward then settles", () => {
  const dist = (o: Float32Array, i: number) =>
    Math.hypot(o[i * 3], o[i * 3 + 1])
  const quiet = run(state())
  const mid = run(state({ burstAge: 0.3 }))
  expect(dist(mid, 2)).toBeGreaterThan(dist(quiet, 2) + 0.05)
  const late = run(state({ burstAge: 1.5 }))
  for (let i = 0; i < 3; i++) expect(offset(late, i)).toBeLessThanOrEqual(0.12)
})

test("writes into the provided buffer", () => {
  const out = new Float32Array(base.length)
  displace(base, out, 3, state() as never)
  expect(out[0]).not.toBe(0)
})

test("ripple is gentler than burst and settles", () => {
  const dist = (o: Float32Array, i: number) =>
    Math.hypot(o[i * 3], o[i * 3 + 1])
  const quiet = run(state())
  const burst = run(state({ burstAge: 0.3 }))
  const ripple = run(state({ burstAge: 0.3, burstGain: RIPPLE_GAIN }))
  const gain = (o: Float32Array) => dist(o, 2) - dist(quiet, 2)
  expect(gain(ripple)).toBeGreaterThan(0)
  expect(gain(ripple)).toBeLessThan(gain(burst))
  const late = run(state({ burstAge: 1.5, burstGain: RIPPLE_GAIN }))
  for (let i = 0; i < 3; i++) expect(offset(late, i)).toBeLessThanOrEqual(0.12)
})
