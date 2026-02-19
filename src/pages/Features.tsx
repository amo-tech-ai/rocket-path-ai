import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import FeaturesHero from "@/components/features/FeaturesHero";
import IntelligenceDashboard from "@/components/features/IntelligenceDashboard";
import TasksExecution from "@/components/features/TasksExecution";
import InvestorCRM from "@/components/features/InvestorCRM";
import DocumentsPitchDecks from "@/components/features/DocumentsPitchDecks";
import DiscoveryResearch from "@/components/features/DiscoveryResearch";
import SystemDiagram from "@/components/features/SystemDiagram";
import FeaturesOutcomes from "@/components/features/FeaturesOutcomes";
import FeaturesCTA from "@/components/features/FeaturesCTA";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <FeaturesHero />
        <IntelligenceDashboard />
        <TasksExecution />
        <InvestorCRM />
        <DocumentsPitchDecks />
        <DiscoveryResearch />
        <SystemDiagram />
        <FeaturesOutcomes />
        <FeaturesCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
