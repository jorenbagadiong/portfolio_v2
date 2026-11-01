import { expect, test } from "./fixtures"
import type { Locator, Page } from "@playwright/test"

test.use({ colorScheme: "light" })

const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
const lum = ([r, g, b]: number[]) => {
  const f = (v: number) => {
    const x = v / 255
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

async function ratioAgainstBg(page: Page, el: Locator) {
  await expect(el).toBeVisible()
  const fg = await el.evaluate((n) => getComputedStyle(n).color)
  const bg = await page.evaluate(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--bg")
      .trim()
      .replace(/ /g, ",")
    return `rgb(${raw})`
  })
  const [a, b] = [lum(parse(fg)), lum(parse(bg))]
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

test("home: Download CV outline button text meets AA", async ({ page }) => {
  await page.goto("/")
  const btn = page.locator("main a[download]")
  expect(await ratioAgainstBg(page, btn.first())).toBeGreaterThanOrEqual(4.5)
})

test("home: hero name meets AA", async ({ page }) => {
  await page.goto("/")
  const name = page.locator("main h1 > span").first()
  expect(await ratioAgainstBg(page, name)).toBeGreaterThanOrEqual(4.5)
})

test("active nav link meets AA", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "desktop nav")
  await page.goto("/about")
  const link = page.locator("header nav a[aria-current='page']")
  expect(await ratioAgainstBg(page, link)).toBeGreaterThanOrEqual(4.5)
})

test("contact: accent heading span meets AA", async ({ page }) => {
  await page.goto("/contact")
  const span = page.locator("main h1 > span.block")
  expect(await ratioAgainstBg(page, span)).toBeGreaterThanOrEqual(4.5)
})

test("profile: timeline date (small text) meets AA", async ({ page }) => {
  await page.goto("/about")
  const date = page.locator("main span.text-accent-text.text-sm").first()
  expect(await ratioAgainstBg(page, date)).toBeGreaterThanOrEqual(4.5)
})
