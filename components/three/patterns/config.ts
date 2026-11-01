import type { PatternName } from "./types"

export function patternForPath(pathname: string): PatternName {
  if (pathname === "/profile" || pathname.startsWith("/profile/"))
    return "column"
  if (pathname === "/projects" || pathname.startsWith("/projects/"))
    return "grid"
  if (pathname === "/contact" || pathname.startsWith("/contact/"))
    return "sphere"
  return "cloud"
}
