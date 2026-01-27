import { 
  ReportHero, 
  ReportSection, 
  SectionTitle, 
  InsightCard, 
  DataTable, 
  PullQuote,
  FlowDiagram,
  SourcesSection 
} from "@/components/blog";
import { Badge } from "@/components/ui/badge";

const AiJobsReport = () => {
  return (
    <article>
      {/* Hero Section */}
      <ReportHero
        title="AI Jobs & Future of Work — 2024–2026"
        subtitle="What's growing, what's emerging, what's at risk — and where the data is strongest."
        chips={["LinkedIn + WEF + Indeed + PwC", "Measured vs projected", "US + global signals"]}
        kpis={[
          { value: "1.3M", label: "New AI jobs in 2 years", source: "WEF/LinkedIn", type: "measured" },
          { value: "+78M", label: "Net jobs by 2030 (170M created, 92M displaced)", source: "WEF projection", type: "projected" },
          { value: "+70%", label: "AI skill demand in US postings YoY", source: "WEF/LinkedIn", type: "measured" },
          { value: "4.2%", label: "Peak share of postings mentioning AI", source: "Indeed, Dec 2025", type: "measured" }
        ]}
      />

      {/* Executive Summary */}
      <ReportSection>
        <SectionTitle 
          title="Executive Summary" 
          subtitle="What the data tells us about AI's impact on jobs"
        />
        <div className="grid md:grid-cols-2 gap-6">
          <InsightCard
            title="Job creation is already visible"
            stat="1.3M"
            description="AI created 1.3M new jobs in two years (measured). Evidence of net-new roles, not just task automation."
            source="WEF/LinkedIn"
            type="measured"
            index={0}
          />
          <InsightCard
            title="Long-term net gain remains the base forecast"
            stat="+78M"
            description="Projected net gain by 2030. Large churn: creation and displacement happening together."
            source="WEF"
            type="projected"
            index={1}
          />
          <InsightCard
            title="Demand is shifting fast inside job postings"
            stat="+70% YoY"
            description="AI skill demand in US postings. AI literacy is becoming table-stakes across knowledge work."
            source="WEF/LinkedIn"
            type="measured"
            index={2}
          />
          <InsightCard
            title="AI mentions are still small but accelerating"
            stat="4.2%"
            description="Peak share in Indeed AI Tracker. Early-stage, but growing even as hiring weakens."
            source="Indeed"
            type="measured"
            index={3}
          />
          <InsightCard
            title="AI exposure correlates with productivity growth"
            stat="4.8×"
            description="Higher productivity growth in AI-exposed sectors. Economic value shows up first where AI can be deployed at scale."
            source="PwC"
            type="measured"
            index={4}
          />
          <InsightCard
            title="AI skills are most concentrated in ICT"
            stat="8.8%"
            description="Of ICT job ads require AI skills. Tech remains the engine room for AI skill accumulation."
            source="Index.dev"
            type="measured"
            index={5}
          />
        </div>
      </ReportSection>

      {/* Job Creation vs Displacement */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Job Creation vs Displacement (2030 Outlook)"
        />
        <div className="bg-card rounded-xl border border-border p-8">
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
            ["MLOps Engineer", "High", { value: "High", badge: "High", badgeVariant: "high" }, "Tech, Logistics"],
            ["Prompt Engineer", { value: "Declining relevance", badge: "Caution", badgeVariant: "low" }, { value: "Medium", badge: "Medium", badgeVariant: "medium" }, "Marketing"],
            ["AI Safety Specialist", { value: "Emerging high", badge: "Projected", badgeVariant: "projected" }, { value: "High", badge: "High", badgeVariant: "high" }, "Tech, Gov"],
            ["Robotics Engineer", { value: "470k created (proj)", badge: "Projected", badgeVariant: "projected" }, { value: "Medium", badge: "Medium", badgeVariant: "medium" }, "Mfg, Logistics"]
          ]}
        />
      </ReportSection>

      {/* Salaries */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="AI Salaries by Role (US)"
          subtitle="Median compensation and growth rates"
        />
        <DataTable
          headers={["Role", "Median Salary", "Junior Range", "Senior Range", "Growth Rate", "Equity Notes"]}
          rows={[
            ["AI/ML Engineer", "$180–200k", "$140–160k", "$220k+", "+20% YoY", "Common startups"],
            ["Data Scientist", "$160k", "$120–140k", "$200k+", "+15–28%", "Moderate"],
            ["AI Product Manager", "$170k", "$130–150k", "$210k+", "+18%", "High Big Tech"],
            ["MLOps Engineer", "$175k", "$135k", "$220k", "+25%", "Startup equity"],
            ["AI Research Scientist", "$190k", "$150k", "$250k+", "+22%", "Heavy equity"]
          ]}
          footnote="Ranges vary by location and total compensation structure; global medians often 20–40% lower (estimate)."
        />
      </ReportSection>

      {/* Jobs at Risk */}
      <ReportSection>
        <SectionTitle 
          title="Jobs at Risk of Automation"
          subtitle="Task-level automation pressure (not job-level certainty)"
        />
        <DataTable
          headers={["Role", "% Tasks Automatable", "Timeline", "Outcome"]}
          rows={[
            ["Data Entry", "80–90%", "Near-term", { value: "Disappears", badge: "High Risk", badgeVariant: "high" }],
            ["Basic Content Writing", "60–70%", "Near-term", { value: "Transforms", badge: "Medium", badgeVariant: "medium" }],
            ["Customer Support Tier 1", "50–60%", "Near-term", { value: "Shrinks 37%", badge: "Projected", badgeVariant: "projected" }],
            ["QA/Manual Testing", "70%", "Near-term", { value: "Oversight role", badge: "Evolves", badgeVariant: "medium" }],
            ["Bookkeeping", "65%", "Medium-term", { value: "AI-augmented", badge: "Transforms", badgeVariant: "medium" }]
          ]}
          footnote="These are task-level automation risks, not job-level certainties. Many roles will evolve rather than disappear."
        />
      </ReportSection>

      {/* Skills Matrix */}
      <ReportSection className="bg-muted/20">
        <SectionTitle 
          title="Skills Matrix"
          subtitle="Table-stakes vs rare/high-value skills by role"
        />
        <DataTable
          headers={["Role", "Table Stakes Skills", "Rare/High-Value Skills"]}
          rows={[
            ["AI/ML Engineer", "Python, PyTorch, cloud", "Agent systems, custom models"],
            ["Data Scientist", "SQL, pipelines, stats", "Causal AI, domain exp"],
            ["AI Product Manager", "LLMs, APIs", "Ethics, orchestration"],
            ["MLOps Engineer", "Kubernetes, monitoring", "Scaling agentic AI"],
            ["AI Safety Specialist", "Bias detection", "Red-teaming, gov frameworks"]
          ]}
          footnote="Human skills (judgment, ambiguity, communication) remain universally high-value."
        />
      </ReportSection>

      {/* Not Replaced, Re-shaped */}
      <ReportSection>
        <SectionTitle 
          title="Not Replaced, Re-shaped"
          subtitle="Roles where human leadership remains essential"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { role: "Product leadership", why: "Strategy + accountability", how: "AI provides data, humans decide tradeoffs" },
            { role: "Strategy", why: "Ambiguity handling", how: "AI runs scenarios, humans choose direction" },
            { role: "Complex engineering", why: "Integration + reliability", how: "AI accelerates but needs oversight" },
            { role: "Healthcare", why: "Empathy + trust", how: "AI augments diagnostics and documentation" },
            { role: "Skilled trades", why: "Physical variability", how: "AI helps scheduling/diagnostics, slow replacement" }
          ].map((item, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-6">
              <h4 className="font-display font-medium text-foreground mb-2">{item.role}</h4>
              <p className="text-sm text-muted-foreground mb-3">Why human-led: {item.why}</p>
              <p className="text-xs text-primary">{item.how}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Sources */}
      <ReportSection className="bg-muted/20">
        <SourcesSection
          sources={[
            { name: "WEF/LinkedIn", url: "https://www.weforum.org/stories/2026/01/ai-has-already-added-1-3-million-new-jobs-according-to-linkedin-data/" },
            { name: "Indeed Hiring Lab", url: "https://www.hiringlab.org/2026/01/22/january-labor-market-update-jobs-mentioning-ai-are-growing-amid-broader-hiring-weakness/" },
            { name: "PwC", url: "https://www.pwc.com/gx/en/news-room/press-releases/2024/pwc-2024-global-ai-jobs-barometer.html" },
            { name: "Index.dev", url: "https://www.index.dev/blog/ai-job-growth-statistics" }
          ]}
          methodology="Combines measured job posting data (LinkedIn, Indeed) with WEF projections. 'Measured' indicates verified signals from job postings or surveys; 'Projected' indicates forward-looking estimates."
          definitions={[
            { term: "AI jobs", definition: "Roles where AI skills are core requirements, not just nice-to-have" },
            { term: "AI skill demand", definition: "Frequency of AI-related skills appearing in job postings" },
            { term: "Task automation", definition: "Percentage of job tasks that can be performed by AI systems" }
          ]}
          limitations={[
            "Job posting data may not reflect actual hiring",
            "WEF projections are model-based estimates",
            "Salary data varies significantly by geography",
            "Automation timelines are inherently uncertain"
          ]}
        />
      </ReportSection>
    </article>
  );
};

export default AiJobsReport;
