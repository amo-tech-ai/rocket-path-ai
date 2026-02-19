import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import HowItWorksHero from "@/components/howitworks/HowItWorksHero";
import StepCapture from "@/components/howitworks/StepCapture";
import InsightStatement from "@/components/howitworks/InsightStatement";
import LivingSystemProof from "@/components/howitworks/LivingSystemProof";
import StepPriorities from "@/components/howitworks/StepPriorities";
import StepDecisions from "@/components/howitworks/StepDecisions";
import FeaturesGrid from "@/components/howitworks/FeaturesGrid";
import CompleteFlow from "@/components/howitworks/CompleteFlow";
import FinalCTA from "@/components/howitworks/FinalCTA";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HowItWorksHero />
        <StepCapture />
        <InsightStatement />
        <LivingSystemProof />
        <StepPriorities />
        <StepDecisions />
        <FeaturesGrid />
        <CompleteFlow />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
