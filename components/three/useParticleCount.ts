"use client"

import { useState } from "react"

import { isSmallDevice } from "./budget"

export function useParticleCount(): number {
  const [count] = useState(() => (isSmallDevice() ? 140 : 260))
  return count
}
