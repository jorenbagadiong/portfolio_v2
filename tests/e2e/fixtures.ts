import { expect, test as base } from "@playwright/test"

// Marks the intro as already played so specs don't race it.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => sessionStorage.setItem("intro-played", "1"))
    await use(page)
  },
})

export { expect }
