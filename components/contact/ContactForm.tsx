"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import emailjs from "@emailjs/browser"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getEmailJsConfig } from "@/lib/emailjs-config"
import { particles } from "@/lib/particle-store"

const EMAIL = "joren.bagadiong14@gmail.com"

const ContactFormSchema = z.object({
  fullname: z.string().nonempty("Full Name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().nonempty("Message is required"),
})

type ContactFormValues = z.infer<typeof ContactFormSchema>

type Status = { kind: "success" | "error"; text: string } | null

const labelClass = "ml-1 text-sm text-muted"

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: { fullname: "", email: "", subject: "", message: "" },
  })
  const [status, setStatus] = useState<Status>(null)

  const sendEmail = async (values: ContactFormValues) => {
    setStatus(null)
    const config = getEmailJsConfig()
    if (!config.ok) {
      console.error("Missing EmailJS env vars:", config.missing)
      setStatus({
        kind: "error",
        text: `The contact form isn't available right now. Please email me at ${EMAIL}.`,
      })
      return
    }
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        values,
        config.publicKey
      )
      setStatus({
        kind: "success",
        text: "Your message has been sent! I'll get back to you soon.",
      })
      form.reset()
      particles.pulse("burst")
    } catch (error) {
      console.error("EmailJS error:", error)
      setStatus({
        kind: "error",
        text: `Something went wrong. Please try again, or email me at ${EMAIL}.`,
      })
    }
  }

  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(sendEmail)}
        className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-surface p-6 backdrop-blur-md md:p-8"
        noValidate
      >
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Full name</FormLabel>
              <FormControl>
                <Input {...field} type="text" autoComplete="name" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Subject (optional)</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Message</FormLabel>
              <FormControl>
                <Textarea {...field} required className="h-[180px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse items-end gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p
            role="status"
            aria-live="polite"
            className={`text-sm font-medium ${
              status?.kind === "error" ? "text-destructive" : "text-accent-text"
            }`}
          >
            {status?.text}
          </p>
          <Button
            type="submit"
            size="md"
            className="shrink-0"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
