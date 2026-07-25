import Header from "@/components/header";
import Hero from "@/components/hero";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import MentorsSection from "@/components/mentors-section";
import InnovateSection from "@/components/innovate-section";
import PortfolioSection from "@/components/portfolio-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050B14] text-white">
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
