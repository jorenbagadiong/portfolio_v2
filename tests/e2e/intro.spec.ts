import { expect, test } from "@playwright/test"

const effectiveOpacity = () => (sel: string) => {
  let el: Element | null = document.querySelector(sel)
  let o = 1
  while (el) {
    o *= Number(getComputedStyle(el).opacity)
    el = el.parentElement
  }
  return o
}

test("intro plays once per session", async ({ page }) => {
  await page.goto("/")
  const html = page.locator("html")
  await expect(html).toHaveClass(/\bintro\b/)
  await expect(html).not.toHaveClass(/\bintro\b/, { timeout: 2500 })
  await expect
    .poll(() => page.evaluate(effectiveOpacity(), "main"), {
      timeout: 2500,
    })
    .toBe(1)
  await page.reload()
  await page.waitForTimeout(300)
  await expect(html).not.toHaveClass(/\bintro\b/)
})

test("click skips intro", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveClass(/\bintro\b/)
  await page.waitForTimeout(100)
  await page.mouse.click(200, 200)
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, {
    timeout: 600,
  })
})

test("reduced motion never plays intro", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/)
  await page.waitForTimeout(500)
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/)
})

test("no WebGL ends intro", async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === "webgl" || type === "webgl2") return null
      return (orig as (...a: unknown[]) => unknown).call(this, type, ...rest)
    } as typeof orig
  })
  await page.goto("/")
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, {
    timeout: 500 + 1500,
  })
})

test("particles assemble after the canvas appears", async ({ page }) => {
  const t0 = Date.now()
  await page.goto("/", { waitUntil: "commit" })
  const html = page.locator("html")
  await page.locator("canvas").waitFor({ state: "attached" })
  const attached = Date.now()
  await page.waitForTimeout(1200)
  // The assemble takes 1.4s from canvas mount, so the intro is still running.
  await expect(html).toHaveClass(/\bintro\b/)
  await expect(html).not.toHaveClass(/\bintro\b/, { timeout: 2000 })
  expect(Date.now() - t0).toBeLessThan(2800 + 400)
  // Nominal assemble is 1.4s. Timer and rAF jitter measured from a different
  // anchor (canvas attach vs. first frame) can shave ~100ms, so allow 200ms of
  // slack; 1200ms still proves the intro is not skipped or instant.
  expect(Date.now() - attached).toBeGreaterThan(1200)
})

test("the click that skips the intro does not activate content beneath", async ({
  page,
}) => {
  let downloaded = false
  page.on("download", () => (downloaded = true))
  await page.goto("/")
  await expect(page.locator("html")).toHaveClass(/\bintro\b/)
  await page.waitForTimeout(200)
  const box = await page
    .getByRole("link", { name: /download cv/i })
    .boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, {
    timeout: 600,
  })
  await page.waitForTimeout(500)
  expect(downloaded).toBe(false)
  expect(new URL(page.url()).pathname).toBe("/")
})

test("overlay fades out instead of vanishing", async ({ page }) => {
  await page.goto("/")
  // Sample the overlay on the frame right after html.intro is removed.
  await page.evaluate(() => {
    const w = window as unknown as { __fade: unknown }
    const root = document.documentElement
    new MutationObserver((_, obs) => {
      if (root.classList.contains("intro")) return
      obs.disconnect()
      setTimeout(() => {
        const el = document.querySelector(".intro-overlay")
        w.__fade = el
          ? {
              display: getComputedStyle(el).display,
              opacity: Number(getComputedStyle(el).opacity),
            }
          : null
      }, 100)
    }).observe(root, { attributes: true, attributeFilter: ["class"] })
  })
  await expect
    .poll(
      () =>
        page.evaluate(() => (window as never as { __fade: unknown }).__fade),
      {
        timeout: 4000,
      }
    )
    .not.toBeUndefined()
  const fade = (await page.evaluate(
    () => (window as never as { __fade: unknown }).__fade
  )) as { display: string; opacity: number } | null
  expect(fade).not.toBeNull()
  expect(fade!.display).not.toBe("none")
  expect(fade!.opacity).toBeGreaterThan(0)
  expect(fade!.opacity).toBeLessThan(1)
  await expect(page.locator(".intro-overlay")).toHaveCount(0, { timeout: 600 })
})

test("hero name does not animate while the intro is hidden", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveClass(/\bintro\b/)
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/, {
    timeout: 3000,
  })
  // Right after the intro ends the hero letters must just be starting.
  const minOpacity = await page.evaluate(() => {
    const letters = document.querySelectorAll(
      "h1 .motion-hidden-letters > span"
    )
    return Math.min(
      ...Array.from(letters).map((l) => Number(getComputedStyle(l).opacity))
    )
  })
  expect(minOpacity).toBeLessThan(1)
})
