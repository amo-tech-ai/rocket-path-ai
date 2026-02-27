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
    description: "AI inference costs dropped 10× since 2022, while model capabilities improved dramatically. Enterprise-grade AI that required $500K contracts now costs under $5K/month — unlocking adoption for mid-market brands.",
    accentColor: "#0E3E1B",
  },
  {
    title: "Consumers",
    stat: "60%",
    description: "Of US shoppers already use AI-powered tools to discover and compare products. The shift from search-first to AI-first shopping means brands invisible to AI agents lose access to high-intent buyers.",
    accentColor: "#CB9FD2",
  },
  {
    title: "Competitors",
    stat: "64%",
    description: "Of Fortune 500 companies now reference AI strategy in earnings calls. Early movers are building proprietary data flywheels and vendor relationships that create compounding advantages over time.",
    accentColor: "#2A4E45",
  },
  {
    title: "Talent",
    stat: "40%",
    description: "Of fashion brands created dedicated AI leadership roles in 2025 — titles like Head of AI, VP of Data Science, and Chief Digital Officer. This isn't experimentation; it's permanent organizational restructuring.",
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
  "Dynamic pricing: BCG measures 50× more dynamic pricing capability with AI vs. manual methods, and 3-5% gross profit lift from AI-driven pricing optimization",
  "Markdown timing: Calendar-based discounting leaves margin on the table. AI identifies the optimal moment to mark down each SKU — one outdoor brand reduced promo spend 23% YoY while exceeding revenue goals",
  "Personalized promotions: 25% of shoppers will pay more if the price increase is explained. AI calibrates offers to individual price sensitivity, driving 10% improvement in perceived value (BCG)",
  "LTV protection: For brands with AOV over $100, promo-acquired customers are worth 23% less lifetime value. AI identifies which customers to acquire at full price vs. discount",
];

// ─── Slide 4: Gen Z Flow ───
export const genZFlowSteps = [
  { label: "Social", sublabel: "43% discover on TikTok, 47% on YouTube" },
  { label: "AI Discovery", sublabel: "60% already use AI agents to shop" },
  { label: "Influencer Validation", sublabel: "2× more likely to convert from creator content" },
  { label: "AI Search", sublabel: "ChatGPT + Perplexity replacing Google" },
  { label: "Purchase", sublabel: "OpenAI Instant Checkout via Shopify" },
];

export const genZStats = [
  { value: "41%", label: "Of Gen Z and Gen Alpha already use AI for fashion shopping (vs. 34% of millennials+). High-spend shoppers ($1,000+/yr) use AI daily at 45% — nearly 2× the rate of low spenders" },
  { value: "90%", label: "Of young AI users research trends, compare products, and check prices through AI multiple times per month. US social commerce hit $85B in 2024, projected to reach $100B in 2025" },
  { value: "AEO", label: "Answer Engine Optimization is replacing SEO. ChatGPT launched Instant Checkout (Sept 2025) via Shopify. 77% of consumers used ChatGPT as a search engine. Reviews and blogs drive ~80% of AI citation sources" },
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
  { category: "Design AI", examples: "Raspberry AI ($29M) generates fashion concepts from text prompts. Doji ($14M) powers virtual try-on. Perry Ellis cut physical samples 50% with AI design. Blng.AI ($5M) applies generative AI specifically to jewellery design and marketing", color: "#0E3E1B" },
  { category: "Commerce AI", examples: "Daydream ($50M, ex-Stitch Fix COO) built an AI fashion search engine. Depict ($18M) deploys ChatGPT-like search in stores. Spangle AI ($6M) creates personalized product pages for Revolve and Alexander Wang. Profound ($35M) optimizes brands for AI chatbot discovery", color: "#2A4E45" },
  { category: "Pricing AI", examples: "7Learnings ($16M) and SparkBox ($3.5M, clients: River Island, New Balance) deliver predictive pricing that recovers 3-5% margin per season. BCG measures 50× more dynamic pricing capability with AI vs. manual methods", color: "#CB9FD2" },
  { category: "Resale AI", examples: "Croissant ($24M) predicts resale value via browser extension. The RealReal's AI authentication (Shield, Vision) drove EBITDA from -43% (2020) to +20% (2024). Phia ($8.85M) tracks prices across resale platforms. Vinted grew net profit +330% YoY using AI-powered operations", color: "#FFC9C1" },
];

export const startupMeta = {
  count: "17",
  funding: "$400M+",
  thesis: "Speed + Cost Reduction + Automation",
};

// ─── Slide 8: Growth Segments ───
export const growthSegments = [
  { segment: "Jewellery", cagr: "4.1%", note: "Unit sales growing at 4.1% annually 2025-28 — 4× the rate of clothing (McKinsey). Driven by self-gifting, investment demand, and lab-grown expansion. Smart jewellery searches up 62% YoY", color: "#0E3E1B" },
  { segment: "Footwear", cagr: "10%", note: "EU online footwear growing 10% CAGR 2025-30 (Google/Deloitte). Men's apparel+footwear at 10% CAGR. AI fit prediction can cut return rates from 30% to under 10%. Smart eyewear market forecast: $30B+ by 2030", color: "#2A4E45" },
  { segment: "Resale", cagr: "2–3×", note: "Expected to reach 23% market share by 2030 and $350B by 2027. 59% of consumers plan to shop resale in 2026. China at 70%+ resale penetration. Vinted: 21M monthly searches, up from 7M in 2018", color: "#CB9FD2" },
  { segment: "Mid-Market Luxury", cagr: "Rising", note: "The underserved sweet spot. 'Quiet luxury' searches +67% YoY, 'elevated basics' +52% YoY. These brands have $15K-$75K ACV budgets but lack enterprise AI tools. Target SaaS opportunity: $50M-$200M per vertical", color: "#697485" },
];

// ─── Slide 9: AI Evolution Timeline ───
export const aiTimelineStages = [
  { year: "2018", label: "Basic Predictions", description: "Statistical models and rule-based systems for demand forecasting. ChatGPT hadn't launched. nVidia was a gaming GPU company. Fashion AI meant simple trend analytics dashboards that showed data but couldn't act on it." },
  { year: "2023", label: "AI Creation Tools", description: "ChatGPT hit 100M users in record time. Generative AI unlocked content creation at scale — product descriptions, design concepts, marketing copy. BCG: 3× campaign development speed, 30% sampling cost reduction. But AI still operated as a tool, not a decision-maker." },
  { year: "2025", label: "AI Agents", description: "The inflection point. OpenAI launched Instant Checkout via Shopify. Agentic commerce could reach $3-5T by 2030 (McKinsey). AI agents now execute multi-step workflows: monitoring prices, adjusting markdowns, rebalancing inventory. 35%+ of fashion execs already use gen AI in operations." },
  { year: "2030", label: "Fully Autonomous", description: "McKinsey projects ~1/3 of employee time in Europe/US could be automated by gen AI. Fashion companies will operate with autonomous pricing, self-optimizing supply chains, and AI-managed customer engagement — humans set strategy, AI executes tactics." },
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
