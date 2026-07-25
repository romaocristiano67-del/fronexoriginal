"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  Brush,
  Clapperboard,
  Globe2,
  LayoutDashboard,
  Megaphone,
  Smartphone,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  buildPremiumServiceRequestMessage,
  getWhatsAppLink,
} from "@/lib/whatsapp";

type MockupKind =
  | "website"
  | "mobile"
  | "system"
  | "social"
  | "aiVideo"
  | "videoEdit"
  | "brand";

type PortfolioItem = {
  title: string;
  service: string;
  description: string;
  detail: string;
  kind: MockupKind;
  icon: typeof Globe2;
  color: string;
};

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    title: "Landing page para marca premium",
    service: "Sites & Web",
    description: "Hero forte, catálogo visual e CTA direto para conversão.",
    detail: "Modelo com camadas de interface, brilho lateral e profundidade para simular uma página premium no telemóvel.",
    kind: "website",
    icon: Globe2,
    color: "#CE1126",
  },
  {
    title: "App mobile de pedidos",
    service: "Aplicações Mobile",
    description: "Onboarding, pedidos, notificações e área de cliente.",
    detail: "Mockup 3D vertical com cartões empilhados para transmitir rapidez, toque e fluxo de compra.",
    kind: "mobile",
    icon: Smartphone,
    color: "#F7D116",
  },
  {
    title: "Sistema web de gestão",
    service: "Sistemas Web",
    description: "Dashboard operacional com métricas e processos.",
    detail: "Painel técnico em camadas, pensado para mostrar dados com clareza mesmo em ecrãs pequenos.",
    kind: "system",
    icon: LayoutDashboard,
    color: "#38BDF8",
  },
  {
    title: "Calendário de conteúdo social",
    service: "Gestão de Redes/TikTok",
    description: "Posts, campanhas e peças para redes e WhatsApp.",
    detail: "Tiles flutuantes em grelha social, com destaque para ritmo visual e consistência de conteúdo.",
    kind: "social",
    icon: Megaphone,
    color: "#2563EB",
  },
  {
    title: "Vídeo comercial com IA",
    service: "Vídeos de IA",
    description: "Storyboard, avatar, voz e variações criativas.",
    detail: "Cena cinematográfica com núcleo luminoso e frames laterais para representar produção com IA.",
    kind: "aiVideo",
    icon: Bot,
    color: "#8B5CF6",
  },
  {
    title: "Timeline de edição dinâmica",
    service: "Edição de Vídeos",
    description: "Cortes, legendas, motion e exportação social.",
    detail: "Linha do tempo 3D com blocos de edição e camadas de áudio, pronta para interação por arrasto.",
    kind: "videoEdit",
    icon: Clapperboard,
    color: "#10B981",
  },
  {
    title: "Sistema visual de marca",
    service: "Design Gráfico / UI/UX",
    description: "Identidade visual, componentes e peças de comunicação.",
    detail: "Peças de marca orbitais, paleta coerente e composição tecnológica com acabamento premium.",
    kind: "brand",
    icon: Brush,
    color: "#F97316",
  },
];

function useDeviceTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = Math.max(-24, Math.min(24, event.beta ?? 0));
      const gamma = Math.max(-24, Math.min(24, event.gamma ?? 0));
      setTilt({ x: beta / 260, y: gamma / 220 });
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => window.removeEventListener("deviceorientation", handleOrientation, true);
  }, []);

  return tilt;
}

function InterfaceModel({
  kind,
  color,
  dragRotation,
  expanded,
}: {
  kind: MockupKind;
  color: string;
  dragRotation: { x: number; y: number };
  expanded: boolean;
}) {
  const group = useRef<Group>(null);
  const tilt = useDeviceTilt();
  const pieces = useMemo(() => {
    if (kind === "mobile") return { count: 5, width: 1.05, height: 1.72, gap: 0.16 };
    if (kind === "system") return { count: 7, width: 1.45, height: 0.82, gap: 0.14 };
    if (kind === "social") return { count: 6, width: 0.64, height: 0.82, gap: 0.16 };
    if (kind === "videoEdit") return { count: 8, width: 1.12, height: 0.24, gap: 0.12 };
    if (kind === "brand") return { count: 6, width: 0.72, height: 0.72, gap: 0.18 };
    if (kind === "aiVideo") return { count: 5, width: 0.92, height: 1.08, gap: 0.16 };
    return { count: 5, width: 1.34, height: 0.78, gap: 0.16 };
  }, [kind]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const time = clock.getElapsedTime();
    group.current.rotation.x += ((dragRotation.x + tilt.x) - group.current.rotation.x) * 0.08;
    group.current.rotation.y += ((dragRotation.y + tilt.y + Math.sin(time * 0.4) * 0.08) - group.current.rotation.y) * 0.08;
    group.current.position.y = Math.sin(time * 0.75) * 0.035;
    group.current.scale.setScalar(expanded ? 1.08 : 1);
  });

  const accentRows = pieces.count;

  return (
    <group ref={group} rotation={[0.12, -0.18, 0]}>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[2.2, 2.55, 0.1]} />
        <meshStandardMaterial color="#09090b" metalness={0.65} roughness={0.28} />
      </mesh>

      {Array.from({ length: accentRows }).map((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const isTimeline = kind === "videoEdit";
        const x = isTimeline ? 0 : (col - 1) * (pieces.width * 0.52 + pieces.gap);
        const y = isTimeline
          ? 0.74 - index * 0.22
          : 0.58 - row * (pieces.height * 0.52 + pieces.gap);
        const z = 0.04 + index * 0.012;
        const width = isTimeline ? pieces.width + (index % 3) * 0.24 : pieces.width;
        const height = isTimeline ? pieces.height : pieces.height;

        return (
          <group key={`${kind}-${index}`} position={[x, y, z]}>
            <mesh>
              <boxGeometry args={[width, height, 0.08]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? color : "#f8fafc"}
                emissive={index % 2 === 0 ? color : "#111827"}
                emissiveIntensity={index % 2 === 0 ? 0.18 : 0.04}
                metalness={0.28}
                roughness={0.34}
                transparent
                opacity={index % 2 === 0 ? 0.88 : 0.72}
              />
            </mesh>
            <mesh position={[0, -height * 0.24, 0.055]}>
              <boxGeometry args={[width * 0.62, 0.035, 0.03]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.08} transparent opacity={0.68} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, 0, 0.18]}>
        <torusGeometry args={[1.42, 0.01, 8, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.72} transparent opacity={0.72} />
      </mesh>
      <mesh position={[0.92, -0.78, 0.24]}>
        <sphereGeometry args={[0.11, 18, 18]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={0.44} metalness={0.35} roughness={0.2} />
      </mesh>
    </group>
  );
}

function ProjectCanvas({
  item,
  dragRotation,
  expanded,
}: {
  item: PortfolioItem;
  dragRotation: { x: number; y: number };
  expanded: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.25], fov: 40 }}
      dpr={[1, 1.45]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.65 }}
      className="pointer-events-none"
    >
      <ambientLight intensity={1.05} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-2.5, -1.5, 3]} intensity={1.1} color={item.color} />
      <InterfaceModel
        kind={item.kind}
        color={item.color}
        dragRotation={dragRotation}
        expanded={expanded}
      />
    </Canvas>
  );
}

function PortfolioCard({
  item,
  index,
  onServiceRequest,
}: {
  item: PortfolioItem;
  index: number;
  onServiceRequest: (serviceTitle: string) => void;
}) {
  const Icon = item.icon;
  const [expanded, setExpanded] = useState(false);
  const [dragRotation, setDragRotation] = useState({ x: 0.12, y: -0.18 });
  const cardRef = useRef<HTMLElement>(null);
  const dragStart = useRef({ x: 0, y: 0, moved: false });
  const inView = useInView(cardRef, { margin: "220px 0px", once: false });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 6) dragStart.current.moved = true;
    setDragRotation({
      x: Math.max(-0.72, Math.min(0.72, 0.12 + deltaY / 180)),
      y: Math.max(-0.92, Math.min(0.92, -0.18 + deltaX / 150)),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!dragStart.current.moved) setExpanded((value) => !value);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.52, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_24px_90px_-42px_rgba(0,0,0,0.95)] backdrop-blur-2xl"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          background: `radial-gradient(circle at 18% 0%, ${item.color}38, transparent 34%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
        }}
      />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-zinc-300">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          {item.service}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.08] text-white transition-transform duration-300 group-hover:rotate-6">
          <Icon size={18} />
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setExpanded((value) => !value);
        }}
        className="relative h-72 touch-pan-y select-none overflow-hidden rounded-lg border border-white/10 bg-zinc-950/70 outline-none"
      >
        {inView ? (
          <ProjectCanvas item={item} dragRotation={dragRotation} expanded={expanded} />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `radial-gradient(circle at 50% 38%, ${item.color}44, transparent 38%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(9,9,11,0.9))`,
            }}
          />
        )}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
          <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-200 backdrop-blur-xl">
            Arraste para rodar
          </span>
          <span className="rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-200 backdrop-blur-xl">
            Toque para {expanded ? "fechar" : "detalhes"}
          </span>
        </div>
      </div>

      <div className="pt-5">
        <h3 className="font-display text-2xl font-semibold leading-tight text-white">
          {item.title}
        </h3>
        <p className="mt-3 text-base leading-7 text-zinc-300">
          {item.description}
        </p>
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-hidden"
        >
          <p className="mt-4 rounded-md border border-white/10 bg-white/[0.05] p-3 text-sm leading-6 text-zinc-300">
            {item.detail}
          </p>
        </motion.div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
          onClick={() => onServiceRequest(item.service)}
          className="relative mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-white px-4 text-sm font-semibold text-zinc-950 shadow-[0_18px_60px_-24px_rgba(255,255,255,0.9)] transition-[filter,box-shadow] duration-200 hover:brightness-110 active:brightness-95 sm:w-auto"
        >
          <span className="absolute inset-0 translate-x-[-120%] bg-angola-gold/30 transition-transform duration-700 group-hover:translate-x-[120%]" />
          <span className="relative">Solicitar orçamento</span>
          <ArrowUpRight size={15} className="relative" />
        </motion.button>
      </div>
    </motion.article>
  );
}

export default function PortfolioSection() {
  const handleServiceRequest = async (serviceTitle: string) => {
    let clientEmail: string | undefined;
    let clientName: string | undefined;
    let userId: string | undefined;

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      clientEmail = user?.email;
      userId = user?.id;
      clientName =
        typeof user?.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : undefined;
    } catch {
      // Visitantes sem sessão seguem para atendimento sem dados pessoais.
    }

    const message = buildPremiumServiceRequestMessage({
      serviceTitle,
      source: "portfolio",
      clientEmail,
      clientName,
      userId,
    });

    toast.info(
      "A redirecionar para o atendimento premium para finalizar o seu pedido e verificar o pagamento...",
      { duration: 1800 }
    );

    window.setTimeout(() => {
      window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    }, 900);
  };

  return (
    <section id="portfolio" className="relative overflow-hidden bg-zinc-950 py-24 text-white md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(206,17,38,0.16),transparent_32%),radial-gradient(circle_at_90%_40%,rgba(56,189,248,0.12),transparent_30%)]"
      />
      <div className="container-fronex relative z-10">
        <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <div className="flag-thread" />
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
              Portfólio vivo, feito para girar no telemóvel
            </h2>
          </div>
          <p className="text-lg leading-8 text-zinc-300">
            Cada projeto agora aparece como um modelo 3D leve: toque para abrir
            detalhes, arraste para rodar e veja a composição reagir ao movimento
            do smartphone quando disponível.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <PortfolioCard
              key={item.title}
              item={item}
              index={index}
              onServiceRequest={handleServiceRequest}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
