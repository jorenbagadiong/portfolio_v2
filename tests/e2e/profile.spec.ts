import { expect, test } from "@playwright/test"

test("timeline shows all experience entries", async ({ page }) => {
  await page.goto("/profile")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await expect(page.getByText("TDH International Inc")).toBeVisible()
  await page.getByText("MadTech Geek").scrollIntoViewIfNeeded()
  await expect(page.getByText("MadTech Geek")).toBeVisible()
})

test("responsibilities toggle", async ({ page }) => {
  await page.goto("/profile")
  await expect(
    page.getByRole("button", { name: /show responsibilities/i }).first()
  ).toBeVisible()
  // stable locator: the accessible name flips once toggled
  const toggle = page.locator("main button[aria-controls]").first()
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-expanded", "true")
  const text = page.getByText("Converted Figma UI/UX designs")
  await expect(text).toBeVisible()
  await toggle.focus()
  await page.keyboard.press("Enter")
  await expect(text).toBeHidden()
})

test("skill names available", async ({ page }) => {
  await page.goto("/profile")
  const skill = page.getByRole("button", { name: "React.js", exact: true })
  await skill.scrollIntoViewIfNeeded()
  await skill.focus()
  await expect(page.getByRole("tooltip")).toContainText("React.js")
})
