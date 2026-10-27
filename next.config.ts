import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/motionlab",
        destination: "https://motionlab-six.vercel.app/motionlab",
      },
      {
        source: "/motionlab/:path*",
        destination: "https://motionlab-six.vercel.app/motionlab/:path*",
      },
    ]
  },
}

export default nextConfig
