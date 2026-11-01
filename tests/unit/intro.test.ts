import { expect, test } from "vitest"
import { INTRO_FLAG, shouldPlayIntro } from "@/lib/intro"

const ok = { jsEnabled: true, reducedMotion: false, webgl: true, played: false }

test("plays only when everything allows it", () => {
  expect(shouldPlayIntro(ok)).toBe(true)
  expect(shouldPlayIntro({ ...ok, jsEnabled: false })).toBe(false)
  expect(shouldPlayIntro({ ...ok, reducedMotion: true })).toBe(false)
  expect(shouldPlayIntro({ ...ok, webgl: false })).toBe(false)
  expect(shouldPlayIntro({ ...ok, played: true })).toBe(false)
})

test("flag name", () => expect(INTRO_FLAG).toBe("intro-played"))
