import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/work", destination: "/projects", permanent: true },
      { source: "/work/:path*", destination: "/projects", permanent: true },
      { source: "/profile", destination: "/about", permanent: true },
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
      {
        source: "/spendwise",
        destination: "https://spendwise-ten-murex.vercel.app/spendwise",
      },
      {
        source: "/spendwise/:path*",
        destination: "https://spendwise-ten-murex.vercel.app/spendwise/:path*",
      },
    ]
  },
}

export default nextConfig
