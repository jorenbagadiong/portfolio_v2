import { expect, test } from "vitest"
import { navLinks, projects, getProjectBySlug, stats } from "@/lib/site-data"

test("nav links are home, profile, projects, contact", () => {
  expect(navLinks.map((l) => l.path)).toEqual([
    "/",
    "/profile",
    "/projects",
    "/contact",
  ])
})
test("project slugs are unique kebab-case", () => {
  const slugs = projects.map((p) => p.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
  slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/))
})
test("getProjectBySlug finds and misses", () => {
  expect(getProjectBySlug("cryptoweb-app")?.title).toBe("Cryptoweb App")
  expect(getProjectBySlug("nope")).toBeUndefined()
})
test("stats keep current values", () => {
  expect(stats.map((s) => s.num)).toEqual([5, 18, 16, 500])
})
