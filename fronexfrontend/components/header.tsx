"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  Coins,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Serviços", href: "#servicos" },
  { label: "Mentores", href: "#mentores" },
  { label: "Criar/Inovar", href: "#inovar" },
  { label: "Portfólio", href: "#portfolio" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [tokens, setTokens] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);

      if (!user) {
        setTokens(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("daily_tokens")
        .eq("id", user.id)
        .maybeSingle();

      setTokens(typeof data?.daily_tokens === "number" ? data.daily_tokens : 25);
    };

    loadProfile();

    const { data } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    const onTokensUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ tokensRemaining?: number }>).detail;
      if (typeof detail?.tokensRemaining === "number") setTokens(detail.tokensRemaining);
    };

    window.addEventListener("fronex:tokens-updated", onTokensUpdated);

    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("fronex:tokens-updated", onTokensUpdated);
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-zinc-950/85 text-white shadow-[0_18px_60px_-32px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-fronex flex h-16 items-center justify-between md:h-20">
        {/* Logótipo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950">
            <span className="font-display text-sm font-bold">
              F
            </span>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            FRONEX
          </span>
          {/* Bandeira de Angola discreta, como assinatura da marca */}
          <span
            aria-hidden
            className="ml-1 h-2 w-3 rounded-[2px] bg-flag-thread opacity-80 transition-opacity group-hover:opacity-100"
          />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Ações à direita */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white shadow-soft transition-colors hover:bg-white/10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25 }}
                className="flex"
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>

          {email ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-zinc-300 shadow-soft">
                <Coins size={14} />
                {tokens ?? "..."} tokens
              </span>
              <Link
                href="/dashboard"
                className="flex h-9 items-center gap-1.5 rounded-md bg-white px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-angola-gold"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Terminar sessão"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-zinc-950 transition-colors hover:bg-angola-gold"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1.5 rounded-md bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-angola-gold md:flex"
            >
              Entrar / Criar Conta
              <ArrowRight size={14} />
            </Link>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-zinc-950/95 text-white backdrop-blur-xl md:hidden"
          >
            <div className="container-fronex flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-100 hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
              {email ? (
                <div className="mt-2 grid gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-zinc-950"
                  >
                    Dashboard
                    <LayoutDashboard size={14} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    Sair
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-zinc-950"
                >
                  Entrar / Criar Conta
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
