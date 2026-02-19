import { 
  ReportSection, 
  SectionTitle, 
  InsightCard, 
  StatGrid,
  PullQuote,
  FeatureCard,
  SourcesSection,
  HeroKpiGrid,
  ProgressComparison,
  NumberedPillars,
  DarkCTASection
} from "@/components/blog";
import { 
  Sparkles, 
  Search, 
  Megaphone, 
  Package,
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  Zap,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const AiEcommerceReport = () => {
  return (
    <article>
      {/* Enhanced Hero Section */}
      <ReportSection className="pb-0">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left: Title (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Executive Briefing 2024–2026
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              AI in E-commerce:<br />
              From Experimentation to{" "}
              <span className="italic text-primary">Revenue Engine</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">
              A premium research-grade report detailing the transformative impact of 
              artificial intelligence in the global retail sector.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium"
            >
              Read Executive Summary
              <span>→</span>
            </motion.button>
          </motion.div>

          {/* Right: KPI Stack (2 cols) */}
          <div className="lg:col-span-2">
            <HeroKpiGrid
              variant="stack"
              kpis={[
                { value: "+24%", label: "Avg Conversion Lift", icon: TrendingUp },
                { value: "4.2×", label: "Personalization ROI", icon: Target },
                { value: "-18%", label: "Churn Reduction", icon: Users },
                { value: "+31%", label: "Customer LTV", icon: Zap },
                { value: "+15%", label: "Inventory Efficiency", icon: Package }
              ]}
            />
          </div>
        </div>
      </ReportSection>

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

      {/* Revenue & Conversion Impact */}
      <ReportSection className="bg-muted/20">
        <ProgressComparison
          title="Revenue & Conversion Impact"
          subtitle="Data from over 500 leading retailers shows that AI isn't just a cost-saving tool; it's a primary growth driver. The divergence between AI adopters and laggards is expected to widen by 40% by 2026."
          items={[
            { 
              label: "Conversion Rate Uplift", 
              current: 35, 
              projected: 75, 
              currentLabel: "2023",
              projectedLabel: "2026 Projected",
              suffix: "%"
            },
            { 
              label: "Revenue Per Visitor (RPV)", 
              current: 30, 
              projected: 68, 
              currentLabel: "Current",
              projectedLabel: "Optimized",
              suffix: "%"
            }
          ]}
        />
        <div className="mt-8 text-right">
          <span className="text-3xl font-display font-semibold text-primary">+24.5%</span>
          <span className="text-sm text-muted-foreground ml-2">Avg. conversion improvement</span>
        </div>
      </ReportSection>

      {/* Implementation Pillars */}
      <ReportSection>
        <NumberedPillars
          title="Core Implementation Pillars"
          pillars={[
            {
              number: "01",
              title: "Generative Search",
              description: "Moving beyond keywords to semantic understanding. Conversational interfaces that guide users to products via natural language.",
              icon: Search
            },
            {
              number: "02",
              title: "Predictive Inventory",
              description: "Demand forecasting with 95%+ accuracy. Reduce overstock and stock-outs by analyzing 100+ external signals simultaneously.",
              icon: BarChart3
            },
            {
              number: "03",
              title: "Hyper Personalization",
              description: "1:1 dynamic storefronts. Every user sees a unique layout, price, and product mix based on real-time intent signals.",
              icon: Target
            },
            {
              number: "04",
              title: "Automated Support",
              description: "Beyond simple chatbots. Resolving 80% of complex queries without human intervention while increasing satisfaction scores.",
              icon: MessageSquare
            }
          ]}
        />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl border border-border p-8"
        >
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
        </motion.div>
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-destructive/30 p-6 flex items-start gap-4"
            >
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">→ {item.issue}</p>
              </div>
            </motion.div>
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-3xl font-display font-semibold text-white mb-2">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
              <Badge variant="outline" className="mt-2 text-xs border-white/30 text-white/70">Projected</Badge>
            </motion.div>
          ))}
        </div>
      </ReportSection>

      {/* CTA */}
      <ReportSection>
        <DarkCTASection
          title="Ready to scale your AI strategy?"
          subtitle="Get the complete research report with implementation playbooks and vendor analysis."
          primaryButton={{ label: "Book Strategy Session", href: "#" }}
        />
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
