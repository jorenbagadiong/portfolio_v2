import Logo from "@/components/Logo"
import Nav from "@/components/Nav"
import ThemeToggle from "@/components/ThemeToggle"
import MobileNav from "@/components/MobileNav"

const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-text">
      <div className="container mx-auto flex justify-between items-center">
        {/* logo */}
        <Logo />
        {/* desktop nav */}
        <div className="hidden xl:flex gap-8 items-center">
          <Nav />
          <ThemeToggle />
        </div>
        {/* mobile nav */}
        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
