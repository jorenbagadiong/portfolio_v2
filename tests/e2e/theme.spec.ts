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

const readColors = (page: import("@playwright/test").Page) =>
  page.evaluate(() => ({
    bg: getComputedStyle(document.body).backgroundColor,
    accent: getComputedStyle(
      document.querySelector("header span.text-accent") as Element
    ).color,
    particle: getComputedStyle(document.documentElement)
      .getPropertyValue("--particle")
      .trim(),
  }))

test.describe("computed colors", () => {
  test.use({ colorScheme: "dark" })
  test("tokens resolve to real colors in each theme", async ({ page }) => {
    await page.goto("/")
    const dark = await readColors(page)
    expect(dark.bg).toBe("rgb(28, 28, 34)")
    expect(dark.accent).toBe("rgb(0, 255, 153)")
    expect(dark.particle).toBe("0 255 153")

    await page.emulateMedia({ colorScheme: "light" })
    await page.reload()
    const light = await readColors(page)
    expect(light.bg).toBe("rgb(245, 247, 246)")
    expect(light.accent).toBe("rgb(0, 168, 107)")
    expect(light.accent).not.toBe(dark.accent)
  })
})
