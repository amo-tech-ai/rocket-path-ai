# Accelerator + Startup Dataset — Design Specification

> **Purpose:** Structured dataset for StartupAI: 100 accelerators, 1000 startups, taxonomy, scoring, product opportunities  
> **Outputs:** Markdown tables, CSV, analytics, schema, prompts  
> **Status:** Draft v1 — Ready for research execution

---

## 1. Master Prompt (Search → Analyze → Output Tables + Scores)

```markdown
You are an expert research analyst building a structured dataset for StartupAI.

Goal:
1) Build a dataset of 100 startup accelerators (global).
2) Build a dataset of 1000 startups associated with those accelerators.
3) For each accelerator, analyze: type(s) of programs, industries supported, typical stage, funding terms (if public), remote vs in-person, value props, alumni outcomes, success signals, and founder experience.
4) Produce percent stats, trends, and success patterns across the dataset.
5) Propose AI product opportunities for StartupAI: product types + feature sets + classification industries.

Use web search grounding and ONLY cite reliable sources. Prefer:
- Accelerator official sites
- Crunchbase / reputable databases
- Well-known publications (TechCrunch, Sifted, Forbes, etc.)
- The two seed sources below:
  - https://www.growthmentor.com/blog/best-startup-accelerators/
  - https://about.crunchbase.com/blog/100-startup-accelerators-around-the-world

Hard rules:
- Never invent funding terms or stats. If unknown, set null and mark "missing".
- Normalize program types into a controlled set (see taxonomy below).
- Each row must have a source_url list (2+ sources preferred).
- Output must be structured, no fluff.

Taxonomies (use these exact labels)
Accelerator Program Types:
- accelerator (cohort-based)
- incubator (longer, earlier)
- fellowship (people-first)
- studio (venture studio)
- corporate accelerator
- university accelerator
- grant program
- remote accelerator
- seed fund platform (non-cohort)
- community/membership

Startup Stages:
- pre-idea
- idea
- pre-seed
- seed
- series-a

Industries (use multi-label):
- AI/ML
- DevTools
- B2B SaaS
- Fintech
- Healthtech
- Biotech
- Climate/energy
- Cybersecurity
- Robotics/industrial
- Marketplace
- Consumer
- Edtech
- Web3/crypto
- Retail/ecommerce
- Supply chain/logistics
- Media/creator
- Govtech
- Insurtech
- Proptech
- Travel/hospitality
- HR/people ops
- Legaltech

Required outputs (in this order):

A) Accelerator table (100 rows) as Markdown table:
columns:
- accelerator_id
- name
- website_url
- locations (country/region)
- remote_status (remote / hybrid / in-person)
- program_types (array)
- typical_stage (array)
- industries_supported (array)
- cohort_length_weeks (number|null)
- funding_amount_usd (number|null)
- equity_percent (number|null)
- application_open (yes/no/unknown)
- acceptance_difficulty (easy/medium/hard/extreme)
- review_score_100 (0-100; explain rubric)
- success_signals (array: demo_day, follow_on_rate, notable_alumni, top_vc_network, exits, etc.)
- notable_alumni (array max 8)
- what_it_does (1 sentence)
- purpose_for_founders (1 sentence)
- source_urls (array)

B) Startup table (1000 rows) as CSV-formatted text:
columns:
- startup_id
- name
- website_url
- accelerator_name
- batch_year (if known)
- industry_tags (array)
- stage_now (best estimate from sources)
- what_job_it_does (JTBD: 1 sentence)
- key_ai_use (if any)
- success_signal (raised, revenue, acquired, unknown)
- source_urls (array)

C) Analytics section:
- remote_share_percent
- most_common_industries_top10 with %
- median_funding and IQR (only if enough known values)
- stage_distribution %
- program_type_distribution %
- top 10 accelerators by "review_score_100"
- top 10 accelerators by "notable_alumni_count"
- trends (5 bullets) grounded in observed dataset patterns

D) StartupAI product opportunities:
1) AI products (5–10 types) that map to accelerator + startup needs
2) Feature sets per product (core + advanced)
3) Suggested classification fields for StartupAI database (schema-ready)

Scoring rubric (review_score_100):
- Brand + network strength (0–25)
- Alumni outcomes (0–25)
- Founder experience / mentorship quality (0–20)
- Funding terms attractiveness (0–15)
- Remote quality + accessibility (0–15)
Total = 100. Must cite evidence where possible; if evidence missing, apply conservative scoring and mark reasons.

Start by extracting a candidate list of accelerators from the two seed sources, then expand to reach 100 using reputable lists/databases.
```

---

## 2. Fast Mode Prompt (Accelerator Table Only)

```markdown
Build the Accelerator Table only (100 rows) using search-grounded sources.
Return a Markdown table + a short bullet list of top trends (with %).
No startup table.
Keep missing fields as null.
```

---

## 3. Dataset Builder Prompt (100 Accelerators → 1000 Startups)

```markdown
For each accelerator in the 100-row accelerator table:
- Identify ~10 notable startups associated with it (prefer sourced lists, demo days, Crunchbase, official alumni pages).
- Produce the 1000-row startup CSV.
- Ensure each startup row has at least 1 source_url.
If an accelerator has fewer than 10 reliably sourced startups, fill remaining with startups from other accelerators (but never fabricate).
```

---

## 4. JTBD + AI Use Cases Prompt

```markdown
Using the 1000 startup dataset, cluster startups by:
- industry_tags
- what_job_it_does (JTBD)
- AI usage patterns

Output:
1) Top 25 "jobs to be done" across startups (with %)
2) Top 10 AI adoption patterns (with %)
3) Recommended StartupAI product modules that directly serve these JTBD clusters
4) For each module: core features + advanced features + data fields required
```

---

## 5. Minimal Schema (Postgres-Ready)

```sql
-- accelerators
CREATE TABLE accelerators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  locations TEXT[],
  remote_status TEXT CHECK (remote_status IN ('remote', 'hybrid', 'in-person')),
  program_types TEXT[],
  typical_stage TEXT[],
  industries_supported TEXT[],
  cohort_length_weeks INT,
  funding_amount_usd INT,
  equity_percent NUMERIC(5,2),
  application_open TEXT CHECK (application_open IN ('yes', 'no', 'unknown')),
  acceptance_difficulty TEXT CHECK (acceptance_difficulty IN ('easy', 'medium', 'hard', 'extreme')),
  review_score_100 INT CHECK (review_score_100 BETWEEN 0 AND 100),
  success_signals TEXT[],
  notable_alumni TEXT[],
  what_it_does TEXT,
  purpose_for_founders TEXT,
  org_id UUID REFERENCES orgs(id),  -- RLS isolation
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- accelerator_programs (1:m if accelerator runs multiple program types)
CREATE TABLE accelerator_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accelerator_id UUID REFERENCES accelerators(id) ON DELETE CASCADE,
  program_type TEXT NOT NULL,
  cohort_length_weeks INT,
  funding_amount_usd INT,
  equity_percent NUMERIC(5,2),
  remote_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- accelerator_batches
CREATE TABLE accelerator_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accelerator_id UUID REFERENCES accelerators(id) ON DELETE CASCADE,
  batch_name TEXT,  -- e.g. "W24", "2024"
  start_date DATE,
  end_date DATE,
  cohort_size INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- startups
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  industry_tags TEXT[],
  stage_now TEXT CHECK (stage_now IN ('pre-idea', 'idea', 'pre-seed', 'seed', 'series-a')),
  what_job_it_does TEXT,
  key_ai_use TEXT,
  success_signal TEXT CHECK (success_signal IN ('raised', 'revenue', 'acquired', 'unknown')),
  org_id UUID REFERENCES orgs(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- startup_accelerator_memberships (m:n)
CREATE TABLE startup_accelerator_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  accelerator_id UUID REFERENCES accelerators(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES accelerator_batches(id) ON DELETE SET NULL,
  batch_year INT,
  joined_at DATE,
  UNIQUE(startup_id, accelerator_id)
);

-- industry_tags (reference table for controlled vocab)
CREATE TABLE industry_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  category TEXT CHECK (category IN ('core', 'extended'))
);

-- sources (for citations / provenance)
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  entity_type TEXT,  -- 'accelerator', 'startup'
  entity_id UUID,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- scoring_runs (audit trail for review_score_100)
CREATE TABLE scoring_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accelerator_id UUID REFERENCES accelerators(id) ON DELETE CASCADE,
  score INT,
  rubric_scores JSONB,  -- {brand: 22, alumni: 20, ...}
  evidence_notes TEXT,
  run_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_accelerators_remote ON accelerators(remote_status);
CREATE INDEX idx_accelerators_score ON accelerators(review_score_100 DESC);
CREATE INDEX idx_startups_industry ON startups USING GIN(industry_tags);
CREATE INDEX idx_startups_stage ON startups(stage_now);
CREATE INDEX idx_memberships_startup ON startup_accelerator_memberships(startup_id);
CREATE INDEX idx_memberships_accelerator ON startup_accelerator_memberships(accelerator_id);

-- RLS: org_id isolation for multi-tenant
-- ALTER TABLE accelerators ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY accelerator_org ON accelerators USING (org_id = current_setting('app.current_org_id')::uuid);
```

---

## 6. Industry Classification (Controlled Vocabulary)

**Core (most common):**

| Slug | Label |
|------|-------|
| b2b-saas | B2B SaaS |
| ai-ml | AI/ML |
| devtools | DevTools |
| fintech | Fintech |
| healthtech | Healthtech |
| cybersecurity | Cybersecurity |
| climate-energy | Climate/Energy |
| marketplace | Marketplace |
| consumer | Consumer |

**Extended:**

| Slug | Label |
|------|-------|
| biotech | Biotech |
| insurtech | Insurtech |
| proptech | Proptech |
| supply-chain-logistics | Supply Chain/Logistics |
| robotics-industrial | Robotics/Industrial |
| edtech | Edtech |
| legaltech | Legaltech |
| hr-people-ops | HR/People Ops |
| govtech | Govtech |
| retail-ecommerce | Retail/Ecommerce |
| media-creator | Media/Creator |
| travel-hospitality | Travel/Hospitality |
| web3-crypto | Web3/Crypto |

---

## 7. Practical Use Cases (What This Unlocks in StartupAI)

| Use Case | Description | Data Used |
|----------|-------------|-----------|
| **Accelerator matching** | "Which program fits my stage + industry?" | `accelerators`, `industries_supported`, `typical_stage`, `remote_status` |
| **Portfolio insights** | Batch risk, readiness scoring | `startups`, `startup_accelerator_memberships`, `success_signal` |
| **Founder playbooks** | Program-specific execution plans | `accelerators`, `what_it_does`, `purpose_for_founders`, `success_signals` |
| **Auto outreach** | Mentor/investor intros + email drafts | `notable_alumni`, `success_signals`, network data |
| **Benchmarking** | Funding norms, stage timelines, success patterns | `funding_amount_usd`, `equity_percent`, analytics |

---

## 8. Seed Sources

| Source | URL | Use |
|--------|-----|-----|
| GrowthMentor | https://www.growthmentor.com/blog/best-startup-accelerators/ | Candidate list |
| Crunchbase | https://about.crunchbase.com/blog/100-startup-accelerators-around-the-world | Candidate list |
| Accelerator official sites | — | Funding terms, alumni, program details |
| Crunchbase / PitchBook | — | Startup–accelerator links, funding |
| TechCrunch, Sifted, Forbes | — | Trends, exits, validation |

---

## 9. Scoring Rubric (review_score_100)

| Dimension | Max | Evidence |
|------------|-----|----------|
| Brand + network strength | 25 | Top VCs, brand mentions, media coverage |
| Alumni outcomes | 25 | Exits, follow-on funding, unicorns |
| Founder experience / mentorship | 20 | Mentor quality, founder NPS, curriculum |
| Funding terms | 15 | Amount, equity, non-dilutive options |
| Remote quality + accessibility | 15 | Remote/hybrid, global access, async support |
| **Total** | **100** | Cite evidence; if missing, score conservatively and note |

---

**Path:** `tasks/design/04-accelerator-startup-dataset-spec.md`  
**Next:** Execute Master Prompt with web-grounded search; populate accelerator table first.
