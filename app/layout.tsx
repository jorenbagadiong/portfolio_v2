import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"

import Header from "@/components/Header"
import PageTransition from "@/components/PageTransition"
import ThemeProvider from "@/components/ThemeProvider"
import StaticBackground from "@/components/StaticBackground"
import ParticleBackground from "@/components/three/ParticleBackgroundLazy"

import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetsbrainMono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Joren Bagadiong | Frontend Web Developer",
  description:
    "Portfolio of Joren Bagadiong, a frontend developer focused on creating fast and accessible websites with React, Next.js, and Tailwind CSS.",
  keywords: [
    "Joren Bagadiong",
    "Frontend Developer",
    "Web Developer",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Portfolio",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </head>
      <body className={jetbrainsMono.variable}>
        <ThemeProvider>
          <StaticBackground />
          <ParticleBackground />
          <Header />
          <PageTransition>{children}</PageTransition>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
