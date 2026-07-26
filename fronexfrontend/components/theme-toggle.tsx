"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
      className={`group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface/90 text-ink shadow-[0_12px_30px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-colors hover:border-accent/45 hover:text-accent ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,rgb(var(--color-accent)/0.12),rgb(var(--color-accent-soft)/0.08))] opacity-0 transition-opacity group-hover:opacity-100"
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, y: 8, rotate: -45 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -8, rotate: 45 }}
          transition={{ duration: 0.2 }}
          className="relative flex"
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
