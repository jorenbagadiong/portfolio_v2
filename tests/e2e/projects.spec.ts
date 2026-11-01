import type { Page } from "@playwright/test"
import { expect, test } from "./fixtures"

const card = (page: Page, name: string) =>
  page.getByRole("link", { name: new RegExp(name, "i") })

test("grid lists all six projects", async ({ page }) => {
  await page.goto("/projects")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  for (const name of [
    "MotionLab",
    "PokeLab",
    "Cryptoweb App",
    "Pet grooming",
    "CryptoList",
    "Portfolio v1",
  ])
    await expect(page.getByRole("heading", { name })).toBeVisible()
})

test("card opens overlay; Esc closes and returns focus", async ({ page }) => {
  await page.goto("/projects")
  const link = card(page, "Cryptoweb App")
  await link.click()
  await expect(page).toHaveURL(/\/projects\/cryptoweb-app$/)
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(card(page, "Cryptoweb App")).toBeFocused()
})

test("back closes, forward reopens", async ({ page }) => {
  await page.goto("/projects")
  await card(page, "Cryptoweb App").click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.goBack()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page).toHaveURL(/\/projects$/)
  await page.goForward()
  await expect(page.getByRole("dialog")).toBeVisible()
})

const watchWipe = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __wipeSeen?: boolean }
    w.__wipeSeen = false
    const hit = (n: Node) =>
      n instanceof Element &&
      (n.matches("[data-stair-transition]") ||
        !!n.querySelector("[data-stair-transition]"))
    new MutationObserver((muts) => {
      if (muts.some((m) => [...m.addedNodes].some(hit))) w.__wipeSeen = true
    }).observe(document.documentElement, { childList: true, subtree: true })
  })
const wipeSeen = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __wipeSeen?: boolean }).__wipeSeen
  )

test("no stair wipe opening or closing the overlay", async ({ page }) => {
  await page.goto("/projects")
  await watchWipe(page)
  await card(page, "Cryptoweb App").click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.goForward()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.goBack()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.goForward()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.waitForTimeout(300)
  expect(await wipeSeen(page)).toBe(false)
})

test("control: wipe detector sees /projects to /contact", async ({
  page,
  isMobile,
}) => {
  await page.goto("/projects")
  await watchWipe(page)
  if (isMobile) await page.getByRole("button", { name: /open menu/i }).click()
  await page
    .getByRole("link", { name: /^contact$/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/contact$/)
  await page.waitForTimeout(300)
  expect(await wipeSeen(page)).toBe(true)
})

test("direct visit renders full page", async ({ page }) => {
  await page.goto("/projects/cryptolist")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page.getByRole("heading", { name: "CryptoList" })).toBeVisible()
  await expect(page.getByRole("link", { name: /github/i })).toHaveAttribute(
    "href",
    /github\.com\/jorenbagadiong\/CryptoList/
  )
})

test("unknown slug 404s", async ({ page }) => {
  const res = await page.goto("/projects/nope")
  expect(res?.status()).toBe(404)
})
