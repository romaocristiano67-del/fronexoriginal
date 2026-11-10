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
  BriefcaseBusiness,
  UsersRound,
  PanelsTopLeft,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Wordmark from "@/components/wordmark";

const NAV_LINKS = [
  { label: "Serviços", href: "#servicos", icon: BriefcaseBusiness, tone: "navy" },
  { label: "Mentores", href: "#mentores", icon: UsersRound, tone: "sky" },
  { label: "Portfólio", href: "#portfolio", icon: PanelsTopLeft, tone: "blue" },
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
      className={`fixed top-0 ${menuOpen ? "z-[90]" : "z-50"} w-full border-b border-white/10 bg-nav text-nav-ink shadow-[0_2px_12px_-8px_rgba(0,0,0,0.5)] transition-colors duration-300 ${
        scrolled
          ? "shadow-[0_4px_18px_-10px_rgba(0,0,0,0.55)]"
          : ""
      }`}
    >
      <div className="container-fronex flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex min-w-0 items-center">
          <Wordmark textClassName="text-nav-ink text-[1.06rem] sm:text-[1.16rem]" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-nav-muted transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {email ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-nav-ink">
                <Coins size={14} className="text-accent-soft" />
                {tokens ?? "..."} tokens
              </span>
              <Link href="/dashboard" className="btn-primary h-9 px-4 text-sm">
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Terminar sessão"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/20 bg-white/10 text-nav-ink transition-colors hover:border-accent-soft hover:text-accent-soft"
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
            className="flex h-11 w-11 items-center justify-center rounded-md text-accent-soft transition-colors hover:bg-white/10 md:hidden"
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
            className="absolute inset-x-0 top-full z-[60] h-[calc(100dvh-4.05rem)] overflow-y-auto border-t border-border bg-canvas text-ink shadow-[0_20px_48px_-26px_rgba(7,31,51,0.32)] md:hidden"
          >
            <nav aria-label="Navegação principal móvel" className="container-fronex flex min-h-full flex-col gap-3 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Navegação
              </p>
              {NAV_LINKS.map((link, index) => {
                const Icon = link.icon;
                const toneClass = {
                  navy: "bg-nav text-white",
                  sky: "bg-accent-soft/35 text-accent-dim",
                  blue: "bg-accent/10 text-accent",
                }[link.tone];

                return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex min-h-[76px] items-center gap-4 rounded-md border border-border bg-surface px-4 py-3 text-left shadow-[0_5px_18px_-16px_rgba(7,31,51,0.35)] transition-colors duration-200 hover:border-accent/40 hover:bg-white"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${toneClass}`}>
                    <Icon size={21} strokeWidth={1.7} />
                  </span>
                  <span className="flex-1 text-base font-semibold text-ink">
                    {link.label}
                  </span>
                  <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-canvas px-2 text-[11px] font-semibold tabular-nums text-muted">
                    0{index + 1}
                  </span>
                </a>
                );
              })}
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
