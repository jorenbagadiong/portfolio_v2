"use client"

import { useForm } from "react-hook-form"
import emailjs from "@emailjs/browser"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getEmailJsConfig } from "@/lib/emailjs-config"
import { particles } from "@/lib/particle-store"

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

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: { fullname: "", email: "", subject: "", message: "" },
  })

  const sendEmail = async (values: ContactFormValues) => {
    const config = getEmailJsConfig()
    if (!config.ok) {
      console.error("Missing EmailJS env vars:", config.missing)
      toast.error("Contact form is not configured")
      return
    }
    try {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        values,
        config.publicKey
      )
      toast.success("Your message has been sent!")
      form.reset()
      particles.pulse("burst")
    } catch (error) {
      console.error("EmailJS error:", error)
      toast.error("Something went wrong. Please try again.")
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
              <FormControl>
                <Input {...field} placeholder="Full Name" />
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
              <FormControl>
                <Input {...field} type="email" placeholder="Email" />
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
              <FormControl>
                <Input {...field} placeholder="Subject" />
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
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Type your message here."
                  className="h-[180px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="md"
          className="self-end"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Form>
  )
}
