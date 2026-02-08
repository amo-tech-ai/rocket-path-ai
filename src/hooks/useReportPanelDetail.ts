import { useState, useRef, useCallback } from 'react';

export interface PanelDetailResponse {
  section_number: number;
  more_detail: string;
  why_this_matters: string;
  risks_gaps: string[];
  validate_next: string[];
}

/** Static sample data keyed by section number. Will be replaced by AI call later. */
const SAMPLE_DATA: Record<number, Omit<PanelDetailResponse, 'section_number'>> = {
  1: {
    more_detail: 'The core problem centers on repetitive support tickets consuming agent time. Existing chatbots fail because they lack brand voice alignment and real-time order context, causing hallucinated responses that erode customer trust.',
    why_this_matters: 'Problem severity directly drives willingness to pay. This dimension carries 20% weight in the final validation score.',
    risks_gaps: [
      'No primary interviews with support managers to confirm 70% figure',
      'Unclear if the problem is seasonal or consistent year-round',
      'No data on how much churn is actually caused by slow responses',
    ],
    validate_next: [
      'Interview 5 ecommerce support managers about ticket composition',
      'Survey 30 DTC brands on current AI tool satisfaction',
      'Analyze public reviews of competing support tools for pain points',
    ],
  },
  2: {
    more_detail: 'The target buyer is a support manager at a 10-50 agent DTC brand on Shopify. Purchase trigger is typically when ticket volume exceeds 500/day and CSAT drops below 85%. Switching cost is moderate due to CRM integrations.',
    why_this_matters: 'A well-defined buyer persona with clear purchase triggers reduces go-to-market risk and shortens the sales cycle.',
    risks_gaps: [
      'Buyer persona needs validation beyond DTC -- B2B ecommerce may differ',
      'Decision maker vs. user distinction unclear (manager vs. agents)',
      'No data on average contract value or budget authority at this level',
    ],
    validate_next: [
      'Map the buying committee: who decides, who influences, who blocks',
      'Run 3 discovery calls to validate the purchase trigger hypothesis',
      'Price sensitivity test with 2-3 willingness-to-pay ranges',
    ],
  },
  3: {
    more_detail: 'Market sizing relies on the global ecommerce support tools TAM. Growth is driven by Shopify merchant expansion and AI adoption curves. The SOM estimate assumes 0.1% penetration within 3 years via Shopify app store distribution.',
    why_this_matters: 'Investors evaluate market size to assess ceiling potential. An unreliable TAM undermines fundraising narratives and strategic planning.',
    risks_gaps: [
      'TAM source and methodology not independently verified',
      'SAM may overstate addressable market if limited to English-speaking brands',
      'SOM assumes Shopify distribution which may have approval delays',
    ],
    validate_next: [
      'Cross-reference TAM with at least 2 independent analyst reports',
      'Validate SAM by counting Shopify Plus stores with 10+ support agents',
      'Check Shopify app store approval timeline for similar AI tools',
    ],
  },
  4: {
    more_detail: 'The competitive landscape includes native helpdesk AI (Gorgias, Zendesk) and standalone AI drafting tools. Incumbents have distribution advantage but often lack brand voice customization and multi-channel context integration.',
    why_this_matters: 'Competitive positioning determines pricing power and defensibility. Feature commoditization by incumbents is the top existential risk.',
    risks_gaps: [
      'No analysis of what Gorgias and Zendesk are building in their AI roadmaps',
      'Moat relies on brand voice -- unclear how defensible this is technically',
      'Missing competitive pricing benchmarks for positioning',
    ],
    validate_next: [
      'Monitor Gorgias/Zendesk release notes and AI feature announcements',
      'Build a blind taste test comparing your drafts vs. native AI drafts',
      'Interview 3 churned users of competing AI support tools',
    ],
  },
  5: {
    more_detail: 'Key assumptions include sustained Shopify growth, willingness of brands to trust AI with customer-facing responses, and the technical feasibility of maintaining brand voice accuracy above 90% at scale.',
    why_this_matters: 'Untested assumptions are the primary cause of startup failure. Identifying which are testable helps prioritize validation efforts.',
    risks_gaps: [
      'Platform dependency on Shopify creates single point of failure',
      'AI accuracy assumption (90%+) lacks benchmark data from production use',
      'Regulatory risk around AI-generated customer communications not assessed',
    ],
    validate_next: [
      'Rank assumptions by impact and testability on a 2x2 matrix',
      'Run a 2-week pilot with 3 brands to measure actual AI accuracy',
      'Research ecommerce AI communication regulations in target markets',
    ],
  },
  6: {
    more_detail: 'The MVP should focus on single-channel email drafting with Shopify order context. Build the core AI drafting engine and brand voice training; defer multi-channel, analytics dashboard, and self-service onboarding to v2.',
    why_this_matters: 'Scope discipline determines whether you ship in weeks or months. Every additional feature multiplies integration complexity.',
    risks_gaps: [
      'Scope creep risk from early customers requesting features outside MVP',
      'Build vs. buy decision for the NLP engine not finalized',
      'No clear criteria for when to graduate from MVP to v2 features',
    ],
    validate_next: [
      'Define 3 hard "not in MVP" boundaries and communicate to stakeholders',
      'Prototype the core AI drafting loop in under 2 weeks',
      'Set measurable MVP success criteria (e.g., 80% draft acceptance rate)',
    ],
  },
  7: {
    more_detail: 'Next steps follow a dependency chain: user interviews feed problem validation, which informs MVP spec, which determines pilot scope. Parallelizing research and prototype reduces the critical path to first pilot.',
    why_this_matters: 'Sequencing mistakes waste months. Identifying the critical path ensures the team works on the highest-leverage activity at each stage.',
    risks_gaps: [
      'Timeline assumes full-time founder commitment which may not be the case',
      'No contingency plan if user interviews invalidate core assumptions',
      'Resource requirements for parallel workstreams not estimated',
    ],
    validate_next: [
      'Create a 4-week sprint plan with weekly milestones and owners',
      'Identify which steps can run in parallel vs. sequential dependencies',
      'Define go/no-go decision points after each validation sprint',
    ],
  },
  8: {
    more_detail: 'The scores matrix reveals that Market Size and Problem Clarity score highest, while Competitive Moat and Team Readiness are the weakest dimensions. The overall weighted score reflects these imbalances.',
    why_this_matters: 'Understanding which dimensions drag the score down reveals the fastest path to improving overall validation strength.',
    risks_gaps: [
      'Dimension weights may not reflect your specific market dynamics',
      'Some dimensions score high on surface-level data without deep validation',
      'No comparison to benchmarks from similar startups at this stage',
    ],
    validate_next: [
      'Focus improvement efforts on the 2 lowest-scoring dimensions first',
      'Gather evidence to strengthen the weakest sub-factors in each dimension',
      'Re-run validation after addressing top 3 identified gaps',
    ],
  },
  9: {
    more_detail: 'The proposed stack leverages established APIs and frameworks, reducing build time. Key technical risks center on API latency for real-time drafting, rate limits on LLM providers, and maintaining response quality at scale.',
    why_this_matters: 'Technical feasibility determines whether the MVP timeline is realistic. Undisclosed complexity is the top cause of delayed launches.',
    risks_gaps: [
      'API cost projections at scale not calculated (LLM token costs)',
      'No load testing data for the expected concurrent users',
      'Vendor lock-in risk with primary LLM provider not assessed',
    ],
    validate_next: [
      'Calculate per-ticket AI cost at 100, 1K, and 10K tickets/day',
      'Build a simple load test simulating peak traffic patterns',
      'Evaluate fallback LLM provider to reduce vendor dependency',
    ],
  },
  10: {
    more_detail: 'B2B SaaS with per-seat or per-ticket pricing aligns with customer value perception. The LTV/CAC ratio and payback period are key unit economics to monitor as pricing is validated through early pilots.',
    why_this_matters: 'Revenue model viability determines whether the business can sustain growth. Poor unit economics at small scale rarely improve at larger scale.',
    risks_gaps: [
      'Pricing not yet validated with actual customers willing to pay',
      'No competitive pricing benchmark analysis completed',
      'Unit economics assume steady-state -- early CAC will be much higher',
    ],
    validate_next: [
      'Run a pricing page A/B test with 3 different price points',
      'Gather competitive pricing data from 5 comparable SaaS tools',
      'Secure 1 LOI (letter of intent) at target pricing before building',
    ],
  },
  11: {
    more_detail: 'The founding team needs AI/ML expertise and ecommerce domain knowledge. Early hires should fill the most critical skill gap first. Advisory board can provide industry credibility and customer introductions.',
    why_this_matters: 'Team composition is the #1 factor investors evaluate. Skill gaps directly correlate with execution risk and timeline slippage.',
    risks_gaps: [
      'Current team skill gaps vs. MVP requirements not mapped',
      'Hiring timeline may conflict with runway constraints',
      'Advisory needs identified but no specific advisors approached',
    ],
    validate_next: [
      'Map required skills vs. current team capabilities on a gap matrix',
      'Prioritize the single most critical hire and begin sourcing',
      'Identify 3 potential advisors with ecommerce SaaS experience',
    ],
  },
  12: {
    more_detail: 'Key questions are ranked by risk level: fatal questions can kill the business if answered negatively, important questions affect strategy, and minor questions are nice-to-know. Each needs a specific validation method.',
    why_this_matters: 'Unanswered fatal questions represent existential risk. Addressing them early prevents investing months into an invalid hypothesis.',
    risks_gaps: [
      'Some fatal questions may have been misclassified as important',
      'Validation methods for certain questions require significant resources',
      'No timeline assigned to when each question must be answered',
    ],
    validate_next: [
      'Address the top fatal question within the next 2 weeks',
      'Define what a "good enough" answer looks like for each question',
      'Create a validation calendar with deadlines for each key question',
    ],
  },
  13: {
    more_detail: 'Research sources include market reports, competitor analysis, and industry publications. Source credibility varies -- primary research (interviews, surveys) carries more weight than secondary sources (blog posts, estimates).',
    why_this_matters: 'Decisions built on unreliable sources compound errors. A single flawed market size estimate can cascade through the entire business plan.',
    risks_gaps: [
      'Most sources are secondary -- no primary research conducted yet',
      'Some market data may be outdated (pre-2025 AI adoption curves)',
      'Missing research on regulatory landscape for AI in customer service',
    ],
    validate_next: [
      'Conduct 5 primary research interviews to validate secondary findings',
      'Verify the 3 most critical statistics from independent sources',
      'Add regulatory and compliance research to the resource list',
    ],
  },
  14: {
    more_detail: 'Financial projections model conservative, moderate, and aggressive scenarios. Key sensitivities include customer acquisition rate, average contract value, and churn. The break-even timeline depends heavily on initial pricing power.',
    why_this_matters: 'Projections test whether the business model can sustain itself. The gap between scenarios reveals how sensitive the model is to assumptions.',
    risks_gaps: [
      'Assumptions driving the model have not been validated with real data',
      'No comparable benchmark data from similar-stage SaaS companies',
      'Sensitivity analysis on key variables not presented',
    ],
    validate_next: [
      'Identify the 3 assumptions that most impact break-even timing',
      'Run sensitivity analysis: what if CAC is 2x or ACV is 0.5x',
      'Compare projections with published benchmarks from SaaS peers',
    ],
  },
};

export function useReportPanelDetail() {
  const cache = useRef<Map<number, PanelDetailResponse>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PanelDetailResponse | null>(null);
  const [currentSection, setCurrentSection] = useState<number | null>(null);

  const fetchPanelDetail = useCallback(async (
    _reportId: string,
    sectionNumber: number,
    _sectionTitle: string,
    _sectionContent: string,
    _score?: number,
    _dimensionScore?: number,
  ) => {
    setCurrentSection(sectionNumber);
    setError(null);

    // Check cache
    const cached = cache.current.get(sectionNumber);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setData(null);

    // Simulate brief loading for UX feel
    await new Promise(r => setTimeout(r, 400));

    const sample = SAMPLE_DATA[sectionNumber];
    if (!sample) {
      setError('No detail available for this section');
      setLoading(false);
      return;
    }

    const result: PanelDetailResponse = {
      section_number: sectionNumber,
      ...sample,
    };

    cache.current.set(sectionNumber, result);
    setData(result);
    setLoading(false);
  }, []);

  return { loading, error, data, currentSection, fetchPanelDetail };
}
