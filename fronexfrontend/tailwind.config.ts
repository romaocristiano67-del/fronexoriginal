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
        // Fronex — deep navy, warm ivory and pool-blue palette
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
          contrast: "rgb(var(--color-accent-ink) / <alpha-value>)",
          action: "rgb(var(--color-action-ink) / <alpha-value>)",
        },
        nav: {
          DEFAULT: "rgb(var(--color-nav) / <alpha-value>)",
          ink: "rgb(var(--color-nav-ink) / <alpha-value>)",
          muted: "rgb(var(--color-nav-muted) / <alpha-value>)",
        },
        // Mantidos para compatibilidade com componentes existentes
        angola: {
          black: "#0D2336",
          red: "#0E67A6",
          gold: "#73CFE8",
        },
        fronex: {
          DEFAULT: "#0E67A6",
          red: "#0E67A6",
          gold: "#73CFE8",
          neon: "#73CFE8",
          navy: "#071F33",
          surface: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ['-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif'],
        editorial: ['"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif'],
        body: ['-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui, sans-serif'],
      },
      borderRadius: {
        "4xl": "2rem",
        surface: "var(--radius-surface)",
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(0,0,0,0.4)",
        "soft-lg": "0 20px 60px -15px rgba(0,0,0,0.5)",
        "soft-dark": "0 20px 60px -15px rgba(0,0,0,0.7)",
        neon: "0 6px 18px -10px rgb(var(--color-accent) / 0.4)",
        "neon-lg": "0 12px 30px -18px rgb(var(--color-accent-soft) / 0.32)",
      },
      backgroundImage: {
        "flag-thread":
          "linear-gradient(90deg, #071F33 0%, #0E67A6 58%, #73CFE8 100%)",
        "hero-glow":
          "radial-gradient(ellipse 70% 58% at 75% 38%, rgb(var(--color-accent-soft) / 0.11), transparent 56%), radial-gradient(ellipse 52% 38% at 15% 82%, rgb(var(--color-chart-3) / 0.07), transparent 52%)",
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
