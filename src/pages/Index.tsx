import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import HeroSection from "@/components/marketing/HeroSection";
import HowItWorksScrollSection from "@/components/how-it-works/HowItWorksScrollSection";
import InsightSection from "@/components/marketing/InsightSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import TimelineSection from "@/components/marketing/TimelineSection";
import ValuePillarsSection from "@/components/marketing/ValuePillarsSection";
import GuidedFlowSection from "@/components/marketing/GuidedFlowSection";
import OutcomesSection from "@/components/marketing/OutcomesSection";
import CTASection from "@/components/marketing/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksScrollSection />
        <InsightSection />
        <FeaturesSection />
        <TimelineSection />
        <ValuePillarsSection />
        <GuidedFlowSection />
        <OutcomesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
