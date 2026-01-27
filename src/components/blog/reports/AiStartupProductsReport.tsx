import { 
  ReportHero, 
  ReportSection, 
  SectionTitle, 
  StackedDiagram,
  FeatureCard,
  FlowDiagram,
  PullQuote,
  SourcesSection 
} from "@/components/blog";
import { 
  Workflow, 
  Users, 
  Plug, 
  ShieldCheck,
  Clock,
  TrendingUp,
  PiggyBank,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react";

const AiStartupProductsReport = () => {
  return (
    <article>
      {/* Hero Section */}
      <ReportHero
        title="Most Funded AI Startups Do One Thing Well: Replace Work"
        subtitle="The best AI startups don't 'add AI.' They own a workflow, remove friction, and deliver measurable outcomes."
        chips={["VC patterns", "Product features", "Investor logic"]}
        kpis={[
          { value: "3", label: "Product types get funded: Models · Infra · Apps", type: "measured" },
          { value: "Fewer", label: "Startups, bigger checks", type: "measured" },
          { value: "Vertical", label: "Focus beats generic tools", type: "measured" },
          { value: "Outcomes", label: "Drive acceleration, not features", type: "measured" }
        ]}
      />

      {/* 3 Layers */}
      <ReportSection>
        <SectionTitle 
          title="The 3 Layers of AI Startups"
          subtitle="How the AI startup landscape is structured"
        />
        <StackedDiagram
          layers={[
            { title: "Applications / Vertical AI", subtitle: "Job-doers", description: "Clear ROI" },
            { title: "Infrastructure (\"Plumbing\")", subtitle: "Picks & shovels", description: "Mission-critical" },
            { title: "Foundation Models", subtitle: "The brain", description: "High capital" }
          ]}
        />
        
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-display text-lg font-medium mb-3">Foundation Models</h4>
            <p className="text-sm text-muted-foreground mb-4">Large AI models offered via APIs</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Who buys:</span> Developers, enterprises, platforms</p>
              <p><span className="font-medium">Why funded:</span> Platform scale + ecosystem lock-in</p>
            </div>
            <p className="text-xs text-primary mt-4 italic">"High risk, very high upside. Requires massive capital."</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-display text-lg font-medium mb-3">Infrastructure</h4>
            <p className="text-sm text-muted-foreground mb-4">Tools that make AI usable in production</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Who buys:</span> AI teams, startups, enterprises</p>
              <p><span className="font-medium">Why funded:</span> Every AI app depends on this layer</p>
            </div>
            <p className="text-xs text-primary mt-4 italic">"AWS for AI reliability — boring, but mission-critical."</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-display text-lg font-medium mb-3">Applications</h4>
            <p className="text-sm text-muted-foreground mb-4">AI that automates real business workflows</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Who buys:</span> Teams, operators, SMBs, enterprises</p>
              <p><span className="font-medium">Why funded:</span> Clear ROI, faster sales, easier adoption</p>
            </div>
            <p className="text-xs text-primary mt-4 italic">"If it saves time or makes money fast → fundable."</p>
          </div>
        </div>
      </ReportSection>

      {/* Winning Features */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Common Features in Funded AI Startups"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={<Workflow className="w-5 h-5" />}
            title="Workflow Ownership"
            description="AI doesn't just answer — it completes steps. Not 'write an email' but 'resolve the entire support ticket'."
            index={0}
          />
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="Human-in-the-Loop Controls"
            description="AI proposes. Humans approve. Review screens, approval buttons, undo/rollback. Required for trust and enterprise adoption."
            index={1}
          />
          <FeatureCard
            icon={<Plug className="w-5 h-5" />}
            title="Integrations"
            description="AI fits into existing tools. CRM, Helpdesk, Finance systems. No one wants another dashboard."
            index={2}
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Reliability & Guardrails"
            description="AI must be predictable. Logging, audit trails, cost limits, error detection, policy enforcement."
            index={3}
          />
        </div>
      </ReportSection>

      {/* Value Creation */}
      <ReportSection>
        <SectionTitle 
          title="Why Customers Pay for AI Products"
          subtitle="The four quadrants of AI value"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Time Saved</h4>
            <p className="text-sm text-muted-foreground mb-4">Hours → minutes. Fewer manual steps.</p>
            <p className="text-xs text-primary italic">Ex: Recruiter screens 100 resumes → AI pre-filters to 10</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Revenue Lift</h4>
            <p className="text-sm text-muted-foreground mb-4">Higher conversions. Faster follow-ups.</p>
            <p className="text-xs text-primary italic">Ex: AI sales assistant replies instantly → more deals closed</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <PiggyBank className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Cost Reduction</h4>
            <p className="text-sm text-muted-foreground mb-4">Fewer support agents. Lower error rates.</p>
            <p className="text-xs text-primary italic">Ex: AI handles Tier-1 support → humans handle complex cases</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-4" />
            <h4 className="font-display font-medium mb-2">Better Decisions</h4>
            <p className="text-sm text-muted-foreground mb-4">Summaries instead of raw data. Prioritization.</p>
            <p className="text-xs text-primary italic">Ex: AI flags customers likely to churn this week</p>
          </div>
        </div>
      </ReportSection>

      {/* Investor Logic */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="What Makes an AI Startup Fundable"
        />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-primary/30 p-6">
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
          </div>
          
          <div className="bg-card rounded-xl border border-destructive/30 p-6">
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
          </div>
        </div>
      </ReportSection>

      {/* Acceleration */}
      <ReportSection>
        <SectionTitle 
          title="How AI Startups Scale Fast"
        />
        <FlowDiagram
          title="Growth Pattern"
          steps={[
            { title: "Narrow Use Case", description: "Start focused" },
            { title: "Early ROI", description: "Prove value fast" },
            { title: "Vertical Expansion", description: "Go deep" },
            { title: "Agentic Automation", description: "Multi-step" }
          ]}
        />
        
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-medium mb-2">Accelerators</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Structured milestones</li>
              <li>• Demo-driven development</li>
              <li>• Early customer access</li>
            </ul>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-medium mb-2">Vertical Focus</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Start in one industry</li>
              <li>• Learn deeply</li>
              <li>• Expand sideways</li>
            </ul>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <h4 className="font-medium mb-2">Agentic Systems</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Multi-step automation</li>
              <li>• Human-supervised autonomy</li>
            </ul>
          </div>
        </div>
      </ReportSection>

      {/* Key Takeaways */}
      <ReportSection dark>
        <SectionTitle title="Key Takeaways" />
        <div className="space-y-8 max-w-3xl mx-auto">
          <PullQuote 
            quote="AI that owns a workflow beats AI that answers questions."
            variant="editorial"
          />
          <PullQuote 
            quote="Trust and control matter as much as intelligence."
            variant="editorial"
          />
          <PullQuote 
            quote="The best AI startups feel boring — until you see the ROI."
            variant="editorial"
          />
        </div>
      </ReportSection>

      {/* Sources */}
      <ReportSection>
        <SourcesSection
          sources={[
            { name: "Crunchbase" },
            { name: "PitchBook" },
            { name: "CB Insights" },
            { name: "TechCrunch" },
            { name: "Y Combinator" }
          ]}
          methodology="AI startups categorized as: Foundation models, Infrastructure, Applications/Vertical AI. Focus on AI-native products, not generic software with minor AI features."
        />
      </ReportSection>
    </article>
  );
};

export default AiStartupProductsReport;
