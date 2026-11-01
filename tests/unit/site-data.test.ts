import { expect, test } from "vitest"
import {
  navLinks,
  projects,
  getProjectBySlug,
  listedProjects,
  mainProjects,
  earlierProjects,
} from "@/lib/site-data"

test("nav links are home, about, projects, contact", () => {
  expect(navLinks.map((l) => l.path)).toEqual([
    "/",
    "/about",
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
  expect(getProjectBySlug("cryptoweb-app")?.title).toBe("CryptoWeb App")
  expect(getProjectBySlug("nope")).toBeUndefined()
})
test("MotionLab then PokeLab lead; practice projects are earlier work", () => {
  expect(mainProjects.map((p) => p.slug)).toEqual(["motionlab", "pokelab"])
  expect(earlierProjects.map((p) => p.slug)).toEqual([
    "cryptoweb-app",
    "pet-grooming",
    "cryptolist",
    "portfolio-v1",
  ])
})
test("drafts are never listed", () => {
  expect(listedProjects.some((p) => p.draft)).toBe(false)
})
test("tool names use their official spelling", () => {
  const names = projects.flatMap((p) => p.stack.map((s) => s.name))
  for (const bad of ["Tailwindcss", "React.js", "Emailjs", "MUI"])
    expect(names).not.toContain(bad)
})
