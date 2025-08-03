import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

import Header from "@/components/Header"
import PageTransition from "@/components/PageTransition"
import StairTransition from "@/components/StairTransition"

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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </head>
      <body className={jetbrainsMono.variable}>
        <Header />
        <StairTransition />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
