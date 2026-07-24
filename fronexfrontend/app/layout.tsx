import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AIChatWidget from "@/components/ai-chat-widget";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fronex | Tecnologia e Serviços Digitais em Angola",
  description:
    "A Fronex cria sites, apps, sistemas, conteúdo e inteligência artificial para negócios angolanos. Orçamento instantâneo, entrega rápida, qualidade internacional.",
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
  return (
    <html lang="pt-AO" suppressHydrationWarning>
      <body className={`${inter.variable} ${manrope.variable} font-body`}>
        <ThemeProvider>
          {children}
          <AIChatWidget />
          <Toaster richColors position="top-right" toastOptions={{ duration: 3600 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
