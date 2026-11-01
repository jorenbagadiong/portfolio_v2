"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion"

type Props = {
  children: ReactNode
}

const PageTransition = ({ children }: Props) => {
  const pathname = usePathname()
  const reduced = usePrefersReducedMotion()

  if (reduced) return <>{children}</>

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.25 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
