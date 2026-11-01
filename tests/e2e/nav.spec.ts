import { expect, test } from "./fixtures"

test("/work redirects to /projects", async ({ page }) => {
  await page.goto("/work")
  await expect(page).toHaveURL(/\/projects$/)
})

test("hire me visible except on contact", async ({ page, isMobile }) => {
  const hireMe = page.getByRole("link", { name: /hire me/i })
  const open = async () => {
    if (isMobile) {
      await page.getByRole("button", { name: /open menu/i }).click()
    }
  }
  for (const path of ["/", "/profile", "/projects"]) {
    await page.goto(path)
    await open()
    await expect(hireMe).toBeVisible()
  }
  await page.goto("/contact")
  await open()
  await expect(hireMe).toHaveCount(0)
})

test("each route loads", async ({ page }) => {
  for (const path of ["/", "/profile", "/projects", "/contact"]) {
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
  await dialog.getByRole("link", { name: /^profile$/i }).click()
  await expect(page).toHaveURL(/\/profile$/)
  await expect(dialog).toBeHidden()
})
