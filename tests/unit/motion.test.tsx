import { beforeEach, expect, test, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CountUp } from "@/components/motion/CountUp"
import { AnimatedName } from "@/components/motion/AnimatedName"
import { Reveal } from "@/components/motion/Reveal"

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("reduced-motion"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
  )
})

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
