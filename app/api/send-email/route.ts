import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          fullname: body.fullname,
          email: body.email,
          subject: body.subject,
          employment: body.employment,
          message: body.message,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return NextResponse.json({ success: true, data: response.data })
  } catch (error: any) {
    console.error("Email send error:", error.response?.data || error.message)
    return NextResponse.json(
      { success: false, error: error.response?.data || error.message },
      { status: 500 }
    )
  }
}
