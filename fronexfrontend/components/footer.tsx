import Link from "next/link";
import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-14 dark:border-border-dark">
      <div className="container-fronex flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink dark:bg-ink-dark">
              <span className="font-display text-sm font-bold text-canvas dark:text-canvas-dark">
                F
              </span>
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              FRONEX
            </span>
          </div>
          <p className="mt-4 text-sm text-muted dark:text-muted-dark">
            Tecnologia e serviços digitais feitos em Angola, para negócios que
            querem crescer com qualidade internacional.
          </p>
          <div className="mt-5 flag-thread" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted-dark">
              Navegação
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><a href="#servicos" className="hover:text-angola-red">Serviços</a></li>
              <li><a href="#mentores" className="hover:text-angola-red">Mentores</a></li>
              <li><a href="#inovar" className="hover:text-angola-red">Criar/Inovar</a></li>
              <li><a href="#precos" className="hover:text-angola-red">Preços</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted-dark">
              Conta
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><Link href="/login" className="hover:text-angola-red">Entrar</Link></li>
              <li><Link href="/login" className="hover:text-angola-red">Criar Conta</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted-dark">
              Contacto
            </p>
            <ul className="mt-3 flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="https://wa.me/244946419129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-angola-red"
                >
                  <MessageCircle size={15} />
                  +244 946 419 129
                </a>
              </li>
              <li>
                <a
                  href="mailto:geral@fronex.ao"
                  className="flex items-center gap-2 hover:text-angola-red"
                >
                  <Mail size={15} />
                  geral@fronex.ao
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-angola-red"
                >
                  <Instagram size={15} />
                  @fronex.ao
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-fronex mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted dark:border-border-dark dark:text-muted-dark md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Fronex. Todos os direitos reservados.</p>
        <p>Feito com 🖤❤️💛 em Angola.</p>
      </div>
    </footer>
  );
}
