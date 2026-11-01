import { expect, test } from "./fixtures"
import type { Page } from "@playwright/test"

const wipe = (page: Page) => page.locator("[data-stair-transition]")

async function go(page: Page, isMobile: boolean | undefined, name: string) {
  if (isMobile) {
    // The sheet closes after each navigation, so open it before each click.
    await expect(page.getByRole("dialog")).toHaveCount(0)
    await page.getByRole("button", { name: /open menu/i }).click()
  }
  await page
    .getByRole("link", { name: new RegExp(`^${name}$`, "i") })
    .first()
    .click()
}

test("no wipe on first load", async ({ page }) => {
  await page.goto("/")
  await page.waitForTimeout(300)
  await expect(wipe(page)).toHaveCount(0)
  await page.goto("/about")
  await page.waitForTimeout(300)
  await expect(wipe(page)).toHaveCount(0)
})

test("wipe plays on navigation", async ({ page, isMobile }) => {
  await page.goto("/")
  await go(page, isMobile, "About")
  await expect(wipe(page)).toBeAttached()
  await expect(wipe(page)).toContainText("About")
  await expect(wipe(page)).toBeHidden({ timeout: 1200 })
  await expect(wipe(page)).toHaveCount(0)
})

test("reduced motion: no wipe", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await go(page, isMobile, "About")
  await expect(page).toHaveURL(/\/about$/)
  await page.waitForTimeout(300)
  await expect(wipe(page)).toHaveCount(0)
})

test("clicks not blocked", async ({ page, isMobile }) => {
  await page.goto("/")
  await go(page, isMobile, "About")
  await expect(wipe(page)).toBeAttached()
  await go(page, isMobile, "Projects")
  await expect(page).toHaveURL(/\/projects$/)
})

test("rapid navigation restarts a single wipe", async ({ page, isMobile }) => {
  await page.goto("/")
  await go(page, isMobile, "About")
  await expect(wipe(page)).toContainText("About")
  await go(page, isMobile, "Contact")
  await expect(page).toHaveURL(/\/contact$/)
  await expect(wipe(page)).toContainText("Contact")
  await expect(wipe(page)).toHaveCount(1)
  await expect(wipe(page)).toHaveCount(0, { timeout: 1500 })
})
