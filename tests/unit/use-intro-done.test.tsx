import { afterEach, expect, test } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useIntroDone } from "@/lib/hooks/useIntroDone"

afterEach(() => document.documentElement.classList.remove("intro"))

test("true immediately when html.intro is absent", () => {
  const { result } = renderHook(() => useIntroDone())
  expect(result.current).toBe(true)
})

test("false while html.intro is set, true after intro:end", () => {
  document.documentElement.classList.add("intro")
  const { result } = renderHook(() => useIntroDone())
  expect(result.current).toBe(false)
  act(() => {
    document.documentElement.classList.remove("intro")
    window.dispatchEvent(new Event("intro:end"))
  })
  expect(result.current).toBe(true)
})
