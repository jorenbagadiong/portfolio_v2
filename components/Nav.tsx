"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { navLinks } from "@/lib/site-data"

const Nav = () => {
  const pathname = usePathname()
  const reduce = useReducedMotion()
  return (
    <nav className="flex gap-8">
      {navLinks.map((link) => {
        const active = link.path === pathname
        return (
          <Link
            href={link.path}
            key={link.path}
            aria-current={active ? "page" : undefined}
            className={`${active ? "text-accent-text" : ""} relative capitalize font-medium hover:text-accent-text transition-all`}
          >
            {link.name}
            {active && (
              <motion.span
                layoutId="nav-underline"
                transition={reduce ? { duration: 0 } : undefined}
                className="absolute left-0 right-0 -bottom-1 h-0.5 bg-accent"
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

export default Nav
