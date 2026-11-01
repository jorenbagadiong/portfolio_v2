"use client"

import { MotionConfig } from "framer-motion"
import { ThemeProvider as NextThemesProvider } from "next-themes"

const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {/* Honour prefers-reduced-motion for every Framer animation (layoutId, toggle). */}
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
  </NextThemesProvider>
)

export default ThemeProvider
