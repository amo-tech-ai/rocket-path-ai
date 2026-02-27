// AI Adoption by Industry — Report Data
// Sources: McKinsey 2024, OECD 2025, PwC 2025, BCG 2024, Stanford HAI 2025, OpenAI 2025, Bloomberg 2024

// ── Colors ────────────────────────────────────────────────
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
  BLUE: "#3B82F6",
  CYAN: "#06B6D4",
  AMBER: "#F59E0B",
  EMERALD: "#10B981",
  ROSE: "#F43F5E",
};

// ── Slide 1: Hero ─────────────────────────────────────────
export const heroKpis = [
  { value: "72%", label: "Organizations Using AI", trend: "+17pp YoY", trendType: "positive" as const },
  { value: "$250B+", label: "Private AI Investment (2024)", trend: "Global total", trendType: "positive" as const },
  { value: "3.7×", label: "Gen AI ROI", sublabel: "Per dollar invested", trendType: "positive" as const },
  { value: "74%", label: "Stuck Before Tangible Returns", trend: "The scaling gap", trendType: "negative" as const },
];

// ── Slide 2: Executive Summary ────────────────────────────
export const executiveSummaryPoints = [
  {
    title: "AI adoption has crossed the tipping point",
    description:
      "72% of organizations now use AI in at least one function. Gen AI adoption jumped from 33% to 65% in just 10 months. The question has shifted from 'if' to 'how fast.'",
  },
  {
    title: "Most companies can't scale past pilots",
    description:
      "Only 26% of companies have moved beyond proof-of-concept. 74% have yet to show tangible returns. The gap between experimentation and value extraction is the defining challenge.",
  },
  {
    title: "Leaders are pulling away",
    description:
      "AI leaders show 1.5× revenue growth, 1.6× shareholder returns, and 1.4× ROIC. They invest in operating-model shifts, not tool rollouts.",
  },
  {
    title: "Tech leads, but manufacturing has the highest upside",
    description:
      "Technology & SaaS leads at 88% adoption. But manufacturing — at just 4-8% — shows 31% labor productivity gains and €190M savings in documented cases.",
  },
];

export const executivePullQuote = {
  quote: "AI delivers value when workflows change, not when tools are added.",
  author: "BCG",
  role: "AI Adoption Report 2024",
};

// ── Slide 3: Adoption Rankings (Bar Chart) ────────────────
export const adoptionByIndustry = [
  { name: "Technology & SaaS", adoption: 88, color: COLORS.FOREST },
  { name: "Financial Services", adoption: 75, color: COLORS.TEAL },
  { name: "Healthcare", adoption: 55, color: COLORS.BLUE },
  { name: "Retail & E-commerce", adoption: 50, color: COLORS.INDIGO },
  { name: "Professional Services", adoption: 45, color: COLORS.LAVENDER },
  { name: "Manufacturing", adoption: 40, color: COLORS.AMBER },
  { name: "Logistics & Supply Chain", adoption: 31, color: COLORS.CYAN },
  { name: "Marketing & Media", adoption: 28, color: COLORS.CORAL },
  { name: "Energy & Climate", adoption: 15, color: COLORS.EMERALD },
  { name: "Education", adoption: 8, color: COLORS.SLATE },
];

// ── Slide 4: Industry Deep Dives ──────────────────────────
export const industryDeepDives = [
  {
    icon: "Building2",
    title: "Technology & SaaS",
    adoption: "88%",
    description: "GitHub Copilot writes 46% of code at Microsoft. Salesforce's Einstein handles 1B+ predictions daily. AI agents now resolve IT tickets end-to-end without human intervention.",
    example: "Example: Atlassian's AI assistant auto-resolves 20% of Jira tickets before an engineer sees them.",
    stats: [
      { value: "88%", label: "Regular AI use" },
      { value: "39%", label: "Report EBIT impact" },
      { value: "3×", label: "High performers scale agents" },
    ],
    color: COLORS.FOREST,
  },
  {
    icon: "Banknote",
    title: "Financial Services",
    adoption: "75%",
    description: "JPMorgan's COiN analyzes 12,000 contracts in seconds (vs. 360,000 lawyer-hours). PayPal's AI catches fraud in <1 second. Robo-advisors manage $2T+ in assets globally.",
    example: "Example: Mastercard's AI prevented $20B in fraud in a single year using real-time transaction scoring.",
    stats: [
      { value: "75%", label: "Large firms using AI" },
      { value: "50%", label: "Resolution time cut" },
      { value: "#2", label: "Highest adopting sector" },
    ],
    color: COLORS.TEAL,
  },
  {
    icon: "Heart",
    title: "Healthcare",
    adoption: "55%",
    description: "Google's AI detects diabetic retinopathy as accurately as ophthalmologists. Tempus uses AI to match cancer patients with clinical trials. PathAI automates pathology slide analysis.",
    example: "Example: Mayo Clinic's AI detects heart disease from a standard ECG with 93% accuracy — catching conditions doctors miss.",
    stats: [
      { value: "80%+", label: "Testing or using AI" },
      { value: "25%", label: "Cost reduction" },
      { value: "-90%", label: "Maintenance time" },
    ],
    color: COLORS.BLUE,
  },
  {
    icon: "ShoppingCart",
    title: "Retail & E-commerce",
    adoption: "50%",
    description: "Amazon's recommendation engine drives 35% of total sales. Stitch Fix uses AI stylists to personalize every box. Walmart's AI replenishment system reduced out-of-stocks by 30%.",
    example: "Example: Shopify's AI product descriptions increased merchant conversion rates by 15% overnight.",
    stats: [
      { value: "+15%", label: "Revenue outperformance" },
      { value: "+15%", label: "Conversion rate lift" },
      { value: "53%", label: "Shoppers use AI search" },
    ],
    color: COLORS.INDIGO,
  },
  {
    icon: "Factory",
    title: "Manufacturing",
    adoption: "40%",
    description: "Siemens uses AI twins to simulate entire factories before building them. BMW's AI agents cut production planning time by 30-40%. Computer vision catches defects human eyes miss.",
    example: "Example: A European auto manufacturer saved €190M annually by predicting machine failures 3 weeks before they happened.",
    stats: [
      { value: "+31%", label: "Labor productivity" },
      { value: "€190M", label: "Savings (case study)" },
      { value: "77%", label: "Implementation rate (2025)" },
    ],
    color: COLORS.AMBER,
  },
  {
    icon: "Truck",
    title: "Logistics & Supply Chain",
    adoption: "31%",
    description: "UPS's ORION system saves 100M miles/year through AI route optimization. Swiss Railways cut bridge inspection time by 60% using visual AI. Waymo runs 150K+ autonomous rides weekly.",
    example: "Example: DHL's AI demand forecasting reduced overstock by 20% across 220 countries.",
    stats: [
      { value: "-60%", label: "Inspection time" },
      { value: "-20–30%", label: "Error reduction" },
      { value: "150K+", label: "Waymo rides/week" },
    ],
    color: COLORS.CYAN,
  },
];

// ── Slide 5: Gen AI Use Cases (Heatmap) ───────────────────
export const genAiUseCases = [
  { function: "Marketing & Sales", percentage: 34, description: "e.g., HubSpot AI writes email campaigns, Jasper generates ad copy", example: "Coca-Cola used gen AI to create personalized ad variants across 200 markets" },
  { function: "Product Development", percentage: 26, description: "e.g., Figma AI generates design variants, GPT prototypes features", example: "Duolingo uses GPT-4 to generate interactive language exercises at scale" },
  { function: "IT / Engineering", percentage: 22, description: "e.g., GitHub Copilot, automated test generation, documentation", example: "Google engineers report 20% faster code reviews with AI assistance" },
  { function: "Service Operations", percentage: 21, description: "e.g., Klarna's AI assistant handles 2/3 of customer chats", example: "Klarna's AI does the work of 700 full-time customer service agents" },
  { function: "Strategy & Finance", percentage: 17, description: "e.g., AI-powered forecasting, scenario modeling, M&A analysis", example: "JPMorgan's analysts use AI to parse 10,000+ earnings calls in minutes" },
  { function: "HR & Talent", percentage: 14, description: "e.g., HireVue AI interviews, Workday skills matching", example: "Unilever screens 1.8M+ annual applicants with AI pre-screening" },
  { function: "Supply Chain", percentage: 13, description: "e.g., AI demand sensing, route optimization, inventory balancing", example: "Walmart's AI replenishment predicts store-level demand hourly" },
  { function: "Legal & Compliance", percentage: 11, description: "e.g., Harvey AI for contract analysis, regulatory scanning", example: "Allen & Overy's AI assistant reviews contracts 80% faster than associates" },
];

// ── Slide 6: Productivity Impact ──────────────────────────
export const productivityStats = [
  { value: "40–60 min", label: "Saved daily — that's an extra month of productive time per year for every worker using AI", icon: "Clock", source: "OpenAI / Stanford HAI" },
  { value: "10+ hrs", label: "Saved weekly by heavy users — equivalent to gaining a second employee for 25% of the cost", icon: "Zap", source: "OpenAI" },
  { value: "75%", label: "Of workers say AI makes them faster or better at their jobs — not slightly, measurably", icon: "TrendingUp", source: "BCG" },
  { value: "87%", label: "Of IT workers resolve issues faster with AI — debugging, incident response, system monitoring", icon: "Monitor", source: "OpenAI" },
  { value: "85%", label: "Of marketers create campaigns faster — first drafts, A/B copy, audience targeting, analytics", icon: "Megaphone", source: "OpenAI" },
  { value: "15–25%", label: "Productivity gain at scale — this is after full deployment, not just pilot numbers", icon: "BarChart3", source: "PwC" },
];

// ── Slide 7: Investment Landscape ─────────────────────────
export const investmentByRegion = [
  { region: "United States", amount: 109.1, unit: "B", share: 82, color: COLORS.FOREST },
  { region: "China", amount: 9.3, unit: "B", share: 7, color: COLORS.CORAL },
  { region: "United Kingdom", amount: 4.5, unit: "B", share: 3, color: COLORS.INDIGO },
  { region: "Rest of World", amount: 10.1, unit: "B", share: 8, color: COLORS.SLATE },
];

export const investmentStats = [
  { value: "$250B+", label: "Global private AI investment (2024)" },
  { value: "$33.9B", label: "Gen AI startup funding (+18.7% YoY)" },
  { value: "280×", label: "Inference cost drop (2022–2024)" },
  { value: "20%", label: "Of IT budgets allocated to AI" },
];

// ── Slide 8: Value Gap (Leaders vs. Laggards) ─────────────
export const valueGapData = {
  leaders: {
    label: "AI Leaders",
    traits: [
      { dimension: "Revenue Growth", value: "1.5×", description: "Higher than peers", realWorld: "Amazon, Microsoft, and NVIDIA grew revenue 50% faster than industry averages" },
      { dimension: "Shareholder Returns", value: "1.6×", description: "Higher than peers", realWorld: "AI-first companies delivered 60% higher total shareholder returns over 3 years" },
      { dimension: "ROIC", value: "1.4×", description: "Higher than peers", realWorld: "Leaders reinvest AI savings into new AI — creating a compounding advantage" },
      { dimension: "Approach", value: "Operating-model shift", description: "Redesign workflows", realWorld: "Klarna redesigned entire support flow around AI, not just adding a chatbot" },
      { dimension: "Budget", value: "20%+", description: "Of digital budget on AI", realWorld: "Leaders spend $10M+ on AI while laggards debate $500K pilots" },
    ],
  },
  laggards: {
    label: "AI Laggards",
    traits: [
      { dimension: "Revenue Growth", value: "1.0×", description: "Baseline", realWorld: "Growing at market rate — no AI-driven competitive advantage" },
      { dimension: "Shareholder Returns", value: "1.0×", description: "Baseline", realWorld: "Investors increasingly penalize companies without clear AI strategies" },
      { dimension: "ROIC", value: "1.0×", description: "Baseline", realWorld: "Manual processes cost more each year as AI-native competitors scale" },
      { dimension: "Approach", value: "Tool rollout", description: "Buy and deploy", realWorld: "Bought ChatGPT Enterprise licenses but didn't change any workflows" },
      { dimension: "Budget", value: "<5%", description: "Incremental pilots", realWorld: "Running 15 disconnected AI experiments with no path to production" },
    ],
  },
};

// ── Slide 9: The 10/20/70 Rule ────────────────────────────
export const scalingFramework = {
  rule: [
    {
      share: 10,
      label: "Algorithms & Models",
      description: "Choosing GPT-4 vs. Claude vs. Gemini, fine-tuning on your data, writing effective prompts. This is the part most companies obsess over — but it's the smallest lever.",
      example: "BMW spent 6 months choosing models, then 18 months on change management. The model choice mattered far less than training 50,000 employees.",
      color: COLORS.LAVENDER,
    },
    {
      share: 20,
      label: "Technology & Data",
      description: "Clean data pipelines, API integrations, security architecture, and infrastructure that can handle production scale — not just demo day.",
      example: "A Fortune 500 retailer's AI pilot worked perfectly on 1,000 products. It crashed when deployed across 500,000 SKUs because their data pipeline couldn't handle the load.",
      color: COLORS.INDIGO,
    },
    {
      share: 70,
      label: "People & Process",
      description: "Getting teams to actually change how they work. New workflows, new decision-making processes, retraining, governance, and executive sponsorship that lasts beyond the keynote.",
      example: "Klarna's AI assistant replaced 700 FTE of customer service work — but only because they redesigned the entire support workflow around AI, not just bolted it onto existing processes.",
      color: COLORS.FOREST,
    },
  ],
  barriers: [
    { barrier: "Data quality & infrastructure", rank: 1, percentage: 58, source: "PwC", description: "Messy, siloed, or incomplete data makes AI unreliable. Most companies have data everywhere but insights nowhere." },
    { barrier: "Change management / readiness", rank: 2, percentage: 52, source: "PwC", description: "Teams resist new workflows. Middle management becomes the bottleneck when execs push AI from above." },
    { barrier: "Lack of use-case prioritization", rank: 3, percentage: 47, source: "PwC", description: "Companies try 50 AI experiments instead of going deep on 3 that matter. Scattered pilots produce scattered results." },
    { barrier: "Talent shortage", rank: 4, percentage: 44, source: "McKinsey", description: "Not just ML engineers — companies lack AI product managers, data engineers, and leaders who understand both AI and operations." },
    { barrier: "Inaccuracy concerns", rank: 5, percentage: 56, source: "McKinsey", description: "AI hallucinations in customer-facing apps erode trust. One bad answer can undo months of adoption progress." },
    { barrier: "Cybersecurity risk", rank: 6, percentage: 53, source: "McKinsey", description: "Sensitive data in AI prompts, model poisoning, and adversarial attacks create new attack surfaces." },
  ],
  maturity: [
    { stage: "Experimental", share: 25, color: COLORS.SLATE },
    { stage: "Pilot", share: 30, color: COLORS.TEAL },
    { stage: "Scaled", share: 30, color: COLORS.FOREST },
    { stage: "Advanced", share: 15, color: COLORS.INDIGO },
  ],
};

// ── Slide 10: Predictions ─────────────────────────────────
export const predictions = [
  {
    number: "01",
    title: "Agentic AI Goes Mainstream",
    description: "Instead of chatbots that answer questions, AI agents will book your flights, file your taxes, and manage your supply chain autonomously. Think: AI employees, not AI tools.",
    source: "PwC / BCG",
  },
  {
    number: "02",
    title: "Gen AI Market Hits $1.6T+ by 2032",
    description: "That's larger than the current GDP of Spain. Every software category — from CRM to ERP to accounting — gets rebuilt with AI at the core, not bolted on as a feature.",
    source: "Bloomberg",
  },
  {
    number: "03",
    title: "The Pilot Trap Breaks Open",
    description: "The 74% stuck in pilots will halve by 2027. Companies that haven't reached production by then will be acquisition targets, not acquirers. The window for learning is closing.",
    source: "McKinsey / BCG",
  },
  {
    number: "04",
    title: "Industry Winners Pull Away",
    description: "Tech at 88% adoption will see AI everywhere. Manufacturing at 40% has the biggest upside — €190M savings cases become the norm, not the exception. Education stays behind.",
    source: "OECD",
  },
  {
    number: "05",
    title: "AI Governance Becomes Table Stakes",
    description: "The EU AI Act is already law. Companies without formal AI governance will lose enterprise contracts, face fines, and struggle to hire. Compliance becomes a moat, not a cost center.",
    source: "PwC",
  },
  {
    number: "06",
    title: "AI Gets 280× Cheaper (Again)",
    description: "Running GPT-3.5-level models cost 280× less in 2024 than 2022. That trend continues. By 2027, today's expensive AI becomes essentially free to run — on your phone.",
    source: "Stanford HAI / Bloomberg",
  },
];

// ── Case Studies ──────────────────────────────────────────
export const caseStudies = [
  { company: "BMW", industry: "Automotive", outcome: "+30–40%", metric: "Productivity improvement", description: "Deployed GenAI agents across production planning, quality control, and supply chain management. Engineers now use AI to simulate manufacturing changes before implementing them." },
  { company: "Swiss Railways (SBB)", industry: "Transport", outcome: "-60%", metric: "Inspection time reduction", description: "AI-powered cameras on trains automatically inspect 3,000 km of track and 1,200 bridges. Defects that took inspectors weeks to find are now flagged in hours." },
  { company: "Klarna", industry: "Fintech", outcome: "700 FTE", metric: "Work replaced by AI assistant", description: "Their AI customer service assistant handles 2/3 of all customer chats in 35 markets and 23 languages. Average resolution time dropped from 11 minutes to 2." },
  { company: "Siemens", industry: "Manufacturing", outcome: "€190M", metric: "Annual cost savings", description: "AI digital twins simulate entire factories. Predictive maintenance alerts teams 3 weeks before equipment failure, eliminating unplanned downtime." },
  { company: "Waymo", industry: "Transport", outcome: "150K+", metric: "Autonomous rides/week", description: "Full self-driving across Phoenix, San Francisco, and LA. No human driver. Passengers rate it safer than human rideshare drivers." },
];

// ── Sources ───────────────────────────────────────────────
export const sources = [
  { name: "McKinsey — The State of AI (2024 Global Survey)", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" },
  { name: "OECD — How Do Different Sectors Engage with AI (Feb 2025)", url: "https://www.oecd.org/en/blogs/2025/02/how-do-different-sectors-engage-with-ai.html" },
  { name: "PwC — AI Predictions 2025", url: "https://www.pwc.com/us/en/tech-effect/ai-analytics/ai-predictions.html" },
  { name: "BCG — Where's the Value in AI? (2024)", url: "https://www.bcg.com/publications/2024/maximizing-return-on-ai-investment" },
  { name: "Stanford HAI — AI Index Report 2025", url: "https://aiindex.stanford.edu/report/" },
  { name: "OpenAI — The State of Enterprise AI (2025)", url: "https://openai.com/index/the-state-of-enterprise-ai/" },
  { name: "Bloomberg Intelligence — Generative AI Outlook (Nov 2024)", url: "https://www.bloomberg.com/professional/insights/trading/generative-ai-outlook/" },
  { name: "Coherent Solutions — AI Adoption Trends 2025", url: "https://www.coherentsolutions.com/insights/ai-adoption-trends-you-should-not-miss-2025" },
  { name: "Aloa — AI Adoption by Industry (2025)", url: "https://aloa.co/ai/resources/industry-insights/ai-adoption-by-industry" },
  { name: "Vention — AI Adoption Statistics (2025)", url: "https://ventionteams.com/solutions/ai/adoption-statistics" },
];
