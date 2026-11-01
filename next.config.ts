import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/work/:path*", destination: "/projects", permanent: true },
    ]
  },
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
      {
        source: "/pokelab",
        destination: "https://pokelab-steel.vercel.app/pokelab",
      },
      {
        source: "/pokelab/:path*",
        destination: "https://pokelab-steel.vercel.app/pokelab/:path*",
      },
    ]
  },
}

export default nextConfig
