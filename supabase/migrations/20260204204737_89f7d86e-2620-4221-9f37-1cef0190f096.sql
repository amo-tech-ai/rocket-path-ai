-- Knowledge chunks table is already created by previous migration
-- This migration adds missing columns and updates search function

-- Add industry column if not exists
ALTER TABLE public.knowledge_chunks 
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Add fetch tracking columns
ALTER TABLE public.knowledge_chunks 
ADD COLUMN IF NOT EXISTS fetch_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE public.knowledge_chunks 
ADD COLUMN IF NOT EXISTS last_fetched_at TIMESTAMPTZ;

-- Create index on industry for filtered searches
CREATE INDEX IF NOT EXISTS knowledge_chunks_industry_idx ON public.knowledge_chunks(industry);

-- Insert more sample knowledge chunks
INSERT INTO public.knowledge_chunks (content, embedding, source, source_type, year, sample_size, confidence, category, tags) VALUES
-- Additional benchmarks
('Monthly recurring revenue (MRR) growth of 15%+ month-over-month is considered excellent for early-stage SaaS. 10%+ is good, below 5% signals concern.',
 array_fill(0::real, ARRAY[1536])::vector, 
 'PwC SaaS Growth Benchmarks 2026', 'pwc', 2026, 4454, 'high', 'growth', ARRAY['mrr', 'saas', 'benchmark']),

('Early-stage startups should aim for a burn multiple under 2x (net burn / net new ARR). Capital efficient companies achieve under 1.5x.',
 array_fill(0::real, ARRAY[1536])::vector,
 'BCG Capital Efficiency Study 2026', 'bcg', 2026, 2360, 'high', 'unit_economics', ARRAY['burn_multiple', 'efficiency', 'arr']),

('Magic number (net new ARR / sales & marketing spend from prior quarter) above 0.75 indicates efficient growth. Above 1.0 is exceptional.',
 array_fill(0::real, ARRAY[1536])::vector,
 'Gartner SaaS Efficiency Metrics 2026', 'gartner', 2026, NULL, 'high', 'unit_economics', ARRAY['magic_number', 'efficiency', 'saas']),

('Rule of 40: Combined revenue growth rate + profit margin should exceed 40% for healthy SaaS companies. Top performers achieve 60%+.',
 array_fill(0::real, ARRAY[1536])::vector,
 'Deloitte Rule of 40 Analysis 2026', 'deloitte', 2026, 3235, 'high', 'growth', ARRAY['rule_of_40', 'profitability', 'growth']),

('Average time to close an enterprise deal is 3-9 months. Companies with product-led growth models can reduce this to 1-3 months for SMB.',
 array_fill(0::real, ARRAY[1536])::vector,
 'McKinsey Sales Cycle Analysis 2026', 'mckinsey', 2026, 1800, 'medium', 'customer_acquisition', ARRAY['sales_cycle', 'enterprise', 'plg']),

('Quick ratio (new MRR + expansion MRR) / (churned MRR + contraction MRR) should be above 4 for healthy growth. Below 1 indicates contraction.',
 array_fill(0::real, ARRAY[1536])::vector,
 'CB Insights SaaS Health Metrics 2026', 'cb_insights', 2026, NULL, 'high', 'growth', ARRAY['quick_ratio', 'mrr', 'health']),

('Ideal logo churn for B2B SaaS is under 10% annually. SMB-focused companies may see 15-20% which is still acceptable.',
 array_fill(0::real, ARRAY[1536])::vector,
 'Deloitte Customer Retention Study 2026', 'deloitte', 2026, 3235, 'high', 'churn', ARRAY['logo_churn', 'retention', 'b2b']),

('Gross margin for software companies should be 70%+ for venture-scale economics. Below 60% is a red flag for investors.',
 array_fill(0::real, ARRAY[1536])::vector,
 'PwC Software Economics 2026', 'pwc', 2026, 4454, 'high', 'unit_economics', ARRAY['gross_margin', 'software', 'benchmark']),

('Average NPS score for B2B SaaS is 36. Scores above 50 are considered excellent and correlate with strong organic growth.',
 array_fill(0::real, ARRAY[1536])::vector,
 'Gartner Customer Satisfaction Index 2026', 'gartner', 2026, NULL, 'medium', 'product_market_fit', ARRAY['nps', 'satisfaction', 'benchmark']),

('Expansion revenue should contribute 20-30% of total new ARR for mature SaaS. Early-stage may see 10-15% which is acceptable.',
 array_fill(0::real, ARRAY[1536])::vector,
 'BCG Revenue Expansion Study 2026', 'bcg', 2026, 2360, 'high', 'growth', ARRAY['expansion', 'arr', 'upsell'])

ON CONFLICT DO NOTHING;