import { expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import PageTransition from "@/components/PageTransition"

vi.mock("next/navigation", () => ({ usePathname: () => "/" }))

vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
)

test("PageTransition first render has no inline opacity 0", () => {
  const { getByText } = render(
    <PageTransition>
      <p>page</p>
    </PageTransition>
  )
  const wrapper = getByText("page").parentElement as HTMLElement
  expect(wrapper.style.opacity).not.toBe("0")
})

test("PageTransition server markup has no inline opacity 0", () => {
  const html = renderToString(
    <PageTransition>
      <p>page</p>
    </PageTransition>
  )
  expect(html).not.toContain("opacity:0")
})
