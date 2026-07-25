"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
  CircleDashed,
  Command,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquareMore,
  Moon,
  PanelLeft,
  PhoneCall,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
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

type CommandAction = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  icon: typeof Sparkles;
  onSelect: () => void;
};

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

function formatStatusLabel(status: string) {
  if (status === "A aguardar verificação") return "Em revisão";
  if (status === "Inativo") return "Disponível";
  return status;
}

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
      className="flex w-full items-center justify-between gap-5 rounded-2xl border border-[#141C2E] bg-surface p-4 text-left transition-colors hover:border-accent/30"
    >
      <span>
        <span className="block text-sm font-bold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-ink-muted">
          {description}
        </span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-canvas shadow-lg transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

function ProgressRing({
  label,
  caption,
  value,
  accent,
  icon: Icon,
  suffix = "%",
}: {
  label: string;
  caption: string;
  value: number;
  accent: string;
  icon: typeof Sparkles;
  suffix?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="rounded-2xl border border-[#141C2E] bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
          <Icon size={16} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative h-20 w-20 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${accent} ${clamped * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
          }}
        >
          <div className="absolute inset-[0.3rem] rounded-full border border-[#141C2E] bg-canvas" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(clamped)}
                {suffix}
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">{caption}</p>
          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Atualizado em tempo real com base na sessão actual.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-24 flex-col justify-between rounded-2xl border border-[#141C2E] bg-surface p-4 text-left transition-colors hover:border-accent/30 active:scale-[0.98]"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
        <Icon size={18} />
      </span>
      <span>
        <span className="block text-sm font-bold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-ink-muted">
          {description}
        </span>
      </span>
    </button>
  );
}

function CommandPalette({
  open,
  query,
  setQuery,
  commands,
  onClose,
}: {
  open: boolean;
  query: string;
  setQuery: (value: string) => void;
  commands: CommandAction[];
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? commands.filter((command) => {
        const haystack = [
          command.label,
          command.description,
          ...command.keywords,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : commands;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/65 px-4 py-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#141C2E] bg-surface text-white shadow-soft-dark"
          >
            <div className="flex items-center gap-3 border-b border-[#141C2E] bg-canvas/50 px-4 py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                <Command size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Pesquisar acções, secções ou serviços..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-muted"
                />
                <p className="mt-1 text-[11px] text-muted">
                  Ctrl+K no desktop. No mobile, toque numa acção rápida ou no
                  botão de pesquisa.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#141C2E] bg-canvas px-3 py-2 text-xs font-semibold text-ink-muted hover:text-accent"
              >
                Fechar
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {filtered.length ? (
                <div className="grid gap-2">
                  {filtered.map((command) => {
                    const Icon = command.icon;
                    return (
                      <button
                        key={command.id}
                        type="button"
                        onClick={() => {
                          command.onSelect();
                          onClose();
                        }}
                        className="flex items-start gap-3 rounded-xl border border-[#141C2E] bg-canvas/40 p-4 text-left transition-colors hover:border-accent/30 hover:bg-accent/5"
                      >
                        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-white">
                            {command.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-ink-muted">
                            {command.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#141C2E] bg-canvas/40 px-4 py-10 text-center text-sm text-ink-muted">
                  Nenhuma acção encontrada. Tente outro termo.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DashboardShell({ user }: { user: DashboardUser }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [notifications, setNotifications] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const [phone, setPhone] = useState("");
  const [tokensRemaining, setTokensRemaining] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
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

  const serviceMetrics = useMemo(() => {
    const pending = ACTIVE_SERVICES.filter(
      (service) => service.status === "A aguardar verificação",
    ).length;
    const inactive = ACTIVE_SERVICES.filter(
      (service) => service.status === "Inativo",
    ).length;
    const profilePieces = [displayName.trim(), phone.trim()].filter(
      Boolean,
    ).length;

    return {
      totalServices: ACTIVE_SERVICES.length,
      pending,
      inactive,
      profileProgress: Math.round((profilePieces / 2) * 100),
      projectProgress: Math.round(
        ((ACTIVE_SERVICES.length - pending) / ACTIVE_SERVICES.length) * 100,
      ),
      tokensProgress: Math.round(((tokensRemaining ?? 25) / 25) * 100),
    };
  }, [displayName, phone, tokensRemaining]);

  const activeTabLabel = TABS.find((tab) => tab.id === activeTab)?.label;

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const loadProfile = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setTokensRemaining(null);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("daily_tokens")
        .eq("id", authUser.id)
        .maybeSingle();

      setTokensRemaining(
        typeof data?.daily_tokens === "number" ? data.daily_tokens : 25,
      );
    };

    loadProfile();

    const { data } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    const onTokensUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ tokensRemaining?: number }>)
        .detail;
      if (typeof detail?.tokensRemaining === "number") {
        setTokensRemaining(detail.tokensRemaining);
      }
    };

    window.addEventListener("fronex:tokens-updated", onTokensUpdated);

    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("fronex:tokens-updated", onTokensUpdated);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }

      if (event.key === "Escape") {
        setPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
      { duration: 1800 },
    );

    window.setTimeout(() => {
      window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }, 900);
  };

  const commandActions: CommandAction[] = [
    {
      id: "overview",
      label: "Visão Geral",
      description: "Voltar ao resumo bento da conta.",
      keywords: ["resumo", "dashboard", "overview"],
      icon: LayoutDashboard,
      onSelect: () => setActiveTab("overview"),
    },
    {
      id: "profile",
      label: "O Meu Perfil",
      description: "Abrir os dados do cliente e contacto.",
      keywords: ["perfil", "nome", "contacto"],
      icon: UserRound,
      onSelect: () => setActiveTab("profile"),
    },
    {
      id: "preferences",
      label: "Preferências",
      description: "Alternar tema e opções da interface.",
      keywords: ["preferências", "tema", "settings"],
      icon: Settings2,
      onSelect: () => setActiveTab("preferences"),
    },
    {
      id: "services",
      label: "Serviços",
      description: "Ver os serviços e o estado actual.",
      keywords: ["serviços", "status", "consultoria"],
      icon: BriefcaseBusiness,
      onSelect: () => setActiveTab("services"),
    },
    {
      id: "search",
      label: "Abrir pesquisa",
      description: "Voltar ao comando rápido quando precisar.",
      keywords: ["pesquisa", "buscar", "command"],
      icon: Search,
      onSelect: () => setPaletteOpen(true),
    },
    {
      id: "quick-contact",
      label: "Contactar no WhatsApp",
      description: "Abrir o atendimento premium da dashboard.",
      keywords: ["whatsapp", "apoio", "contactar"],
      icon: PhoneCall,
      onSelect: () =>
        handleServiceRequest("Apoio rápido da Dashboard", "Pedido rápido"),
    },
    {
      id: "theme",
      label: "Alternar tema",
      description: "Mudar a aparência da interface.",
      keywords: ["tema", "dark", "light"],
      icon: Moon,
      onSelect: toggleTheme,
    },
    {
      id: "logout",
      label: "Terminar sessão",
      description: "Fechar a conta e voltar ao site.",
      keywords: ["sair", "logout"],
      icon: LogOut,
      onSelect: handleLogout,
    },
  ];

  return (
    <main className="min-h-screen bg-canvas text-white">
      <div
        aria-hidden
        className="fixed inset-0 bg-[linear-gradient(180deg,rgba(0,255,163,0.04)_0%,transparent_22%),radial-gradient(ellipse_at_top_right,rgba(0,255,163,0.08),transparent_45%)]"
      />
      <div
        aria-hidden
        className="fixed inset-0 bg-[linear-gradient(rgba(0,255,163,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,163,0.04)_1px,transparent_1px)] bg-[size:36px_36px] opacity-30"
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-[#141C2E] bg-canvas p-5 lg:block">
          <div className="flex h-full flex-col">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white">
                <Image
                  src="/images/logo-fronex-crop.jpg"
                  alt="Fronex"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="font-display text-xl font-bold uppercase tracking-[0.18em]">
                FRONEX
              </span>
            </Link>

            <div className="mt-8 rounded-2xl border border-[#141C2E] bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 font-semibold text-accent">
                  {initials || "F"}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {displayName || "Cliente Fronex"}
                  </p>
                  <p className="truncate text-xs text-ink-muted">
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
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border border-accent/40 bg-accent/10 text-accent"
                        : "border border-transparent text-ink-muted hover:bg-surface hover:text-white"
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
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface hover:text-accent"
              >
                <Home size={18} />
                Voltar ao site
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface hover:text-accent"
              >
                <LogOut size={18} />
                Terminar sessão
              </button>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-[#141C2E] bg-canvas/90 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  <PanelLeft size={14} />
                  Dashboard
                </div>
                <h1 className="mt-1 truncate font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {activeTabLabel}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  aria-label="Abrir pesquisa rápida"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#141C2E] bg-surface text-ink-muted transition-colors hover:border-accent/40 hover:text-accent lg:h-10 lg:w-auto lg:gap-2 lg:px-3"
                >
                  <Search size={17} />
                  <span className="hidden text-xs font-semibold lg:inline">
                    Pesquisar
                  </span>
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={
                    theme === "light"
                      ? "Ativar modo escuro"
                      : "Ativar modo claro"
                  }
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#141C2E] bg-surface text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Terminar sessão"
                  className="btn-primary hidden h-11 px-4 text-sm font-bold sm:flex"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 lg:grid-cols-12"
              >
                <div className="rounded-2xl border border-[#141C2E] bg-surface p-5 lg:col-span-7 lg:p-6">
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#141C2E] bg-accent/10 px-3 py-1.5 text-xs font-semibold text-ink-muted">
                          <Sparkles size={13} className="text-accent" />
                          Resumo em tempo real
                        </div>
                        <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                          {displayName || "Cliente Fronex"}, a sua operação está
                          pronta para avançar.
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
                          A visão geral foi reorganizada em módulos pequenos
                          para leitura rápida no telemóvel, com os dados da
                          sessão a manterem-se ligados ao Supabase.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPaletteOpen(true)}
                        className="hidden h-12 w-12 items-center justify-center rounded-xl border border-[#141C2E] bg-surface text-accent transition-colors hover:border-accent/40 sm:flex"
                      >
                        <Command size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <QuickActionButton
                        icon={PhoneCall}
                        label="WhatsApp"
                        description="Abrir o atendimento premium."
                        onClick={() =>
                          handleServiceRequest(
                            "Apoio rápido da Dashboard",
                            "Pedido rápido",
                          )
                        }
                      />
                      <QuickActionButton
                        icon={UserRound}
                        label="Editar perfil"
                        description="Ir para os dados do cliente."
                        onClick={() => setActiveTab("profile")}
                      />
                      <QuickActionButton
                        icon={BriefcaseBusiness}
                        label="Ver serviços"
                        description="Consultar o estado actual."
                        onClick={() => setActiveTab("services")}
                      />
                      <QuickActionButton
                        icon={Settings2}
                        label="Preferências"
                        description="Tema e layout da interface."
                        onClick={() => setActiveTab("preferences")}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#141C2E] bg-surface p-5 lg:col-span-5 lg:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Estado rápido
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        Indicadores compactos
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#141C2E] bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                      Actualizado
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <ProgressRing
                      label="Perfil"
                      caption="Completo para propostas mais precisas"
                      value={serviceMetrics.profileProgress}
                      accent="#00FFA3"
                      icon={UserRound}
                    />
                    <ProgressRing
                      label="Projetos"
                      caption={`${serviceMetrics.totalServices - serviceMetrics.pending}/${serviceMetrics.totalServices} em circulação`}
                      value={serviceMetrics.projectProgress}
                      accent="#00E0FF"
                      icon={CircleDashed}
                    />
                    <ProgressRing
                      label="Tokens"
                      caption={`${tokensRemaining ?? 25} disponíveis hoje`}
                      value={serviceMetrics.tokensProgress}
                      accent="#00FFA3"
                      icon={ShieldCheck}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#141C2E] bg-surface p-5 lg:col-span-8 lg:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Serviços em foco
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        Estado dos projectos
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#141C2E] bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                      {serviceMetrics.pending} em revisão
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {ACTIVE_SERVICES.map((service, index) => {
                      const accent =
                        index === 0
                          ? "#00FFA3"
                          : index === 1
                            ? "#00E0FF"
                            : "#00FFA3";

                      return (
                        <article
                          key={service.title}
                          className="rounded-2xl border border-[#141C2E] bg-canvas/50 p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="font-display text-lg font-bold text-white">
                                {service.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-ink-muted">
                                {service.detail}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              <div
                                className="relative h-14 w-14 rounded-full"
                                style={{
                                  background: `conic-gradient(${accent} ${index === 0 ? 72 : index === 1 ? 48 : 48}deg, rgba(255,255,255,0.12) 0deg)`,
                                }}
                              >
                                <div className="absolute inset-[0.22rem] rounded-full border border-[#141C2E] bg-canvas" />
                                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
                                  {index === 0 ? "72%" : "48%"}
                                </div>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                  service.status === "A aguardar verificação"
                                    ? "bg-accent/15 text-white"
                                    : "bg-accent/10 text-ink-muted"
                                }`}
                              >
                                {formatStatusLabel(service.status)}
                              </span>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#141C2E] bg-surface p-5 lg:col-span-4 lg:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Perfil
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        Dados do cliente
                      </h3>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 font-semibold text-accent">
                      {initials || "F"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label className="grid gap-2 text-sm font-bold text-white">
                      Nome completo
                      <input
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        placeholder="Introduza o seu nome"
                        className="min-h-12 rounded-xl border border-[#141C2E] bg-canvas-light px-4 py-3 text-sm font-normal text-white outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-white">
                      Email
                      <input
                        value={user.email}
                        readOnly
                        className="min-h-12 rounded-xl border border-[#141C2E] bg-canvas/60 px-4 py-3 text-sm font-normal text-ink-muted outline-none"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-white">
                      Telefone
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+244 ..."
                        className="min-h-12 rounded-xl border border-[#141C2E] bg-canvas-light px-4 py-3 text-sm font-normal text-white outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#141C2E] bg-surface p-5 lg:col-span-6 lg:p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      Preferências rápidas
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">
                      Controlo de uma só mão
                    </h3>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <ToggleRow
                      checked={theme === "dark"}
                      label="Tema"
                      description="Alternar entre claro e escuro."
                      onChange={toggleTheme}
                    />
                    <ToggleRow
                      checked={notifications}
                      label="Notificações"
                      description="Receber avisos sobre pedidos e mudanças."
                      onChange={() => setNotifications((value) => !value)}
                    />
                    <ToggleRow
                      checked={compactLayout}
                      label="Layout compacto"
                      description="Reduzir os espaços entre os módulos."
                      onChange={() => setCompactLayout((value) => !value)}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-[#141C2E] bg-surface p-5 lg:col-span-6 lg:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Acesso rápido
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        Ações grandes e sem erro
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaletteOpen(true)}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#141C2E] bg-surface text-accent transition-colors hover:border-accent/40"
                    >
                      <Search size={17} />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <QuickActionButton
                      icon={MessageSquareMore}
                      label="Pesquisa rápida"
                      description="Abrir o command palette."
                      onClick={() => setPaletteOpen(true)}
                    />
                    <QuickActionButton
                      icon={PhoneCall}
                      label="WhatsApp"
                      description="Falar com a equipa."
                      onClick={() =>
                        handleServiceRequest(
                          "Apoio rápido da Dashboard",
                          "Pedido rápido",
                        )
                      }
                    />
                    <QuickActionButton
                      icon={LayoutDashboard}
                      label="Resumo"
                      description="Voltar à visão geral."
                      onClick={() => setActiveTab("overview")}
                    />
                    <QuickActionButton
                      icon={LogOut}
                      label="Sair"
                      description="Terminar sessão com segurança."
                      onClick={handleLogout}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl rounded-2xl border border-[#141C2E] bg-surface p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 font-semibold text-accent">
                    {initials || "F"}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Dados do cliente
                    </p>
                    <p className="text-xs text-ink-muted">
                      Sessão activa: {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Nome completo
                    <input
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="Introduza o seu nome"
                      className="min-h-12 rounded-xl border border-[#141C2E] bg-canvas-light px-4 py-3 text-sm font-normal text-white outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Email
                    <input
                      value={user.email}
                      readOnly
                      className="min-h-12 rounded-xl border border-[#141C2E] bg-canvas/60 px-4 py-3 text-sm font-normal text-ink-muted outline-none"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-white">
                    Telefone
                    <input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+244 ..."
                      className="min-h-12 rounded-xl border border-[#141C2E] bg-canvas-light px-4 py-3 text-sm font-normal text-white outline-none placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent"
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
                  description="Alterna a interface entre claro e escuro."
                  onChange={toggleTheme}
                />
                <ToggleRow
                  checked={notifications}
                  label="Notificações"
                  description="Receber avisos sobre propostas, serviços e actualizações."
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
                {ACTIVE_SERVICES.map((service, index) => (
                  <article
                    key={service.title}
                    className="rounded-2xl border border-[#141C2E] bg-surface p-5"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-display text-xl font-bold text-white">
                          {service.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">
                          {service.detail}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                        <span
                          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                            service.status === "A aguardar verificação"
                              ? "bg-accent/15 text-white"
                              : "bg-accent/10 text-ink-muted"
                          }`}
                        >
                          {formatStatusLabel(service.status)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleServiceRequest(service.title, service.status)
                          }
                          className="btn-primary font-bold"
                        >
                          <span className="relative">
                            {service.status === "Inativo"
                              ? "Subscrever"
                              : "Finalizar verificação"}
                          </span>
                          <ArrowUpRight size={15} className="relative" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3">
                      <div className="h-2 rounded-full bg-accent/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${index === 0 ? 72 : 48}%`,
                            background:
                              index === 0
                                ? "linear-gradient(90deg,#00FFA3,#00E0FF)"
                                : "linear-gradient(90deg,#00E0FF,#00FFA3)",
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                        {index === 0 ? "72%" : "48%"}
                      </span>
                    </div>
                  </article>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#141C2E] bg-canvas/95 px-3 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-accent/15 text-accent"
                    : "text-ink-muted hover:bg-surface hover:text-white"
                }`}
              >
                <Icon size={18} />
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        aria-label="Abrir pesquisa rápida"
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent text-canvas shadow-neon lg:hidden"
      >
        <Search size={18} />
      </button>

      <CommandPalette
        open={paletteOpen}
        query={paletteQuery}
        setQuery={setPaletteQuery}
        commands={commandActions}
        onClose={() => {
          setPaletteOpen(false);
          setPaletteQuery("");
        }}
      />
    </main>
  );
}
