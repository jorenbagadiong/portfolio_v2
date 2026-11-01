import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.E2E_PORT ?? 3100)

export default defineConfig({
  testDir: "tests/e2e",
  // The intro specs measure wall-clock timing of a WebGL animation; parallel
  // workers starve it of CPU and make them flaky.
  workers: 1,
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1280, height: 800 },
        launchOptions: {
          args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
        },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        launchOptions: {
          args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
        },
      },
    },
  ],
  webServer: {
    command: `yarn build && yarn start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_EMAILJS_SERVICE_ID: "test_service",
      NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: "test_template",
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: "test_key",
    },
  },
})
