import { expect, test } from "./fixtures"

test("/work redirects to /projects", async ({ page }) => {
  await page.goto("/work")
  await expect(page).toHaveURL(/\/projects$/)
})

test("/profile redirects to /about", async ({ page }) => {
  await page.goto("/profile")
  await expect(page).toHaveURL(/\/about$/)
})

test("each route loads", async ({ page }) => {
  for (const path of ["/", "/about", "/projects", "/contact"]) {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await expect(
      page.locator("main").getByRole("heading").first()
    ).toBeVisible()
  }
})

test("mobile menu closes after tapping a link", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only")
  await page.goto("/")
  await page.getByRole("button", { name: /open menu/i }).click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await dialog.getByRole("link", { name: /^about$/i }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(dialog).toBeHidden()
})
