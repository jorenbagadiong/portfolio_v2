import { navLinks } from "@/lib/site-data"

/** Destination page name for a pathname, e.g. "/projects/x" -> "Projects". */
export function routeLabel(pathname: string): string {
  const match = navLinks.find((l) =>
    l.path === "/"
      ? pathname === "/"
      : pathname === l.path || pathname.startsWith(`${l.path}/`)
  )
  if (!match) return ""
  return match.name.charAt(0).toUpperCase() + match.name.slice(1)
}

export const isProjectsRoute = (p: string) =>
  p === "/projects" || /^\/projects\/[^/]+$/.test(p)

/** The stair wipe plays on every pathname change except within /projects. */
export function shouldWipe(prev: string, next: string): boolean {
  if (prev === next) return false
  return !(isProjectsRoute(prev) && isProjectsRoute(next))
}
