"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navLinks } from "@/lib/site-data"
import HireMeButton from "@/components/HireMeButton"
import { CiMenuFries } from "react-icons/ci"

const MobileNav = () => {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open menu"
        className="flex justify-center items-center"
      >
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        {/* Required for accessibility */}
        <DialogTitle>
          <VisuallyHidden />
        </DialogTitle>
        <div className="my-28 text-center text-2xl">
          <Link href="/">
            <h1 className="text-4xl font-semibold">
              Joren <span className="text-accent">.</span>
            </h1>
          </Link>
        </div>
        <nav className="flex flex-col justify-center items-center gap-4">
          {navLinks.map((link, index) => {
            return (
              <Link
                href={link.path}
                key={index}
                aria-current={link.path === pathname ? "page" : undefined}
                className={`${link.path === pathname && "text-accent border-b-2 border-accent"} text-l capitalize hover:text-accent transition-all`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="mt-8 flex justify-center">
          <HireMeButton />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
