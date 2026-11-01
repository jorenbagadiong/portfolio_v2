import { expect, test } from "vitest"
import { routeLabel, shouldWipe } from "@/lib/route-label"

test.each([
  ["/", "Home"],
  ["/profile", "Profile"],
  ["/projects", "Projects"],
  ["/projects/cryptolist", "Projects"],
  ["/contact", "Contact"],
  ["/nope", ""],
])("routeLabel(%s) = %s", (path, label) => {
  expect(routeLabel(path)).toBe(label)
})

test.each([
  ["/projects", "/projects/cryptolist", false],
  ["/projects/cryptolist", "/projects", false],
  ["/projects/a", "/projects/b", false],
  ["/", "/projects", true],
  ["/projects", "/contact", true],
  ["/projects/cryptolist", "/profile", true],
  ["/profile", "/projects/cryptolist", true],
  ["/projects", "/projects", false],
])("shouldWipe(%s, %s) = %s", (a, b, expected) => {
  expect(shouldWipe(a, b)).toBe(expected)
})
