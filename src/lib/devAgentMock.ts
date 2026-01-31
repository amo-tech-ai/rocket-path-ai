/**
 * Development Agent Mock
 * Provides mock responses for edge function calls in dev mode
 */

import { DEV_BYPASS_AUTH, DEV_MOCK_USER_ID } from './devConfig';
import type {
  EnrichmentResult,
  FounderEnrichmentResult,
  ReadinessResult,
  QuestionsResult,
  ProcessAnswerResult,
  InvestorScoreResult,
  SummaryResult,
  CompleteWizardResult,
} from '@/hooks/onboarding/types';

/**
 * Generates mock competitors based on company data
 */
function generateMockCompetitors(companyName: string, industry: string | string[]): string[] {
  const industryStr = Array.isArray(industry) ? industry[0] : industry || 'Technology';
  const baseCompetitors = [
    `${industryStr} Solutions Inc`,
    `${industryStr} Platform`,
    `NextGen ${industryStr}`,
  ];

  // Add company-specific variations
  if (companyName) {
    const nameWords = companyName.split(' ').slice(0, 2);
    baseCompetitors.push(`${nameWords.join(' ')} Alternative`);
  }

  return baseCompetitors.slice(0, 3); // Ensure at least 3
}

/**
 * Mock edge function responses for dev mode
 */
export function getMockAgentResponse<T>(action: string, body: Record<string, unknown>): T {
  if (!DEV_BYPASS_AUTH) {
    throw new Error('Mock responses only available in dev mode');
  }

  switch (action) {
    case 'create_session':
      return {
        session_id: 'dev-session-' + Math.random().toString(36).substring(7),
        success: true,
      } as T;

    case 'update_session':
      return {
        success: true,
      } as T;

    case 'enrich_url':
      const urlCompanyName = (body.url as string)?.includes('example') ? 'Example Company' : 'Tech Startup Inc';
      return {
        extractions: {
          company_name: urlCompanyName,
          description: 'AI-powered platform for startups',
          industry: ['Technology', 'SaaS'],
          business_model: ['Subscription', 'Freemium'],
          stage: 'Seed',
          competitors: generateMockCompetitors(urlCompanyName, 'Technology'),
        },
        success: true,
      } as T;

    case 'enrich_context':
      const description = body.description as string || '';
      const targetMarket = body.target_market as string || '';
      // Try to infer industry from description or use default
      let inferredIndustry = 'Technology';
      if (description.toLowerCase().includes('fintech') || description.toLowerCase().includes('finance')) {
        inferredIndustry = 'Fintech';
      } else if (description.toLowerCase().includes('health') || description.toLowerCase().includes('medical')) {
        inferredIndustry = 'Healthcare';
      } else if (description.toLowerCase().includes('saas') || description.toLowerCase().includes('software')) {
        inferredIndustry = 'SaaS';
      }

      return {
        extractions: {
          industry: [inferredIndustry],
          business_model: ['SaaS'],
          stage: 'Seed',
          competitors: generateMockCompetitors(description.substring(0, 20) || 'Company', inferredIndustry),
        },
        success: true,
      } as T;

    case 'enrich_founder':
      return {
        success: true,
        founder: {
          name: body.name || 'John Doe',
          role: 'CEO',
          experience: '10+ years in tech',
          education: 'MBA from Stanford',
          previous_companies: ['Google', 'Microsoft'],
        },
      } as T;

    case 'calculate_readiness':
      return {
        readiness_score: {
          overall_score: 72,
          category_scores: {
            product: 75,
            market: 70,
            team: 80,
            clarity: 65,
          },
          benchmarks: ['Above average product readiness', 'Strong team composition'],
          recommendations: ['Focus on market validation', 'Strengthen value proposition'],
        },
        success: true,
      } as T;

    case 'get_questions':
      return {
        questions: [
          {
            id: 'q1',
            text: 'What is your primary customer acquisition channel?',
            type: 'multiple_choice',
            topic: 'growth',
            why_matters: 'Helps understand your go-to-market strategy',
            options: [
              { id: 'a1', text: 'Organic/Search', emoji: '🔍' },
              { id: 'a2', text: 'Paid Ads', emoji: '📢' },
              { id: 'a3', text: 'Partnerships', emoji: '🤝' },
              { id: 'a4', text: 'Direct Sales', emoji: '💼' },
            ],
          },
          {
            id: 'q2',
            text: 'What is your current monthly recurring revenue?',
            type: 'multiple_choice',
            topic: 'traction',
            why_matters: 'Shows business maturity and growth trajectory',
            options: [
              { id: 'a5', text: 'Under $10K', emoji: '🌱' },
              { id: 'a6', text: '$10K-$50K', emoji: '📈' },
              { id: 'a7', text: '$50K-$100K', emoji: '🚀' },
              { id: 'a8', text: 'Over $100K', emoji: '💎' },
            ],
          },
          {
            id: 'q3',
            text: 'How many paying customers do you have?',
            type: 'multiple_choice',
            topic: 'traction',
            why_matters: 'Indicates product-market fit and scalability',
            options: [
              { id: 'a9', text: 'Under 10', emoji: '🏁' },
              { id: 'a10', text: '10-50', emoji: '📊' },
              { id: 'a11', text: '50-200', emoji: '🎯' },
              { id: 'a12', text: 'Over 200', emoji: '🌟' },
            ],
          },
        ],
        advisor: {
          name: 'AI Advisor',
          persona: 'experienced',
        },
      } as T;

    case 'process_answer':
      return {
        success: true,
        signals: ['Strong growth trajectory', 'Clear value proposition'],
        next_question_id: null,
      } as T;

    case 'calculate_score':
      return {
        investor_score: {
          total_score: 78,
          breakdown: {
            team: 75,
            traction: 75,
            market: 80,
            product: 80,
            fundraising: 70,
          },
          recommendations: [
            { action: 'Strengthen market positioning', points_gain: 5 },
            { action: 'Build strategic partnerships', points_gain: 3 },
          ],
        },
        success: true,
      } as T;

    case 'generate_summary':
      return {
        summary: {
          executive_summary: 'A promising startup in the technology space with strong team and product.',
          key_highlights: [
            'Strong product-market fit indicators',
            'Experienced founding team',
            'Growing customer base',
          ],
          recommendations: [
            'Focus on customer acquisition',
            'Strengthen competitive positioning',
            'Build strategic partnerships',
          ],
        },
        success: true,
      } as T;

    case 'complete_wizard':
      return {
        startup_id: 'dev-startup-123',
        tasks_created: 5,
        success: true,
      } as T;

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

/**
 * Checks if we should use mock responses
 */
export function shouldUseMockAgent(userId?: string): boolean {
  return DEV_BYPASS_AUTH && userId === DEV_MOCK_USER_ID;
}
