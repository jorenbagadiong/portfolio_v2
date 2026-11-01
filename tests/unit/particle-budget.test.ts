import { expect, test } from "vitest"
import { nextFrameDelay, SMALL_FRAME_MS } from "@/components/three/budget"

test("full-size devices are not throttled", () => {
  expect(nextFrameDelay(false, 4)).toBe(0)
})

test("small devices wait out the rest of a ~30fps frame", () => {
  expect(SMALL_FRAME_MS).toBeCloseTo(1000 / 30)
  expect(nextFrameDelay(true, 5)).toBeCloseTo(SMALL_FRAME_MS - 5)
})

test("small devices never wait a negative time", () => {
  expect(nextFrameDelay(true, 80)).toBe(0)
})
