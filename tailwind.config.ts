/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // optional
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1200px",
    },
    fontFamily: {
      primary: "var(--font-jetsbrainMono)",
    },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        primary: "rgb(var(--bg) / <alpha-value>)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "var(--muted)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
        },
        "accent-text": "rgb(var(--accent-text) / <alpha-value>)",
        "on-accent": "rgb(var(--on-accent) / <alpha-value>)",
        particle: "rgb(var(--particle) / <alpha-value>)",
        destructive: "rgb(var(--destructive) / <alpha-value>)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
