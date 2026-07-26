import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fronex — tech-focused brand palette
        canvas: {
          DEFAULT: "rgb(var(--color-canvas) / <alpha-value>)",
          dark: "rgb(var(--color-canvas-dark) / <alpha-value>)",
          light: "rgb(var(--color-canvas-light) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          dark: "rgb(var(--color-surface-dark) / <alpha-value>)",
          elevated: "rgb(var(--color-surface-elevated) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          dark: "rgb(var(--color-border-dark) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          dark: "rgb(var(--color-ink-dark) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          dark: "rgb(var(--color-muted-dark) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          soft: "rgb(var(--color-accent-soft) / <alpha-value>)",
          dim: "rgb(var(--color-accent-dim) / <alpha-value>)",
        },
        // Mantidos para compatibilidade com componentes existentes
        angola: {
          black: "#111111",
          red: "#2563EB",
          gold: "#22D3EE",
        },
        fronex: {
          DEFAULT: "#2563EB",
          red: "#2563EB",
          gold: "#22D3EE",
          neon: "#22D3EE",
          navy: "#0F172A",
          surface: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(0,0,0,0.4)",
        "soft-lg": "0 20px 60px -15px rgba(0,0,0,0.5)",
        "soft-dark": "0 20px 60px -15px rgba(0,0,0,0.7)",
        neon: "0 0 24px -4px rgba(37,99,235,0.28)",
        "neon-lg": "0 0 48px -8px rgba(34,211,238,0.24)",
      },
      backgroundImage: {
        "flag-thread":
          "linear-gradient(90deg, #0F172A 0%, #2563EB 52%, #22D3EE 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(37,99,235,0.16), transparent 55%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(34,211,238,0.12), transparent 50%), radial-gradient(ellipse 45% 35% at 50% 20%, rgba(15,23,42,0.06), transparent 45%)",
        "section-fade":
          "linear-gradient(180deg, rgb(var(--color-canvas)) 0%, rgb(var(--color-canvas-light)) 50%, rgb(var(--color-canvas)) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
