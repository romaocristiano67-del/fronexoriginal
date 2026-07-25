import dynamic from "next/dynamic";
import Header from "@/components/header";
import Hero from "@/components/hero";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import MentorsSection from "@/components/mentors-section";
import InnovateSection from "@/components/innovate-section";
import Footer from "@/components/footer";

const PortfolioSection = dynamic(() => import("@/components/portfolio-section"), {
  ssr: false,
  loading: () => <div className="min-h-96 bg-canvas" />,
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas text-white">
      <Header />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <MentorsSection />
      <InnovateSection />
      <PortfolioSection />
      <Footer />
    </main>
  );
}
