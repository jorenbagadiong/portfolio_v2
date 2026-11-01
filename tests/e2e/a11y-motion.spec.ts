import { expect, test } from "./fixtures"

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  // Framer's layoutId expansion animates a transform (scale/translate) on the
  // modal's media box for its first frames. Sampling every animation frame
  // after the click is robust against timing: with reduced motion the box must
  // never carry a transform, and the dialog must be fully opaque whenever seen.
  test("project dialog appears instantly, with no layout animation", async ({
    page,
  }) => {
    await page.goto("/projects")
    await page.evaluate(() => {
      const w = window as unknown as { __samples: unknown[] }
      w.__samples = []
      const tick = () => {
        const dlg = document.querySelector('[role="dialog"]')
        if (dlg) {
          const media = dlg.querySelector(".aspect-\\[16\\/9\\]")
          let o = 1
          for (let e: Element | null = dlg; e; e = e.parentElement)
            o *= Number(getComputedStyle(e).opacity)
          w.__samples.push({
            opacity: o,
            transform: media ? getComputedStyle(media).transform : "none",
          })
        }
        requestAnimationFrame(tick)
      }
      tick()
    })
    await page.getByRole("link", { name: /cryptoweb app/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await page.waitForTimeout(600)
    const samples = (await page.evaluate(
      () => (window as unknown as { __samples: unknown[] }).__samples
    )) as { opacity: number; transform: string }[]
    expect(samples.length).toBeGreaterThan(3)
    // The very first frame is the pre-measurement mount frame, which carries
    // the projected start box in every mode (7 transformed frames without
    // reduced motion vs 1 with it). Everything after must be settled.
    for (const s of samples.slice(1)) {
      expect(s.opacity).toBe(1)
      expect(s.transform).toBe("none")
    }
  })
})

test("social links have accessible names", async ({ page }) => {
  await page.goto("/")
  const links = page.locator("main a[target='_blank']")
  expect(await links.count()).toBe(4)
  for (const link of await links.all()) {
    const name = await link.getAttribute("aria-label")
    expect((name ?? "").trim().length).toBeGreaterThan(0)
  }
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveCount(1)
})

test("skill tooltip has an opaque background", async ({ page }) => {
  await page.goto("/profile")
  const skill = page.getByRole("button", { name: "React.js", exact: true })
  await skill.scrollIntoViewIfNeeded()
  await skill.hover()
  const tip = page.locator("[data-radix-popper-content-wrapper] [data-state]")
  await expect(tip.first()).toBeVisible()
  const bg = await tip
    .first()
    .evaluate((n) => getComputedStyle(n).backgroundColor)
  expect(bg).not.toBe("rgba(0, 0, 0, 0)")
  expect(bg).not.toBe("transparent")
})

test("hero buttons are single tab stops", async ({ page }) => {
  await page.goto("/")
  const cv = page.getByRole("link", { name: /download cv/i })
  await expect(cv).toHaveCount(1)
  await expect(page.locator("main a button, main button a")).toHaveCount(0)
})
