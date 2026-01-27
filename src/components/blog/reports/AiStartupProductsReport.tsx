import { 
  ReportSection, 
  SectionTitle, 
  FeatureCard,
  PullQuote,
  SourcesSection,
  HeroKpiGrid,
  EcosystemStack,
  NumberedPillars,
  StrategicMatrix,
  DarkCTASection,
  InsightCard
} from "@/components/blog";
import { 
  Layers, 
  Server, 
  Cpu,
  CheckSquare,
  Users,
  Database,
  Sparkles,
  Zap,
  Clock,
  TrendingUp,
  PiggyBank,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";

const AiStartupProductsReport = () => {
  return (
    <article>
      {/* Enhanced Hero Section with KPI Grid */}
      <ReportSection className="pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Editorial V1.1 | 2024–2026 Research
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              Most Funded AI Startups Do One Thing Well:{" "}
              <span className="italic text-primary">Replace Work</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              The shift from tool-centric AI to agentic workflow ownership is redefining 
              the capital landscape. Founders are no longer building features; they are 
              building digital labor.
            </p>
          </motion.div>

          {/* Right: KPI Grid */}
          <HeroKpiGrid
            kpis={[
              { value: "3", label: "Product Types", sublabel: "Core ecosystem layers identified" },
              { value: "$12B+", label: "Capital Inflow", sublabel: "Series A–C investment volume" },
              { value: "84%", label: "Workflow Focus", sublabel: "Primary focus on B2B tasks" },
              { value: "2.4×", label: "Efficiency", sublabel: "Average productivity gain" }
            ]}
          />
        </div>
      </ReportSection>

      {/* Ecosystem Stack - Visual Diagram */}
      <ReportSection className="bg-muted/20">
        <EcosystemStack
          title="The 3-Layer Ecosystem Landscape"
          subtitle="A structural analysis of where value is accruing"
          layers={[
            {
              number: "I. Applications",
              title: "The Value Layer",
              subtitle: "Vertical AI",
              description: "Vertical AI solving specific industry workflows. Companies like Harvey (Legal) or Sierra (Customer CX) that own the entire user outcome, effectively acting as digital staff rather than software utilities.",
              icon: Layers
            },
            {
              number: "II. Infrastructure",
              title: "The Scaling Layer",
              subtitle: "AI Infra",
              description: "Compute, deployment, and monitoring tools. The plumbing that makes agentic workflows reliable, observable, and cost-effective. Critical for enterprise adoption.",
              icon: Server
            },
            {
              number: "III. Models",
              title: "The Foundation",
              subtitle: "LLMs & Specialized AI",
              description: "LLMs and specialized architectural foundations. Increasing commoditization of general intelligence, shifting value to domain-specific training and proprietary data integrations.",
              icon: Cpu
            }
          ]}
        />
      </ReportSection>

      {/* Strategic Pillars - Numbered Cards */}
      <ReportSection>
        <NumberedPillars
          title="Core Strategic Pillars"
          pillars={[
            {
              number: "01",
              title: "Workflow Ownership",
              description: "Successful startups are moving beyond 'copilots' to 'autopilots'—taking full accountability for specific business outcomes rather than just assisting.",
              icon: CheckSquare
            },
            {
              number: "02",
              title: "Human-in-the-Loop",
              description: "The high-trust model: AI handles 95% of the labor while humans act as supervisors, editors, and final approvers for edge cases.",
              icon: Users
            },
            {
              number: "03",
              title: "Proprietary Context",
              description: "Moats are built through data integration—the ability to ingest and reason across an enterprise's private, siloed knowledge graph.",
              icon: Database
            }
          ]}
        />
      </ReportSection>

      {/* Strategic Matrix - 2x2 Quadrant */}
      <ReportSection className="bg-muted/20">
        <StrategicMatrix
          title="The Strategic Value Matrix"
          subtitle="Positioning startups based on task complexity vs. autonomy level"
          xAxisLabel={{ low: "Simple Tasks", high: "Complex Tasks" }}
          yAxisLabel={{ low: "Low Autonomy", high: "High Autonomy" }}
          quadrants={[
            { title: "Utility Tools", subtitle: "Low Value / High Competition", icon: Zap },
            { title: "Strategic Agents", subtitle: "The 2026 Opportunity", highlighted: true, icon: Sparkles },
            { title: "Chat Interfaces", subtitle: "Commodity Layer", icon: Users },
            { title: "Decision Support", subtitle: "High Trust / Slow Adoption", icon: Database }
          ]}
        />
      </ReportSection>

      {/* Why Customers Pay */}
      <ReportSection>
        <SectionTitle 
          title="Why Customers Pay for AI Products"
          subtitle="The four quadrants of AI value"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-6 text-center"
          >
            <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Time Saved</h4>
            <p className="text-sm text-muted-foreground mb-4">Hours → minutes. Fewer manual steps.</p>
            <p className="text-xs text-primary italic">Ex: Recruiter screens 100 resumes → AI pre-filters to 10</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-6 text-center"
          >
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Revenue Lift</h4>
            <p className="text-sm text-muted-foreground mb-4">Higher conversions. Faster follow-ups.</p>
            <p className="text-xs text-primary italic">Ex: AI sales assistant replies instantly → more deals closed</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-6 text-center"
          >
            <PiggyBank className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Cost Reduction</h4>
            <p className="text-sm text-muted-foreground mb-4">Fewer support agents. Lower error rates.</p>
            <p className="text-xs text-primary italic">Ex: AI handles Tier-1 support → humans handle complex cases</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-border p-6 text-center"
          >
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Better Decisions</h4>
            <p className="text-sm text-muted-foreground mb-4">Summaries instead of raw data. Prioritization.</p>
            <p className="text-xs text-primary italic">Ex: AI flags customers likely to churn this week</p>
          </motion.div>
        </div>
      </ReportSection>

      {/* Investor Logic */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="What Makes an AI Startup Fundable"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-primary/30 p-6"
          >
            <h4 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Fundable Signals
            </h4>
            <ul className="space-y-3">
              {[
                "Clear daily user",
                "Clear job replaced or improved",
                "Measurable ROI",
                "Data or workflow lock-in",
                "Defensible distribution"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl border border-destructive/30 p-6"
          >
            <h4 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              Red Flags
            </h4>
            <ul className="space-y-3">
              {[
                "\"ChatGPT for X\" with no workflow ownership",
                "No clear customer",
                "Generic AI wrapper",
                "No trust or controls",
                "No data advantage",
                "Too many features, no outcome"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </ReportSection>

      {/* Key Insights */}
      <ReportSection>
        <SectionTitle title="Strategic Insights" />
        <div className="grid md:grid-cols-2 gap-6">
          <InsightCard
            title="The Application Layer Thesis"
            stat="84%"
            description="Of funded AI startups focus on B2B workflow automation over consumer applications."
            type="measured"
            index={0}
          />
          <InsightCard
            title="Infrastructure Consolidation"
            stat="Top 5"
            description="Infrastructure players capture 60% of category funding as winners emerge."
            type="estimated"
            index={1}
          />
          <InsightCard
            title="Model Commoditization"
            stat="2024"
            description="The year open-weight models reached parity with proprietary alternatives."
            type="measured"
            index={2}
          />
          <InsightCard
            title="Agent Emergence"
            stat="$2B+"
            description="Invested in autonomous agent platforms since Q3 2024 alone."
            type="measured"
            index={3}
          />
        </div>
      </ReportSection>

      {/* Key Takeaways */}
      <ReportSection dark>
        <SectionTitle title="Key Takeaways" />
        <div className="space-y-8 max-w-3xl mx-auto">
          <PullQuote 
            quote="The most valuable AI startups don't build better tools—they replace the need for tools entirely."
            variant="editorial"
          />
          <PullQuote 
            quote="Workflow ownership is the new moat. Copilots are a feature; autopilots are a company."
            variant="editorial"
          />
          <PullQuote 
            quote="Capital follows proprietary context. Generic AI is a race to zero."
            variant="editorial"
          />
        </div>
      </ReportSection>

      {/* Dark CTA */}
      <ReportSection>
        <DarkCTASection
          title="Ready to architect your AI strategy?"
          subtitle="Get the full 150+ page research report with detailed company profiles, funding data, and strategic recommendations."
          primaryButton={{ label: "Download Full Report", href: "#" }}
          secondaryButton={{ label: "Contact Research Team", href: "#" }}
        />
      </ReportSection>

      {/* Sources */}
      <ReportSection>
        <SourcesSection
          sources={[
            { name: "PitchBook" },
            { name: "Crunchbase" },
            { name: "a16z State of AI" },
            { name: "Index Ventures" },
            { name: "Company Filings" }
          ]}
          methodology="Analysis based on disclosed funding rounds for AI-native startups from 2023-2025. Categories assigned based on primary revenue source and product positioning."
        />
      </ReportSection>
    </article>
  );
};

export default AiStartupProductsReport;
