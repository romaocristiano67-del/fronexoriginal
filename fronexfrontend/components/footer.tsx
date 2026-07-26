import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-canvas py-14 text-ink">
      <div className="container-fronex flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center">
            <span className="relative h-11 w-36 overflow-hidden rounded-[1rem] border border-border bg-surface p-1 shadow-sm">
              <Image
                src="/images/logo-fronex-original.jpg"
                alt="Fronex"
                fill
                sizes="144px"
                className="object-cover object-center"
              />
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-muted">
            Tecnologia e serviços digitais feitos em Angola, para negócios que
            querem crescer com presença forte e acabamento cuidadoso.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="section-label">Navegação</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
              <li><a href="#sobre" className="transition-colors hover:text-accent">Sobre</a></li>
              <li><a href="#servicos" className="transition-colors hover:text-accent">Serviços</a></li>
              <li><a href="#mentores" className="transition-colors hover:text-accent">Mentores</a></li>
              <li><a href="#inovar" className="transition-colors hover:text-accent">Criar/Inovar</a></li>
              <li><a href="#portfolio" className="transition-colors hover:text-accent">Portfólio</a></li>
            </ul>
          </div>

          <div>
            <p className="section-label">Conta</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-muted">
              <li><Link href="/login" className="transition-colors hover:text-accent">Entrar</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-accent">Criar Conta</Link></li>
            </ul>
          </div>

          <div>
            <p className="section-label">Contacto</p>
            <ul className="mt-3 flex flex-col gap-3 text-sm text-ink-muted">
              <li>
                <a
                  href="https://wa.me/244946419129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <MessageCircle size={15} className="text-accent" />
                  +244 946 419 129
                </a>
              </li>
              <li>
                <a
                  href="mailto:geral@fronex.ao"
                  className="flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <Mail size={15} className="text-accent" />
                  geral@fronex.ao
                </a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-accent transition-colors hover:border-accent/40 hover:bg-accent/10"
              >
                <Github size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fronex mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Fronex. Todos os direitos reservados.</p>
        <p>Design, tecnologia e produto digital em Angola.</p>
      </div>
    </footer>
  );
}
