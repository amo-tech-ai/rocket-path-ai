// Fashion AI 2026 — Report Data
// Sources: McKinsey/BoF State of Fashion 2026, BCG, K3 Fashion Solutions, Research Nester

export const heroKpis = [
  { value: "$2.0T", label: "Global Fashion Market (2025)", trend: "→ $2.4T by 2030", trendType: "positive" as const },
  { value: "$89B", label: "AI in Fashion by 2035", trend: "40.8% yearly growth", trendType: "positive" as const },
  { value: "71%", label: "Unhappy with Current Tools", trend: "K3 Fashion Solutions", trendType: "neutral" as const },
  { value: "#1", label: "AI Is the Top Priority for 2026", trend: "McKinsey/BoF Survey", trendType: "positive" as const },
];

export const executiveSummaryPoints = [
  {
    title: "The market is taking off",
    description:
      "AI in fashion is worth $2.9B today and is expected to reach $89B by 2035, growing 40% per year. 2026 is when serious adoption starts.",
  },
  {
    title: "Current tools aren't working",
    description:
      "71% of fashion buyers say their current software doesn't help much. That means a huge opportunity to build something better.",
  },
  {
    title: "Tariffs are squeezing profits",
    description:
      "US clothing tariffs are jumping from 13% to 36% — that's $27B in extra costs. Brands need AI to protect their profits.",
  },
  {
    title: "Most AI projects fail — but the winners win big",
    description:
      "90% of AI projects fail, but the 10% that work see 3–5% more profit per sale and clear results within one season.",
  },
];

export const executivePullQuote = {
  quote:
    "AI isn't a priority because executives think it's cool. It's a priority because profits depend on it.",
  author: "McKinsey & BoF",
  role: "State of Fashion 2026",
};

export const marketFunnelTiers = [
  { label: "Total Fashion Market", value: "$2.0T", sublabel: "The full global market in 2025, growing to $2.4T by 2030", color: "#1e293b" },
  { label: "AI Opportunity in Fashion", value: "$89B", sublabel: "The total AI market in fashion by 2035 — growing 40% per year", color: "#334155" },
  { label: "Brands Already Buying AI Tools", value: "~$15B", sublabel: "By 2028 — fashion brands actively paying for AI software", color: "#475569" },
  { label: "Your Realistic Slice", value: "$50M–$200M", sublabel: "What one focused AI product can realistically capture", color: "#6366F1" },
];

export const marketSupportingStats = [
  { value: "40.8%", label: "AI in fashion grows 40% per year", type: "measured" as const },
  { value: "53%", label: "US shoppers already use AI to search for products", type: "measured" as const },
  { value: "90%", label: "Of AI projects fail — but focused tools succeed", type: "measured" as const },
];

export const opportunityChartData = [
  { name: "GEO / Product Data", som: 200, timeToValue: 6, buyer: "VP Digital / CMO" },
  { name: "Markdown Optimization", som: 200, timeToValue: 10, buyer: "VP Merchandising" },
  { name: "Compliance / Traceability", som: 200, timeToValue: 36, buyer: "Sustainability / Legal" },
  { name: "Allocation Copilot", som: 200, timeToValue: 28, buyer: "VP Ops" },
  { name: "Content + SKU Launch", som: 200, timeToValue: 4, buyer: "E-commerce / CMO" },
];

export const opportunityPillars = [
  {
    number: "01",
    title: "Make Products Findable by AI Shoppers",
    description:
      "Help products show up when AI shopping assistants search for them. 53% of US shoppers already use AI to find products. Market: $50M–$200M. Results in 4–8 weeks.",
  },
  {
    number: "02",
    title: "Smarter Sales & Discounting",
    description:
      "Stop guessing when to put items on sale. Use AI to time discounts perfectly and recover 3–5% more profit per season. Market: $50M–$200M. Results in 8–12 weeks.",
  },
  {
    number: "03",
    title: "Sustainability & Compliance Automation",
    description:
      "New EU rules require product sustainability data by 2026. AI can automate the reporting and supply chain tracking. Market: $50M–$200M. Results in 6–12 months.",
  },
  {
    number: "04",
    title: "AI Inventory Planning",
    description:
      "Stop sending too much stock to the wrong stores. AI predicts where products will sell best. Unsold inventory hit record highs in 2024. Market: $50M–$200M. Results in 6–9 months.",
  },
  {
    number: "05",
    title: "Auto-Create Product Listings",
    description:
      "Automatically generate product photos, descriptions, and online listings. The fastest way to see results from AI in fashion. Market: $50M–$200M. Results in 2–6 weeks.",
  },
];

export const competitorTableHeaders = [
  "Competitor",
  "Target Segment",
  "Pricing",
  "Key Strength",
  "Threat Level",
];

export const competitorTableRows = [
  ["Blue Yonder", "$500M+ retailers", "$200K+/yr", "Deep ML at scale", { value: "Medium", badge: "Medium", badgeVariant: "warning" as const }],
  ["Revionics (Aptos)", "Grocery + apparel", "$100K+/yr", "Proven ROI", { value: "Medium", badge: "Medium", badgeVariant: "warning" as const }],
  ["EDITED", "Brands + retailers", "$30K+/yr", "Fashion data + trend", { value: "Medium", badge: "Medium", badgeVariant: "warning" as const }],
  ["Heuritech", "Large brands", "$40K+/yr", "AI trend + demand", { value: "Low", badge: "Low", badgeVariant: "success" as const }],
  ["Intelligence Node", "E-commerce", "$20K+/yr", "Competitor pricing", { value: "Low", badge: "Low", badgeVariant: "success" as const }],
  ["Profitect", "Retail chains", "$50K+/yr", "Analytics-first", { value: "Low", badge: "Low", badgeVariant: "success" as const }],
];

export const competitorMatrixQuadrants: [
  { title: string; subtitle?: string; highlighted?: boolean },
  { title: string; subtitle?: string; highlighted?: boolean },
  { title: string; subtitle?: string; highlighted?: boolean },
  { title: string; subtitle?: string; highlighted?: boolean },
] = [
  { title: "Mid-Market Generic", subtitle: "Intelligence Node, Profitect — general tools" },
  { title: "Opportunity Zone", subtitle: "Nobody's built this yet — your chance", highlighted: true },
  { title: "Enterprise Generic", subtitle: "Blue Yonder, Revionics — big company tools" },
  { title: "Enterprise Fashion-Specific", subtitle: "Heuritech, EDITED — fashion-focused but expensive" },
];

export const macroHeadwindStats = [
  { value: "13% → 36%", label: "US clothing tariffs nearly tripling", type: "measured" as const },
  { value: "$27B", label: "Extra costs from new tariffs on clothing", type: "measured" as const },
  { value: "2026", label: "EU sustainability rules kick in", type: "measured" as const },
  { value: "71%", label: "Unhappy with the software they use today", type: "measured" as const },
];

export const riskHeatmapRows = [
  { segment: "Luxury", riskScore: { level: "medium" as const, percentage: 50 }, primaryImpact: "Moderate tariff hit, but can charge premium prices", growthCatalyst: "Personalized VIP experiences" },
  { segment: "Fast Fashion", riskScore: { level: "high" as const, percentage: 90 }, primaryImpact: "Hit hardest by tariffs; already thin profits", growthCatalyst: "Faster design-to-store with AI" },
  { segment: "DTC Mid-Market", riskScore: { level: "high" as const, percentage: 80 }, primaryImpact: "Big tariff hit and not ready for AI yet", growthCatalyst: "Smarter pricing and discounting" },
  { segment: "Department Stores", riskScore: { level: "high" as const, percentage: 90 }, primaryImpact: "Hardest hit by tariffs; barely using AI", growthCatalyst: "Better inventory planning" },
];

export const pilotFailureModes = [
  {
    icon: "Calendar",
    title: "Fixed Sales Calendar → Smart Timing",
    description: "Running sales on the same dates every year loses 3–5% profit. AI figures out the best time to discount.",
    stats: [{ value: "3-5%", label: "Extra profit recovered" }],
  },
  {
    icon: "Target",
    title: "Generic Tools → Built for Fashion",
    description: "General-purpose software doesn't understand fashion — things like seasons, trend cycles, and style expiration.",
    stats: [{ value: "90%", label: "AI projects fail" }],
  },
  {
    icon: "BarChart3",
    title: "Dashboards → AI That Takes Action",
    description: "Dashboards just show you data. AI agents actually recommend what to do — that's where the real value is.",
    stats: [{ value: "71%", label: "Unhappy with tools" }],
  },
  {
    icon: "DollarSign",
    title: "Enterprise Pricing → Affordable for Everyone",
    description: "Big enterprise tools cost $100K+ per year. Mid-size brands need solutions at $2K–$8K per month.",
    stats: [{ value: "$100K+", label: "Enterprise starting price" }],
  },
];

// ─── Slide 2: Strategic Forces ───
export const strategicForces = [
  {
    title: "Technology",
    stat: "10×",
    description: "AI costs dropped 10× in two years. It's now affordable for any fashion company to use.",
    accentColor: "#0E3E1B",
  },
  {
    title: "Consumers",
    stat: "60%",
    description: "Of US shoppers already use AI to find products. People are discovering brands through AI, not just Google.",
    accentColor: "#CB9FD2",
  },
  {
    title: "Competitors",
    stat: "64%",
    description: "Of Fortune 500 companies talk about AI in earnings calls. Big companies are already spending on it.",
    accentColor: "#2A4E45",
  },
  {
    title: "Talent",
    stat: "40%",
    description: "Of fashion brands created new AI leadership roles. Companies are restructuring their teams around AI.",
    accentColor: "#FFC9C1",
  },
];

// ─── Slide 3: Consumer Behavior Shift ───
export const consumerShiftData = [
  { label: "Spending less than last year", value: 48.5, color: "#2A4E45" },
  { label: "Won't look unless 30%+ off", value: 66, color: "#2A4E45" },
  { label: "Waiting for bigger sales", value: 44.5, color: "#FFC9C1" },
  { label: "Comparing prices across brands", value: 36.7, color: "#2A4E45" },
];

export const consumerInsights = [
  "Set the right price at the right time automatically",
  "Know when to put items on sale — before it's too late",
  "Show each shopper personalized deals they actually want",
  "Protect profits by understanding what people are willing to pay",
];

// ─── Slide 4: Gen Z Flow ───
export const genZFlowSteps = [
  { label: "Social", sublabel: "TikTok, Instagram" },
  { label: "AI Discovery", sublabel: "Personalized feeds" },
  { label: "Influencer Validation", sublabel: "Trust signals" },
  { label: "AI Search", sublabel: "Agent-powered" },
  { label: "Purchase", sublabel: "Frictionless checkout" },
];

export const genZStats = [
  { value: "40%", label: "Of future fashion spending will come from Gen Z & Gen Alpha" },
  { value: "40%", label: "Of young shoppers already use AI to find products" },
  { value: "AEO", label: "Optimizing for AI shopping agents is the new SEO" },
];

// ─── Slide 5: Value Chain ───
export const valueChainStages = [
  { label: "Trend", aiImpact: "Computer vision forecasting" },
  { label: "Design", aiImpact: "Generative AI creation" },
  { label: "Sourcing", aiImpact: "Supplier intelligence" },
  { label: "Manufacturing", aiImpact: "Quality prediction" },
  { label: "Allocation", aiImpact: "Predictive placement" },
  { label: "Merchandising", aiImpact: "Dynamic pricing" },
  { label: "Commerce", aiImpact: "AI search & personalization" },
  { label: "Returns", aiImpact: "Fraud detection & routing" },
];

// ─── Slide 6: ROI Comparison ───
export const roiMetrics = [
  { metric: "Visitors Who Buy", before: "2.1%", after: "3.4%", lift: "+62%" },
  { metric: "Profit Per Sale", before: "48%", after: "51–53%", lift: "+3–5%" },
  { metric: "Unsold Inventory", before: "25–30%", after: "12–18%", lift: "−45%" },
  { metric: "Cost to Get a Customer", before: "$38", after: "$24", lift: "−37%" },
];

// ─── Slide 7: Startup Ecosystem ───
export const startupClusters = [
  { category: "Design AI", examples: "AI-generated designs, virtual try-on tools", color: "#0E3E1B" },
  { category: "Commerce AI", examples: "Auto product listings, AI shopping helpers", color: "#2A4E45" },
  { category: "Pricing AI", examples: "Smart discounting, demand prediction", color: "#CB9FD2" },
  { category: "Resale AI", examples: "Verify authenticity, grade item condition", color: "#FFC9C1" },
];

export const startupMeta = {
  count: "17",
  funding: "$400M+",
  thesis: "Speed + Cost Reduction + Automation",
};

// ─── Slide 8: Growth Segments ───
export const growthSegments = [
  { segment: "Jewellery", cagr: "4×", note: "Growing 4× faster than clothing", color: "#0E3E1B" },
  { segment: "Footwear", cagr: "10%", note: "10% yearly growth in EU online shoe sales", color: "#2A4E45" },
  { segment: "Resale", cagr: "2–3×", note: "Growing 2–3× faster than new clothing sales", color: "#CB9FD2" },
  { segment: "Mid-Market Luxury", cagr: "Rising", note: "The sweet spot — premium quality, accessible price", color: "#697485" },
];

// ─── Slide 9: AI Evolution Timeline ───
export const aiTimelineStages = [
  { year: "2018", label: "Basic Predictions", description: "Simple rules to forecast demand and spot patterns" },
  { year: "2023", label: "AI Creation Tools", description: "AI starts writing, designing, and generating images" },
  { year: "2025", label: "AI Agents", description: "AI runs entire workflows from start to finish" },
  { year: "2030", label: "Fully Autonomous", description: "AI manages supply chains and commerce on its own" },
];

export const sources = [
  { name: "McKinsey / BoF — State of Fashion 2026" },
  { name: "BCG — The AI-First Fashion Company (2025)" },
  { name: "K3 Fashion Solutions — Knowledge Hub" },
  { name: "Research Nester — AI in Fashion Market Report" },
  { name: "McKinsey — Generative AI in Fashion Report" },
];

export const methodology =
  "Market numbers come from published research by McKinsey, BCG, and Research Nester. Competitor pricing comes from their public websites and analyst reports. Market opportunity estimates are based on counting fashion brands by size and the types of AI tools they need. All statistics include their sources.";

export const definitions = [
  { term: "TAM", definition: "Total Addressable Market — the full size of the fashion industry" },
  { term: "SAM", definition: "Serviceable Addressable Market — fashion brands that are actually buying AI tools" },
  { term: "SOM", definition: "Serviceable Obtainable Market — the realistic slice one product can capture" },
  { term: "GEO", definition: "Generative Engine Optimization — making products show up in AI shopping results" },
  { term: "ESPR/DPP", definition: "EU sustainability rules requiring brands to track and report product environmental data" },
];

export const limitations = [
  "Different research firms give different AI market size estimates",
  "Market opportunity numbers are rough estimates, not exact predictions",
  "Competitor prices come from public info — actual prices may differ",
  "Risk scores for fashion segments are our best assessment based on available data",
];
