import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AIChatWidget from "@/components/ai-chat-widget";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Fronex | Tecnologia e Serviços Digitais em Angola",
  description:
    "A Fronex cria sites, apps, sistemas e conteúdo digital com presença forte, acabamento moderno e foco no mobile.",
  keywords: [
    "Fronex",
    "tecnologia Angola",
    "desenvolvimento web Luanda",
    "apps Angola",
    "design gráfico Angola",
    "gestão de redes sociais Angola",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeScript = `
    (() => {
      try {
        const stored = localStorage.getItem("fronex-theme");
        const theme = stored === "dark"
          ? "dark"
          : stored === "light"
            ? "light"
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.style.colorScheme = theme;
      } catch {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      }
    })();
  `;

  return (
    <html lang="pt-AO" suppressHydrationWarning>
      <body className="font-body">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <MotionConfig reducedMotion="user">
            {children}
            <AIChatWidget />
            <Toaster richColors position="top-right" toastOptions={{ duration: 3600 }} />
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
