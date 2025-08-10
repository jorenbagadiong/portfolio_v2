"use client"

import { motion } from "framer-motion"
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    description: "Micara Estates, Sahud-ulan, Tanza, Cavite",
  },
]

const Contact = () => {
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
            <form className="flex flex-col gap-6 p-6 bg-[#27272c] rounded-xl ">
              <h3 className="text-4xl text-accent">Let's work together</h3>
              <p className="text-white/60">
                I’m a frontend web developer specializing in Next.js, Tailwind
                CSS, and modern JavaScript. I build responsive, high-performance
                websites with clean, maintainable code. My goal is to deliver
                fast, reliable, and user-friendly web applications that work
                seamlessly across devices.
              </p>
              <Input type="fullname" placeholder="Full Name" />
              <Input type="email" placeholder="Email" />
              <Input type="subject" placeholder="Subject" />
              <Select name="employment">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Employment Type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Employment Type</SelectLabel>
                    <SelectItem value="fulltime">Full Time</SelectItem>
                    <SelectItem value="parttime">Part Time</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Textarea
                className="h-[200px]"
                placeholder="Type your message here."
              />
              <div className="flex flex-col-reverse items-end">
                <Button size="md" className="max-w-[300px]">
                  Send message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default Contact
