-- Create investors table for tracking investor pipeline
CREATE TABLE public.investors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    firm_name TEXT,
    email TEXT,
    phone TEXT,
    title TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    type TEXT DEFAULT 'vc', -- vc, angel, family_office, corporate, accelerator
    investment_focus TEXT[], -- sectors they invest in
    stage_focus TEXT[], -- seed, series_a, series_b, etc.
    check_size_min NUMERIC,
    check_size_max NUMERIC,
    portfolio_companies TEXT[],
    status TEXT DEFAULT 'researching', -- researching, contacted, meeting_scheduled, pitched, due_diligence, term_sheet, committed, passed
    priority TEXT DEFAULT 'medium', -- low, medium, high, top
    warm_intro_from TEXT,
    first_contact_date DATE,
    last_contact_date DATE,
    next_follow_up DATE,
    meetings_count INTEGER DEFAULT 0,
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;

-- RLS policies for investors
CREATE POLICY "Users can view investors in their org startups"
    ON public.investors FOR SELECT
    USING (startup_in_org(startup_id));

CREATE POLICY "Users can insert investors in their org startups"
    ON public.investors FOR INSERT
    WITH CHECK (startup_in_org(startup_id));

CREATE POLICY "Users can update investors in their org startups"
    ON public.investors FOR UPDATE
    USING (startup_in_org(startup_id));

CREATE POLICY "Users can delete investors in their org startups"
    ON public.investors FOR DELETE
    USING (startup_in_org(startup_id));

-- Dev bypass policy for investors
CREATE POLICY "Dev bypass for investors"
    ON public.investors FOR SELECT
    USING (user_org_id() IS NULL);

-- Trigger for updated_at
CREATE TRIGGER update_investors_updated_at
    BEFORE UPDATE ON public.investors
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Create index for better query performance
CREATE INDEX idx_investors_startup_id ON public.investors(startup_id);
CREATE INDEX idx_investors_status ON public.investors(status);

-- Insert sample seed data (using existing startup from seed data)
INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, warm_intro_from, first_contact_date, last_contact_date, notes, tags)
SELECT 
    s.id,
    'Sarah Chen',
    'Sequoia Capital',
    'sarah.chen@sequoia.com',
    'Partner',
    'vc',
    ARRAY['AI/ML', 'SaaS', 'Enterprise'],
    ARRAY['seed', 'series_a'],
    250000,
    2000000,
    'pitched',
    'top',
    'John from YC',
    '2024-12-01',
    '2025-01-10',
    'Very interested in our AI approach. Asked detailed questions about unit economics.',
    ARRAY['tier-1', 'ai-focus']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, first_contact_date, notes, tags)
SELECT 
    s.id,
    'Michael Rodriguez',
    'a16z',
    'mrodriguez@a16z.com',
    'General Partner',
    'vc',
    ARRAY['AI/ML', 'Developer Tools', 'Infrastructure'],
    ARRAY['series_a', 'series_b'],
    1000000,
    10000000,
    'meeting_scheduled',
    'top',
    '2025-01-05',
    'Meeting scheduled for next week. Focus on technical deep-dive.',
    ARRAY['tier-1', 'technical']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, notes, tags)
SELECT 
    s.id,
    'Emily Watson',
    'First Round Capital',
    'emily@firstround.com',
    'Principal',
    'vc',
    ARRAY['SaaS', 'B2B', 'AI/ML'],
    ARRAY['pre_seed', 'seed'],
    100000,
    500000,
    'researching',
    'high',
    'Great track record with B2B SaaS companies.',
    ARRAY['seed-focus']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, warm_intro_from, first_contact_date, last_contact_date, notes, tags)
SELECT 
    s.id,
    'David Kim',
    'Y Combinator',
    'david@ycombinator.com',
    'Partner',
    'accelerator',
    ARRAY['AI/ML', 'SaaS', 'Fintech'],
    ARRAY['pre_seed', 'seed'],
    125000,
    500000,
    'due_diligence',
    'top',
    'YC Alumni Network',
    '2024-11-15',
    '2025-01-12',
    'In DD phase. Need to provide customer references and financials.',
    ARRAY['accelerator', 'yc']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, notes, tags)
SELECT 
    s.id,
    'Jennifer Lee',
    'Angel Investor',
    'jennifer.lee@gmail.com',
    'Angel Investor',
    'angel',
    ARRAY['AI/ML', 'Healthcare'],
    ARRAY['pre_seed', 'seed'],
    25000,
    100000,
    'contacted',
    'medium',
    'Former Google exec. Strong network in AI space.',
    ARRAY['angel', 'operator']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, first_contact_date, last_contact_date, notes, tags)
SELECT 
    s.id,
    'Robert Chang',
    'Accel Partners',
    'rchang@accel.com',
    'Partner',
    'vc',
    ARRAY['Enterprise', 'SaaS', 'Security'],
    ARRAY['series_a', 'series_b'],
    500000,
    5000000,
    'passed',
    'medium',
    '2024-10-01',
    '2024-11-15',
    'Passed - said they are too focused on security vertical right now.',
    ARRAY['tier-1']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, warm_intro_from, first_contact_date, last_contact_date, notes, tags)
SELECT 
    s.id,
    'Amanda Foster',
    'Lightspeed Venture Partners',
    'afoster@lsvp.com',
    'Principal',
    'vc',
    ARRAY['AI/ML', 'Consumer', 'Enterprise'],
    ARRAY['seed', 'series_a'],
    200000,
    2000000,
    'term_sheet',
    'top',
    'Portfolio CEO intro',
    '2024-12-10',
    '2025-01-14',
    'Term sheet received! $1.5M at $12M pre. Reviewing with lawyer.',
    ARRAY['tier-1', 'hot-lead']
FROM public.startups s LIMIT 1;

INSERT INTO public.investors (startup_id, name, firm_name, email, title, type, investment_focus, stage_focus, check_size_min, check_size_max, status, priority, first_contact_date, notes, tags)
SELECT 
    s.id,
    'Chris Martinez',
    'Google Ventures',
    'cmartinez@gv.com',
    'Partner',
    'corporate',
    ARRAY['AI/ML', 'Cloud', 'Enterprise'],
    ARRAY['series_a', 'series_b', 'series_c'],
    2000000,
    20000000,
    'contacted',
    'high',
    '2025-01-08',
    'Reached out via LinkedIn. Awaiting response.',
    ARRAY['corporate-vc', 'strategic']
FROM public.startups s LIMIT 1;