"use client"

import { Component, type ReactNode, useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"

import { hasWebGL } from "@/lib/intro"

import ParticleField from "./ParticleField"

class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function ParticleBackground() {
  const [supported, setSupported] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSupported(hasWebGL())
  }, [])

  if (!supported) return null

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none transition-opacity"
      style={{ opacity: ready ? 1 : 0, transitionDuration: "600ms" }}
    >
      <CanvasBoundary>
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: false, alpha: true }}
          onCreated={() => setReady(true)}
        >
          <ParticleField />
        </Canvas>
      </CanvasBoundary>
    </div>
  )
}
