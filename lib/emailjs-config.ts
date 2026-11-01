export type EmailJsConfig =
  | { ok: true; serviceId: string; templateId: string; publicKey: string }
  | { ok: false; missing: string[] }

// Literal process.env.NEXT_PUBLIC_* accesses so Next inlines them at build time.
const defaultEnv = (): Record<string, string | undefined> => ({
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
})

export function getEmailJsConfig(
  env: Record<string, string | undefined> = defaultEnv()
): EmailJsConfig {
  const keys = [
    "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
    "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
    "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
  ] as const
  const missing = keys.filter((k) => !env[k])
  if (missing.length > 0) return { ok: false, missing }
  return {
    ok: true,
    serviceId: env[keys[0]]!,
    templateId: env[keys[1]]!,
    publicKey: env[keys[2]]!,
  }
}
