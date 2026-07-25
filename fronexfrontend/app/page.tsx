import dynamic from "next/dynamic";
import Header from "@/components/header";
import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";
import MentorsSection from "@/components/mentors-section";
import InnovateSection from "@/components/innovate-section";
import Footer from "@/components/footer";

const PortfolioSection = dynamic(() => import("@/components/portfolio-section"), {
  ssr: false,
  loading: () => <div className="min-h-96 bg-[#f8f7f3] dark:bg-[#080809]" />,
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-zinc-950 transition-colors duration-300 dark:bg-[#080809] dark:text-[#f5f3ee]">
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
