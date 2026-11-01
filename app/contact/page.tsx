import type { Metadata } from "next"

import { ContactForm } from "@/components/contact/ContactForm"
import { Reveal } from "@/components/motion/Reveal"
import { contactInfo } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Contact | Joren Bagadiong",
  description: "Get in touch with Joren Bagadiong.",
}

export default function ContactPage() {
  return (
    <section className="container mx-auto py-12">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_1.2fr] xl:gap-16">
        <Reveal>
          <h1 className="text-4xl font-bold text-text xl:text-6xl">
            Let&apos;s build
            <span className="block text-accent-text">something together.</span>
          </h1>
          <p className="mt-4 text-muted">
            Open to full-time roles and freelance work.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {contactInfo.map((item) => (
              <li
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 backdrop-blur-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border text-xl text-accent-text">
                  <item.icon aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted">{item.title}</p>
                  <p className="break-words text-text">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
