import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"

import IntroLoader from "@/components/IntroLoader"
import Header from "@/components/Header"
import StairTransition from "@/components/StairTransition"
import PageTransition from "@/components/PageTransition"
import ThemeProvider from "@/components/ThemeProvider"
import StaticBackground from "@/components/StaticBackground"
import ParticleBackground from "@/components/three/ParticleBackgroundLazy"

import { INTRO_FLAG } from "@/lib/intro"

import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetsbrainMono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

// Adds `js`, and `intro` when the intro should play, before first paint.
const INTRO_HEAD_SCRIPT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('${INTRO_FLAG}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('intro')}catch(e){}})()`

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
        <script
          dangerouslySetInnerHTML={{
            __html: INTRO_HEAD_SCRIPT,
          }}
        />
      </head>
      <body className={jetbrainsMono.variable}>
        <ThemeProvider>
          <StaticBackground />
          <ParticleBackground />
          <IntroLoader />
          <StairTransition />
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
