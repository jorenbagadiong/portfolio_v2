import { expect, test } from "./fixtures"

test("timeline shows all experience entries", async ({ page }) => {
  await page.goto("/about")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await expect(page.getByText("TDH International Inc")).toBeVisible()
  await page.getByText("MadTech Geek").scrollIntoViewIfNeeded()
  await expect(page.getByText("MadTech Geek")).toBeVisible()
})

test("intro, heading, and core strengths", async ({ page }) => {
  await page.goto("/about")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About Me")
  await expect(
    page.getByRole("heading", { name: "Core Strengths", level: 2 })
  ).toBeVisible()
  for (const s of [
    "Reusable Components",
    "Business Application Development",
    "Collaboration & Problem Solving",
  ])
    await expect(
      page.getByRole("heading", { name: s, exact: true })
    ).toHaveCount(1)
})

test("recent roles show responsibilities without a toggle", async ({
  page,
}) => {
  await page.goto("/about")
  await expect(
    page.getByText("Maintain the company's web applications")
  ).toBeVisible()
  await expect(
    page.getByText("Debugged and improved existing applications.")
  ).toBeAttached()
  await expect(page.locator("main button[aria-controls]")).toHaveCount(2)
})

test("responsibilities toggle", async ({ page }) => {
  await page.goto("/about")
  await expect(
    page.getByRole("button", { name: /show responsibilities/i }).first()
  ).toBeVisible()
  // stable locator: the accessible name flips once toggled
  const toggle = page.locator("main button[aria-controls]").first()
  await expect(toggle).toHaveAttribute("aria-expanded", "false")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-expanded", "true")
  const text = page.getByText("Started my frontend career")
  await expect(text).toBeVisible()
  await toggle.focus()
  await page.keyboard.press("Enter")
  await expect(text).toBeHidden()
})

test("skills are a grouped list, no percentages", async ({ page }) => {
  await page.goto("/about")
  for (const group of [
    "Frameworks",
    "Styling",
    "Testing",
    "Animation",
    "Tools",
  ])
    await expect(
      page.getByRole("heading", { name: group, exact: true })
    ).toHaveCount(1)
  await expect(page.getByText("Tailwind CSS", { exact: true })).toBeAttached()
  await expect(page.getByText(/\d+%/)).toHaveCount(0)
  await expect(
    page.getByRole("heading", { name: "My Proficiency" })
  ).toHaveCount(0)
})

test("has its own title", async ({ page }) => {
  await page.goto("/about")
  await expect(page).toHaveTitle("About | Joren Bagadiong – Frontend Developer")
})

test.describe("light accent text contrast", () => {
  test.use({ colorScheme: "light" })
  test("timeline date meets AA against --bg", async ({ page }) => {
    await page.goto("/about")
    const date = page.locator("main li span.text-accent-text").first()
    await expect(date).toBeVisible()
    const { fg, bg } = await page.evaluate(() => {
      const el = document.querySelector("main li span.text-accent-text")!
      const probe = document.createElement("div")
      probe.style.color =
        "rgb(" +
        getComputedStyle(document.documentElement)
          .getPropertyValue("--bg")
          .trim()
          .replace(/ /g, ",") +
        ")"
      document.body.appendChild(probe)
      const bg = getComputedStyle(probe).color
      probe.remove()
      return { fg: getComputedStyle(el).color, bg }
    })
    const parse = (c: string) =>
      (c.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const x = v / 255
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const [a, b] = [lum(parse(fg)), lum(parse(bg))]
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })
})
