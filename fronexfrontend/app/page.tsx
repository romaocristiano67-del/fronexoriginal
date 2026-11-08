import Header from "@/components/header";
import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";
import MentorsSection from "@/components/mentors-section";
import PortfolioSection from "@/components/portfolio-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <Header />
      <Hero />
      <ServicesSection />
      <MentorsSection />
      <PortfolioSection />
      <Footer />
    </main>
  );
}
