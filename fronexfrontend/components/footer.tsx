import { Mail, Phone } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/50 py-5 text-ink backdrop-blur-xl">
      <ScrollReveal className="container-fronex flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
        <a
          href="tel:+244946419129"
          className="inline-flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface/70 hover:text-accent"
        >
          <Phone size={16} aria-hidden="true" className="text-accent" />
          946419129
        </a>
        <a
          href="mailto:romacristiao77@gmail.com"
          className="inline-flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-surface/70 hover:text-accent"
        >
          <Mail size={16} aria-hidden="true" className="text-accent" />
          romacristiao77@gmail.com
        </a>
      </ScrollReveal>
    </footer>
  );
}
