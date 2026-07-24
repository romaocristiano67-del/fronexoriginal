"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Moon,
  PanelLeft,
  Settings2,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildPremiumServiceRequestMessage,
  getWhatsAppLink,
} from "@/lib/whatsapp";

type DashboardTab = "overview" | "profile" | "preferences" | "services";

interface DashboardUser {
  id: string;
  email: string;
  name: string;
}

const TABS: Array<{
  id: DashboardTab;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
}> = [
  {
    id: "overview",
    label: "Visão Geral",
    shortLabel: "Resumo",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "O Meu Perfil",
    shortLabel: "Perfil",
    icon: UserRound,
  },
  {
    id: "preferences",
    label: "Preferências",
    shortLabel: "Prefs",
    icon: Settings2,
  },
  {
    id: "services",
    label: "Serviços",
    shortLabel: "Serviços",
    icon: BriefcaseBusiness,
  },
];

const ACTIVE_SERVICES = [
  {
    title: "Website institucional",
    status: "A aguardar verificação",
    detail:
      "O serviço fica ativo após confirmação manual do pagamento pela equipa Fronex.",
  },
  {
    title: "Consultoria UI/UX",
    status: "Inativo",
    detail:
      "Pode subscrever este serviço e finalizar o processo pelo atendimento premium.",
  },
  {
    title: "Sistema web de gestão",
    status: "Inativo",
    detail:
      "Dashboards, área administrativa e fluxos internos preparados sob orçamento.",
  },
];

function ToggleRow({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-5 rounded-xl border border-border bg-surface/75 p-4 text-left shadow-soft backdrop-blur-xl transition-colors hover:border-ink dark:border-border-dark dark:bg-surface-dark/70 dark:hover:border-ink-dark"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-muted dark:text-muted-dark">
          {description}
        </span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-ink dark:bg-ink-dark" : "bg-border dark:bg-border-dark"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-soft transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

export default function DashboardShell({ user }: { user: DashboardUser }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [notifications, setNotifications] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const [phone, setPhone] = useState("");
  const { theme, toggleTheme } = useTheme();

  const initials = useMemo(() => {
    const source = displayName.trim() || user.email;
    return source
      .split(/[.@\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [displayName, user.email]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleServiceRequest = (serviceTitle: string, status: string) => {
    const message = buildPremiumServiceRequestMessage({
      serviceTitle,
      source: "dashboard",
      clientEmail: user.email,
      clientName: displayName || undefined,
      userId: user.id,
      status,
    });

    toast.info(
      "A redirecionar para o atendimento premium para finalizar o seu pedido e verificar o pagamento...",
      {
      duration: 1800,
      }
    );

    window.setTimeout(() => {
      window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }, 900);
  };

  const activeTabLabel = TABS.find((tab) => tab.id === activeTab)?.label;

  return (
    <main className="min-h-screen bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-dark">
      <div
        aria-hidden
        className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(206,17,38,0.12),transparent_34%),linear-gradient(180deg,rgba(250,250,249,0)_0%,#FAFAF9_78%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(247,209,22,0.10),transparent_32%),linear-gradient(180deg,rgba(10,10,11,0)_0%,#0A0A0B_82%)]"
      />
      <div
        aria-hidden
        className="fixed inset-0 bg-[linear-gradient(rgba(17,17,19,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,19,0.045)_1px,transparent_1px)] bg-[size:34px_34px] dark:bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)]"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/80 bg-surface/55 p-5 backdrop-blur-2xl dark:border-border-dark dark:bg-surface-dark/45 lg:block">
          <div className="flex h-full flex-col">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-bold text-canvas dark:bg-ink-dark dark:text-canvas-dark">
                F
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                FRONEX
              </span>
            </Link>

            <div className="mt-8 rounded-2xl border border-border bg-white/65 p-4 shadow-soft backdrop-blur-xl dark:border-border-dark dark:bg-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink font-semibold text-canvas dark:bg-ink-dark dark:text-canvas-dark">
                  {initials || "F"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {displayName || "Cliente Fronex"}
                  </p>
                  <p className="truncate text-xs text-muted dark:text-muted-dark">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <nav className="mt-6 space-y-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark"
                        : "text-muted hover:bg-ink/5 hover:text-ink dark:text-muted-dark dark:hover:bg-white/8 dark:hover:text-ink-dark"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {tab.label}
                    </span>
                    {active && <ChevronRight size={16} />}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-ink/5 hover:text-ink dark:text-muted-dark dark:hover:bg-white/8 dark:hover:text-ink-dark"
              >
                <Home size={18} />
                Voltar ao site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted transition-colors hover:bg-angola-red/10 hover:text-angola-red dark:text-muted-dark"
              >
                <LogOut size={18} />
                Terminar sessão
              </button>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-border/75 bg-canvas/75 px-5 py-4 backdrop-blur-2xl dark:border-border-dark dark:bg-canvas-dark/70 sm:px-7 lg:px-10">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted dark:text-muted-dark">
                  <PanelLeft size={14} />
                  Dashboard
                </div>
                <h1 className="mt-1 truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {activeTabLabel}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/80 shadow-soft backdrop-blur-xl transition-colors hover:border-ink dark:border-border-dark dark:bg-surface-dark/70 dark:hover:border-ink-dark"
                >
                  {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Terminar sessão"
                  className="hidden h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-canvas transition-colors hover:bg-angola-red dark:bg-ink-dark dark:text-canvas-dark sm:flex"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div className="px-5 py-6 sm:px-7 lg:px-10 lg:py-9">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    ["0", "Serviços ativos", BriefcaseBusiness],
                    ["25", "Tokens disponíveis", ShieldCheck],
                    ["2", "A aguardar verificação", CheckCircle2],
                  ].map(([value, label, Icon]) => (
                    <div
                      key={label as string}
                      className="rounded-2xl border border-border bg-surface/72 p-5 shadow-soft backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/68"
                    >
                      <Icon size={20} className="text-angola-red" />
                      <p className="mt-6 font-display text-4xl font-semibold">
                        {value as string}
                      </p>
                      <p className="mt-1 text-sm text-muted dark:text-muted-dark">
                        {label as string}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border bg-ink p-6 text-canvas shadow-soft-lg dark:border-border-dark dark:bg-ink-dark dark:text-canvas-dark">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-60">
                    Próxima ação recomendada
                  </p>
                  <h2 className="mt-4 max-w-2xl font-display text-2xl font-semibold">
                    Atualize o seu perfil para receber propostas mais precisas.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 opacity-70">
                    Informações como telefone, objetivo e preferências ajudam a
                    equipa Fronex a preparar recomendações mais ajustadas.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl rounded-2xl border border-border bg-surface/75 p-5 shadow-soft-lg backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/68 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink font-semibold text-canvas dark:bg-ink-dark dark:text-canvas-dark">
                    {initials || "F"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Dados do cliente</p>
                    <p className="text-xs text-muted dark:text-muted-dark">
                      Sessão ativa: {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm font-semibold">
                    Nome completo
                    <input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="Introduza o seu nome"
                      className="rounded-xl border border-border bg-canvas px-4 py-3 text-sm font-normal outline-none transition-colors focus:border-ink dark:border-border-dark dark:bg-canvas-dark dark:focus:border-ink-dark"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Email
                    <input
                      value={user.email}
                      readOnly
                      className="rounded-xl border border-border bg-canvas px-4 py-3 text-sm font-normal text-muted outline-none dark:border-border-dark dark:bg-canvas-dark dark:text-muted-dark"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">
                    Telefone
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+244 ..."
                      className="rounded-xl border border-border bg-canvas px-4 py-3 text-sm font-normal outline-none transition-colors focus:border-ink dark:border-border-dark dark:bg-canvas-dark dark:focus:border-ink-dark"
                    />
                  </label>
                </div>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid max-w-3xl gap-4"
              >
                <ToggleRow
                  checked={theme === "dark"}
                  label="Tema escuro"
                  description="Alterna a interface entre claro e escuro neste dispositivo."
                  onChange={toggleTheme}
                />
                <ToggleRow
                  checked={notifications}
                  label="Notificações"
                  description="Receber avisos sobre propostas, serviços e atualizações."
                  onChange={() => setNotifications((value) => !value)}
                />
                <ToggleRow
                  checked={compactLayout}
                  label="Layout compacto"
                  description="Reduz espaçamentos para uma experiência mais densa."
                  onChange={() => setCompactLayout((value) => !value)}
                />
              </motion.div>
            )}

            {activeTab === "services" && (
              <motion.div
                key="services"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid max-w-4xl gap-4"
              >
                {ACTIVE_SERVICES.map((service) => (
                  <article
                    key={service.title}
                    className="rounded-2xl border border-border bg-surface/75 p-5 shadow-soft backdrop-blur-xl dark:border-border-dark dark:bg-surface-dark/68"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-display text-xl font-semibold">
                          {service.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-muted dark:text-muted-dark">
                          {service.detail}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                        <span
                          className={`w-fit rounded-md px-3 py-1.5 text-xs font-semibold ${
                            service.status === "A aguardar verificação"
                              ? "bg-angola-gold/20 text-ink dark:text-ink-dark"
                              : "bg-border text-muted dark:bg-border-dark dark:text-muted-dark"
                          }`}
                        >
                          {service.status}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleServiceRequest(service.title, service.status)
                          }
                          className="group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md bg-[linear-gradient(135deg,#111113,#CE1126)] px-4 py-2.5 text-sm font-semibold text-white shadow-soft-lg transition-transform hover:-translate-y-0.5 dark:bg-[linear-gradient(135deg,#F4F4F3,#CE1126)] dark:text-canvas-dark"
                        >
                          <span className="absolute inset-0 translate-x-[-120%] bg-white/20 transition-transform duration-700 group-hover/cta:translate-x-[120%]" />
                          <span className="relative">
                            {service.status === "Inativo"
                              ? "Subscrever"
                              : "Finalizar verificação"}
                          </span>
                          <ArrowUpRight size={15} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/88 px-3 py-2 backdrop-blur-2xl dark:border-border-dark dark:bg-surface-dark/88 lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark"
                    : "text-muted dark:text-muted-dark"
                }`}
              >
                <Icon size={18} />
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
