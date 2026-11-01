import { expect, test } from "@playwright/test"

test("CV download is above the fold", async ({ page }) => {
  await page.goto("/")
  const cv = page.getByRole("link", { name: /download cv/i })
  await expect(cv).toBeVisible()
  const box = await cv.boundingBox()
  const viewport = page.viewportSize()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height)
  await expect(cv).toHaveAttribute("href", /Joren_Bagadiong_Resume_ATS\.pdf$/)
})

test("heading names Joren", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Joren Bagadiong"
  )
})

test("stats reach final values", async ({ page }) => {
  await page.goto("/")
  await page.getByText("Years of experience").scrollIntoViewIfNeeded()
  await page.waitForTimeout(2000)
  for (const n of ["5", "18", "16", "500"]) {
    await expect(page.getByText(n, { exact: true })).toBeVisible()
  }
})
