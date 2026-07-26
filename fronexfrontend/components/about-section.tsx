import { ArrowRight, BarChart3, Rocket, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Rocket,
    title: "Inovação",
    description:
      "Soluções digitais pensadas para o mercado angolano, com tecnologia actual e execução rápida.",
  },
  {
    icon: Shield,
    title: "Confiança",
    description:
      "Processo transparente, contacto directo e entrega com qualidade internacional em cada projecto.",
  },
  {
    icon: BarChart3,
    title: "Resultados",
    description:
      "Sites, apps e sistemas desenhados para converter, organizar operação e fazer a marca crescer.",
  },
];

export default function AboutSection() {
  return (
    <section id="sobre" className="relative bg-canvas py-20 md:py-28">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(210,31,43,0.06),transparent_60%)]"
      />

      <div className="container-fronex relative">
        <div className="mb-14 grid gap-8 md:mb-16 md:grid-cols-[1fr_1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <p className="section-label">Sobre nós</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink md:text-5xl">
              Identidade digital com clareza, ritmo e presença.
            </h2>
          </div>
          <div className="flex flex-col gap-4 md:pb-1">
            <p className="text-base leading-7 text-ink-muted md:text-lg">
              A Fronex combina design, engenharia e comunicação para ajudar
              negócios angolanos a parecerem mais fortes no telemóvel e mais
              confiantes em qualquer ecrã.
            </p>
            <a href="#servicos" className="link-accent">
              Saiba mais
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="card-surface group">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
