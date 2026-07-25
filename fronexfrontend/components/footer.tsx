import Link from "next/link";
import Image from "next/image";
import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-14 text-zinc-950 transition-colors duration-300 dark:border-white/10 dark:bg-[#0d0d0f] dark:text-[#f5f3ee]">
      <div className="container-fronex flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center">
            <span className="relative h-11 w-36 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10">
              <Image
                src="/images/logo-fronex-wordmark.jpg"
                alt="Fronex"
                fill
                sizes="144px"
                className="object-cover"
              />
            </span>
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
            Tecnologia e serviços digitais feitos em Angola, para negócios que
            querem crescer com qualidade internacional.
          </p>
          <div className="mt-5 flag-thread" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
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
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Conta
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li><Link href="/login" className="hover:text-angola-red">Entrar</Link></li>
              <li><Link href="/login" className="hover:text-angola-red">Criar Conta</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
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

      <div className="container-fronex mt-12 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Fronex. Todos os direitos reservados.</p>
        <p>Design, tecnologia e produto digital em Angola.</p>
      </div>
    </footer>
  );
}
