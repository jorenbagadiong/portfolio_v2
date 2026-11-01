import type { Page } from "@playwright/test"
import { expect, test } from "./fixtures"

const SEND = "**/api.emailjs.com/api/v1.0/email/send"

async function stub(
  page: Page,
  opts: { status?: number; delay?: number } = {}
) {
  const calls = { count: 0 }
  await page.route(SEND, async (route) => {
    calls.count++
    if (opts.delay) await new Promise((r) => setTimeout(r, opts.delay))
    await route.fulfill({ status: opts.status ?? 200, body: "OK" })
  })
  return calls
}

async function fill(page: Page) {
  await page.getByLabel("Full name").fill("Ada Lovelace")
  await page.getByLabel("Email").fill("ada@example.com")
  await page.getByLabel("Subject (optional)").fill("Hello")
  await page.getByLabel("Message").fill("A message")
}

const sendBtn = (page: Page) =>
  page.getByRole("button", { name: /send message|sending/i })

test("validation errors show", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
  await sendBtn(page).click()
  await expect(page.getByText("Full Name is required")).toBeVisible()
  await expect(page.getByText("Email is required")).toBeVisible()
  await expect(page.getByText("Message is required")).toBeVisible()
})

test("fields are labelled and required", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.getByLabel("Full name")).toHaveAttribute("required", "")
  await expect(page.getByLabel("Email")).toHaveAttribute("type", "email")
  await expect(page.getByLabel("Message")).toHaveAttribute("required", "")
  await expect(page.getByRole("link", { name: /@gmail\.com/ })).toHaveAttribute(
    "href",
    /^mailto:/
  )
  await expect(page.getByRole("link", { name: /\+63/ })).toHaveAttribute(
    "href",
    /^tel:/
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Let's build something together."
  )
})

test("successful send shows status and resets", async ({ page }) => {
  const calls = await stub(page)
  await page.goto("/contact")
  await fill(page)
  await sendBtn(page).click()
  await expect(page.getByRole("status")).toContainText(
    "Your message has been sent!"
  )
  await expect(page.getByLabel("Full name")).toHaveValue("")
  await expect(page.getByLabel("Message")).toHaveValue("")
  expect(calls.count).toBe(1)
})

test("double click sends once", async ({ page }) => {
  const calls = await stub(page, { delay: 800 })
  await page.goto("/contact")
  await fill(page)
  await sendBtn(page).dblclick()
  await expect(sendBtn(page)).toBeDisabled()
  await expect(page.getByRole("status")).toContainText("has been sent")
  expect(calls.count).toBe(1)
})

test("failed send keeps values", async ({ page }) => {
  await stub(page, { status: 500 })
  await page.goto("/contact")
  await fill(page)
  await sendBtn(page).click()
  await expect(
    page.getByText("Something went wrong. Please try again")
  ).toBeVisible()
  await expect(page.getByLabel("Message")).toHaveValue("A message")
})
