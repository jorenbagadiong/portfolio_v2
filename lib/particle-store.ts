export type PulseKind = "burst" | "ripple"

type Listener = (kind: PulseKind) => void

const listeners = new Set<Listener>()

export const particles = {
  pulse(kind: PulseKind): void {
    for (const listener of [...listeners]) listener(kind)
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
