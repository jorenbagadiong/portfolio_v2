import { expect, test, vi } from "vitest"
import { particles } from "@/lib/particle-store"

test("pulse notifies subscribers and unsubscribe stops it", () => {
  const fn = vi.fn()
  const off = particles.subscribe(fn)
  particles.pulse("burst")
  expect(fn).toHaveBeenCalledWith("burst")
  off()
  particles.pulse("burst")
  expect(fn).toHaveBeenCalledTimes(1)
})
