import { expect, test } from "vitest"
import { shouldShowHireMe } from "@/lib/nav"

test.each([
  ["/", true],
  ["/profile", true],
  ["/projects", true],
  ["/projects/cryptolist", true],
  ["/contact", false],
])("%s → %s", (p, v) => expect(shouldShowHireMe(p)).toBe(v))
