/**
 * Curated Industry Links
 * Maps industries to high-authority research URLs extracted from research/links/*.md.
 * Injected into agent prompts so Gemini checks authoritative sources first.
 */

export interface CuratedLink {
  source: string;
  url: string;
  score: number;
}

/** Maps free-text keywords to canonical industry keys */
const INDUSTRY_ALIASES: Record<string, string> = {
  // customer_support
  "customer support": "customer_support",
  "customer service": "customer_support",
  "cx": "customer_support",
  "contact center": "customer_support",
  "helpdesk": "customer_support",
  "help desk": "customer_support",
  "chatbot": "customer_support",
  "chatbots": "customer_support",
  "support": "customer_support",
  // cybersecurity
  "cybersecurity": "cybersecurity",
  "cyber security": "cybersecurity",
  "security": "cybersecurity",
  "infosec": "cybersecurity",
  "information security": "cybersecurity",
  // education
  "education": "education",
  "edtech": "education",
  "ed tech": "education",
  "e-learning": "education",
  "elearning": "education",
  "online learning": "education",
  "tutoring": "education",
  // fashion
  "fashion": "fashion",
  "apparel": "fashion",
  "clothing": "fashion",
  "textile": "fashion",
  "textiles": "fashion",
  // financial_services
  "financial services": "financial_services",
  "finance": "financial_services",
  "fintech": "financial_services",
  "banking": "financial_services",
  "insurance": "financial_services",
  "insurtech": "financial_services",
  "payments": "financial_services",
  "lending": "financial_services",
  "wealthtech": "financial_services",
  "wealth management": "financial_services",
  // healthcare
  "healthcare": "healthcare",
  "health care": "healthcare",
  "healthtech": "healthcare",
  "health tech": "healthcare",
  "medtech": "healthcare",
  "med tech": "healthcare",
  "biotech": "healthcare",
  "pharma": "healthcare",
  "pharmaceutical": "healthcare",
  "digital health": "healthcare",
  "telehealth": "healthcare",
  // legal_compliance
  "legal": "legal_compliance",
  "legal tech": "legal_compliance",
  "legaltech": "legal_compliance",
  "compliance": "legal_compliance",
  "regtech": "legal_compliance",
  "regulatory": "legal_compliance",
  "law": "legal_compliance",
  // manufacturing
  "manufacturing": "manufacturing",
  "industrial": "manufacturing",
  "factory": "manufacturing",
  "industry 4.0": "manufacturing",
  // marketing_sales_crm
  "marketing": "marketing_sales_crm",
  "sales": "marketing_sales_crm",
  "crm": "marketing_sales_crm",
  "martech": "marketing_sales_crm",
  "advertising": "marketing_sales_crm",
  "adtech": "marketing_sales_crm",
  "ad tech": "marketing_sales_crm",
  // media_entertainment
  "media": "media_entertainment",
  "entertainment": "media_entertainment",
  "content": "media_entertainment",
  "streaming": "media_entertainment",
  "gaming": "media_entertainment",
  "video": "media_entertainment",
  "music": "media_entertainment",
  // real_estate
  "real estate": "real_estate",
  "proptech": "real_estate",
  "prop tech": "real_estate",
  "property": "real_estate",
  "construction": "real_estate",
  "contech": "real_estate",
  // retail_ecommerce
  "retail": "retail_ecommerce",
  "ecommerce": "retail_ecommerce",
  "e-commerce": "retail_ecommerce",
  "commerce": "retail_ecommerce",
  "d2c": "retail_ecommerce",
  "dtc": "retail_ecommerce",
  "shopping": "retail_ecommerce",
  // saas_ai
  "saas": "saas_ai",
  "ai": "saas_ai",
  "artificial intelligence": "saas_ai",
  "b2b": "saas_ai",
  "enterprise software": "saas_ai",
  "software": "saas_ai",
  "developer tools": "saas_ai",
  "devtools": "saas_ai",
  // supply_chain
  "supply chain": "supply_chain",
  "logistics": "supply_chain",
  "shipping": "supply_chain",
  "freight": "supply_chain",
  "warehousing": "supply_chain",
  "fulfillment": "supply_chain",
  // travel_tourism
  "travel": "travel_tourism",
  "tourism": "travel_tourism",
  "hospitality": "travel_tourism",
  "hotel": "travel_tourism",
  "hotels": "travel_tourism",
  "airline": "travel_tourism",
  "airlines": "travel_tourism",
};

/** Top 5 links per industry, extracted from research/links/*.md */
const INDUSTRY_LINKS: Record<string, CuratedLink[]> = {
  customer_support: [
    { source: "Gartner — Contact center / CX", url: "https://www.gartner.com/en/customer-service-support", score: 93 },
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 91 },
    { source: "McKinsey State of AI", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", score: 90 },
    { source: "PitchBook AI Outlook 2026", url: "https://pitchbook.com/news/reports/2026-artificial-intelligence-outlook-the-great-competition-wars-have-begun", score: 88 },
    { source: "CB Insights — Tech trends 2026", url: "https://www.cbinsights.com/research/report/top-tech-trends-2026/", score: 87 },
  ],
  cybersecurity: [
    { source: "CB Insights — Tech trends 2026", url: "https://www.cbinsights.com/research/report/top-tech-trends-2026/", score: 94 },
    { source: "Gartner — Security & risk", url: "https://www.gartner.com/en/security", score: 93 },
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 91 },
    { source: "CISA — AI and cybersecurity", url: "https://www.cisa.gov/topics/artificial-intelligence", score: 90 },
    { source: "NIST — AI risk management", url: "https://www.nist.gov/itl/ai-risk-management-framework", score: 89 },
  ],
  education: [
    { source: "Precedence Research — AI in education market", url: "https://www.precedenceresearch.com/ai-in-education-market", score: 91 },
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 90 },
    { source: "TCS — EdTech trends 2026", url: "https://www.tcs.com/what-we-do/industries/education/article/edtech-trends-2026-intelligence-redefining-learning-systems", score: 88 },
    { source: "Ed.gov — AI in education", url: "https://www.ed.gov", score: 87 },
    { source: "EdWeek — Technology", url: "https://www.edweek.org/technology", score: 86 },
  ],
  fashion: [
    { source: "McKinsey — State of Fashion hub", url: "https://www.mckinsey.com/industries/retail/our-insights/state-of-fashion", score: 95 },
    { source: "BCG — The AI-first fashion company", url: "https://www.bcg.com/publications/2025/the-ai-first-fashion-company", score: 93 },
    { source: "Strategy& (PwC) — Fashion Retail Outlook", url: "https://www.strategyand.pwc.com/de/en/industries/consumer-markets/fashion-retail-outlook.html", score: 90 },
    { source: "Business of Fashion — State of Fashion", url: "https://www.businessoffashion.com/reports/the-state-of-fashion-industry/", score: 88 },
    { source: "Deloitte — Retail & Distribution Outlook", url: "https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook.html", score: 87 },
  ],
  financial_services: [
    { source: "BCG AI Radar 2026", url: "https://www.bcg.com/publications/2026/as-ai-investments-surge-ceos-take-the-lead", score: 95 },
    { source: "McKinsey — GenAI in banking risk & compliance", url: "https://www.mckinsey.com/capabilities/risk-and-resilience/our-insights/how-generative-ai-can-help-banks-manage-risk-and-compliance", score: 94 },
    { source: "Deloitte Banking Outlook 2026", url: "https://www.deloitte.com/us/en/insights/industry/financial-services/financial-services-industry-outlooks/banking-industry-outlook.html", score: 92 },
    { source: "PwC CEO Survey 2026", url: "https://www.pwc.com/gx/en/ceo-survey/2026/pwc-ceo-survey-2026.pdf", score: 91 },
    { source: "SEC — AI and capital markets", url: "https://www.sec.gov", score: 88 },
  ],
  healthcare: [
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 96 },
    { source: "BCG — How AI agents will transform healthcare", url: "https://www.bcg.com/publications/2026/how-ai-agents-will-transform-health-care", score: 95 },
    { source: "McKinsey — GenAI in healthcare", url: "https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook", score: 94 },
    { source: "Grand View Research — AI in healthcare market", url: "https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-healthcare-market", score: 92 },
    { source: "FDA — AI/ML medical devices", url: "https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices", score: 91 },
  ],
  legal_compliance: [
    { source: "National Law Review — Ten AI predictions 2026", url: "https://natlawreview.com/article/ten-ai-predictions-2026-what-leading-analysts-say-legal-teams-should-expect", score: 93 },
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 91 },
    { source: "EU AI Act (official)", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689", score: 90 },
    { source: "Gartner — Legal tech", url: "https://www.gartner.com/en/legal-compliance", score: 89 },
    { source: "Thomson Reuters — Legal AI", url: "https://www.thomsonreuters.com/en-us/products/legal-research/ai-legal-research.html", score: 88 },
  ],
  manufacturing: [
    { source: "Deloitte Manufacturing Outlook 2026", url: "https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook.html", score: 94 },
    { source: "McKinsey — GenAI in manufacturing and supply chains", url: "https://www.mckinsey.com/capabilities/operations/our-insights/operations-blog/harnessing-generative-ai-in-manufacturing-and-supply-chains", score: 93 },
    { source: "BCG AI Radar 2026", url: "https://www.bcg.com/publications/2026/as-ai-investments-surge-ceos-take-the-lead", score: 91 },
    { source: "Gartner — Retail/Digital transformation", url: "https://www.gartner.com/en/industries/retail-digital-transformation", score: 88 },
    { source: "Markets and Markets — AI in manufacturing", url: "https://www.marketsandmarkets.com/Market-Reports/artificial-intelligence-manufacturing-market-72679105.html", score: 87 },
  ],
  marketing_sales_crm: [
    { source: "Gartner — Marketing / Sales", url: "https://www.gartner.com/en/marketing", score: 92 },
    { source: "Deloitte GenAI in software 2026", url: "https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/gen-ai-inside-software.html", score: 91 },
    { source: "McKinsey State of AI", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", score: 90 },
    { source: "Salesforce — Einstein / AI", url: "https://www.salesforce.com/products/einstein/", score: 88 },
    { source: "HubSpot — AI / Marketing", url: "https://www.hubspot.com/artificial-intelligence", score: 87 },
  ],
  media_entertainment: [
    { source: "EY — 2026 media and entertainment trends", url: "https://www.ey.com/en_us/insights/media-entertainment/2026-media-and-entertainment-trends", score: 93 },
    { source: "Deloitte — TMT predictions 2026", url: "https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026.html", score: 91 },
    { source: "McKinsey State of AI", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai", score: 89 },
    { source: "CB Insights — Tech trends 2026", url: "https://www.cbinsights.com/research/report/top-tech-trends-2026/", score: 88 },
    { source: "Grand View Research — Media AI market", url: "https://www.grandviewresearch.com", score: 86 },
  ],
  real_estate: [
    { source: "JLL — AI and real estate", url: "https://www.jll.com/en-us/insights/artificial-intelligence-and-its-implications-for-real-estate", score: 92 },
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 89 },
    { source: "McKinsey — Real estate / construction", url: "https://www.mckinsey.com/industries/real-estate/our-insights", score: 88 },
    { source: "Gartner — Real estate tech", url: "https://www.gartner.com", score: 86 },
    { source: "CoStar — Analytics", url: "https://www.costar.com", score: 85 },
  ],
  retail_ecommerce: [
    { source: "US Census — Retail E-commerce", url: "https://www.census.gov/retail/ecommerce.html", score: 94 },
    { source: "Deloitte — 2026 Retail Outlook", url: "https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook.html", score: 92 },
    { source: "McKinsey — Agentic Commerce", url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants", score: 91 },
    { source: "NRF — Forecasts & Research", url: "https://nrf.com/research-insights/forecasts", score: 89 },
    { source: "Statista — E-commerce market", url: "https://www.statista.com/markets/413/e-commerce/", score: 88 },
  ],
  saas_ai: [
    { source: "Gartner — Agentic AI prediction 2026", url: "https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026", score: 95 },
    { source: "Deloitte — GenAI inside software 2026", url: "https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions/2026/gen-ai-inside-software.html", score: 94 },
    { source: "Bessemer (BVP) — SaaS benchmarks / Cloud 100", url: "https://www.bvp.com/bvp-nasdaq-emerging-cloud-index", score: 92 },
    { source: "a16z — Gen AI 100 apps", url: "https://a16z.com/100-gen-ai-apps-3/", score: 91 },
    { source: "CB Insights — AI Top Startups 2025", url: "https://www.cbinsights.com/research/report/artificial-intelligence-top-startups-2025/", score: 90 },
  ],
  supply_chain: [
    { source: "McKinsey — GenAI in manufacturing and supply chains", url: "https://www.mckinsey.com/capabilities/operations/our-insights/operations-blog/harnessing-generative-ai-in-manufacturing-and-supply-chains", score: 95 },
    { source: "Deloitte State of AI 2026", url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html", score: 92 },
    { source: "Gartner — Top technology trends 2026", url: "https://www.gartner.com/en/articles/top-technology-trends-2026", score: 90 },
    { source: "CB Insights — Tech trends 2026", url: "https://www.cbinsights.com/research/report/top-tech-trends-2026/", score: 88 },
    { source: "Logistics Viewpoints — AI in logistics 2025/2026", url: "https://logisticsviewpoints.com/2025/12/22/ai-in-logistics-what-actually-worked-in-2025-and-what-will-scale-in-2026/", score: 86 },
  ],
  travel_tourism: [
    { source: "BCG — Travel & Tourism Overview", url: "https://www.bcg.com/industries/travel-tourism/overview", score: 94 },
    { source: "BCG — Travel & Tourism Insights", url: "https://www.bcg.com/industries/travel-tourism/insights", score: 92 },
    { source: "Skift Research", url: "https://research.skift.com/", score: 90 },
    { source: "Mintel — Travel Trends by Generation", url: "https://www.mintel.com/insights/travel-and-tourism/travel-trends-by-generation/", score: 90 },
    { source: "Condé Nast Traveler — 2026 Trends", url: "https://www.cntraveler.com/story/the-biggest-travel-trends-of-2026", score: 90 },
  ],
};

/** Top 5 cross-industry startup/tech sources from 16-startup-sites-top-20.md */
const CROSS_INDUSTRY_LINKS: CuratedLink[] = [
  { source: "TechCrunch — Startups", url: "https://techcrunch.com/category/startups/", score: 95 },
  { source: "Crunchbase News", url: "https://news.crunchbase.com/", score: 93 },
  { source: "VentureBeat", url: "https://venturebeat.com/", score: 91 },
  { source: "PitchBook — News/Articles", url: "https://pitchbook.com/news/articles", score: 88 },
  { source: "CB Insights — Tech trends 2026", url: "https://www.cbinsights.com/research/report/top-tech-trends-2026/", score: 86 },
];

/** 5 startup platforms for positioning, traction, and competitive signals */
const PLATFORM_LINKS: CuratedLink[] = [
  { source: "Product Hunt", url: "https://www.producthunt.com", score: 88 },
  { source: "Indie Hackers", url: "https://www.indiehackers.com", score: 82 },
  { source: "SaaSHub", url: "https://www.saashub.com", score: 78 },
  { source: "Microlaunch", url: "https://microlaunch.net", score: 74 },
  { source: "uNeed", url: "https://uneed.best", score: 72 },
];

// P01E: Platform search URL templates for dynamic keyword-based competitor discovery
interface PlatformSearchConfig {
  name: string;
  searchTemplate: string; // {keywords} placeholder
  score: number;
}

const PLATFORM_SEARCH_CONFIGS: PlatformSearchConfig[] = [
  { name: "Product Hunt", searchTemplate: "https://www.producthunt.com/search?q={keywords}", score: 88 },
  { name: "SaaSHub", searchTemplate: "https://www.saashub.com/search?q={keywords}", score: 78 },
  { name: "Indie Hackers", searchTemplate: "https://www.indiehackers.com/search?q={keywords}", score: 82 },
  { name: "Microlaunch", searchTemplate: "https://microlaunch.net/search?q={keywords}", score: 74 },
  { name: "uNeed", searchTemplate: "https://uneed.best/search?q={keywords}", score: 72 },
];

/** P01E: Build platform-specific search URLs from extracted keywords */
export function buildPlatformSearchUrls(keywords: string): CuratedLink[] {
  if (!keywords || !keywords.trim()) return PLATFORM_LINKS; // Fallback to homepages
  const sanitized = keywords.trim().slice(0, 100); // Cap at 100 chars
  const encoded = encodeURIComponent(sanitized);
  return PLATFORM_SEARCH_CONFIGS.map((config) => ({
    source: `${config.name} search: "${sanitized}"`,
    url: config.searchTemplate.replace('{keywords}', encoded),
    score: config.score,
  }));
}

/** Resolve free-text industry string to canonical key */
export function resolveIndustry(industry: string): string | null {
  const normalized = industry.toLowerCase().trim();
  if (INDUSTRY_LINKS[normalized]) return normalized;
  return INDUSTRY_ALIASES[normalized] ?? null;
}

/** Get curated links for an industry. Accepts optional keywords for smart platform search URLs. */
export function getCuratedLinks(industry: string, keywords?: string): {
  industryLinks: CuratedLink[];
  crossIndustryLinks: CuratedLink[];
  platformLinks: CuratedLink[];
  matchedIndustry: string | null;
} {
  const matchedIndustry = resolveIndustry(industry);
  const industryLinks = matchedIndustry ? INDUSTRY_LINKS[matchedIndustry] : [];
  // P01E: Use keyword-based search URLs when keywords provided, else fall back to homepages
  const platformLinks = keywords ? buildPlatformSearchUrls(keywords) : PLATFORM_LINKS;
  return {
    industryLinks,
    crossIndustryLinks: CROSS_INDUSTRY_LINKS,
    platformLinks,
    matchedIndustry,
  };
}

/** Format links for injection into agent system prompts */
export function formatLinksForPrompt(links: CuratedLink[]): string {
  return links
    .map((l) => `- ${l.source} (authority: ${l.score}/100): ${l.url}`)
    .join("\n");
}
