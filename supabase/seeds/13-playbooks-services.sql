-- ============================================================================
-- Seed: Industry Playbooks - Services Sector
-- Contains: healthcare, education, legal_professional, events_management, travel_hospitality
-- ============================================================================

-- 1. Healthcare
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns, decision_frameworks, warning_signs, stage_checklists,
  version, is_active, source
) VALUES (
  'healthcare',
  'Healthcare',
  'Broken healthcare workflow → AI automation → better outcomes + efficiency → regulatory approval → industry adoption',
  '{
    "pre_seed": {
      "focus": ["Clinical expertise on team", "Regulatory strategy (FDA, HIPAA)", "Clear clinical workflow"],
      "metrics": ["MD/PhD on team or advisory", "Pilot site identified", "Regulatory pathway documented"],
      "deal_breakers": ["No clinical expertise", "Unclear regulatory path", "Direct-to-consumer without clinical validation"]
    },
    "seed": {
      "focus": ["Clinical validation", "Pilot results", "Regulatory progress"],
      "metrics": ["2-3 health system pilots", "Clinical outcome data", "FDA 510k or HIPAA compliance"],
      "deal_breakers": ["No clinical evidence", "Regulatory issues", "Cant get health system buy-in"]
    },
    "series_a": {
      "focus": ["Proven clinical outcomes", "Reimbursement strategy", "Scalable sales model"],
      "metrics": ["5+ health system customers", "Published clinical data", "Clear path to reimbursement"],
      "deal_breakers": ["No reimbursement path", "Clinical outcome questions", "Single customer dependency"]
    }
  }'::jsonb,
  '[
    {"pattern": "Regulatory Surprise", "why_fatal": "FDA requires clinical trial you didnt budget for", "early_warning": "Havent consulted regulatory expert", "how_to_avoid": "Regulatory strategy before product. Budget 18-24 months"},
    {"pattern": "Selling to Wrong Buyer", "why_fatal": "Clinicians excited but IT/procurement kills deal", "early_warning": "Only talking to clinical champions", "how_to_avoid": "Map full buying center. Engage IT and compliance early"},
    {"pattern": "No Reimbursement Path", "why_fatal": "Health systems wont pay if they cant bill", "early_warning": "Product requires new budget line", "how_to_avoid": "Design for existing reimbursement codes or proven ROI"},
    {"pattern": "HIPAA Afterthought", "why_fatal": "One breach destroys company", "early_warning": "No BAA strategy, no security officer", "how_to_avoid": "HIPAA compliance from day 1. BAAs before any PHI"}
  ]'::jsonb,
  '[
    {"metric": "Health System Pilots", "good": "2-3", "great": ">5", "stage": "Seed"},
    {"metric": "ARR", "good": "$200K-500K", "great": ">$500K", "stage": "Series A"},
    {"metric": "Clinical Outcome Improvement", "good": "10-20%", "great": ">30%", "stage": "Series A"}
  ]'::jsonb,
  '{
    "use_phrases": ["Clinical validation", "HIPAA compliant", "FDA cleared", "EHR integrated", "Care pathway", "Clinical workflow", "Quality improvement"],
    "avoid_phrases": ["Disrupting healthcare", "Patients love it", "Doctors will prescribe it", "Replaces physicians"],
    "investor_vocabulary": ["FDA 510k", "De novo", "PMA", "HIPAA", "BAA", "EHR", "EMR", "Epic", "Cerner", "FHIR", "CPT codes", "Reimbursement"]
  }'::jsonb,
  '[
    {"name": "Health System Direct", "stages": ["Seed", "Series A"], "channels": ["CMIO/CNO relationships", "Innovation centers", "Health system accelerators"], "best_for": "Enterprise health system sales"},
    {"name": "EHR Marketplace", "stages": ["Series A"], "channels": ["Epic App Orchard", "Cerner Code"], "best_for": "Distribution to existing EHR users"},
    {"name": "Specialty Associations", "stages": ["Seed"], "channels": ["Medical specialty conferences", "KOL relationships"], "best_for": "Clinical adoption and validation"}
  ]'::jsonb,
  '[
    {"decision": "FDA Pathway", "if": "Software makes clinical decisions", "then": "Likely FDA regulated", "because": "SaMD (Software as Medical Device) rules apply"},
    {"decision": "Build vs Partner for EHR", "if": "Workflow requires EHR data", "then": "Start with top 2 EHRs", "because": "Epic + Cerner = 60% of market"}
  ]'::jsonb,
  '[
    {"signal": "Pilot stalls in IT security review", "trigger": "Security gaps or process issues", "action": "Dedicated resource for security. Pre-build documentation", "severity": "warning"},
    {"signal": "Clinical champion leaves", "trigger": "Lost internal sponsor", "action": "Build relationship with 3+ stakeholders per account", "severity": "critical"},
    {"signal": "FDA sends questions", "trigger": "Regulatory timeline risk", "action": "Engage regulatory consultant immediately", "severity": "critical"}
  ]'::jsonb,
  '[
    {"stage": "pre_seed", "tasks": ["Recruit clinical advisor or co-founder", "Document regulatory pathway", "Identify pilot sites", "HIPAA compliance framework"]},
    {"stage": "seed", "tasks": ["Launch 2-3 pilots", "Collect clinical outcome data", "Complete HIPAA/SOC 2", "Map reimbursement strategy"]},
    {"stage": "series_a", "tasks": ["5+ health system customers", "Publish clinical data", "Build clinical evidence", "Hire enterprise sales"]}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 2. Education
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'education',
  'Education',
  'Learning gaps → personalized AI → measurable outcomes → institutional adoption → learning transformation',
  '{
    "pre_seed": {
      "focus": ["Learning outcome focus", "Educator relationships", "Pedagogical foundation"],
      "metrics": ["Education expertise on team", "Pilot schools/districts", "Clear learning outcome metrics"],
      "deal_breakers": ["No education experience", "Tech-first approach without pedagogy", "Only consumer without institutional path"]
    },
    "seed": {
      "focus": ["Efficacy data", "District/university pilots", "Student engagement metrics"],
      "metrics": ["5-10 school pilots", "Learning outcome improvement data", "$20-50K MRR"],
      "deal_breakers": ["No efficacy evidence", "High churn among schools", "Cant navigate procurement"]
    }
  }'::jsonb,
  '[
    {"pattern": "Cool Tech Bad Pedagogy", "why_fatal": "Educators reject products that dont fit how learning works", "early_warning": "No educators on team or advisory", "how_to_avoid": "Hire educators. Build on learning science"},
    {"pattern": "Budget Timing Mismatch", "why_fatal": "Schools buy on annual cycles. Miss the window wait 12 months", "early_warning": "Dont know district budget cycles", "how_to_avoid": "Learn procurement cycles. Target decision makers 6 months before budget"},
    {"pattern": "Consumer Focus Without Institution", "why_fatal": "Parents pay once, institutions pay annually", "early_warning": "Only B2C marketing", "how_to_avoid": "Design for institutional use. B2C can be funnel to B2B"}
  ]'::jsonb,
  '[
    {"metric": "Schools/Districts", "good": "5-10", "great": ">20", "stage": "Seed"},
    {"metric": "MRR", "good": "$20-50K", "great": ">$50K", "stage": "Seed"},
    {"metric": "Learning Outcome Lift", "good": "10-15%", "great": ">20%", "stage": "Seed"},
    {"metric": "Student Engagement", "good": "3x/week usage", "great": "Daily usage", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Learning outcomes", "Efficacy study", "Formative assessment", "Adaptive learning", "LMS integration", "FERPA compliant", "Student engagement"],
    "avoid_phrases": ["Gamified learning", "Replace teachers", "Kids love it", "Screen time"],
    "investor_vocabulary": ["LMS", "SIS", "FERPA", "Title I", "ESSA", "Efficacy", "IEP", "504"]
  }'::jsonb,
  '[
    {"name": "District Direct", "stages": ["Seed"], "channels": ["Superintendent relationships", "Ed tech conferences (ISTE, ASU+GSV)", "State adoption"], "best_for": "K-12 district sales"},
    {"name": "LMS Marketplace", "stages": ["Seed", "Series A"], "channels": ["Canvas", "Blackboard", "Google Classroom"], "best_for": "Distribution to existing LMS users"},
    {"name": "Teacher Champions", "stages": ["Pre-Seed", "Seed"], "channels": ["Teacher communities", "Freemium for teachers", "Word of mouth"], "best_for": "Bottom-up adoption"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 3. Legal / Professional Services
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'legal_professional',
  'Legal / Professional Services',
  'Billable hour inefficiency → AI automation → cost reduction → productivity gains → firm transformation',
  '{
    "pre_seed": {
      "focus": ["Legal industry expertise", "Workflow automation focus", "Law firm relationships"],
      "metrics": ["Legal background on team", "3-5 law firm pilots", "Clear time savings metrics"],
      "deal_breakers": ["No legal expertise", "Threatening billable hour model without alternative", "Only consumer legal"]
    },
    "seed": {
      "focus": ["Am Law 200 traction", "Measurable productivity gains", "Practice area focus"],
      "metrics": ["$30-60K MRR", "2-3 Am Law 200 pilots", "Clear ROI per attorney"],
      "deal_breakers": ["No Am Law relationships", "Cant prove time savings", "Horizontal approach"]
    }
  }'::jsonb,
  '[
    {"pattern": "Threatening the Billable Hour", "why_fatal": "Partners wont adopt tools that reduce revenue", "early_warning": "Product reduces hours without alternative value", "how_to_avoid": "Frame as productivity not replacement. More leverage per hour"},
    {"pattern": "Missing IT and Procurement", "why_fatal": "Partners say yes but IT/procurement says no", "early_warning": "Only talking to practice groups", "how_to_avoid": "Engage CIO and procurement early"},
    {"pattern": "Generic Legal Tech", "why_fatal": "Practice areas are different worlds", "early_warning": "One product for all practice areas", "how_to_avoid": "Pick one practice area. Go deep"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$30-60K", "great": ">$80K", "stage": "Seed"},
    {"metric": "Am Law 200 Logos", "good": "2-3", "great": ">5", "stage": "Seed"},
    {"metric": "Time Savings per Attorney", "good": "2-5 hours/week", "great": ">5 hours/week", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Attorney productivity", "Practice efficiency", "Matter profitability", "Knowledge management", "Document automation", "Legal workflow"],
    "avoid_phrases": ["Replace lawyers", "End of billable hour", "Disrupting BigLaw"],
    "investor_vocabulary": ["Am Law 100/200", "Practice area", "Matter", "Associate leverage", "PPP", "RPL", "DMS", "Practice management"]
  }'::jsonb,
  '[
    {"name": "Am Law Direct", "stages": ["Seed"], "channels": ["Partner relationships", "Legal tech conferences (ILTACON, Legalweek)", "Consultant referrals"], "best_for": "BigLaw enterprise sales"},
    {"name": "Legal Tech Integrations", "stages": ["Seed", "Series A"], "channels": ["DMS integration (iManage, NetDocuments)", "Practice management platforms"], "best_for": "Distribution through existing stack"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 4. Events Management
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'events_management',
  'Events Management',
  'Event complexity → AI-powered planning → seamless execution → memorable experiences → industry standard',
  '{
    "pre_seed": {
      "focus": ["Events industry experience", "Clear pain point", "Event planner relationships"],
      "metrics": ["Events background on team", "5-10 events managed", "Clear efficiency metrics"],
      "deal_breakers": ["No events experience", "Solution for non-problem", "Only consumer events"]
    },
    "seed": {
      "focus": ["Corporate event traction", "Platform stickiness", "Repeat event usage"],
      "metrics": ["100+ events on platform", "$20-40K MRR", "70%+ repeat rate"],
      "deal_breakers": ["One-time use only", "Cant handle enterprise security", "No differentiation from free tools"]
    }
  }'::jsonb,
  '[
    {"pattern": "Feature Not Platform", "why_fatal": "Zoom/Teams add your feature", "early_warning": "Single feature focus", "how_to_avoid": "Own the workflow. Registration to follow-up"},
    {"pattern": "Seasonal Dependency", "why_fatal": "Revenue spikes then crashes", "early_warning": "All revenue in Q1 or Q4", "how_to_avoid": "Build annual contracts. Diversify event types"},
    {"pattern": "Commoditized Registration", "why_fatal": "Eventbrite and free tools are good enough", "early_warning": "Competing on registration price", "how_to_avoid": "Differentiate on engagement, analytics, or workflow"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$20-40K", "great": ">$50K", "stage": "Seed"},
    {"metric": "Events per Month", "good": "50-100", "great": ">200", "stage": "Seed"},
    {"metric": "Repeat Rate", "good": "60-70%", "great": ">80%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Event ROI", "Attendee engagement", "Event intelligence", "Virtual/hybrid", "Registration to revenue", "Event portfolio"],
    "avoid_phrases": ["Eventbrite killer", "Virtual event platform", "Post-COVID"],
    "investor_vocabulary": ["Registration", "Attendance rate", "Engagement score", "Event ROI", "Hybrid", "On-demand"]
  }'::jsonb,
  '[
    {"name": "Corporate Direct", "stages": ["Seed"], "channels": ["Event marketing teams", "Industry conferences", "Agency partnerships"], "best_for": "Enterprise event programs"},
    {"name": "Venue Partnerships", "stages": ["Seed", "Series A"], "channels": ["Venue tech stack", "Hospitality platforms"], "best_for": "Distribution through venues"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();

-- 5. Travel & Hospitality
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, benchmarks,
  terminology, gtm_patterns,
  version, is_active, source
) VALUES (
  'travel_hospitality',
  'Travel & Hospitality',
  'Fragmented travel experience → AI personalization → seamless journey → loyalty → industry transformation',
  '{
    "pre_seed": {
      "focus": ["Travel industry expertise", "Distribution strategy", "Clear differentiation"],
      "metrics": ["Travel background on team", "Industry partnerships", "Working product"],
      "deal_breakers": ["No travel experience", "Competing on price with OTAs", "No distribution strategy"]
    },
    "seed": {
      "focus": ["Transaction volume", "Partner integrations", "Unit economics"],
      "metrics": ["$50K+ monthly GMV", "2-3 distribution partners", "Positive unit economics"],
      "deal_breakers": ["Negative unit economics", "No partner relationships", "Single supplier dependency"]
    }
  }'::jsonb,
  '[
    {"pattern": "OTA Price War", "why_fatal": "Booking.com and Expedia will outspend you", "early_warning": "Competing on lowest price", "how_to_avoid": "Differentiate on experience not price"},
    {"pattern": "Supplier Dependency", "why_fatal": "Airlines/hotels change terms and break your model", "early_warning": "90% of inventory from one supplier", "how_to_avoid": "Diversify suppliers. Own the customer relationship"},
    {"pattern": "Macro Sensitivity", "why_fatal": "Recession/pandemic destroys demand overnight", "early_warning": "Only leisure travel, no corporate", "how_to_avoid": "Mix of leisure and corporate. Build for downturns"}
  ]'::jsonb,
  '[
    {"metric": "Monthly GMV", "good": "$50-200K", "great": ">$200K", "stage": "Seed"},
    {"metric": "Take Rate", "good": "8-12%", "great": ">15%", "stage": "Seed"},
    {"metric": "Repeat Booking Rate", "good": "20-30%", "great": ">40%", "stage": "Seed"}
  ]'::jsonb,
  '{
    "use_phrases": ["Travel experience", "Traveler loyalty", "Distribution strategy", "Dynamic packaging", "Revenue per traveler", "Personalization"],
    "avoid_phrases": ["Better than Expedia", "Cheapest flights", "Uber for travel"],
    "investor_vocabulary": ["GMV", "Take rate", "GDS", "OTA", "Metasearch", "NDC", "RevPAR", "ADR", "Ancillary"]
  }'::jsonb,
  '[
    {"name": "B2B Distribution", "stages": ["Seed"], "channels": ["TMCs", "Corporate travel", "Travel agencies"], "best_for": "Volume without consumer CAC"},
    {"name": "Niche Direct", "stages": ["Pre-Seed", "Seed"], "channels": ["Content marketing", "Community", "Influencers"], "best_for": "Building brand in specific segment"}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  updated_at = now();
