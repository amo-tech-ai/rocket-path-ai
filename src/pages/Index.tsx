import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import HeroSection from "@/components/marketing/HeroSection";
import HowItWorksSection from "@/components/marketing/HowItWorksSection";
import InsightSection from "@/components/marketing/InsightSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import TimelineSection from "@/components/marketing/TimelineSection";
import ValuePillarsSection from "@/components/marketing/ValuePillarsSection";
import GuidedFlowSection from "@/components/marketing/GuidedFlowSection";
import HubSection from "@/components/marketing/HubSection";
import OutcomesSection from "@/components/marketing/OutcomesSection";
import CTASection from "@/components/marketing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <InsightSection />
        <FeaturesSection />
        <TimelineSection />
        <ValuePillarsSection />
        <GuidedFlowSection />
        <HubSection />
        <OutcomesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
