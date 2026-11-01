"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "@/lib/site-data"
import ThemeToggle from "@/components/ThemeToggle"
import Logo from "@/components/Logo"
import { CiMenuFries } from "react-icons/ci"

const MobileNav = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="flex justify-center items-center"
      >
        <CiMenuFries className="text-[32px] text-accent-text" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        {/* Required for accessibility */}
        <DialogTitle>
          <VisuallyHidden />
        </DialogTitle>
        <div className="my-28 text-center text-2xl">
          <Logo />
        </div>
        <nav className="flex flex-col justify-center items-center gap-4">
          {navLinks.map((link, index) => {
            return (
              <Link
                href={link.path}
                key={index}
                onClick={() => setOpen(false)}
                aria-current={link.path === pathname ? "page" : undefined}
                className={`${link.path === pathname && "text-accent-text border-b-2 border-accent"} text-l capitalize hover:text-accent-text transition-all`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="mt-8 flex justify-center items-center">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
