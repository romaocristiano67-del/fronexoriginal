import Header from "@/components/header";
import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";
import MentorsSection from "@/components/mentors-section";
import InnovateSection from "@/components/innovate-section";
import PortfolioSection from "@/components/portfolio-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas dark:bg-canvas-dark">
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
