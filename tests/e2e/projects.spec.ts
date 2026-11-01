import { expect, test } from "./fixtures"

const card = (page: import("@playwright/test").Page, name: string) =>
  page.getByRole("link", { name: new RegExp(name, "i") })

test("grid lists all four projects", async ({ page }) => {
  await page.goto("/projects")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  for (const name of [
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

test("no stair wipe opening or closing the overlay", async ({ page }) => {
  const wipe = page.locator("[data-stair-transition]")
  await page.goto("/projects")
  await card(page, "Cryptoweb App").click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.waitForTimeout(300)
  await expect(wipe).toHaveCount(0)
  await page.goBack()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.waitForTimeout(300)
  await expect(wipe).toHaveCount(0)
  await page.goForward()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.waitForTimeout(300)
  await expect(wipe).toHaveCount(0)
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
