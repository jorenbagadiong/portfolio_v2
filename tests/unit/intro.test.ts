import { expect, test } from "vitest"
import { INTRO_FLAG, introEndAt, shouldPlayIntro } from "@/lib/intro"

const ok = { jsEnabled: true, reducedMotion: false, webgl: true, played: false }

test("plays only when everything allows it", () => {
  expect(shouldPlayIntro(ok)).toBe(true)
  expect(shouldPlayIntro({ ...ok, jsEnabled: false })).toBe(false)
  expect(shouldPlayIntro({ ...ok, reducedMotion: true })).toBe(false)
  expect(shouldPlayIntro({ ...ok, webgl: false })).toBe(false)
  expect(shouldPlayIntro({ ...ok, played: true })).toBe(false)
})

test("flag name", () => expect(INTRO_FLAG).toBe("intro-played"))

test("introEndAt waits for ready, capped, with a fallback", () => {
  expect(introEndAt(0, null)).toBe(1700)
  expect(introEndAt(100, null)).toBe(1800)
  expect(introEndAt(0, 500)).toBe(2200)
  expect(introEndAt(0, 1500)).toBe(2600)
  expect(introEndAt(0, 5000)).toBe(2600)
})
