import { useState } from "react"
import { beforeEach, expect, test, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { CountUp } from "@/components/motion/CountUp"
import { AnimatedName } from "@/components/motion/AnimatedName"
import { Reveal } from "@/components/motion/Reveal"

let reducedMatches = true
let listeners: Array<() => void> = []

beforeEach(() => {
  reducedMatches = true
  listeners = []
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      get matches() {
        return query.includes("reduced-motion") && reducedMatches
      },
      media: query,
      addEventListener: (_: string, fn: () => void) => listeners.push(fn),
      removeEventListener: (_: string, fn: () => void) => {
        listeners = listeners.filter((l) => l !== fn)
      },
    }))
  )
})

function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>count {n}</button>
}

test("CountUp shows final value under reduced motion", () => {
  render(<CountUp to={18} />)
  expect(screen.getByText("18")).toBeInTheDocument()
})

test("AnimatedName exposes full name to screen readers", () => {
  const { container } = render(<AnimatedName text="Joren Bagadiong" />)
  expect(screen.getByText("Joren Bagadiong")).toHaveClass("sr-only")
  expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
})

test("Reveal renders children", () => {
  render(
    <Reveal>
      <p>hi</p>
    </Reveal>
  )
  expect(screen.getByText("hi")).toBeInTheDocument()
})

test("Reveal keeps child state when reduced motion flips", () => {
  reducedMatches = false
  render(
    <Reveal>
      <Counter />
    </Reveal>
  )
  fireEvent.click(screen.getByText("count 0"))
  expect(screen.getByText("count 1")).toBeInTheDocument()
  act(() => {
    reducedMatches = true
    listeners.forEach((l) => l())
  })
  expect(screen.getByText("count 1")).toBeInTheDocument()
})

test("AnimatedName letters start hidden when motion is allowed", () => {
  reducedMatches = false
  const { container } = render(<AnimatedName text="Joren" />)
  expect(container.querySelector('[aria-hidden="true"]')).toHaveClass(
    "motion-hidden-letters"
  )
})
