"use client"

import { useState } from "react"

export function useParticleCount(): number {
  const [count] = useState(() => {
    const small =
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4
    return small ? 600 : 1500
  })
  return count
}
