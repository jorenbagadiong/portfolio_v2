import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  use: { baseURL: "http://localhost:3100" },
  projects: [
    {
      name: "desktop",
      use: { browserName: "chromium", viewport: { width: 1280, height: 800 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "yarn build && yarn start -p 3100",
    port: 3100,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "test_service",
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "test_template",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "test_key",
    },
  },
})
