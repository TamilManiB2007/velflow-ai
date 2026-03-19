import { useState, useCallback } from "react";
import OpeningExperience from "@/components/velflow/OpeningExperience";
import Navigation from "@/components/velflow/Navigation";
import HeroSection from "@/components/velflow/HeroSection";
import MarqueeTicker from "@/components/velflow/MarqueeTicker";
import ScrollStorytelling from "@/components/velflow/ScrollStorytelling";
import ServicesGrid from "@/components/velflow/ServicesGrid";
import HowItWorks from "@/components/velflow/HowItWorks";
import Pricing from "@/components/velflow/Pricing";
import TechStack from "@/components/velflow/TechStack";
import CTABanner from "@/components/velflow/CTABanner";
import Testimonials from "@/components/velflow/Testimonials";
import ContactFooter from "@/components/velflow/ContactFooter";
import CustomCursor from "@/components/velflow/CustomCursor";
import KonamiEasterEgg from "@/components/velflow/KonamiEasterEgg";
import MobileStickyCTA from "@/components/velflow/MobileStickyCTA";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import ChatWidget from "@/components/velflow/ChatWidget";
// BrandStory removed — not needed

const Index = () => {
  const [showSite, setShowSite] = useState(false);
  useVisitorTracking();
  const handleOpeningComplete = useCallback(() => setShowSite(true), []);

  return (
    <>
      <CustomCursor />
      <KonamiEasterEgg />

      {!showSite && <OpeningExperience onComplete={handleOpeningComplete} />}

      {showSite && (
        <>
          <Navigation />
          <main>
            <HeroSection />
            <MarqueeTicker />
            <ScrollStorytelling />
            <ServicesGrid />
            <HowItWorks />
            <Pricing />
            <TechStack />
            <Testimonials />
            <CTABanner />
            <ContactFooter />
          </main>
          <MobileStickyCTA />
          <ChatWidget />
        </>
      )}
    </>
  );
};

export default Index;
