"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { isProjectsRoute } from "@/lib/route-label"
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type Props = {
  children: ReactNode
}

const PageTransition = ({ children }: Props) => {
  const pathname = usePathname()
  const reduced = usePrefersReducedMotion()
  // Server and first client render use initial={false}: no inline opacity 0,
  // so the page is visible before hydration. Later route changes get the fade.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isProjectsRoute(pathname) ? "/projects" : pathname}
        initial={reduced || !mounted ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={
          reduced ? undefined : { opacity: 0, transition: { duration: 0.25 } }
        }
        transition={reduced ? { duration: 0 } : undefined}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
