import { expect, test } from "./fixtures"

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
    "Joren D. Bagadiong"
  )
})

test("featured work lists MotionLab then PokeLab", async ({ page }) => {
  await page.goto("/")
  const section = page.getByRole("region", { name: "Featured work" })
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByRole("heading", { level: 3 })).toHaveText([
    "MotionLab",
    "PokeLab",
  ])
  await expect(
    section.getByRole("link", { name: "Case study: MotionLab" })
  ).toHaveAttribute("href", "/projects/motionlab")
  for (const img of await section.getByRole("img").all())
    expect((await img.getAttribute("alt"))?.length).toBeGreaterThan(10)
})

test("portrait has alt text", async ({ page }) => {
  await page.goto("/")
  await expect(
    page.getByRole("img", { name: "Portrait of Joren Bagadiong" })
  ).toHaveCount(1)
})

test("shows experience badge, no stats strip", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByText("5+ years", { exact: true })).toBeVisible()
  await expect(page.getByText("Code commits", { exact: true })).toHaveCount(0)
  await expect(
    page.getByText("Projects completed", { exact: true })
  ).toHaveCount(0)
})
