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
        // Fronex Studio — Dark Tech
        canvas: {
          DEFAULT: "#050B14",
          dark: "#050B14",
          light: "#0A0F1C",
        },
        surface: {
          DEFAULT: "#0F1626",
          dark: "#0F1626",
          elevated: "#141C2E",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          dark: "rgba(255,255,255,0.08)",
          accent: "rgba(0,255,163,0.35)",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          dark: "#FFFFFF",
          muted: "#A8B3C7",
        },
        muted: {
          DEFAULT: "#8B97AB",
          dark: "#8B97AB",
        },
        accent: {
          DEFAULT: "#00FFA3",
          soft: "#00E090",
          dim: "rgba(0,255,163,0.15)",
        },
        // Mantidos para compatibilidade com componentes existentes
        angola: {
          black: "#050B14",
          red: "#CE1126",
          gold: "#F7D116",
        },
        fronex: {
          DEFAULT: "#00FFA3",
          red: "#CE1126",
          gold: "#F7D116",
          neon: "#00FFA3",
          navy: "#050B14",
          surface: "#0F1626",
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
        neon: "0 0 24px -4px rgba(0,255,163,0.45)",
        "neon-lg": "0 0 48px -8px rgba(0,255,163,0.35)",
      },
      backgroundImage: {
        "flag-thread":
          "linear-gradient(90deg, #050B14 0%, #00FFA3 50%, #00E0FF 100%)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,255,163,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,180,255,0.08), transparent 50%)",
        "section-fade":
          "linear-gradient(180deg, #050B14 0%, #0A0F1C 50%, #050B14 100%)",
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
