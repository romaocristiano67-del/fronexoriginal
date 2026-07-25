import dynamic from "next/dynamic";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";
import MentorsSection from "@/components/mentors-section";
import InnovateSection from "@/components/innovate-section";
import Footer from "@/components/footer";

const PortfolioSection = dynamic(() => import("@/components/portfolio-section"), {
  ssr: false,
  loading: () => <div className="min-h-96 bg-zinc-950" />,
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <Header />
      <Hero />
      <ServicesSection />
      <MentorsSection />
      <InnovateSection />
      <PortfolioSection />
      <Footer />
    </main>
  );
}
