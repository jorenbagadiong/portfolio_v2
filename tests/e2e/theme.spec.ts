import { expect, test } from "@playwright/test"

test.describe("toggle", () => {
  test.use({ colorScheme: "dark" })

  test("toggle switches and persists", async ({ page, isMobile }) => {
    await page.goto("/")
    const html = page.locator("html")
    await expect(html).toHaveClass(/dark/)
    if (isMobile) {
      await page.getByRole("button", { name: /open menu/i }).click()
    }
    await page.getByRole("button", { name: /switch to light theme/i }).click()
    await expect(html).not.toHaveClass(/dark/)
    await page.reload()
    await expect(html).not.toHaveClass(/dark/)
  })
})

test.describe("system light", () => {
  test.use({ colorScheme: "light" })
  test("follows system when unset (light)", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).not.toHaveClass(/dark/)
  })
})

test.describe("system dark", () => {
  test.use({ colorScheme: "dark" })
  test("follows system when unset (dark)", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveClass(/dark/)
  })
})
