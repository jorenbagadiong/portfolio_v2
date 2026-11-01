import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type ChangeListener = (event: { matches: boolean }) => void

let matches = false
let listeners: ChangeListener[] = []

function stubMatchMedia() {
  listeners = []
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return matches
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, fn: ChangeListener) => {
        listeners.push(fn)
      },
      removeEventListener: (_type: string, fn: ChangeListener) => {
        listeners = listeners.filter((l) => l !== fn)
      },
      addListener: (fn: ChangeListener) => listeners.push(fn),
      removeListener: (fn: ChangeListener) => {
        listeners = listeners.filter((l) => l !== fn)
      },
      dispatchEvent: () => true,
    }))
  )
}

function dispatchChange(next: boolean) {
  matches = next
  listeners.forEach((fn) => fn({ matches: next }))
}

beforeEach(() => {
  stubMatchMedia()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test("returns true when reduced motion is preferred", () => {
  matches = true
  const { result } = renderHook(usePrefersReducedMotion)
  expect(result.current).toBe(true)
})

test("returns false when reduced motion is not preferred", () => {
  matches = false
  const { result } = renderHook(usePrefersReducedMotion)
  expect(result.current).toBe(false)
})

test("updates when the media query changes", () => {
  matches = true
  const { result } = renderHook(usePrefersReducedMotion)
  expect(result.current).toBe(true)
  act(() => dispatchChange(false))
  expect(result.current).toBe(false)
})
