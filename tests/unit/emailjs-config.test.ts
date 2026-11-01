import { expect, test } from "vitest"
import { getEmailJsConfig } from "@/lib/emailjs-config"

test("reports missing vars", () => {
  expect(getEmailJsConfig({ NEXT_PUBLIC_EMAILJS_SERVICE_ID: "s" })).toEqual({
    ok: false,
    missing: [
      "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
      "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
    ],
  })
})
test("returns config when complete", () => {
  expect(
    getEmailJsConfig({
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "s",
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "t",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "k",
    })
  ).toEqual({ ok: true, serviceId: "s", templateId: "t", publicKey: "k" })
})
test("treats empty strings as missing", () => {
  expect(
    getEmailJsConfig({
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "",
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "t",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "k",
    })
  ).toEqual({ ok: false, missing: ["NEXT_PUBLIC_EMAILJS_SERVICE_ID"] })
})
