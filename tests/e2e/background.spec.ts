import { expect, test } from "@playwright/test"

const routes = ["/", "/profile", "/projects", "/contact"]

function collectErrors(page: import("@playwright/test").Page) {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text())
  })
  page.on("pageerror", (err) => errors.push(err.message))
  return errors
}

test("no console errors on any route", async ({ page }) => {
  const errors = collectErrors(page)
  for (const route of routes) {
    await page.goto(route)
    await page.waitForTimeout(500)
  }
  expect(errors).toEqual([])
})

test("canvas mounts and is hidden from a11y", async ({ page }) => {
  await page.goto("/")
  const canvas = page.locator("canvas")
  await expect(canvas).toBeAttached()
  await expect(
    page.locator('[aria-hidden="true"]:has(canvas)').first()
  ).toBeAttached()
})

test("falls back when WebGL is unavailable", async ({ page }) => {
  const errors = collectErrors(page)
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2") return null
      return (orig as (...a: unknown[]) => unknown).call(this, type, ...rest)
    } as typeof orig
  })
  await page.goto("/")
  await expect(page.getByRole("heading").first()).toBeVisible()
  await page.waitForTimeout(500)
  await expect(page.locator("canvas")).toHaveCount(0)
  expect(errors).toEqual([])
})

test("reduced motion renders without errors", async ({ page }) => {
  const errors = collectErrors(page)
  await page.emulateMedia({ reducedMotion: "reduce" })
  for (const route of routes) {
    await page.goto(route)
    await page.waitForTimeout(500)
  }
  expect(errors).toEqual([])
})
