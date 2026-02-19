#!/usr/bin/env tsx
/**
 * Add Events from URLs Script
 * 
 * Adds industry events to Supabase from provided URLs
 * Then triggers image download script
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// Load environment variables
config({ path: join(PROJECT_ROOT, '.env.local') });

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yvyesmiczbjqwbqtlidy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Event data extracted from web search results
const events = [
  {
    name: 'The Briefing: Enterprise Agents',
    full_name: 'The Briefing: Enterprise Agents by Anthropic',
    slug: 'the-briefing-enterprise-agents-2026',
    description: 'Join product and engineering leaders from Anthropic to see what\'s possible when Claude knows your work the way you do. Features new product announcements, live demos, and technical sessions on deploying enterprise agents with confidence.',
    website_url: 'https://www.anthropic.com/events/the-briefing-enterprise-agents',
    event_date: '2026-02-24',
    end_date: '2026-02-24',
    location_city: 'New York City',
    location_country: 'United States',
    venue: 'TBA',
    format: 'in_person' as const,
    ticket_cost_tier: 'premium' as const,
    startup_relevance: 5,
    expected_attendance: 500,
    categories: ['industry'] as any[],
    topics: ['Enterprise AI', 'Claude', 'AI Agents', 'AI Strategy'],
    audience_types: ['Enterprise', 'Executives', 'CIOs', 'CROs'],
    tags: ['anthropic', 'claude', 'enterprise', 'ai-agents', 'new-york']
  },
  {
    name: 'Google Cloud Next 2026',
    full_name: 'Google Cloud Next 2026',
    slug: 'google-cloud-next-2026',
    description: 'Where big ideas become a reality. Join a global community of leaders, thinkers, and doers to explore the latest advancements in AI and cloud tech. Features keynotes, spotlights, breakouts, lightning talks, and hands-on workshops.',
    website_url: 'https://www.googlecloudevents.com/next-vegas',
    event_date: '2026-04-22',
    end_date: '2026-04-24',
    location_city: 'Las Vegas',
    location_country: 'United States',
    venue: 'Mandalay Bay Convention Center',
    format: 'in_person' as const,
    ticket_cost_tier: 'high' as const,
    ticket_cost_min: 999,
    ticket_cost_max: 2299,
    startup_relevance: 5,
    expected_attendance: 30000,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['Google Cloud', 'AI', 'Cloud Infrastructure', 'MLOps', 'Vertex AI'],
    audience_types: ['Developers', 'Enterprise', 'Engineers', 'Founders'],
    tags: ['google-cloud', 'ai', 'cloud', 'infrastructure', 'las-vegas']
  },
  {
    name: 'The AI Conference 2026',
    full_name: 'The AI Conference 2026 - Shaping The Future of AI',
    slug: 'the-ai-conference-2026',
    description: 'A groundbreaking multi-day event covering AGI, LLMs, Infrastructure, Alignment, AI Startups, Neural Architectures, and real-world applications. Features five tracks: AI Frontiers, AI Builders, The AI Stack, Applied AI, and AI Strategy.',
    website_url: 'https://aiconference.com/',
    event_date: '2026-09-29',
    end_date: '2026-10-01',
    location_city: 'San Francisco',
    location_country: 'United States',
    venue: 'Pier 48, Mission Rock',
    format: 'in_person' as const,
    ticket_cost_tier: 'high' as const,
    startup_relevance: 5,
    expected_attendance: 5500,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['AGI', 'LLMs', 'AI Infrastructure', 'AI Alignment', 'AI Startups'],
    audience_types: ['Researchers', 'Developers', 'Founders', 'Engineers', 'Executives'],
    tags: ['ai', 'agi', 'llm', 'research', 'startups', 'san-francisco']
  },
  {
    name: 'Ai4 2026',
    full_name: 'Ai4 2026 - America\'s Largest AI Conference',
    slug: 'ai4-2026',
    description: 'America\'s largest AI conference bringing together business executives and technology leaders to shape the future of AI. Features 1000+ speakers, tracks on AI Agents, Generative AI, and industry-specific applications.',
    website_url: 'https://ai4.io/',
    event_date: '2026-08-04',
    end_date: '2026-08-06',
    location_city: 'Las Vegas',
    location_country: 'United States',
    venue: 'The Venetian',
    format: 'in_person' as const,
    ticket_cost_tier: 'high' as const,
    ticket_cost_min: 1395,
    ticket_cost_max: 5995,
    startup_relevance: 5,
    expected_attendance: 10000,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['AI Agents', 'Generative AI', 'Enterprise AI', 'AI Infrastructure'],
    audience_types: ['Enterprise', 'Founders', 'Developers', 'Researchers'],
    tags: ['ai', 'conference', 'enterprise', 'generative-ai', 'ai-agents']
  },
  {
    name: 'Future Festival World Summit',
    full_name: 'Future Festival World Summit 2026',
    slug: 'future-festival-world-summit-2026',
    description: 'The #1 innovation conference. Join 500+ attendees from 300+ companies including Starbucks, Netflix, Samsung, NASA, Lego & Google. Focus on AI Super Agents and innovation in the age of AI.',
    website_url: 'https://www.futurefestival.com/',
    event_date: '2026-09-29',
    end_date: '2026-10-01',
    location_city: 'Toronto',
    location_country: 'Canada',
    venue: 'TIFF Lightbox / Steam Whistle',
    format: 'in_person' as const,
    ticket_cost_tier: 'high' as const,
    ticket_cost_min: 1000,
    ticket_cost_max: 3000,
    startup_relevance: 4,
    expected_attendance: 500,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['Innovation', 'AI Super Agents', 'Trend Forecasting', 'Futurism'],
    audience_types: ['Enterprise', 'Founders', 'Researchers'],
    tags: ['innovation', 'trends', 'ai', 'futurism', 'toronto']
  },
  {
    name: 'Generative AI Summit Toronto',
    full_name: 'Generative AI Summit Toronto 2026',
    slug: 'generative-ai-summit-toronto-2026',
    description: 'Toronto\'s #1 assembly for engineers & devs building industry-ready LLMs & generative AI. Features tracks on Generative AI, Agentic AI, and Headliners stage.',
    website_url: 'https://world.aiacceleratorinstitute.com/location/toronto/',
    event_date: '2026-11-19',
    end_date: '2026-11-20',
    location_city: 'Toronto',
    location_country: 'Canada',
    venue: 'TBA',
    format: 'in_person' as const,
    ticket_cost_tier: 'medium' as const,
    startup_relevance: 5,
    expected_attendance: 500,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['Generative AI', 'LLMs', 'AI Agents', 'AI Engineering'],
    audience_types: ['Developers', 'Engineers', 'Founders', 'Researchers'],
    tags: ['generative-ai', 'llm', 'toronto', 'engineering', 'ai-agents']
  },
  {
    name: 'ALL IN 2026',
    full_name: 'ALL IN 2026 - Canada\'s AI Event',
    slug: 'all-in-2026',
    description: 'The most important event dedicated to Canada\'s artificial intelligence. Brought together more than 6,500 business decision-makers and AI experts from 40 countries. Building an AI-powered economy.',
    website_url: 'https://allinevent.ai/',
    event_date: '2026-09-16',
    end_date: '2026-09-17',
    location_city: 'Montreal',
    location_country: 'Canada',
    venue: 'TBA',
    format: 'in_person' as const,
    ticket_cost_tier: 'medium' as const,
    ticket_cost_min: 600,
    startup_relevance: 5,
    expected_attendance: 6500,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['AI Economy', 'Enterprise AI', 'AI Policy', 'Canadian AI'],
    audience_types: ['Enterprise', 'Founders', 'Investors', 'Researchers'],
    tags: ['canada', 'ai', 'montreal', 'enterprise', 'ecosystem']
  },
  {
    name: 'AI & Data Summit Toronto',
    full_name: 'IDC Canada AI & Data Summit 2026 Toronto',
    slug: 'ai-data-summit-toronto-2026',
    description: 'Premier event for senior technology and business executives driving artificial intelligence and data strategies. Designed for CDOs, Heads of Data, and AI and innovation leaders.',
    website_url: 'https://event.idc.com/event/ai-data-summit-toronto/',
    event_date: '2026-03-05',
    location_city: 'Toronto',
    location_country: 'Canada',
    venue: 'Marriott Downtown at CF Toronto Eaton Centre',
    format: 'in_person' as const,
    ticket_cost_tier: 'high' as const,
    startup_relevance: 4,
    expected_attendance: 500,
    categories: ['industry'] as any[],
    topics: ['AI Strategy', 'Data Governance', 'AI Compliance', 'Enterprise AI'],
    audience_types: ['Enterprise', 'Executives', 'Data Leaders'],
    tags: ['ai', 'data', 'enterprise', 'toronto', 'idc']
  },
  {
    name: 'Future of AI Summit',
    full_name: 'Financial Times Future of AI Summit 2026',
    slug: 'future-of-ai-summit-2026',
    description: 'Unlocking innovation for real-world advantage. Brings together 900+ attendees, 100+ speakers across two days. Focus on AI regulation, ethics, governance, talent, and ROI.',
    website_url: 'https://ai.live.ft.com/',
    event_date: '2026-11-04',
    end_date: '2026-11-05',
    location_city: 'London',
    location_country: 'United Kingdom',
    venue: 'TBA',
    format: 'in_person' as const,
    ticket_cost_tier: 'premium' as const,
    ticket_cost_min: 1459,
    ticket_cost_max: 2729,
    startup_relevance: 4,
    expected_attendance: 900,
    categories: ['industry'] as any[],
    topics: ['AI Regulation', 'AI Ethics', 'AI Governance', 'AI Policy'],
    audience_types: ['Enterprise', 'Executives', 'Policy Makers', 'Researchers'],
    tags: ['ai', 'regulation', 'ethics', 'governance', 'london', 'ft']
  },
  {
    name: 'NVIDIA GTC',
    full_name: 'NVIDIA GTC AI Conference 2026',
    slug: 'nvidia-gtc-2026',
    description: 'The premier global AI conference for developers, researchers, and business leaders. Showcases breakthroughs in physical AI, AI factories, agentic AI, and inference. Features Jensen Huang\'s keynote and hands-on training.',
    website_url: 'https://www.nvidia.com/gtc/',
    event_date: '2026-03-16',
    end_date: '2026-03-19',
    location_city: 'San Jose',
    location_country: 'United States',
    venue: 'SAP Center & Downtown San Jose',
    format: 'in_person' as const,
    ticket_cost_tier: 'high' as const,
    startup_relevance: 5,
    expected_attendance: 20000,
    categories: ['industry', 'startup_vc'] as any[],
    topics: ['AI Infrastructure', 'CUDA', 'Physical AI', 'AI Agents', 'AI Research'],
    audience_types: ['Developers', 'Researchers', 'Engineers', 'Founders'],
    tags: ['nvidia', 'ai', 'gpu', 'cuda', 'research', 'developers']
  }
];

async function addEvents() {
  console.log('🚀 Adding Events to Supabase\n');
  console.log(`Total events to add: ${events.length}\n`);

  const results = [];

  for (const event of events) {
    try {
      // Check if event already exists
      const { data: existing } = await supabase
        .from('industry_events')
        .select('id, name')
        .eq('slug', event.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping: ${event.name} (already exists)`);
        results.push({ event: event.name, status: 'skipped', id: existing.id });
        continue;
      }

      // Insert event
      const { data, error } = await supabase
        .from('industry_events')
        .insert({
          ...event,
          dates_confirmed: true,
          timezone: 'America/New_York', // Default, can be updated
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Error adding ${event.name}:`, error.message);
        results.push({ event: event.name, status: 'failed', error: error.message });
        continue;
      }

      console.log(`✅ Added: ${event.name} (ID: ${data.id})`);
      results.push({ event: event.name, status: 'success', id: data.id });
    } catch (error: any) {
      console.error(`❌ Error processing ${event.name}:`, error.message);
      results.push({ event: event.name, status: 'failed', error: error.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  const successful = results.filter(r => r.status === 'success').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const failed = results.filter(r => r.status === 'failed').length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ Failed events:');
    results
      .filter(r => r.status === 'failed')
      .forEach(r => {
        console.log(`  - ${r.event}: ${r.error}`);
      });
  }

  console.log('\n📝 Next Step: Run image download script');
  console.log('   npx tsx scripts/download-event-images-cloudinary.ts');

  return results;
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('add-events-from-urls')) {
  addEvents().catch(console.error);
}

export { addEvents, events };
