// AI Jobs & Future of Work — Report Data
// Sources: WEF, McKinsey, Goldman Sachs, PwC, IBM, Brookings, Gartner, OECD, Cambridge, Nexford

// ─── Source URL Map ───────────────────────────────────────────────

export const SRC: Record<string, string> = {
  WEF: "https://www.weforum.org/publications/four-futures-for-jobs-in-the-new-economy-ai-and-talent-in-2030/",
  MCKINSEY: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/superagency-in-the-workplace-empowering-people-to-unlock-ais-full-potential-at-work",
  GOLDMAN: "https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce",
  PWC: "https://www.pwc.com/gx/en/services/ai/ai-jobs-barometer.html",
  IBM: "https://www.ibm.com/think/insights/ai-and-the-future-of-work",
  BROOKINGS: "https://www.brookings.edu/articles/generative-ai-the-american-worker-and-the-future-of-work/",
  GARTNER_REHIRE: "https://www.gartner.com/en/newsroom/press-releases/2026-02-03-gartner-predicts-half-of-companies-that-cut-customer-service-staff-due-to-ai-will-rehire-by-2027",
  GARTNER_20PCT: "https://www.gartner.com/en/newsroom/press-releases/2025-12-02-gartner-survey-finds-only-20-percent-of-customer-service-leaders-report-ai-driven-headcount-reduction",
  GARTNER_IT: "https://www.gartner.com/en/newsroom/press-releases/2026-02-03-gartner-forecasts-worldwide-it-spending-to-grow-10-point-8-percent-in-2026-totaling-6-point-15-trillion-dollars",
  OECD: "https://www.oecd.org/en/topics/policy-issues/future-of-work.html",
  CAMBRIDGE: "https://www.cam.ac.uk/stories/AI-and-the-future-of-work",
  NEXFORD: "https://www.nexford.edu/insights/how-will-ai-affect-jobs",
  UNRIC: "https://unric.org/en/ai-and-the-future-of-work-disruptions-and-opportunitie/",
  BUILTIN: "https://builtin.com/artificial-intelligence/ai-replacing-jobs-creating-jobs",
  PEW: "https://www.pewresearch.org/topic/economy-work/business-workplace/future-of-work/",
  DELOITTE: "https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/articles/generative-ai-and-the-future-of-work.html",
};

// ─── Color Tokens ─────────────────────────────────────────────────

export const COLORS = {
  IVORY: "#F1EEEA",
  DEEP_GREEN: "#12211D",
  FOREST: "#0E3E1B",
  TEAL: "#2A4E45",
  SLATE: "#697485",
  LAVENDER: "#CB9FD2",
  CORAL: "#FFC9C1",
  TEXT_PRIMARY: "#212427",
  INDIGO: "#6366F1",
} as const;

// ─── Hero KPIs ────────────────────────────────────────────────────

export const heroKpis = [
  { value: "+78M", label: "Net Jobs Created by 2030", source: "WEF", trend: "Net positive" },
  { value: "40%", label: "Workforce Needs Reskilling", source: "IBM", trend: "Within 3 years" },
  { value: "$7T", label: "GDP Boost by 2033", source: "GOLDMAN", trend: "Global impact" },
  { value: "25%", label: "AI Wage Premium", source: "PWC", trend: "AI-skilled workers" },
] as const;

// ─── Executive Summary ────────────────────────────────────────────

export const executiveSummaryPoints = [
  {
    number: "01",
    title: "Net Positive, Not Painless",
    description: "AI will create 170M new roles while displacing 92M — a net gain of 78M jobs by 2030. But the transition will be turbulent, requiring 12M US workers to change occupations.",
    source: "WEF",
    accentColor: COLORS.FOREST,
  },
  {
    number: "02",
    title: "Augmentation Over Replacement",
    description: "72% of impacted roles will be augmented with AI toolkits rather than eliminated. The key differentiator is architectural fluency — knowing how to design human-AI workflows.",
    source: "MCKINSEY",
    accentColor: COLORS.TEAL,
  },
  {
    number: "03",
    title: "The Skills Half-Life Crisis",
    description: "Technical skills now have an 18-month half-life. 40% of the global workforce needs reskilling within 3 years. Prompt literacy and model evaluation are the new baseline.",
    source: "IBM",
    accentColor: COLORS.INDIGO,
  },
  {
    number: "04",
    title: "The Great Divergence",
    description: "AI-skilled workers earn 25% more. AI-exposed sectors show 4.8× higher productivity. But 60% of advanced economy jobs face disruption vs only 26% in developing nations.",
    source: "PWC",
    accentColor: COLORS.CORAL,
  },
] as const;

// ─── Displacement vs Creation ─────────────────────────────────────

export const displacementStats = {
  created: { value: "170M", label: "Jobs created", color: COLORS.FOREST },
  displaced: { value: "92M", label: "Jobs displaced", color: COLORS.CORAL },
  net: { value: "+78M", label: "Net change by 2030", color: COLORS.INDIGO },
} as const;

export const displacementCategories = [
  { label: "Routine cognitive (data entry, bookkeeping)", value: 62, color: COLORS.CORAL },
  { label: "Routine manual (assembly, packaging)", value: 45, color: `${COLORS.CORAL}CC` },
  { label: "Non-routine cognitive (analysis, writing)", value: 28, color: COLORS.TEAL },
  { label: "Non-routine manual (care, skilled trades)", value: 12, color: COLORS.FOREST },
] as const;

export const displacementInsight = {
  eyebrow: "Strategic Implication",
  bullets: [
    "Net positive does not mean low disruption — it means large-scale reallocation",
    "12M US workers will need occupational transitions by 2030",
    "Transition costs fall disproportionately on mid-career workers aged 35-54",
    "60% of today's workers are in jobs that didn't exist in 1940",
  ],
  thesis: "The question is not whether AI creates jobs — it's whether displaced workers can access them. The reskilling gap is the real policy emergency.",
  sources: ["WEF", "MCKINSEY", "GOLDMAN"],
} as const;

// ─── Industry Exposure ────────────────────────────────────────────

export const industryExposure = [
  {
    industry: "Financial Services",
    automationPct: "50–60%",
    riskLevel: "HIGH" as const,
    primaryImpact: "Automated reconciliation, audit, compliance reporting",
    growthCatalyst: "Personalized wealth models, fraud detection",
    company: "JPMorgan COiN",
    accentColor: COLORS.CORAL,
  },
  {
    industry: "Legal & Professional",
    automationPct: "44%",
    riskLevel: "HIGH" as const,
    primaryImpact: "Contract review, e-discovery, due diligence",
    growthCatalyst: "Complex litigation strategy, client counseling",
    company: "Harvey AI (legal)",
    accentColor: COLORS.CORAL,
  },
  {
    industry: "Administrative & Support",
    automationPct: "46%",
    riskLevel: "HIGH" as const,
    primaryImpact: "Scheduling, data entry, customer routing",
    growthCatalyst: "Executive assistance, workflow orchestration",
    company: "—",
    accentColor: COLORS.CORAL,
  },
  {
    industry: "Software & Technology",
    automationPct: "35–40%",
    riskLevel: "MEDIUM" as const,
    primaryImpact: "Boilerplate code, documentation, testing",
    growthCatalyst: "System design, architecture, AI orchestration",
    company: "GitHub Copilot",
    accentColor: COLORS.LAVENDER,
  },
  {
    industry: "Healthcare",
    automationPct: "25–30%",
    riskLevel: "LOW-MED" as const,
    primaryImpact: "Diagnostics triage, clinical documentation",
    growthCatalyst: "Patient empathy, complex diagnosis, surgery",
    company: "Mayo Clinic AI",
    accentColor: COLORS.TEAL,
  },
  {
    industry: "Construction & Trades",
    automationPct: "6%",
    riskLevel: "LOW" as const,
    primaryImpact: "Planning software, estimating",
    growthCatalyst: "Physical craft, problem-solving on-site",
    company: "—",
    accentColor: COLORS.FOREST,
  },
] as const;

export const exposureKpis = [
  { value: "60%", label: "Highest exposure (Finance)", color: COLORS.CORAL },
  { value: "6%", label: "Lowest exposure (Construction)", color: COLORS.FOREST },
  { value: "37%", label: "Average across all sectors", color: COLORS.TEAL },
  { value: "2030", label: "Peak transition period", color: COLORS.INDIGO },
] as const;

// ─── Skills Gap ───────────────────────────────────────────────────

export const skillsHalfLife = {
  value: "18",
  unit: "months",
  label: "Average half-life of a technical skill",
  source: "IBM",
} as const;

export const skillsMatrix = [
  { name: "Prompt Engineering", required: 80, current: 20, gap: "Critical", color: COLORS.CORAL },
  { name: "AI/ML Fundamentals", required: 70, current: 30, gap: "High", color: COLORS.LAVENDER },
  { name: "Data Literacy", required: 90, current: 40, gap: "Critical", color: COLORS.CORAL },
  { name: "Ethics & AI Governance", required: 60, current: 10, gap: "High", color: COLORS.LAVENDER },
  { name: "Workflow Orchestration", required: 75, current: 15, gap: "Critical", color: COLORS.CORAL },
] as const;

export const skillsInsight = {
  eyebrow: "The New Skill Floor",
  bullets: [
    "Prompt literacy is no longer a 'plus' skill — it's baseline",
    "Model evaluation (knowing when AI is wrong) is table stakes",
    "Workflow design (human-AI handoffs) is the differentiator",
    "Continuous learning cycles must compress from years to months",
  ],
  thesis: "The talent gap is no longer about potential — it's about architectural fluency. Workers who can design AI-augmented workflows will define the next decade.",
  sources: ["IBM", "MCKINSEY", "WEF"],
} as const;

// ─── Wage & Productivity ──────────────────────────────────────────

export const wageStats = [
  { value: "25%", label: "AI Wage Premium", sublabel: "AI-skilled workers earn more", source: "PWC", color: COLORS.FOREST },
  { value: "$7T", label: "GDP Boost by 2033", sublabel: "Equivalent to adding Japan + Germany", source: "GOLDMAN", color: COLORS.INDIGO },
  { value: "4.8×", label: "Productivity Multiplier", sublabel: "In AI-exposed sectors", source: "PWC", color: COLORS.TEAL },
] as const;

export const productivityBySector = [
  { sector: "Software Development", lift: 55, source: "MCKINSEY", company: "GitHub Copilot" },
  { sector: "Customer Support", lift: 45, source: "GARTNER_20PCT", company: "Klarna" },
  { sector: "Marketing & Content", lift: 37, source: "MCKINSEY", company: "Coca-Cola" },
  { sector: "Financial Analysis", lift: 35, source: "GOLDMAN", company: "JPMorgan" },
  { sector: "Legal Research", lift: 30, source: "BROOKINGS", company: "Harvey AI" },
] as const;

export const wageInsight = {
  eyebrow: "Economic Intelligence",
  bullets: [
    "AI-exposed occupations are growing 4.8× faster than non-exposed roles — PwC",
    "Generative AI could automate 60-70% of employee work activities — McKinsey",
    "Up to $2.6-4.4 trillion in annual productivity gains globally — McKinsey",
    "IT spending forecast to reach $6.15 trillion in 2026 (+10.8% YoY) — Gartner",
  ],
  thesis: "AI doesn't just replace tasks — it amplifies human capability. The winners are organizations that redesign workflows around augmentation, not automation.",
  sources: ["PWC", "MCKINSEY", "GOLDMAN", "GARTNER_IT"],
} as const;

// ─── Emerging Roles ───────────────────────────────────────────────

export const emergingRoles = [
  {
    title: "AI/ML Engineer",
    salary: "$180–260k",
    growth: "Fastest-growing (3yr)",
    description: "Build, train, and deploy machine learning models. Design AI infrastructure for production workloads.",
    companies: "Google, Meta, OpenAI",
    accentColor: COLORS.FOREST,
  },
  {
    title: "AI Ethicist & Bias Auditor",
    salary: "$120–180k",
    growth: "New category",
    description: "Ensure model outputs align with corporate values and local regulations. Audit for fairness and transparency.",
    companies: "Microsoft, IBM, EU institutions",
    accentColor: COLORS.TEAL,
  },
  {
    title: "Prompt Architect",
    salary: "$130–200k",
    growth: "35× posting increase",
    description: "Design prompt systems, optimize token usage, build iterative tuning pipelines for enterprise LLMs.",
    companies: "Anthropic, Scale AI, enterprise SaaS",
    accentColor: COLORS.INDIGO,
  },
  {
    title: "Human-AI Interaction Designer",
    salary: "$110–160k",
    growth: "Emerging",
    description: "Craft intuitive interfaces for complex generative models. Design trust patterns and handoff flows.",
    companies: "Figma, Notion, Vercel",
    accentColor: COLORS.LAVENDER,
  },
] as const;

export const nonReplaceableRoles = [
  {
    title: "Strategic Negotiator",
    description: "High-stakes human conflict where empathy, nuance, and real-time emotional intelligence are paramount.",
    reason: "Requires embodied social cognition",
    accentColor: COLORS.FOREST,
  },
  {
    title: "Senior Creative Director",
    description: "Setting visual and narrative trends that have not yet been digested into training datasets.",
    reason: "Originality beyond pattern matching",
    accentColor: COLORS.TEAL,
  },
  {
    title: "Infrastructure Crisis Manager",
    description: "Physical field intervention and novel problem-solving for hardware failures in unpredictable environments.",
    reason: "Physical + novel problem-solving",
    accentColor: COLORS.INDIGO,
  },
] as const;

export const rolesInsight = {
  eyebrow: "The Augmentation Thesis",
  bullets: [
    "72% of impacted roles will be augmented, not replaced",
    "The fastest-growing jobs didn't exist 5 years ago",
    "Hybrid workers (human judgment + AI tooling) are the apex of the new labor market",
    "AI-resistant roles share one trait: they require embodied, contextual intelligence",
  ],
  thesis: "AI will not replace managers, but managers who use AI will replace those who do not. The talent gap is about architectural fluency — designing human-AI systems.",
  sources: ["MCKINSEY", "WEF", "PWC"],
} as const;

// ─── Geographic Impact ────────────────────────────────────────────

export const geographicRegions = [
  { region: "North America", exposure: 60, context: "Highest white-collar exposure. Strong tech sector absorption.", policy: "Federal AI education funding" },
  { region: "Western Europe", exposure: 55, context: "EU AI Act regulation. Social safety nets buffer transitions.", policy: "EU AI Act + reskilling mandates" },
  { region: "East Asia", exposure: 50, context: "Rapid adoption in Japan, South Korea. Manufacturing automation.", policy: "Government-led AI strategies" },
  { region: "Latin America", exposure: 40, context: "BPO sector vulnerable. Growing tech hubs in Brazil, Mexico.", policy: "Digital infrastructure investment" },
  { region: "Sub-Saharan Africa", exposure: 26, context: "Lower exposure but fewer safety nets. Leapfrog opportunity.", policy: "Mobile-first AI education" },
] as const;

export const geographicStats = [
  { value: "60%", label: "Advanced economies", sublabel: "Jobs facing significant AI disruption", color: COLORS.CORAL },
  { value: "40%", label: "Middle-income nations", sublabel: "Moderate exposure, growing adoption", color: COLORS.LAVENDER },
  { value: "26%", label: "Developing economies", sublabel: "Lower exposure, fewer safety nets", color: COLORS.TEAL },
] as const;

export const geographicInsight = {
  eyebrow: "Global Intelligence",
  bullets: [
    "AI threatens to widen the global inequality gap unless developing nations invest in digital infrastructure",
    "Advanced economies face higher disruption but have stronger institutional buffers",
    "The leapfrog thesis: developing nations can skip legacy systems entirely",
    "Remote work + AI tools may democratize access to global labor markets",
  ],
  thesis: "The geographic divide is not about technology access — it's about institutional readiness. Nations with strong education systems and social safety nets will navigate the transition; those without will fall further behind.",
  sources: ["UNRIC", "GOLDMAN", "OECD"],
} as const;

// ─── Policy Framework ─────────────────────────────────────────────

export const policyFramework = [
  {
    actor: "Government",
    accentColor: COLORS.FOREST,
    actions: [
      "Fund AI literacy programs in public education (K-12 through adult learning)",
      "Update curricula: add prompt engineering, data literacy, AI ethics to core standards",
      "Expand social safety nets: portable benefits, transition funds for displaced workers",
      "Regulate AI in hiring: transparency requirements for automated screening tools",
    ],
    source: "OECD",
  },
  {
    actor: "Corporate",
    accentColor: COLORS.TEAL,
    actions: [
      "Allocate minimum 3% of payroll to reskilling budgets (up from current 0.5% average)",
      "Create internal mobility programs: retrain before you replace",
      "Establish AI ethics review boards with worker representation",
      "Measure AI augmentation impact: productivity per worker, not headcount reduction",
    ],
    source: "MCKINSEY",
  },
  {
    actor: "Individual",
    accentColor: COLORS.INDIGO,
    actions: [
      "Build prompt engineering and AI evaluation skills (the new baseline)",
      "Develop a portfolio of AI-augmented work samples",
      "Cross-skill: combine domain expertise with AI fluency",
      "Join communities of practice for continuous learning (18-month skill cycles)",
    ],
    source: "IBM",
  },
] as const;

export const policyInsight = {
  eyebrow: "The Rehire Signal",
  bullets: [
    "Only 20% of customer service leaders report AI-driven headcount reduction — Gartner",
    "Half of companies that cut staff due to AI will rehire by 2027 — Gartner",
    "The skills gap, not AI itself, is the primary barrier to workforce transformation",
    "Organizations that invest in reskilling see 2-3× higher retention rates",
  ],
  thesis: "The narrative of mass AI unemployment is premature. The real challenge is speed of adaptation — can institutions retrain workers faster than AI transforms their jobs?",
  sources: ["GARTNER_REHIRE", "GARTNER_20PCT", "OECD"],
} as const;

// ─── Predictions Timeline ─────────────────────────────────────────

export const predictions = [
  {
    year: "2025",
    title: "The Tipping Point",
    description: "Gen AI adoption reaches 72% in enterprise. Most knowledge workers use AI tools weekly.",
    confidence: "High",
    active: false,
  },
  {
    year: "2026",
    title: "The Augmentation Wave",
    description: "AI agents handle routine cognitive tasks. Human roles shift to oversight, strategy, and exception handling.",
    confidence: "High",
    active: true,
  },
  {
    year: "2028",
    title: "The Skills Cliff",
    description: "Organizations that didn't invest in reskilling face talent crises. AI-skilled premium reaches 35%+.",
    confidence: "Medium",
    active: false,
  },
  {
    year: "2030",
    title: "The New Equilibrium",
    description: "170M new roles established. Hybrid human-AI workflows are standard. Net positive job creation confirmed.",
    confidence: "Projected",
    active: false,
  },
] as const;

export const predictionCards = [
  { stat: "50%", label: "of tasks will be augmentable by AI", source: "MCKINSEY" },
  { stat: "$60B+", label: "AI agent market by 2028", source: "GARTNER_IT" },
  { stat: "97M", label: "new roles created by 2025", source: "WEF" },
  { stat: "85M", label: "roles displaced by automation", source: "WEF" },
  { stat: "$6.15T", label: "global IT spending in 2026", source: "GARTNER_IT" },
  { stat: "3yr", label: "window for workforce reskilling", source: "IBM" },
] as const;

// ─── Closing Vision ───────────────────────────────────────────────

export const visionQuote = "The future belongs to hybrid workers — those who orchestrate AI systems while contributing uniquely human judgment.";

export const visionMetrics = [
  { value: "+78M", label: "Net jobs by 2030" },
  { value: "40%", label: "Reskilling needed" },
  { value: "$7T", label: "GDP boost by 2033" },
] as const;

// ─── Real-World Spotlights ───────────────────────────────────────

export interface CompanySpotlight {
  company: string;
  before: string;
  after: string;
  source: string;
}

export interface WorkerPersona {
  name: string;
  role: string;
  location: string;
  age: number;
  quote: string;
  toolkit: string;
}

export const companySpotlights: Record<string, CompanySpotlight> = {
  intuit: {
    company: "Intuit (QuickBooks)",
    before: "Small-business bookkeepers spent 15+ hours/week manually categorizing expenses and reconciling accounts.",
    after: "AI auto-categorizes 80% of transactions. Bookkeepers now advise clients on tax strategy and cash flow — higher-value work at higher rates.",
    source: "MCKINSEY",
  },
  jpmorgan: {
    company: "JPMorgan's COiN Platform",
    before: "Lawyers spent 360,000 hours annually reviewing commercial loan agreements for errors and compliance issues.",
    after: "COiN processes 12,000 agreements in seconds. Legal teams now focus on complex negotiations, client counsel, and deal structuring.",
    source: "GOLDMAN",
  },
  amazon_reskill: {
    company: "Amazon's AI Ready Program",
    before: "Warehouse workers and corporate staff had no structured path to AI literacy. Reskilling was ad hoc and untracked.",
    after: "2M+ people trained in AI fundamentals by 2025. Internal mobility doubled — warehouse managers transitioned into ML operations roles.",
    source: "IBM",
  },
  singapore: {
    company: "Singapore's SkillsFuture AI Initiative",
    before: "Adult workers in non-tech sectors had limited access to AI education. Upskilling was employer-dependent.",
    after: "Every adult citizen receives $500 in AI course credits. 340,000 workers completed AI modules in the first year. Gig workers included.",
    source: "OECD",
  },
};

export const workerPersonas: Record<string, WorkerPersona> = {
  daniel: {
    name: "Daniel",
    role: "Former Bank Teller → Digital Banking Specialist",
    location: "Charlotte, NC",
    age: 34,
    quote: "My branch went from 8 tellers to 3 — but I retrained through our bank's AI program. Now I help customers navigate digital tools and flag complex cases the AI can't handle. I earn 20% more.",
    toolkit: "Salesforce AI, internal chatbot, fraud detection dashboard",
  },
  priya: {
    name: "Priya",
    role: "Claims Adjuster → AI-Augmented Team Lead",
    location: "Mumbai, India",
    age: 31,
    quote: "I used to process 8 claims per day. Now AI pre-analyzes documentation and I handle 25 — focusing on the edge cases that need human judgment. Last quarter, I was promoted to train my team of 12.",
    toolkit: "Claims AI copilot, risk scoring model, workflow orchestrator",
  },
  james: {
    name: "James",
    role: "Long-Haul Truck Driver → Fleet Logistics Coordinator",
    location: "Dallas, TX",
    age: 42,
    quote: "Everyone said AI would take my job. Instead, I took a 6-month logistics course. Now I coordinate autonomous and human-driven fleets. I'm home every night instead of on the road.",
    toolkit: "Fleet management AI, route optimization, real-time sensor dashboards",
  },
};

// ─── Sources Section ──────────────────────────────────────────────

export const sources = [
  { name: "World Economic Forum", url: SRC.WEF },
  { name: "McKinsey Global Institute", url: SRC.MCKINSEY },
  { name: "Goldman Sachs", url: SRC.GOLDMAN },
  { name: "PwC AI Jobs Barometer", url: SRC.PWC },
  { name: "IBM Institute for Business Value", url: SRC.IBM },
  { name: "Brookings Institution", url: SRC.BROOKINGS },
  { name: "Gartner", url: SRC.GARTNER_REHIRE },
  { name: "OECD", url: SRC.OECD },
  { name: "University of Cambridge", url: SRC.CAMBRIDGE },
  { name: "Deloitte", url: SRC.DELOITTE },
  { name: "Pew Research Center", url: SRC.PEW },
  { name: "UNRIC (United Nations)", url: SRC.UNRIC },
] as const;

export const methodology =
  "Analysis synthesizes data from 12+ sources including WEF Future of Jobs Report, McKinsey Global Institute Superagency study, PwC AI Jobs Barometer, Goldman Sachs Global Workforce analysis, and Gartner press releases (2024-2026). Job creation and displacement figures are estimates based on multiple forecasting methodologies with varying assumptions about AI adoption speed and policy responses.";

export const definitions = [
  { term: "Net jobs created", definition: "New positions created by AI adoption minus roles displaced by automation" },
  { term: "Skills half-life", definition: "Time for 50% of a technical skill set to become obsolete or significantly outdated" },
  { term: "AI wage premium", definition: "Additional compensation earned by workers with demonstrated AI skills vs peers without" },
  { term: "Augmentation rate", definition: "Percentage of impacted roles where AI assists humans rather than replacing them" },
  { term: "Exposure rate", definition: "Percentage of job tasks in a sector that are technically automatable by current AI" },
] as const;

export const limitations = [
  "Job creation/displacement projections vary significantly between sources (WEF, Goldman Sachs, McKinsey use different models)",
  "Automation potential does not equal actual automation — policy, cost, and organizational factors mediate adoption",
  "Salary data reflects US/Western markets and may not generalize globally",
  "Skills gap measurements are self-reported and may underestimate actual proficiency",
  "Geographic exposure rates are based on economic structure, not actual AI deployment data",
] as const;
