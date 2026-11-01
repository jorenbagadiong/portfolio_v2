import { expect, test } from "./fixtures"

test.describe("320px layout", () => {
  test.use({ viewport: { width: 320, height: 640 } })

  test("no horizontal scroll at 320px", async ({ page }) => {
    for (const path of [
      "/",
      "/about",
      "/projects",
      "/projects/cryptoweb-app",
      "/contact",
    ]) {
      await page.goto(path)
      await page.waitForLoadState("load")
      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }))
      expect(scrollWidth, path).toBeLessThanOrEqual(innerWidth)
    }
  })

  test("header fits at 320px", async ({ page }) => {
    await page.goto("/")
    const logo = page
      .locator("header")
      .getByRole("link", { name: "Home", exact: true })
      .first()
    const menu = page.getByRole("button", { name: /open menu/i })
    const toggle = page.getByRole("button", {
      name: /switch to (light|dark) theme/i,
    })
    const boxes = []
    for (const l of [logo, menu]) {
      await expect(l).toBeVisible()
      boxes.push(await l.boundingBox())
    }
    if (await toggle.count()) {
      await expect(toggle.first()).toBeVisible()
      boxes.push(await toggle.first().boundingBox())
    }
    for (let i = 0; i < boxes.length; i++) {
      const a = boxes[i]!
      expect(a.x + a.width).toBeLessThanOrEqual(320)
      for (let j = i + 1; j < boxes.length; j++) {
        const b = boxes[j]!
        const overlap =
          a.x < b.x + b.width &&
          b.x < a.x + a.width &&
          a.y < b.y + b.height &&
          b.y < a.y + a.height
        expect(overlap).toBe(false)
      }
    }
  })
})
