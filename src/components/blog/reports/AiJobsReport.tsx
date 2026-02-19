import { 
  ReportSection, 
  SectionTitle, 
  InsightCard, 
  DataTable, 
  PullQuote,
  SourcesSection,
  HeroKpiGrid,
  ExecutiveSummary,
  ProgressComparison,
  HeatmapTable,
  SkillsMatrix,
  RoleCards,
  ValueGapSection
} from "@/components/blog";
import { 
  Code,
  Shield,
  Brain
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const AiJobsReport = () => {
  return (
    <article>
      {/* Enhanced Hero Section */}
      <ReportSection className="pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Report V1.1 • 2024–2026
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              AI Jobs &<br />
              <span className="italic">Future of Work</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-6">
              A premium research-grade analysis for executives navigating the tectonic 
              shift from labor displacement to cognitive augmentation.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium"
              >
                Read Executive Summary
              </motion.button>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                  +12
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Lead Analysts</span>
            </div>
          </motion.div>

          {/* Right: KPI Stack */}
          <HeroKpiGrid
            variant="stack"
            kpis={[
              { value: "78M", label: "Net Jobs Created", trend: "+15% vs 2023", trendType: "positive" },
              { value: "45%", label: "Skill Turnover", trend: "Critical Risk", trendType: "negative" },
              { value: "$260k", label: "Avg AI Salary", trend: "+12.4% YoY", trendType: "positive" },
              { value: "12%", label: "Productivity Lift", trend: "Enterprise Avg", trendType: "neutral" }
            ]}
          />
        </div>
      </ReportSection>

      {/* Executive Summary with Pull Quote */}
      <ReportSection>
        <ExecutiveSummary
          introduction="The narrative of AI-driven job loss is evolving. While initial fears focused on total displacement, our 2024-2026 data suggests a period of intense reconfiguration rather than pure elimination."
          keyPoints={[
            {
              title: "Augmentation vs. Replacement",
              description: "72% of impacted roles will be augmented with AI toolkits rather than replaced entirely."
            },
            {
              title: "The New Skill Floor",
              description: "Prompt literacy and basic model tuning are no longer optional 'plus' skills."
            },
            {
              title: "Sector Divergence",
              description: "Financial services and law are seeing the highest 'efficiency squeeze' in entry-level hiring."
            }
          ]}
          pullQuote={{
            quote: "AI will not replace managers, but managers who use AI will replace those who do not. The talent gap is no longer about potential; it is about architectural fluency.",
            author: "Dr. Aria Thorne",
            role: "Lead Researcher"
          }}
        />
      </ReportSection>

      {/* Job Creation vs Displacement */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Job Creation vs Displacement (2030 Outlook)"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card rounded-xl border border-border p-8"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-display font-semibold text-primary mb-2">170M</p>
              <p className="text-sm text-muted-foreground">Jobs created</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display font-semibold text-destructive mb-2">92M</p>
              <p className="text-sm text-muted-foreground">Jobs displaced</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-2">+78M</p>
              <p className="text-sm text-muted-foreground">Net change</p>
              <Badge variant="outline" className="mt-2 text-xs">Projected</Badge>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 italic">
            "Net positive does not mean low disruption — it means large reallocation."
          </p>
        </motion.div>
      </ReportSection>

      {/* Market Benchmarks */}
      <ReportSection>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Regional Data */}
          <ProgressComparison
            title="Created vs. Displaced (By Region)"
            subtitle="Jobs in Millions"
            items={[
              { label: "North America", current: 65, projected: 85, currentLabel: "", projectedLabel: "+2M / -1M" },
              { label: "Europe", current: 55, projected: 75, currentLabel: "", projectedLabel: "+1M / -1.5M" },
              { label: "Asia Pacific", current: 70, projected: 95, currentLabel: "", projectedLabel: "+1M / -2M" }
            ]}
          />

          {/* Right: Salary Table */}
          <div>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-4">
              Average Salary Benchmarks (2024)
            </h3>
            <div className="space-y-4">
              {[
                { role: "ML Engineer (Senior)", salary: "$260,000" },
                { role: "AI Policy Manager", salary: "$185,000" },
                { role: "Prompt Architect", salary: "$145,000" },
                { role: "Data Quality Specialist", salary: "$115,000" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
                >
                  <span className="text-sm text-muted-foreground">{item.role}</span>
                  <span className="font-display text-lg font-semibold text-foreground">{item.salary}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ReportSection>

      {/* Displacement Heatmap */}
      <ReportSection className="bg-muted/20">
        <HeatmapTable
          title="The Displacement Heatmap"
          rows={[
            {
              segment: "Financial Services",
              riskScore: { level: "high", percentage: 68 },
              primaryImpact: "Automated reconciliation & audit",
              growthCatalyst: "Personalized wealth models"
            },
            {
              segment: "Software Development",
              riskScore: { level: "medium", percentage: 42 },
              primaryImpact: "Boilerplate & documentation",
              growthCatalyst: "System design & orchestration"
            },
            {
              segment: "Creative Arts",
              riskScore: { level: "low", percentage: 28 },
              primaryImpact: "Asset generation & rotoscoping",
              growthCatalyst: "Artistic direction & conceptualization"
            }
          ]}
        />
      </ReportSection>

      {/* Skills Matrix */}
      <ReportSection>
        <SkillsMatrix
          title="Workforce Skills Matrix"
          subtitle="Current proficiency levels vs. 2026 market requirements"
          categories={[
            {
              title: "Prompt Engineering",
              icon: Code,
              skills: [
                { name: "Basic NLP", proficient: true },
                { name: "Iterative Tuning", proficient: true },
                { name: "Token Optimization", proficient: false }
              ]
            },
            {
              title: "Ethics & Compliance",
              icon: Shield,
              skills: [
                { name: "Bias Detection", proficient: true },
                { name: "Governance Frameworks", proficient: true },
                { name: "Liability Law", proficient: false }
              ]
            },
            {
              title: "MLOps Infrastructure",
              icon: Brain,
              skills: [
                { name: "Model Hosting", proficient: false },
                { name: "VPC Deployment", proficient: false },
                { name: "Real-time Inference", proficient: false }
              ]
            }
          ]}
        />
      </ReportSection>

      {/* Emerging vs Non-Replaceable Roles */}
      <ReportSection className="bg-muted/20">
        <div className="grid md:grid-cols-2 gap-8">
          <RoleCards
            title="Emerging AI Roles"
            variant="emerging"
            roles={[
              {
                title: "AI Ethicist & Bias Auditor",
                description: "Ensuring model outputs align with corporate values and local regulations."
              },
              {
                title: "Human-AI Interaction Designer",
                description: "Crafting intuitive interfaces for complex generative models."
              },
              {
                title: "Personalized LLM Curator",
                description: "Managing proprietary fine-tuning for executive-level personal assistants."
              }
            ]}
          />
          <RoleCards
            title="Non-Replaceable Roles"
            variant="stable"
            roles={[
              {
                title: "Strategic Negotiator",
                description: "Managing high-stakes human conflict where empathy and nuance are paramount."
              },
              {
                title: "Senior Creative Director",
                description: "Setting visual and narrative trends that have not yet been digested into datasets."
              },
              {
                title: "Infrastructure Crisis Manager",
                description: "Physical field intervention and novel problem-solving for hardware failures."
              }
            ]}
          />
        </div>
      </ReportSection>

      {/* Fastest-Growing AI Jobs */}
      <ReportSection>
        <SectionTitle 
          title="Fastest-Growing AI Jobs"
          subtitle="Roles with highest demand signals"
        />
        <DataTable
          headers={["Role", "Growth Rate", "Demand Trend", "Top Industries"]}
          rows={[
            ["AI/ML Engineer", { value: "Fastest-growing (3yr)", badge: "Measured", badgeVariant: "measured" }, { value: "High", badge: "High", badgeVariant: "high" }, "Tech, Finance, Data centers"],
            ["Data Scientist", { value: "35× (gen AI postings)", badge: "Measured", badgeVariant: "measured" }, { value: "High", badge: "High", badgeVariant: "high" }, "Tech, Retail, Mfg"],
            ["AI Product Manager", { value: "High (implied)", badge: "Implied", badgeVariant: "medium" }, { value: "Medium-High", badge: "Medium", badgeVariant: "medium" }, "Tech/SaaS"],
            ["AI Research Scientist", "Sustained demand", { value: "High", badge: "High", badgeVariant: "high" }, "Tech, Academia"],
            ["MLOps Engineer", "High", { value: "High", badge: "High", badgeVariant: "high" }, "Tech, Logistics"]
          ]}
        />
      </ReportSection>

      {/* Value Gap Section */}
      <ReportSection>
        <ValueGapSection
          title="Closing the Value Gap"
          subtitle="While 80% of organizations have run pilots, only 12% are capturing significant EBIT value. The 'Value Gap' is widening between digital leaders and laggards."
          stats={[
            { value: "12%", label: "Capture Full Value" },
            { value: "48%", label: "Stuck in Pilot Phase" },
            { value: "40%", label: "Limited Exploration" }
          ]}
          ctaLabel="View Strategic Recommendations"
        />
      </ReportSection>

      {/* Key Takeaways */}
      <ReportSection dark>
        <SectionTitle title="Key Takeaways" />
        <div className="space-y-8 max-w-3xl mx-auto">
          <PullQuote 
            quote="The future belongs to hybrid workers—those who can orchestrate AI systems while contributing uniquely human judgment."
            variant="editorial"
          />
          <PullQuote 
            quote="Skills have a half-life of 18 months. Continuous learning is no longer optional."
            variant="editorial"
          />
        </div>
      </ReportSection>

      {/* Sources */}
      <ReportSection>
        <SourcesSection
          sources={[
            { name: "World Economic Forum" },
            { name: "McKinsey Global Institute" },
            { name: "Bureau of Labor Statistics" },
            { name: "LinkedIn Economic Graph" },
            { name: "Glassdoor" }
          ]}
          methodology="Analysis based on job posting data, employer surveys, and economic modeling from 2023-2025. Net job figures are estimates based on multiple forecasting methodologies."
          definitions={[
            { term: "Net jobs created", definition: "New positions minus displaced roles" },
            { term: "Skill turnover", definition: "Percentage of core skills requiring replacement within 24 months" },
            { term: "Productivity lift", definition: "Measured output increase per FTE hour" }
          ]}
        />
      </ReportSection>
    </article>
  );
};

export default AiJobsReport;
