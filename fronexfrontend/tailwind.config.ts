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
        // Fronex — brand palette based on the original logo
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
          red: "#D21F2B",
          gold: "#F2C94C",
        },
        fronex: {
          DEFAULT: "#D21F2B",
          red: "#D21F2B",
          gold: "#F2C94C",
          neon: "#D21F2B",
          navy: "#111111",
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
        neon: "0 0 24px -4px rgba(210,31,43,0.32)",
        "neon-lg": "0 0 48px -8px rgba(242,201,76,0.3)",
      },
      backgroundImage: {
        "flag-thread":
          "linear-gradient(90deg, #111111 0%, #D21F2B 52%, #F2C94C 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(210,31,43,0.16), transparent 55%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(242,201,76,0.12), transparent 50%), radial-gradient(ellipse 45% 35% at 50% 20%, rgba(17,17,17,0.06), transparent 45%)",
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
