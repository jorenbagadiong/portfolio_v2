import { expect, test } from "vitest"
import { patternForPath, patterns } from "@/components/three/patterns"

const names = ["cloud", "column", "grid", "sphere"] as const

test.each(names)("%s returns count*3 finite values within bounds", (n) => {
  const a = patterns[n](1500, 1)
  expect(a.length).toBe(4500)
  a.forEach((v) => {
    expect(Number.isFinite(v)).toBe(true)
    expect(Math.abs(v)).toBeLessThanOrEqual(6)
  })
})

test.each(names)("%s is deterministic per seed", (n) => {
  expect(patterns[n](50, 7)).toEqual(patterns[n](50, 7))
})

test.each([
  ["/", "cloud"],
  ["/profile", "column"],
  ["/projects", "grid"],
  ["/projects/cryptolist", "grid"],
  ["/contact", "sphere"],
  ["/whatever", "cloud"],
])("patternForPath(%s) = %s", (p, n) => expect(patternForPath(p)).toBe(n))

test("works for count 0 and 1", () => {
  expect(patterns.sphere(0, 1).length).toBe(0)
  expect(patterns.grid(1, 1).length).toBe(3)
})

const pts = (n: (typeof names)[number]) => {
  const a = patterns[n](1500, 1)
  const xs: number[] = [],
    ys: number[] = [],
    zs: number[] = []
  for (let i = 0; i < a.length; i += 3) {
    xs.push(a[i])
    ys.push(a[i + 1])
    zs.push(a[i + 2])
  }
  return { xs, ys, zs }
}
const mean = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length
const std = (v: number[]) => {
  const m = mean(v)
  return Math.sqrt(mean(v.map((x) => (x - m) ** 2)))
}

test("column is a thin vertical band on the left", () => {
  const { xs, ys } = pts("column")
  xs.forEach((x) => {
    expect(x).toBeGreaterThanOrEqual(-4.8)
    expect(x).toBeLessThanOrEqual(-3.2)
  })
  expect(Math.min(...ys)).toBeLessThanOrEqual(-5.5)
  expect(Math.max(...ys)).toBeGreaterThanOrEqual(5.5)
})

test("grid is a flat plane at z = -1 spanning the area", () => {
  const { xs, ys, zs } = pts("grid")
  zs.forEach((z) => expect(Math.abs(z + 1)).toBeLessThanOrEqual(0.1))
  expect(Math.min(...xs)).toBeLessThanOrEqual(-5.5)
  expect(Math.max(...xs)).toBeGreaterThanOrEqual(5.5)
  expect(Math.min(...ys)).toBeLessThanOrEqual(-3.5)
  expect(Math.max(...ys)).toBeGreaterThanOrEqual(3.5)
})

test("sphere points lie on a radius 3.5 shell", () => {
  const { xs, ys, zs } = pts("sphere")
  xs.forEach((x, i) => {
    const r = Math.hypot(x, ys[i], zs[i])
    expect(r).toBeGreaterThanOrEqual(3.4)
    expect(r).toBeLessThanOrEqual(3.6)
  })
})

test("cloud is a blob offset to the right", () => {
  const { xs, ys, zs } = pts("cloud")
  expect(mean(xs)).toBeGreaterThan(1.0)
  expect(mean(xs)).toBeLessThan(2.0)
  expect(Math.abs(mean(ys))).toBeLessThanOrEqual(0.5)
  expect(Math.abs(mean(zs))).toBeLessThanOrEqual(0.5)
  expect(std(xs)).toBeGreaterThan(1)
})

test.each(names)("%s differs between seeds", (n) => {
  expect(patterns[n](50, 1)).not.toEqual(patterns[n](50, 2))
})
