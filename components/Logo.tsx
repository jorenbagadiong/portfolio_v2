import Link from "next/link"

const Logo = () => (
  <Link href="/" aria-label="Home">
    <span
      aria-hidden="true"
      className="inline-flex items-baseline text-4xl font-semibold tracking-tight"
    >
      <span className="text-accent-text">&lt;</span>/
      <span className="text-accent-text">&gt;</span>
      <span className="ml-1 inline-block h-[0.8em] w-[0.45em] translate-y-[0.1em] bg-accent motion-safe:animate-blink" />
    </span>
  </Link>
)

export default Logo
