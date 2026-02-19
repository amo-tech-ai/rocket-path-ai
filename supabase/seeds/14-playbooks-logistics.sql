-- ============================================================================
-- Seed: Industry Playbooks - Logistics Sector
-- Contains: logistics_supply_chain
-- ============================================================================

-- Logistics & Supply Chain
INSERT INTO industry_playbooks (
  industry_id, display_name, narrative_arc,
  investor_expectations, failure_patterns, success_stories, benchmarks,
  terminology, gtm_patterns, decision_frameworks, warning_signs, stage_checklists,
  version, is_active, source
) VALUES (
  'logistics_supply_chain',
  'Logistics & Supply Chain',
  'Supply chain fragmentation → visibility platform → optimization → autonomous operations → industry backbone',
  '{
    "pre_seed": {
      "focus": ["Supply chain expertise", "Clear visibility gap", "Shipper or carrier relationships"],
      "metrics": ["Logistics background on team", "3-5 customer pilots", "Data integration working"],
      "deal_breakers": ["No supply chain experience", "Cant get data access", "Solution without partners"]
    },
    "seed": {
      "focus": ["Transaction volume or shipments tracked", "Integration with major TMS/WMS", "Clear cost savings"],
      "metrics": ["$50K+ MRR or GMV tracked", "Major platform integrations", "Measurable efficiency gains"],
      "deal_breakers": ["Cant prove cost savings", "No enterprise relationships", "Vertical too narrow"]
    },
    "series_a": {
      "focus": ["Network effects forming", "Multi-mode capabilities", "Proven ROI at scale"],
      "metrics": ["$200K+ MRR", "Network with 100+ shippers/carriers", "Clear unit economics"],
      "deal_breakers": ["Single customer dependency", "No network effects", "Cant scale operations team"]
    }
  }'::jsonb,
  '[
    {"pattern": "Data Access Wall", "why_fatal": "Cant get the data needed to provide value", "early_warning": "Shippers wont share data or integrations blocked", "how_to_avoid": "Build value that requires only data they want to share. Earn trust incrementally"},
    {"pattern": "Point Solution Trap", "why_fatal": "TMS/WMS add your feature. Youre a commodity", "early_warning": "Only solve one problem in workflow", "how_to_avoid": "Own end-to-end visibility or optimization. Multi-mode"},
    {"pattern": "Carrier Broker vs Tech", "why_fatal": "Margin-stacking business disguised as tech", "early_warning": "Revenue is broker commission not software", "how_to_avoid": "Clear tech revenue model. SaaS or transaction fee on optimization"},
    {"pattern": "Ignoring the Human Element", "why_fatal": "Operators wont use tool that requires behavior change", "early_warning": "Product requires dispatchers to change workflow", "how_to_avoid": "Design for how operations actually work. Ride along with dispatchers"}
  ]'::jsonb,
  '[
    {"archetype": "Visibility Platform", "pattern": "Track one mode → multi-mode → network effects → data moat", "outcome": "Became source of truth. High switching costs"},
    {"archetype": "Optimization Engine", "pattern": "Automate routing → expand to capacity planning → become decision system", "outcome": "Measurable cost savings. Enterprise stickiness"}
  ]'::jsonb,
  '[
    {"metric": "MRR", "good": "$50-100K", "great": ">$200K", "stage": "Seed"},
    {"metric": "Shipments Tracked/Month", "good": "10K-50K", "great": ">100K", "stage": "Seed"},
    {"metric": "Cost Savings per Customer", "good": "5-10%", "great": ">15%", "stage": "Seed"},
    {"metric": "Net Retention", "good": "100-120%", "great": ">130%", "stage": "Series A"}
  ]'::jsonb,
  '{
    "use_phrases": ["Supply chain visibility", "Real-time tracking", "Carrier network", "Mode optimization", "Shipment intelligence", "Predictive ETA", "Exception management"],
    "avoid_phrases": ["Uber for freight", "Blockchain supply chain", "End-to-end platform", "Disrupting logistics"],
    "investor_vocabulary": ["TMS", "WMS", "EDI", "API", "Carrier", "Shipper", "3PL", "LTL", "FTL", "Drayage", "Last mile", "Bill of lading"]
  }'::jsonb,
  '[
    {"name": "Shipper Direct", "stages": ["Seed"], "channels": ["Supply chain executives", "Industry conferences (CSCMP, Gartner)", "Analyst relationships"], "best_for": "Enterprise shipper sales"},
    {"name": "TMS/WMS Integrations", "stages": ["Seed", "Series A"], "channels": ["Partnership with major TMS", "Integration marketplace"], "best_for": "Distribution through existing tech stack"},
    {"name": "Carrier Networks", "stages": ["Seed", "Series A"], "channels": ["Carrier partnerships", "Freight broker relationships"], "best_for": "Building supply-side network"}
  ]'::jsonb,
  '[
    {"decision": "Shipper vs Carrier First", "if": "You have shipper relationships", "then": "Shipper first", "because": "Shippers pay. Carriers come for volume"},
    {"decision": "Single Mode vs Multi-Mode", "if": "Starting from scratch", "then": "Single mode first", "because": "Prove value in one mode before expanding"},
    {"decision": "Visibility vs Optimization", "if": "Shippers dont have visibility", "then": "Visibility first", "because": "Cant optimize what you cant see"}
  ]'::jsonb,
  '[
    {"signal": "Integration blocked by IT", "trigger": "Data access issues", "action": "Offer read-only. Build trust first. Escalate to COO if IT blocks", "severity": "critical"},
    {"signal": "Pilot doesnt expand", "trigger": "Not enough value proven", "action": "Document ROI. If cant prove switch to ICP that can", "severity": "warning"},
    {"signal": "Competitor added to incumbent TMS", "trigger": "Feature commoditization", "action": "Go deeper on optimization or broader on visibility", "severity": "critical"}
  ]'::jsonb,
  '[
    {"stage": "pre_seed", "tasks": ["Recruit supply chain veterans", "Get 3-5 pilot commitments", "Build first integration", "Document visibility gaps"]},
    {"stage": "seed", "tasks": ["Launch with 10+ shippers", "Integrate with major TMS", "Prove cost savings", "Build carrier network"]},
    {"stage": "series_a", "tasks": ["100+ shippers in network", "Multi-mode capabilities", "Prove network effects", "Hire enterprise sales"]}
  ]'::jsonb,
  1, true, 'system'
)
ON CONFLICT (industry_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  narrative_arc = EXCLUDED.narrative_arc,
  investor_expectations = EXCLUDED.investor_expectations,
  failure_patterns = EXCLUDED.failure_patterns,
  success_stories = EXCLUDED.success_stories,
  benchmarks = EXCLUDED.benchmarks,
  terminology = EXCLUDED.terminology,
  updated_at = now();
