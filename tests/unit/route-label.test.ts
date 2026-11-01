import { expect, test } from "vitest"
import { routeLabel } from "@/lib/route-label"

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
