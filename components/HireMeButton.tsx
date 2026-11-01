"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { shouldShowHireMe } from "@/lib/nav"

const HireMeButton = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  if (!shouldShowHireMe(pathname)) return null
  return (
    <Link href="/contact" className={className}>
      <Button>Hire me!</Button>
    </Link>
  )
}

export default HireMeButton
