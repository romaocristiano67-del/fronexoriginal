"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Coins,
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
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
          ? "border-b border-white/[0.06] bg-canvas/90 text-white shadow-[0_18px_60px_-38px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          : "bg-transparent text-white"
      }`}
    >
      <div className="container-fronex flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="relative h-10 w-28 overflow-hidden rounded-lg border border-white/10 bg-white shadow-sm sm:w-36">
            <Image
              src="/images/logo-fronex-wordmark.jpg"
              alt="Fronex"
              fill
              sizes="(min-width: 640px) 144px, 112px"
              className="object-cover"
              priority
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-surface text-ink-muted transition-colors hover:border-accent/40 hover:text-accent sm:flex"
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
              <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-surface px-3 py-2 text-xs font-medium text-ink-muted">
                <Coins size={14} className="text-accent" />
                {tokens ?? "..."} tokens
              </span>
              <Link href="/dashboard" className="btn-primary h-9 px-4 text-sm">
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Terminar sessão"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-surface text-white transition-colors hover:border-accent/40 hover:text-accent"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary hidden h-9 px-4 text-sm md:flex">
              Entrar / Criar Conta
              <ArrowRight size={14} />
            </Link>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-accent transition-colors hover:bg-accent/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/[0.06] bg-canvas/95 text-white backdrop-blur-xl md:hidden"
          >
            <div className="container-fronex flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
              {email ? (
                <div className="mt-2 grid gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary justify-center"
                  >
                    Dashboard
                    <LayoutDashboard size={14} />
                  </Link>
                  <button onClick={handleLogout} className="btn-secondary justify-center">
                    Sair
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn-primary mt-2 justify-center">
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
