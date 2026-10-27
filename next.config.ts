import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "motionlab",
        destination: "https://motionlab-six.vercel.app/",
      },
      {
        source: "/motionlab/:path*",
        destination: "https://motionlab-six.vercel.app/:path*",
      },
    ]
  },
}

export default nextConfig
