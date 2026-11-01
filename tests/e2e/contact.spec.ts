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
  await page.getByPlaceholder("Full Name").fill("Ada Lovelace")
  await page.getByPlaceholder("Email").fill("ada@example.com")
  await page.getByPlaceholder("Subject").fill("Hello")
  await page.getByPlaceholder("Type your message here.").fill("A message")
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

test("successful send toasts and resets", async ({ page }) => {
  const calls = await stub(page)
  await page.goto("/contact")
  await fill(page)
  await sendBtn(page).click()
  await expect(page.getByText("Your message has been sent!")).toBeVisible()
  await expect(page.getByPlaceholder("Full Name")).toHaveValue("")
  await expect(page.getByPlaceholder("Type your message here.")).toHaveValue("")
  expect(calls.count).toBe(1)
})

test("double click sends once", async ({ page }) => {
  const calls = await stub(page, { delay: 800 })
  await page.goto("/contact")
  await fill(page)
  await sendBtn(page).dblclick()
  await expect(sendBtn(page)).toBeDisabled()
  await expect(page.getByText("Your message has been sent!")).toBeVisible()
  expect(calls.count).toBe(1)
})

test("failed send keeps values", async ({ page }) => {
  await stub(page, { status: 500 })
  await page.goto("/contact")
  await fill(page)
  await sendBtn(page).click()
  await expect(
    page.getByText("Something went wrong. Please try again.")
  ).toBeVisible()
  await expect(page.getByPlaceholder("Type your message here.")).toHaveValue(
    "A message"
  )
})
