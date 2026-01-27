import { 
  ReportHero, 
  ReportSection, 
  SectionTitle, 
  InsightCard, 
  StatGrid,
  PullQuote,
  FeatureCard,
  SourcesSection 
} from "@/components/blog";
import { 
  Sparkles, 
  Search, 
  Megaphone, 
  Package,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AiEcommerceReport = () => {
  return (
    <article>
      {/* Hero Section */}
      <ReportHero
        title="AI in E-commerce: From Experimentation to Revenue Engine"
        subtitle="How retailers are deploying AI, what's working, and what still blocks scale."
        chips={["Shopify + McKinsey + Adobe", "Measured + projected", "B2C + B2B signals"]}
        kpis={[
          { value: "$51B+", label: "AI e-commerce market by 2033", source: "24.3% CAGR", type: "projected" },
          { value: "80–89%", label: "Retailers using or piloting AI", type: "measured" },
          { value: "1,200%", label: "GenAI traffic growth YoY", source: "Adobe, Oct 2025", type: "measured" },
          { value: "+16%", label: "AI shoppers convert more than non-AI traffic", type: "measured" },
          { value: "$240–390B", label: "GenAI retail value potential", source: "McKinsey", type: "projected" }
        ]}
      />

      {/* Adoption Reality Check */}
      <ReportSection>
        <SectionTitle 
          title="AI Adoption Is Widespread — But Maturity Is Uneven"
        />
        <StatGrid
          columns={4}
          stats={[
            { value: "51–80%", label: "E-commerce businesses using AI", type: "measured" },
            { value: "84%", label: "Leaders rank AI as top priority", type: "measured" },
            { value: "52%", label: "Plan AI tools for merchandising", type: "measured" },
            { value: "2 of 50+", label: "Retailers with org-wide GenAI success", type: "measured" }
          ]}
        />
        <div className="mt-8">
          <PullQuote 
            quote="Adoption is high. Full transformation is rare."
            variant="callout"
          />
        </div>
      </ReportSection>

      {/* Where AI Is Used */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Where AI Is Actually Used"
          subtitle="Implementation areas with measured impact"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Personalization & Recommendations"
            description="AI-driven product recommendations and personalized shopping experiences."
            stats={[
              { value: "up to 300%", label: "Revenue uplift" },
              { value: "up to 150%", label: "Conversion increase" },
              { value: "91%", label: "Prefer personalized brands" }
            ]}
            index={0}
          />
          <FeatureCard
            icon={<Search className="w-5 h-5" />}
            title="Search & Discovery"
            description="Intelligent search, product comparison, and buying guides."
            stats={[
              { value: "64%", label: "AI critical to search strategy" },
              { value: "51%", label: "Better product comparison" },
              { value: "46%", label: "Improved buying guides" }
            ]}
            index={1}
          />
          <FeatureCard
            icon={<Megaphone className="w-5 h-5" />}
            title="Marketing & Engagement"
            description="AI chatbots, productivity gains, and personalized marketing."
            stats={[
              { value: "up to 67%", label: "Chatbot sales increase" },
              { value: "78%", label: "Marketers report gains" },
              { value: "10–30%", label: "Marketing cost reduction" }
            ]}
            index={2}
          />
          <FeatureCard
            icon={<Package className="w-5 h-5" />}
            title="Operations & Inventory"
            description="Logistics optimization, forecasting, and supply chain risk prediction."
            stats={[
              { value: "5–20%", label: "Logistics savings" },
              { value: "20–30%", label: "Inventory reduction" },
              { value: "53%", label: "Use AI for risk prediction" }
            ]}
            index={3}
          />
        </div>
      </ReportSection>

      {/* Revenue Impact */}
      <ReportSection>
        <SectionTitle 
          title="Revenue & Conversion Impact"
        />
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary mb-2">−47%</p>
              <p className="text-sm text-muted-foreground">Time to purchase</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary mb-2">+150%</p>
              <p className="text-sm text-muted-foreground">Conversion rate</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary mb-2">+50%</p>
              <p className="text-sm text-muted-foreground">Average order value</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-display font-semibold text-primary mb-2">−50%</p>
              <p className="text-sm text-muted-foreground">CAC reduction</p>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            "Speed + relevance = measurable revenue lift"
          </p>
        </div>
      </ReportSection>

      {/* GenAI as Traffic Channel */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Generative AI Is Becoming a Traffic & Referral Channel"
        />
        <StatGrid
          columns={4}
          stats={[
            { value: "13×", label: "YoY GenAI traffic increase (Adobe)", type: "measured" },
            { value: "19×", label: "Cyber Monday traffic spike", type: "measured" },
            { value: "1,200%", label: "YoY traffic growth (Oct 2025)", type: "measured" },
            { value: "+16%", label: "Higher conversion from AI traffic", type: "measured" }
          ]}
        />
        <div className="mt-8">
          <PullQuote 
            quote="AI isn't just a tool — it's becoming a discovery layer."
            variant="callout"
          />
        </div>
      </ReportSection>

      {/* Consumer Behavior */}
      <ReportSection>
        <SectionTitle 
          title="Consumer Behavior & Trust"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-display text-lg font-medium mb-4">How Consumers Use AI</h4>
            <div className="space-y-4">
              {[
                { value: "70%", label: "Use AI during online shopping" },
                { value: "65%", label: "For product research" },
                { value: "74%", label: "Prefer chatbots for basic queries" },
                { value: "47%", label: "Faster purchases with AI tools" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className="font-display font-semibold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-medium mb-4">Trust & Friction</h4>
            <div className="space-y-4">
              {[
                { value: "26%", label: "Trust companies to use AI responsibly", warning: true },
                { value: "87%", label: "Prefer hybrid AI + human support" },
                { value: "10%", label: "Comfortable with AI-managed payments", warning: true }
              ].map((stat, i) => (
                <div key={i} className={`flex items-center justify-between bg-card rounded-lg border p-4 ${stat.warning ? 'border-amber-500/30' : 'border-border'}`}>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <span className={`font-display font-semibold ${stat.warning ? 'text-amber-600' : 'text-primary'}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReportSection>

      {/* SMB Adoption */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Small & Mid-Sized Merchants Are Quietly Leading"
        />
        <StatGrid
          columns={4}
          stats={[
            { value: "75%", label: "SMBs experimenting with AI", type: "measured" },
            { value: "87%", label: "Say AI helps them scale", type: "measured" },
            { value: "83%", label: "Growing SMBs already using AI", type: "measured" },
            { value: "78%", label: "Plan to increase AI spend", type: "measured" }
          ]}
        />
        <div className="mt-8">
          <PullQuote 
            quote="AI lowers the sophistication gap between small and large retailers."
            variant="callout"
          />
        </div>
      </ReportSection>

      {/* What's Not Working */}
      <ReportSection>
        <SectionTitle 
          title="What's Not Working"
          subtitle="Common failure modes in AI implementation"
        />
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "End-to-end autonomous shopping", issue: "Consumer hesitation" },
            { title: "Poor data quality", issue: "AI underperformance" },
            { title: "Tool sprawl", issue: "No ROI" },
            { title: "AI without workflow change", issue: "No margin impact" }
          ].map((item, i) => (
            <div key={i} className="bg-card rounded-xl border border-amber-500/30 p-6 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">→ {item.issue}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <PullQuote 
            quote="AI delivers value when workflows change — not when tools are added."
            variant="editorial"
          />
        </div>
      </ReportSection>

      {/* Outlook */}
      <ReportSection dark>
        <SectionTitle title="What's Next (2026–2030 Outlook)" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "$51B+", label: "AI ecommerce market by 2033" },
            { value: "80%", label: "Customer interactions by AI (2030)" },
            { value: "1 in 3", label: "Retailers using advanced AI agents (2028)" },
            { value: "~60%", label: "Profit lift by 2035" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-display font-semibold text-dark-foreground mb-2">{stat.value}</p>
              <p className="text-sm text-dark-foreground/70">{stat.label}</p>
              <Badge variant="outline" className="mt-2 text-xs border-dark-foreground/30 text-dark-foreground/70">Projected</Badge>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Sources */}
      <ReportSection>
        <SourcesSection
          sources={[
            { name: "Shopify" },
            { name: "McKinsey" },
            { name: "Adobe" },
            { name: "Statista" },
            { name: "Algolia" },
            { name: "Bain" },
            { name: "Deloitte" },
            { name: "EY" }
          ]}
          methodology="AI in e-commerce includes AI-native and AI-embedded systems: recommendations, search, GenAI, forecasting, pricing, fraud detection. Figures combine measured data and forward projections where noted."
        />
      </ReportSection>
    </article>
  );
};

export default AiEcommerceReport;
