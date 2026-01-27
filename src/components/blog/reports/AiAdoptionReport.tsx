import { 
  ReportHero, 
  ReportSection, 
  SectionTitle, 
  InsightCard, 
  DataTable, 
  PullQuote,
  StatGrid,
  FeatureCard,
  SourcesSection 
} from "@/components/blog";
import { 
  Building2, 
  Heart, 
  Banknote, 
  ShoppingCart, 
  Factory, 
  Truck, 
  Zap, 
  Megaphone,
  GraduationCap,
  Briefcase
} from "lucide-react";

const AiAdoptionReport = () => {
  return (
    <article>
      {/* Hero Section */}
      <ReportHero
        title="AI Adoption by Industry — 2025"
        subtitle="Where AI is working, what it's used for, and what outcomes are measurable."
        chips={["10 industries", "adoption + outcomes", "measured vs estimated"]}
        kpis={[
          { value: "88%", label: "Technology & SaaS org-wide AI use", type: "measured" },
          { value: "€190M", label: "Manufacturing savings (measured case)", type: "measured" },
          { value: "+15%", label: "Retail AI leaders outperform peers (revenue)", type: "measured" }
        ]}
      />

      {/* Executive Summary */}
      <ReportSection>
        <SectionTitle 
          title="Executive Summary" 
          subtitle="Six key insights from the data"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <InsightCard
            title="Technology & SaaS leads adoption"
            stat="88% org-wide"
            description="Regular use; 39% report EBIT impact."
            type="measured"
            index={0}
          />
          <InsightCard
            title="Retail shows measurable revenue advantage"
            stat="+15%"
            description="AI leaders outperform peers by 15%."
            type="measured"
            index={1}
          />
          <InsightCard
            title="Manufacturing has strong ROI but low adoption"
            stat="4–8%"
            description="Adoption; 31% labor productivity; €190M savings (case)."
            type="measured"
            index={2}
          />
          <InsightCard
            title="Operations is the hidden hotspot"
            stat="~31%"
            description="Logistics ops adoption; inspections 60% faster (case)."
            type="measured"
            index={3}
          />
          <InsightCard
            title="Marketing gains are wide but uneven"
            stat="3–36%"
            description="Adoption by function; 30–40% productivity (case)."
            type="measured"
            index={4}
          />
          <InsightCard
            title="Energy & Climate adoption is emerging"
            description="Grid optimization benefits noted; limited quantified %."
            type="estimated"
            index={5}
          />
        </div>
      </ReportSection>

      {/* Adoption Summary Table */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Adoption Summary by Industry"
          subtitle="Overview of AI adoption rates and quantified benefits"
        />
        <DataTable
          headers={["Industry", "Adoption Rate (%)", "Key Quantified Benefit", "Source"]}
          rows={[
            ["Technology & SaaS", "88 (org-wide)", "39% report EBIT impact", "McKinsey"],
            ["Healthcare & Life Sciences", "22", "Up to 25% HVAC cost reduction", "Mezzi"],
            ["Finance & FinTech", "24", "50% resolution time reduction", "Mezzi"],
            ["Retail & eCommerce", "31", "15% revenue outperform peers", "Mezzi"],
            ["Manufacturing", "4–8 (varies)", "31% labor productivity; €190M savings", "HighPeakSW"],
            ["Logistics & Supply Chain", "31 (ops)", "60% inspection time down", "WEF"],
            ["Energy & Climate", { value: "Emerging", badge: "Limited data", badgeVariant: "low" }, "Grid optimization (no % specified)", "Business Insider"],
            ["Marketing & Media", "3–36 (functions)", "30–40% productivity (BMW)", "HighPeakSW"],
            ["Education", { value: "Low", badge: "Limited data", badgeVariant: "low" }, "N/A", "N/A"],
            ["Legal & Prof. Services", "20", "20% in service ops", "Mezzi"]
          ]}
          footnote="Ranges reflect survey definitions; adoption varies by function vs org-wide."
        />
      </ReportSection>

      {/* Industry Deep Dives */}
      <ReportSection>
        <SectionTitle 
          title="Industry Deep Dives"
          subtitle="Detailed analysis by sector"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Building2 className="w-5 h-5" />}
            title="Technology & SaaS"
            description="AI agents in IT service desks, software engineering automation, knowledge management, content generation."
            stats={[
              { value: "88%", label: "Regular AI use" },
              { value: "39%", label: "EBIT impact" },
              { value: "3×", label: "High performers scale agents" }
            ]}
            index={0}
          />
          <FeatureCard
            icon={<Heart className="w-5 h-5" />}
            title="Healthcare & Life Sciences"
            description="Clinical decision support, diagnostics, patient management, operational efficiencies."
            stats={[
              { value: "22%", label: "Adoption" },
              { value: "25%", label: "HVAC cost reduction" },
              { value: "-90%", label: "Maintenance time" }
            ]}
            index={1}
          />
          <FeatureCard
            icon={<Banknote className="w-5 h-5" />}
            title="Finance & FinTech"
            description="Fraud detection, risk management, customer service chatbots, compliance monitoring."
            stats={[
              { value: "24%", label: "Adoption" },
              { value: "50%", label: "Resolution time down" }
            ]}
            index={2}
          />
          <FeatureCard
            icon={<ShoppingCart className="w-5 h-5" />}
            title="Retail & eCommerce"
            description="Personalized recommendations, intelligent bots, integrated business planning, inventory forecasting."
            stats={[
              { value: "31%", label: "Adoption" },
              { value: "+15%", label: "Revenue outperformance" }
            ]}
            index={3}
          />
          <FeatureCard
            icon={<Factory className="w-5 h-5" />}
            title="Manufacturing"
            description="Predictive maintenance, quality control (vision), production automation."
            stats={[
              { value: "4–8%", label: "Adoption" },
              { value: "+31%", label: "Labor productivity" },
              { value: "€190M", label: "Savings (case)" }
            ]}
            index={4}
          />
          <FeatureCard
            icon={<Truck className="w-5 h-5" />}
            title="Logistics & Supply Chain"
            description="Supply chain optimization, predictive maintenance, visual inspection automation."
            stats={[
              { value: "31%", label: "Service ops adoption" },
              { value: "-60%", label: "Inspection time" },
              { value: "-20–30%", label: "Error reduction" }
            ]}
            index={5}
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5" />}
            title="Energy & Climate"
            description="Grid management optimization, energy production, sustainability reporting support."
            stats={[
              { value: "Emerging", label: "Adoption level" }
            ]}
            index={6}
          />
          <FeatureCard
            icon={<Megaphone className="w-5 h-5" />}
            title="Marketing & Media"
            description="Content creation, audience engagement, personalization."
            stats={[
              { value: "3–36%", label: "Function range" },
              { value: "+30–40%", label: "BMW productivity" }
            ]}
            index={7}
          />
        </div>
      </ReportSection>

      {/* Real-World Examples */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Real-World Examples"
          subtitle="Measured outcomes from leading organizations"
        />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-display text-lg font-medium mb-2">BMW</h4>
            <p className="text-sm text-muted-foreground mb-4">GenAI agents across functions</p>
            <p className="text-2xl font-display font-semibold text-primary">+30–40%</p>
            <p className="text-xs text-muted-foreground">Productivity improvement</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-display text-lg font-medium mb-2">Swiss Railways (SBB)</h4>
            <p className="text-sm text-muted-foreground mb-4">Visual inspection automation</p>
            <p className="text-2xl font-display font-semibold text-primary">-60%</p>
            <p className="text-xs text-muted-foreground">Inspection time reduction</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-display text-lg font-medium mb-2">Retail AI Leaders</h4>
            <p className="text-sm text-muted-foreground mb-4">Planning & personalization</p>
            <p className="text-2xl font-display font-semibold text-primary">+15%</p>
            <p className="text-xs text-muted-foreground">Revenue outperformance</p>
          </div>
        </div>
      </ReportSection>

      {/* Key Takeaways */}
      <ReportSection dark>
        <SectionTitle title="Key Takeaways" />
        <div className="space-y-8 max-w-3xl">
          <PullQuote 
            quote="AI delivers value when workflows change, not when tools are added."
            variant="editorial"
          />
          <PullQuote 
            quote="High performers focus on execution, not experimentation."
            variant="editorial"
          />
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-dark-foreground font-medium">Start with one workflow</p>
            <p className="text-dark-foreground/60 text-sm mt-1">ops, service, planning</p>
          </div>
          <div className="text-center">
            <p className="text-dark-foreground font-medium">Measure outcomes weekly</p>
            <p className="text-dark-foreground/60 text-sm mt-1">time, cost, accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-dark-foreground font-medium">Scale after reliability</p>
            <p className="text-dark-foreground/60 text-sm mt-1">+ governance</p>
          </div>
        </div>
      </ReportSection>

      {/* Sources */}
      <ReportSection>
        <SourcesSection
          sources={[
            { name: "McKinsey" },
            { name: "WEF" },
            { name: "Deloitte" },
            { name: "BCG" },
            { name: "Mezzi" },
            { name: "HighPeakSW" }
          ]}
          methodology="Adoption rates reflect survey definitions which vary between org-wide deployment and function-specific use. All percentages marked as 'measured' come from cited case studies or surveys with documented sample sizes."
          definitions={[
            { term: "Org-wide adoption", definition: "AI used regularly across most business functions" },
            { term: "Function-level adoption", definition: "AI deployed in specific departments (e.g., marketing, ops)" },
            { term: "Measured", definition: "Outcome verified through case study or controlled survey" }
          ]}
          limitations={[
            "Survey sampling varies by source",
            "Function vs org-wide definitions not always consistent",
            "Some sectors have limited quantified data",
            "Case studies may not generalize"
          ]}
        />
      </ReportSection>
    </article>
  );
};

export default AiAdoptionReport;
