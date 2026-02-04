-- Task 09: Canvas Fields - Add columns for Lean Canvas data capture
-- These fields enable auto-generation of Lean Canvas after onboarding

-- Add canvas fields to startups table (if not exists)
ALTER TABLE public.startups
ADD COLUMN IF NOT EXISTS problem TEXT,
ADD COLUMN IF NOT EXISTS solution TEXT,
ADD COLUMN IF NOT EXISTS existing_alternatives TEXT,
ADD COLUMN IF NOT EXISTS channels TEXT,
ADD COLUMN IF NOT EXISTS value_prop TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.startups.problem IS 'Core problem being solved - maps to Lean Canvas Problem box';
COMMENT ON COLUMN public.startups.solution IS 'How the product solves the problem - maps to Lean Canvas Solution box';
COMMENT ON COLUMN public.startups.existing_alternatives IS 'How customers solve this today - maps to Lean Canvas Existing Alternatives';
COMMENT ON COLUMN public.startups.channels IS 'How customers will find the product - maps to Lean Canvas Channels box';
COMMENT ON COLUMN public.startups.value_prop IS 'Why customers would pay - maps to Lean Canvas Value Proposition';