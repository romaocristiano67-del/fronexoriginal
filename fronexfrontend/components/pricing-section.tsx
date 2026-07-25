import { Check } from "lucide-react";
import { SERVICES, formatKz } from "@/lib/pricing";

export default function PricingSection() {
  return (
    <section id="precos" className="bg-canvas py-24 text-white md:py-32">
      <div className="container-fronex">
        <div className="mb-14 flex flex-col gap-4 md:mb-16 md:max-w-2xl">
          <p className="section-label">Preços</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
            Preços transparentes, sem surpresas
          </h2>
          <p className="text-base text-ink-muted md:text-lg">
            Cada faixa de preço reflete a complexidade do que escolher no
            questionário. O valor final nunca ultrapassa o teto indicado.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div key={service.id} className="card-fronex flex flex-col p-6">
              <p className="font-display text-base font-bold text-white">
                {service.title}
              </p>
              <p className="mt-4 font-display text-3xl font-bold text-accent">
                {formatKz(service.basePrice)}
              </p>
              <p className="text-xs text-muted">preço médio</p>

              <div className="my-5 h-px w-full bg-white/[0.06]" />

              <ul className="flex flex-1 flex-col gap-2.5 text-sm text-ink-muted">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-accent" />
                  Piso a partir de{" "}
                  <span className="font-bold text-accent">
                    {formatKz(service.minPrice)}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-accent" />
                  Teto máximo de{" "}
                  <span className="font-bold text-accent">
                    {formatKz(service.maxPrice)}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-accent" />
                  Orçamento calculado no questionário
                </li>
              </ul>

              <a href="#servicos" className="btn-secondary mt-6 justify-center">
                Simular orçamento
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
