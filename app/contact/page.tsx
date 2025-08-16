"use client"

import { useRef, useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import emailjs from "@emailjs/browser"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const INFO = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "+63 915 395 4186",
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "joren.bagadiong14@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Address",
    description: "Micara Estates, Sahud-Ulan, Tanza, Cavite",
  },
]

const Contact = () => {
  const form = useRef<HTMLFormElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.current) return

    setLoading(true)
    setStatus(null)

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      .then(
        () => {
          setStatus("success")
          setLoading(false)
          form.current?.reset()
        },
        (error) => {
          console.error("EmailJS error:", error)
          setStatus("error")
          setLoading(false)
        }
      )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 2.4, duration: 0.4, ease: "easeIn" },
      }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="w-full flex-1 flex items-start xl:justify-end order-1 xl:order-none mb-8 xl-mb-0">
            <ul className="flex flex-col gap-10">
              {INFO.map((item, index) => {
                return (
                  <li key={index} className="flex items-center gap-6 ">
                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                      <div className="text-[28px] ">{item.icon}</div>
                    </div>
                    <div className="flex flex-col w-full">
                      <p className="text-white/60">{item.title}</p>
                      <h3 className="text-l whitespace-normal break-words">
                        {item.description}
                      </h3>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form
              ref={form}
              onSubmit={sendEmail}
              className="flex flex-col gap-6 p-6 bg-[#27272c] rounded-xl0"
            >
              <h3 className="text-4xl text-accent">Let's work together</h3>
              <p className="text-white/60">
                I’m a frontend web developer specializing in Next.js, Tailwind
                CSS, and modern JavaScript. I build responsive, high-performance
                websites with clean, maintainable code. My goal is to deliver
                fast, reliable, and user-friendly web applications that work
                seamlessly across devices.
              </p>
              <Input name="fullname" type="text" placeholder="Full Name" />
              <Input name="email" type="email" placeholder="Email" />
              <Input name="subject" type="text" placeholder="Subject" />
              <Textarea
                name="message"
                className="h-[200px]"
                placeholder="Type your message here."
              />
              <div className="flex flex-col-reverse items-end">
                {status === "success" ? (
                  <p className="text-green-500 font-medium">
                    ✅ Thanks! Your message has been sent.
                  </p>
                ) : (
                  <Button
                    type="submit"
                    size="md"
                    className="max-w-[300px]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Send message"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Contact
