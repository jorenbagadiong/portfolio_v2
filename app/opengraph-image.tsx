import { ImageResponse } from "next/og"

export const alt = "Joren Bagadiong – Frontend Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Dark theme colours from globals.css.
const BG = "rgb(28, 28, 34)"
const ACCENT = "rgb(0, 255, 153)"
const MUTED = "rgba(255, 255, 255, 0.6)"

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 96px",
        background: BG,
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
        <span style={{ color: ACCENT }}>&lt;</span>/
        <span style={{ color: ACCENT }}>&gt;</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
          Joren Bagadiong
        </div>
        <div style={{ fontSize: 44, color: ACCENT }}>Frontend Developer</div>
        <div style={{ fontSize: 30, color: MUTED }}>
          React · Next.js · TypeScript · Tailwind CSS
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 28, color: MUTED }}>
        jorenbagadiong.dev
      </div>
    </div>,
    size
  )
}
