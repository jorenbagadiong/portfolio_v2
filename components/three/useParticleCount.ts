"use client"

import { useState } from "react"

export function useParticleCount(): number {
  const [count] = useState(() => {
    const small =
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4
    return small ? 140 : 260
  })
  return count
}
