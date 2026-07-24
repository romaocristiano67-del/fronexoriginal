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
        // Base neutra (Apple-like off-white / near-black)
        canvas: {
          DEFAULT: "#FAFAF9",
          dark: "#0A0A0B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#151517",
        },
        border: {
          DEFAULT: "#E7E7E4",
          dark: "#2A2A2E",
        },
        ink: {
          DEFAULT: "#111113",
          dark: "#F4F4F3",
        },
        muted: {
          DEFAULT: "#6B6B6E",
          dark: "#9A9A9E",
        },
        // Cores da bandeira de Angola — usadas com moderação, como assinatura da marca
        angola: {
          black: "#0B0B0C",
          red: "#CE1126",
          gold: "#F7D116",
        },
        fronex: {
          DEFAULT: "#111113",
          red: "#CE1126",
          gold: "#F7D116",
        },
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px -4px rgba(0,0,0,0.06)",
        "soft-lg": "0 20px 60px -15px rgba(0,0,0,0.15)",
        "soft-dark": "0 20px 60px -15px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "flag-thread":
          "linear-gradient(90deg, #0B0B0C 0%, #CE1126 50%, #F7D116 100%)",
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
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
