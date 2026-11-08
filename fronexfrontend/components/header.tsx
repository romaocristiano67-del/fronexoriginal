"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Coins,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Wordmark from "@/components/wordmark";
import ThemeToggle from "@/components/theme-toggle";

const NAV_LINKS = [
  { label: "Serviços", href: "#servicos" },
  { label: "Mentores", href: "#mentores" },
  { label: "Portfólio", href: "#portfolio" },
];

export default function Header() {
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
      className={`fixed top-0 z-50 w-full border-b border-border/50 bg-surface/95 text-ink shadow-[0_8px_32px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl backdrop-saturate-[180%] transition-all duration-300 supports-[backdrop-filter]:bg-surface/70 ${
        scrolled
          ? "shadow-[0_12px_36px_-26px_rgba(15,23,42,0.34)]"
          : ""
      }`}
    >
      <div className="container-fronex flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex min-w-0 items-center">
          <Wordmark textClassName="text-[1.06rem] sm:text-[1.16rem]" />
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
          <ThemeToggle className="h-11 w-11" />

          {email ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="flex items-center gap-1.5 rounded-md border border-border bg-canvas/60 px-3 py-2 text-xs font-medium text-ink-muted">
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
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink transition-colors hover:border-accent/40 hover:text-accent"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary hidden h-9 px-4 text-sm md:flex">
              Entrar
              <ArrowRight size={14} />
            </Link>
          )}

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-accent transition-colors hover:bg-accent/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-border/60 text-ink md:hidden"
          >
            <nav aria-label="Navegação principal móvel" className="container-fronex flex min-h-full flex-col gap-1 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-ink-muted transition-colors hover:bg-canvas/60 hover:text-accent"
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
                  Entrar
                  <ArrowRight size={14} />
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
