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
