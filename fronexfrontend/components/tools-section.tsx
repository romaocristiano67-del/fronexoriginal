"use client";

import { useMemo, useRef, useState } from "react";
import {
  Bot,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  MessageSquareText,
  PenLine,
  Send,
  Sparkles,
  UserRound,
  Wand2,
  FileArchive,
  Scissors,
  MonitorSmartphone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import RichMessage from "@/components/rich-message";
import { assessInnovateIdea } from "@/lib/ai/innovate";
import { DocumentEditor } from "@/components/document-editor";

type ToolKey =
  | "school-work"
  | "cv"
  | "request"
  | "formal-letter"
  | "invitation"
  | "docs"
  | "site-builder"
  | "image-studio"
  | "assistant"
  | "strategist";

type Field = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
};

const toolCards: Array<{
  id: ToolKey;
  title: string;
  description: string;
  icon: typeof FileText;
  badge?: string;
}> = [
  {
    id: "school-work",
    title: "Trabalhos Escolares",
    description: "Capa angolana, índice, desenvolvimento e referências.",
    icon: FileText,
    badge: "temple.html",
  },
  {
    id: "cv",
    title: "Currículos (CV)",
    description: "CV profissional adaptado ao mercado angolano.",
    icon: UserRound,
  },
  {
    id: "request",
    title: "Requerimentos",
    description: "Pedidos formais com linguagem administrativa.",
    icon: PenLine,
  },
  {
    id: "formal-letter",
    title: "Cartas Formais",
    description: "Pedido, reclamação, motivação e solicitação.",
    icon: MessageSquareText,
  },
  {
    id: "invitation",
    title: "Convites",
    description: "Eventos, formaturas, aniversários e cerimónias.",
    icon: Sparkles,
  },
  {
    id: "assistant",
    title: "Assistente Educacional",
    description: "Apoio educacional e documental em pt-AO.",
    icon: Bot,
  },
  {
    id: "docs",
    title: "Edição de PDF / Fronex Docs",
    description: "Gerador IA com modelo local, paginação e exportação.",
    icon: FileArchive,
  },
  {
    id: "site-builder",
    title: "Fronex Site Builder",
    description: "Questionário, site responsivo e pacote ZIP.",
    icon: MonitorSmartphone,
    badge: "ZIP",
  },
  {
    id: "image-studio",
    title: "Fronex Image Studio",
    description: "Remover fundo, recortar, comprimir e converter.",
    icon: ImageIcon,
    badge: "local",
  },
  {
    id: "strategist",
    title: "Estrategista IA",
    description: "Valida ideias e gera planos de negócios.",
    icon: Wand2,
  },
];

const toolCategories = [
  {
    id: "docs-creation",
    title: "Criação de Documentos",
    icon: FileText,
    tools: ["school-work", "cv", "request", "formal-letter", "invitation"],
  },
  {
    id: "editing",
    title: "Ferramentas de Edição",
    icon: Scissors,
    tools: ["docs", "image-studio"],
  },
  {
    id: "web",
    title: "Geração Web",
    icon: MonitorSmartphone,
    tools: ["site-builder"],
  },
  {
    id: "ai",
    title: "Assistente IA",
    icon: Bot,
    tools: ["assistant", "strategist"],
  }
];

const fields: Partial<Record<ToolKey, Field[]>> = {
  "school-work": [
    { key: "school", label: "Escola / Instituição", placeholder: "Ex: Escola Secundária do Cazenga" },
    { key: "subject", label: "Disciplina", placeholder: "Ex: Química" },
    { key: "grade", label: "Classe / Ano", placeholder: "Ex: 10.ª Classe" },
    { key: "topic", label: "Tema do trabalho", placeholder: "Ex: As ligações químicas e os seus tipos" },
    { key: "teacher", label: "Professor", placeholder: "Ex: Prof. António Sebastião" },
    { key: "authors", label: "Autores", placeholder: "Um nome por linha", type: "textarea" },
    {
      key: "pages",
      label: "Paginação",
      type: "select",
      options: ["5-8 páginas", "8-12 páginas", "12-18 páginas"],
    },
  ],
  cv: [
    { key: "name", label: "Nome completo", placeholder: "Ex: Maria Joaquina da Silva" },
    { key: "phone", label: "Telefone", placeholder: "+244 9XX XXX XXX" },
    { key: "email", label: "E-mail", placeholder: "email@exemplo.com" },
    { key: "area", label: "Área / Cargo alvo", placeholder: "Ex: Gestão administrativa" },
    { key: "education", label: "Formação", placeholder: "Curso, instituição e ano", type: "textarea" },
    { key: "experience", label: "Experiência", placeholder: "Funções, empresas e resultados", type: "textarea" },
    { key: "skills", label: "Competências", placeholder: "Excel, liderança, atendimento..." },
  ],
  request: [
    { key: "name", label: "Nome do requerente", placeholder: "Ex: José António Cardoso" },
    { key: "bi", label: "N.º do BI", placeholder: "000000000LA000" },
    { key: "recipient", label: "Destinatário", placeholder: "Ex: Exmo. Sr. Director..." },
    {
      key: "subject",
      label: "Assunto",
      type: "select",
      options: ["Pedido de Declaração de Frequência", "Pedido de Certidão", "Revisão de nota", "Transferência", "Outro"],
    },
    { key: "details", label: "Detalhes", placeholder: "Explique o motivo e o uso do documento", type: "textarea" },
  ],
  "formal-letter": [
    {
      key: "letterType",
      label: "Tipo de carta",
      type: "select",
      options: ["Pedido", "Reclamação", "Motivação", "Solicitação", "Agradecimento", "Recomendação"],
    },
    { key: "sender", label: "Remetente", placeholder: "Nome de quem envia" },
    { key: "recipient", label: "Destinatário", placeholder: "Nome ou instituição" },
    { key: "subject", label: "Assunto", placeholder: "Ex: Pedido de oportunidade de estágio" },
    { key: "details", label: "Contexto", placeholder: "Descreva o objectivo da carta", type: "textarea" },
  ],
  invitation: [
    {
      key: "eventType",
      label: "Tipo de evento",
      type: "select",
      options: ["Aniversário", "Formatura", "Evento empresarial", "Casamento", "Cerimónia familiar"],
    },
    { key: "host", label: "Anfitrião / Organização", placeholder: "Quem convida" },
    { key: "date", label: "Data e hora", placeholder: "Ex: 15 de Agosto, 18h" },
    { key: "place", label: "Local", placeholder: "Ex: Talatona, Luanda" },
    { key: "tone", label: "Tom", type: "select", options: ["Elegante", "Familiar", "Jovem", "Institucional"] },
  ],
  docs: [
    {
      key: "documentType",
      label: "Tipo de documento",
      type: "select",
      options: ["Trabalho escolar", "CV", "Requerimento", "Carta formal", "Convite", "Outro documento"],
    },
    { key: "goal", label: "Objectivo", placeholder: "O que este documento precisa resolver?", type: "textarea" },
    { key: "audience", label: "Destinatário / público", placeholder: "Ex: escola, empresa, director..." },
    { key: "pages", label: "Paginação desejada", type: "select", options: ["1 página", "2-3 páginas", "5-8 páginas", "10+ páginas"] },
    { key: "content", label: "Conteúdo obrigatório", placeholder: "Pontos, dados, nomes e regras que devem entrar", type: "textarea" },
  ],
  "site-builder": [
    { key: "business", label: "Nome do negócio", placeholder: "Ex: Clínica Vida Luanda" },
    {
      key: "siteType",
      label: "Tipo de site",
      type: "select",
      options: ["Landing page", "Portfolio", "Serviços", "Loja simples", "Evento"],
    },
    { key: "audience", label: "Público-alvo", placeholder: "Ex: jovens profissionais em Luanda" },
    { key: "sections", label: "Secções desejadas", placeholder: "Hero, serviços, sobre, contacto...", type: "textarea" },
    { key: "style", label: "Estilo visual", placeholder: "Ex: premium, limpo, tecnológico" },
  ],
  assistant: [
    { key: "message", label: "Pergunta", placeholder: "Ex: Ajuda-me a estruturar um trabalho de História", type: "textarea" },
  ],
  strategist: [
    { key: "idea", label: "Ideia", placeholder: "Ex: Quero abrir uma loja de roupa online em Luanda", type: "textarea" },
  ],
};

const defaultValues: Record<string, string> = {
  pages: "5-8 páginas",
  siteType: "Landing page",
  documentType: "Trabalho escolar",
  subject: "Química",
  eventType: "Formatura",
  tone: "Elegante",
};

const imageActions: Array<{
  mode: "resize" | "compress" | "convert" | "remove-bg" | "crop";
  label: string;
  icon: LucideIcon;
}> = [
  { mode: "remove-bg", label: "Remover fundo", icon: Scissors },
  { mode: "crop", label: "Recortar", icon: Scissors },
  { mode: "resize", label: "Redimensionar", icon: ImageIcon },
  { mode: "compress", label: "Comprimir", icon: Download },
  { mode: "convert", label: "Converter PNG", icon: FileArchive },
];

function getSessionId() {
  const key = "fronex_session_id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  window.localStorage.setItem(key, created);
  return created;
}

function parseSiteResponse(reply: string) {
  const cleaned = reply.replace(/^```json\s*/i, "").replace(/```$/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    return {
      html: String(parsed.html ?? ""),
      css: String(parsed.css ?? ""),
      js: String(parsed.js ?? ""),
      notes: String(parsed.notes ?? ""),
    };
  } catch {
    return {
      html: "<!doctype html><html><head><meta charset=\"utf-8\"><title>Fronex Site</title><link rel=\"stylesheet\" href=\"style.css\"></head><body><main><h1>Fronex Site</h1><p>Conteúdo gerado pela IA.</p></main><script src=\"script.js\"></script></body></html>",
      css: "body{font-family:Inter,Arial,sans-serif;margin:0;padding:48px;background:#f9fbff;color:#0f172a}main{max-width:920px;margin:auto}",
      js: "console.log('Fronex Site pronto');",
      notes: reply,
    };
  }
}

function crc32(input: string) {
  let crc = -1;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i);
    for (let j = 0; j < 8; j += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function makeZip(files: Record<string, string>) {
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const u16 = (n: number) => [n & 255, (n >>> 8) & 255];
  const u32 = (n: number) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];

  Object.entries(files).forEach(([name, content]) => {
    const nameBytes = enc.encode(name);
    const data = enc.encode(content);
    const crc = crc32(content);
    const local = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nameBytes.length), ...u16(0),
      ...nameBytes, ...data,
    ]);
    chunks.push(local);
    central.push(new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nameBytes.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...nameBytes,
    ]));
    offset += local.length;
  });

  const centralOffset = offset;
  central.forEach((item) => {
    chunks.push(item);
    offset += item.length;
  });
  chunks.push(new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(central.length), ...u16(central.length),
    ...u32(offset - centralOffset), ...u32(centralOffset), ...u16(0),
  ]));
  return new Blob(chunks.map((chunk) => chunk.buffer.slice(0) as ArrayBuffer), {
    type: "application/zip",
  });
}

export default function ToolsSection() {
  const [openCategory, setOpenCategory] = useState<string>("docs-creation");
  const [active, setActive] = useState<ToolKey>("school-work");
  
  const [form, setForm] = useState<Record<string, string>>(defaultValues);
  const [reply, setReply] = useState("");
  const [templateWrapper, setTemplateWrapper] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeFields = fields[active] ?? [];
  const activeCard = useMemo(() => toolCards.find((tool) => tool.id === active)!, [active]);
  const isImageStudio = active === "image-studio";
  const requiresEditor = !isImageStudio && active !== "strategist" && active !== "assistant" && active !== "site-builder";

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleToolSelect = (toolId: ToolKey) => {
    setActive(toolId);
    setReply("");
    setTemplateWrapper("");
    setEditorOpen(false);
  };

  const callGenerator = async () => {
    if (isImageStudio) return;
    if (active === "strategist") {
      const idea = (form.idea ?? "").trim();
      const assessment = assessInnovateIdea(idea);
      if (!assessment.valid) {
        setReply(assessment.clarification);
        return;
      }
      setLoading(true);
      setReply("");
      try {
        const response = await fetch("/api/innovate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea, sessionId: getSessionId() }),
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error ?? "Não foi possível organizar o plano.");
        setReply(payload.reply);
        if (typeof payload.tokensRemaining === "number") {
          window.dispatchEvent(new CustomEvent("fronex:tokens-updated", { detail: { tokensRemaining: payload.tokensRemaining } }));
        }
      } catch (error) {
        toast.error("Estrategista indisponível", {
          description: error instanceof Error ? error.message : "Tente novamente.",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setReply("");
    try {
      const apiTool = active;
      const response = await fetch("/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: apiTool, payload: form, sessionId: getSessionId() }),
      });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Sem créditos disponíveis", { description: payload?.upgradeMessage ?? "Tente novamente amanhã." });
        }
        throw new Error(payload?.error ?? "Não foi possível gerar.");
      }
      setReply(payload.reply);
      if (payload.templateWrapper) {
        setTemplateWrapper(payload.templateWrapper);
        setEditorOpen(true);
      }
      if (typeof payload.tokensRemaining === "number") {
        window.dispatchEvent(new CustomEvent("fronex:tokens-updated", { detail: { tokensRemaining: payload.tokensRemaining } }));
      }
    } catch (error) {
      toast.error("Ferramenta indisponível", {
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSiteZip = () => {
    const site = parseSiteResponse(reply);
    const blob = makeZip({
      "index.html": site.html,
      "style.css": site.css,
      "script.js": site.js,
      "README.txt": site.notes || "Site gerado pelo Fronex Site Builder.",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fronex-site.zip";
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadImage = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setProcessedImageUrl(null);
  };

  const processImage = async (mode: "resize" | "compress" | "convert" | "remove-bg" | "crop") => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = mode === "resize" ? 0.55 : 1;
    const crop = mode === "crop";
    canvas.width = crop ? Math.min(img.width, img.height) : Math.round(img.width * scale);
    canvas.height = crop ? Math.min(img.width, img.height) : Math.round(img.height * scale);
    const sx = crop ? Math.max(0, (img.width - canvas.width) / 2) : 0;
    const sy = crop ? Math.max(0, (img.height - canvas.height) / 2) : 0;
    ctx.drawImage(img, sx, sy, crop ? canvas.width : img.width, crop ? canvas.height : img.height, 0, 0, canvas.width, canvas.height);

    if (mode === "remove-bg") {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const r0 = data[0], g0 = data[1], b0 = data[2];
      for (let i = 0; i < data.length; i += 4) {
        const dist = Math.abs(data[i] - r0) + Math.abs(data[i + 1] - g0) + Math.abs(data[i + 2] - b0);
        if (dist < 72) data[i + 3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const mime = mode === "convert" || mode === "remove-bg" ? "image/png" : "image/jpeg";
    setProcessedImageUrl(canvas.toDataURL(mime, mode === "compress" ? 0.55 : 0.9));
  };

  return (
    <section id="ferramentas" className="bg-canvas-light py-20 text-ink md:py-28">
      {editorOpen && templateWrapper && reply && (
        <DocumentEditor 
          htmlContent={reply} 
          templateWrapper={templateWrapper} 
          title={activeCard.title}
          onClose={() => setEditorOpen(false)} 
        />
      )}
      
      <div className="container-fronex">
        <div className="mb-10 max-w-3xl">
          <p className="section-label">Ferramentas</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
            O seu assistente para documentos, sites e mais
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-muted md:text-lg">
            Escolha uma categoria abaixo. Todos os documentos agora usam o padrão profissional com insígnia e estilos avançados.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          
          {/* Categorias - Mobile First Accordion */}
          <div className="space-y-4">
            {toolCategories.map((cat) => {
              const isOpen = openCategory === cat.id;
              const CatIcon = cat.icon;
              return (
                <div key={cat.id} className="overflow-hidden rounded-2xl border border-border bg-surface transition-all shadow-sm">
                  <button
                    onClick={() => setOpenCategory(isOpen ? "" : cat.id)}
                    className={`flex w-full min-h-[80px] items-center justify-between px-5 py-4 transition-colors ${isOpen ? 'bg-accent/5' : 'hover:bg-canvas/50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isOpen ? 'bg-accent text-white' : 'bg-canvas text-ink-muted'}`}>
                        <CatIcon size={24} />
                      </div>
                      <span className="text-lg font-bold text-ink text-left">{cat.title}</span>
                    </div>
                    {isOpen ? <ChevronUp className="text-accent" /> : <ChevronDown className="text-ink-muted" />}
                  </button>
                  
                  {isOpen && (
                    <div className="border-t border-border bg-canvas/30 px-3 py-4 flex flex-col gap-2">
                      {cat.tools.map((toolId) => {
                        const tool = toolCards.find((t) => t.id === toolId);
                        if (!tool) return null;
                        const isSelected = active === tool.id;
                        const ToolIcon = tool.icon;
                        
                        return (
                          <button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            className={`flex items-start gap-4 rounded-xl px-4 py-3 text-left transition-all ${
                              isSelected
                                ? "bg-white shadow-md border border-accent/20 ring-1 ring-accent/10"
                                : "hover:bg-white/60"
                            }`}
                          >
                            <ToolIcon size={20} className={`mt-0.5 shrink-0 ${isSelected ? 'text-accent' : 'text-ink-muted'}`} />
                            <div>
                              <p className={`font-semibold ${isSelected ? 'text-accent' : 'text-ink'}`}>
                                {tool.title} {tool.badge && <span className="ml-2 rounded-full border border-accent/25 bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">{tool.badge}</span>}
                              </p>
                              <p className="mt-1 text-xs text-ink-muted leading-tight">{tool.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Área de Trabalho */}
          <div className="card-fronex flex flex-col p-5 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const ActiveIcon = activeCard.icon;
                    return <ActiveIcon className="text-accent" size={24} />;
                  })()}
                  <h3 className="font-display text-2xl font-bold text-ink">{activeCard.title}</h3>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{activeCard.description}</p>
              </div>
              {!isImageStudio && (
                <span className="shrink-0 rounded-full border border-border bg-canvas/70 px-3 py-1 text-xs font-medium text-ink-muted">
                  1 crédito / geração
                </span>
              )}
            </div>

            {isImageStudio ? (
              <div className="mt-2 space-y-6 flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => event.target.files?.[0] && loadImage(event.target.files[0])}
                />
                <button onClick={() => fileRef.current?.click()} className="btn-secondary w-full justify-center min-h-[60px] text-base">
                  <ImageIcon size={20} className="mr-2" />
                  Carregar imagem do dispositivo
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  {imageActions.map(({ mode, label, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => processImage(mode)}
                      disabled={!imageUrl}
                      className="btn-secondary px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 pt-6 mt-6 border-t md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-canvas/60 p-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Original</p>
                    {imageUrl ? <img src={imageUrl} alt="Imagem original" className="max-h-[300px] w-full rounded-lg object-contain" /> : <div className="flex h-48 items-center justify-center text-sm text-muted">Aguardando...</div>}
                  </div>
                  <div className="rounded-xl border border-border bg-canvas/60 p-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Resultado</p>
                    {processedImageUrl ? (
                      <>
                        <img src={processedImageUrl} alt="Imagem processada" className="max-h-[300px] w-full rounded-lg object-contain" />
                        <a href={processedImageUrl} download="fronex-image.png" className="btn-primary mt-3 w-full">Baixar imagem</a>
                      </>
                    ) : (
                      <div className="flex h-48 items-center justify-center text-sm text-muted">Aguardando...</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 flex-1">
                <div className="grid gap-5 sm:grid-cols-2">
                  {activeFields.map((field) => (
                    <label key={field.key} className={`block ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                      <span className="text-sm font-medium text-ink mb-1.5 block">{field.label}</span>
                      {field.type === "textarea" ? (
                        <textarea
                          value={form[field.key] ?? ""}
                          onChange={(event) => update(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="min-h-[100px] w-full rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent/50 transition-colors"
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={form[field.key] ?? field.options?.[0] ?? ""}
                          onChange={(event) => update(field.key, event.target.value)}
                          className="min-h-[50px] w-full rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-ink outline-none focus:border-accent/50 transition-colors"
                        >
                          {field.options?.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={form[field.key] ?? ""}
                          onChange={(event) => update(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className="min-h-[50px] w-full rounded-xl border border-border bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus:border-accent/50 transition-colors"
                        />
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t flex flex-col gap-4">
                  <button onClick={callGenerator} disabled={loading} className="btn-primary w-full min-h-[56px] text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? <Loader2 size={20} className="animate-spin mr-2" /> : <Sparkles size={20} className="mr-2" />}
                    Gerar Documento com IA
                  </button>

                  {/* Resultados Inline (Assistente ou Site) */}
                  {reply && !requiresEditor && (
                    <div className="mt-4">
                      {active === "site-builder" ? (
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-semibold text-ink">Pré-visualização do Site</span>
                            <button onClick={exportSiteZip} className="btn-secondary px-3 py-2 text-xs">
                              <Download size={14} className="mr-1" /> Descarregar ZIP
                            </button>
                          </div>
                          <SitePreview reply={reply} />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-border bg-canvas/50 p-5">
                          <RichMessage content={reply} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Link para reabrir o editor caso fechado acidentalmente */}
                  {reply && requiresEditor && !editorOpen && (
                    <button onClick={() => setEditorOpen(true)} className="btn-secondary w-full text-accent border-accent/20">
                      Reabrir Editor Visual do Documento Gerado
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SitePreview({ reply }: { reply: string }) {
  const site = parseSiteResponse(reply);
  const srcDoc = `${site.html}<style>${site.css}</style><script>${site.js}</script>`;
  return (
    <div className="space-y-4">
      <iframe
        title="Pré-visualização do site"
        srcDoc={srcDoc}
        className="h-[500px] w-full rounded-xl border border-border bg-white"
      />
      {site.notes ? (
        <div className="rounded-xl border border-border bg-canvas/50 p-4 text-sm leading-6 text-ink-muted">
          {site.notes}
        </div>
      ) : null}
    </div>
  );
}
