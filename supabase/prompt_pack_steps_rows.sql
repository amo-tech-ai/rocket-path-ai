INSERT INTO "public"."prompt_pack_steps" ("id", "pack_id", "step_order", "purpose", "prompt_template", "input_schema", "output_schema", "model_preference", "max_tokens", "temperature", "tools", "created_at", "updated_at") VALUES ('14494c25-fc6e-46a4-b870-74c7fb7a2005', 'pack_pivot_exploration', '1', 'Evaluate pivot decision', 'You are an expert in startup pivots. You''ve seen hundreds — some brilliant (Slack, YouTube, Instagram) and some disastrous.

**Types of Pivot:**
| Type | Description | Example |
|------|-------------|----------|
| Customer segment | Same product, different customer | Slack: gaming → enterprise |
| Problem | Same customer, different problem | Instagram: check-ins → photos |
| Solution | Same problem, different solution | YouTube: dating → video |
| Channel | Same product, different distribution | Warby Parker: retail → DTC |
| Revenue model | Same product, different monetization | Flickr: storage → ads |
| Technology | Same market, different tech | Netflix: DVD → streaming |

**When to Pivot:**
- Consistent negative signal from customers
- Unable to find repeatable customer acquisition
- Unit economics don''t work even at scale
- Market timing is off
- Founder energy is depleted

**When NOT to Pivot:**
- Giving up too early (<6 months of real effort)
- Pivoting to escape hard work
- Following competitor instead of customers
- Pivoting without new data

**Current Situation:**
Company: {{company_name}}
Current product: {{current_product}}
Current metrics: {{current_metrics}}
Challenges: {{challenges}}
New data/learnings: {{new_learnings}}

Analyze and provide pivot recommendation.', '{"challenges":"string","company_name":"string","new_learnings":"string","current_metrics":"string","current_product":"string"}', '{"30_day_plan":"array","what_to_keep":"array","what_to_change":"array","risk_assessment":"array","pivot_recommendation":"string","recommended_pivot_type":"string"}', 'claude', '3000', '0.50', '[]', '2026-01-30 01:50:08.547912+00', '2026-01-30 01:50:08.547912+00'), ('15b5de1b-dad4-49aa-82cb-c462af50eb45', 'pack_investor_lens', '1', 'Simulate VC partner questions', 'You are a seasoned VC partner who has seen 1,000 pitches a year for 15 years.

**Core VC Questions (with hidden meaning):**

| Question | What Investor Wants to Know |
|----------|-----------------------------------|
| "Why are you the right person?" | Unfair advantage or just enthusiasm? |
| "What''s your biggest weakness?" | Self-aware or delusional? |
| "Why hasn''t anyone solved this before?" | Is this really a problem? |
| "What happens if Google does this?" | Understand competitive dynamics? |
| "How do you acquire customers?" | Repeatable GTM or just hope? |
| "What are your unit economics?" | Does the math work? |
| "Why are you raising this amount?" | Know what you''re doing with money? |
| "What scares you most?" | Realistic about risks? |

**Red Flag Signals:**
- Defensive responses (insecurity)
- Unable to articulate competition (naive)
- No metrics or making up numbers (unprepared)
- "We have no competition" (instant credibility kill)

**Founder''s Pitch:**
Company: {{company_name}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Traction: {{traction_metrics}}
Ask: {{fundraise_amount}}

Ask 5-7 hard questions. Rate each answer: Strong / Adequate / Weak / Deal-killer.', '{"company_name":"string","fundraise_amount":"string","solution_summary":"string","traction_metrics":"string","problem_statement":"string"}', '{"top_3_fixes":"array","answer_ratings":"array","killer_question":"string","questions_asked":"array","practice_recommendation":"string","investor_readiness_score":"number"}', 'claude', '3000', '0.60', '[]', '2026-01-30 01:50:08.547912+00', '2026-01-30 01:50:08.547912+00'), ('1c06e49c-98b6-412d-9246-32e3da6d27fd', 'pack_customer_archetype', '1', 'Who buys first', 'Identify who buys first for: {{product_description}}', '{"product_description":"string"}', '{"primary_segment":"object"}', 'gemini', '1500', '0.40', '[]', '2026-01-30 01:15:40.398554+00', '2026-01-30 01:15:40.398554+00'), ('20adc215-7276-43f8-be9e-fe16237ec2bc', 'pack_founder_fit', '3', 'Blind Spot Checklist', 'Based on building a {{business_category}} product for {{target_user}}, list 5 likely cognitive biases I may face.

For each: Bias Name, How it shows up, Why it matters, Safeguard to limit it.', '{}', '{"type":"object","properties":{"biases_list":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('2379db8f-881e-4e61-8f43-15e70443a2fe', 'pack_customer_validation', '1', 'Extract truth with commitment ladder', 'You are an expert in validating customer demand following The Mom Test.

**The Mom Test Principles:**
1. Talk about their life, not your idea
2. Ask about the past, not hypotheticals
3. Talk less, listen more
4. Seek commitment and advancement, not compliments

**Commitment Ladder (weak → strong):**
| Level | Signal | Value |
|-------|--------|-------|
| 1 | "That sounds cool" | Worthless |
| 2 | "I''d definitely use that" | Weak |
| 3 | "Email me when it''s ready" | Moderate |
| 4 | "Can I join beta?" | Good |
| 5 | "Here''s my email and phone" | Strong |
| 6 | "I''ll pay $X when you have it" | Very strong |
| 7 | "Here''s my credit card" | Validated |
| 8 | "Here''s a letter of intent" | Gold |

**Customer Context:**
Customer segment: {{customer_segment}}
Product concept: {{product_concept}}
Interview notes: {{interview_notes}}

Analyze and provide demand validation score with commitment signals.', '{"interview_notes":"string","product_concept":"string","customer_segment":"string"}', '{"red_flags":"array","demand_score":"number","commitment_level":"number","next_steps_earned":"array","price_sensitivity":"object","commitment_signals":"array"}', 'claude', '2500', '0.50', '[]', '2026-01-30 01:49:32.579226+00', '2026-01-30 01:49:32.579226+00'), ('238f9cd4-f821-44f1-aaa2-95ee2f0bec30', 'pack_industry_validation', '1', 'Check for failure patterns', 'Analyze startup for failure patterns', '{"startup_profile":"object"}', '{"patterns_detected":"array"}', 'claude', '2000', '0.30', '[]', '2026-01-30 01:16:15.145594+00', '2026-01-30 01:16:15.145594+00'), ('2c4585e8-d9cb-4245-8b01-6b43d21448fc', 'pack_pitch_narrative', '1', 'Build compelling pitch narrative', 'You are building the storytelling structure that creates investor belief.

**Startup Story Arc:**
| Act | Purpose | Emotion |
|-----|---------|----------|
| Act 1: Setup | Establish the world, the problem | Tension |
| Act 2: Conflict | Show current solutions fail | Frustration |
| Act 3: Hero | Introduce you and your solution | Hope |
| Act 4: Proof | Show traction and metrics | Belief |
| Act 5: Vision | Paint the future | Excitement |
| Act 6: Ask | Call to action | Commitment |

**Company Information:**
Company: {{company_name}}
Founder story: {{founder_story}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Market timing: {{why_now}}
Traction: {{traction_metrics}}
Vision: {{vision}}
Ask: {{fundraise_amount}}

Build the complete narrative arc.', '{"vision":"string","why_now":"string","company_name":"string","founder_story":"string","fundraise_amount":"string","solution_summary":"string","traction_metrics":"string","problem_statement":"string"}', '{"opening_hook":"string","narrative_arc":"object","emotional_beats":"array","story_variations":"object","closing_statement":"string"}', 'claude', '3500', '0.60', '[]', '2026-01-30 02:20:50.774785+00', '2026-01-30 02:20:50.774785+00'), ('2f34ed7c-8dc3-4380-b498-579f9519008f', 'pack_investor_outreach', '1', 'Target Investor List', 'I''m building a {{industry}} company at {{current_stage}} stage in {{geography}}.

Return a Markdown table with 10 investors:
| Investor Name | Stage Focus | Sector Focus | Geography | Why They''re a Fit |', '{}', '{"type":"object","properties":{"investor_list":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('365e697e-10a1-44d9-b6fb-e040142f0739', 'pack_industry_pitch', '3', 'Prepare for investor questions', 'Prepare Q&A', '{"startup_profile":"object"}', '{"prepared_answers":"array"}', 'claude', '2500', '0.40', '[]', '2026-01-30 01:16:15.145594+00', '2026-01-30 01:16:15.145594+00'), ('3bc3a23d-56bd-403a-9e24-43b931e27e37', 'pack_fundraising_readiness', '1', 'Calculate readiness score', 'You are a fundraising expert who has raised $200M+ across 50+ rounds.

**Readiness Requirements by Round:**

| Round | Minimum Requirements | Nice to Have | Red Flags |
|-------|---------------------|--------------|----------|
| **Pre-Seed** | Strong team, clear problem, MVP | Early signal | No relevant experience |
| **Seed** | Working product, 100+ users, early retention | $10K+ MRR, 20%+ MoM | No users, theoretical |
| **Series A** | PMF proven, $1M+ ARR, 100%+ growth | NRR >100%, CAC payback <12mo | Unclear PMF, high churn |

**Readiness Score Calculator:**
| Criterion | Weight |
|-----------|--------|
| Team quality | 25% |
| Market size | 15% |
| Traction | 20% |
| Product-market fit | 20% |
| Unit economics | 10% |
| Competitive position | 10% |

**Scoring Guide:** 9-10: Ready now | 7-8: Almost ready (2-3 months) | 5-6: Significant gaps (6+ months) | <5: Not ready

**Company Information:**
Company: {{company_name}}
Stage: {{current_stage}}
Target round: {{target_round}}
Team: {{team_summary}}
Market: {{market_size}}
Traction: {{traction_metrics}}
PMF signals: {{pmf_signals}}
Unit economics: {{unit_economics}}
Competition: {{competitive_position}}

Calculate readiness score with detailed breakdown.', '{"market_size":"string","pmf_signals":"string","company_name":"string","target_round":"string","team_summary":"string","current_stage":"string","unit_economics":"string","traction_metrics":"string","competitive_position":"string"}', '{"gap_analysis":"array","recommendation":"string","readiness_score":"number","score_breakdown":"object","valuation_range":"string","timeline_to_ready":"string","raise_amount_range":"string"}', 'claude', '3000', '0.40', '[]', '2026-01-30 01:50:44.760216+00', '2026-01-30 01:50:44.760216+00'), ('4018ecf6-a224-492b-bd1b-c1fea8e2f1ed', 'pack_gtm_strategy', '1', 'Channel strategy', 'Suggest best marketing channels for: {{business_name}} targeting {{target_audience}}', '{"business_name":"string","target_audience":"string"}', '{"channels":"array"}', 'gemini', '1800', '0.40', '[]', '2026-01-30 01:15:40.398554+00', '2026-01-30 01:15:40.398554+00'), ('40f54dfa-445c-4424-a04d-0fb1cd09a279', 'pack_founder_deep_dive', '1', 'Assess founder-market fit dimensions', 'You are an expert in evaluating founder-market fit. You''ve seen thousands of founders.

**Founder-Market Fit Dimensions:**

| Dimension | Green Light | Red Flag |
|-----------|-------------|----------|
| **Personal Connection** | Lived the problem | Read about it |
| **Domain Expertise** | Built systems, 10 years | Researched 3 months |
| **Network Access** | Former colleagues | Cold outreach only |
| **Unique Insight** | Contrarian with evidence | Consensus with hope |
| **Commitment Level** | Quit job, invested savings | Side project |

**Founder Information:**
Name: {{founder_name}}
Background: {{founder_background}}
Problem: {{problem_statement}}

Conduct the interview:
1. "How did you first encounter this problem?"
2. "What''s the last thing you learned about this space?"
3. "Who have you talked to about this in the last month?"
4. "What do you believe that most people disagree with?"
5. "What have you given up to work on this?"

Provide founder-market fit score with detailed breakdown.', '{"founder_name":"string","problem_statement":"string","founder_background":"string"}', '{"verdict":"string","fit_score":"number","gaps_and_risks":"array","network_access":"object","unique_insight":"object","commitment_level":"object","domain_expertise":"object","unfair_advantage":"string","personal_connection":"object"}', 'claude', '3000', '0.50', '[]', '2026-01-30 01:49:32.579226+00', '2026-01-30 01:49:32.579226+00'), ('43fbafcb-3317-4ef2-8799-ae7f2b30b50a', 'pack_early_stage_guide', '1', 'Create idea-to-validation roadmap', 'You are guiding a founder through the early stages.

**Idea Stage Focus (0→1):**
- Primary: Validate real problem exists
- Secondary: Develop solution hypothesis
- Tertiary: Build something to get reactions

**Idea Stage Milestones:**
| Week | Milestone | Exit Criteria |
|------|-----------|---------------|
| 1-2 | Problem Hypothesis | Clear problem, customer profile |
| 3-4 | Problem Interviews | 20+ validated conversations |
| 5-6 | Solution Hypothesis | Clear solution direction |
| 7-8 | MVP Spec | Buildable in <4 weeks |
| 9-12 | MVP Build | Working prototype |

**Current Situation:**
Stage: {{current_stage}}
Progress: {{progress_summary}}
Challenges: {{challenges}}

Create the stage-appropriate roadmap.', '{"challenges":"string","current_stage":"string","progress_summary":"string"}', '{"roadmap":"array","mvp_scope":"object","pmf_scorecard":"object","customer_development_plan":"object","pivot_persevere_recommendation":"string"}', 'gemini', '3000', '0.40', '[]', '2026-01-30 02:21:28.126431+00', '2026-01-30 02:21:28.126431+00'), ('4445e935-2264-415c-bdbc-f8aeb6526d8a', 'pack_canvas_metrics_advantage', '1', 'Define key metrics with AARRR framework', 'You are building the Key Metrics box of the Lean Canvas.

**Pirate Metrics (AARRR):**
| Stage | Metric | Definition | Benchmark |
|-------|--------|------------|----------|
| Acquisition | Visitors, signups | How they find you | Varies |
| Activation | First value moment | When they get it | Day 1: 40%+ |
| Retention | Return rate | Do they come back | Week 4: 20%+ |
| Revenue | Conversion, ARPU | Do they pay | Trial > Paid: 5-10% |
| Referral | NPS, viral K | Do they share | NPS > 40 |

**Context:**
Business: {{business_description}}
Industry: {{industry}}
Stage: {{stage}}

Define key metrics with benchmarks.', '{"stage":"string","industry":"string","business_description":"string"}', '{"omtm":"object","alert_thresholds":"object","benchmark_targets":"object","dashboard_metrics":"array","reporting_cadence":"object"}', 'gemini', '2000', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('4c0aa921-8074-46b0-869b-793b2732ed90', 'pack_pitch_deck_generation', '1', 'Generate complete 10-slide deck structure', 'You are a former VC partner and pitch deck specialist who has reviewed 5,000+ decks and helped companies raise $500M+.

**The 10-Slide Standard:**
| Slide | Purpose | Key Elements |
|-------|---------|-------------|
| 1. Cover | Hook + credibility | Company name, one-liner, logo |
| 2. Problem | Create tension | Specific pain, quantified cost |
| 3. Solution | Release tension | How you solve it, demo |
| 4. Market | Show opportunity | TAM/SAM/SOM, growth rate |
| 5. Product | Show what you built | Screenshots, differentiation |
| 6. Traction | Prove it works | Revenue, users, growth rate |
| 7. Business Model | Show the money | How you make money, unit economics |
| 8. Competition | Show awareness | Matrix or positioning map |
| 9. Team | Build trust | Relevant experience |
| 10. Ask | Close the deal | Amount, use of funds, milestones |

**Company Information:**
Company: {{company_name}}
One-liner: {{one_liner}}
Industry: {{industry}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Market: {{market_size}}
Traction: {{traction_metrics}}
Team: {{team_summary}}
Ask: {{fundraise_amount}}
Use of funds: {{use_of_funds}}

Generate the complete deck structure with content for each slide.', '{"industry":"string","one_liner":"string","market_size":"string","company_name":"string","team_summary":"string","use_of_funds":"string","fundraise_amount":"string","solution_summary":"string","traction_metrics":"string","problem_statement":"string"}', '{"slides":"array","speaker_notes":"array","red_flags_to_avoid":"array","visual_recommendations":"array"}', 'claude', '5000', '0.50', '[]', '2026-01-30 02:20:50.774785+00', '2026-01-30 02:20:50.774785+00'), ('517ec092-81b8-40c9-80d5-fb7c0f8c1a8b', 'pack_product_strategy', '2', 'Build 12-Month Roadmap', 'I''m building a product that helps {{target_user}} solve {{core_problem}}. Our main goals for the next 12 months are: {{top_goals}}.

Using this and the solution goals from the previous step, return a roadmap table with:
| Feature or Initiative | Priority | Timeline | Resources Needed | Success Metric |', '{}', '{"type":"object","properties":{"roadmap_table":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('571b41cc-d25e-4a21-b959-f5ab25765abb', 'pack_early_stage_guide', '2', 'Assess PMF and provide recommendations', 'You are assessing product-market fit for a startup.

**PMF Assessment Framework:**

**The Sean Ellis Test:**
"How would you feel if you could no longer use [product]?"
- Very disappointed: >40% = PMF ✓
- Somewhat disappointed: 40-50%
- Not disappointed: <40% = No PMF

**Current Metrics:**
Retention: {{retention_rate}}
NPS: {{nps_score}}
Organic growth: {{organic_growth}}
Customer feedback: {{customer_feedback}}

Provide PMF assessment with gap analysis.', '{"nps_score":"string","organic_growth":"string","retention_rate":"string","customer_feedback":"string"}', '{"pmf_score":"number","6_month_plan":"object","gap_analysis":"array","pmf_achieved":"boolean","recommendations":"array"}', 'gemini', '2500', '0.40', '[]', '2026-01-30 02:21:28.126431+00', '2026-01-30 02:21:28.126431+00'), ('57a5d237-023b-4ee4-ac16-5e97c7fbf296', 'pack_oneliner_profile', '2', 'Assemble complete startup profile', 'You are assembling the complete startup profile from onboarding.

**Profile Schema:**
| Field | Source | Used In |
|-------|--------|--------|
| industry_id | Industry selection | All flows, knowledge injection |
| sub_industry | Industry selection | Specific benchmarks |
| problem_statement | Problem discovery | Canvas, Pitch |
| customer_profile | Problem discovery | Canvas, Pitch |
| pain_quantification | Problem discovery | Validation, Pitch |
| why_now | Problem discovery | Pitch |
| founder_fit_score | Fit assessment | Internal |
| unfair_advantages | Fit assessment | Pitch, Canvas |
| one_liner | One-liner generation | Pitch, Canvas, everywhere |
| elevator_pitch | One-liner generation | Pitch, outreach |

**Profile Data:**
Industry: {{industry_id}}
Sub-industry: {{sub_industry}}
Problem: {{problem_statement}}
Customer: {{customer_profile}}
Quantification: {{pain_quantification}}
Why now: {{why_now}}
Founder fit: {{founder_fit_score}}
Advantages: {{unfair_advantages}}
One-liner: {{one_liner}}
Elevator pitch: {{elevator_pitch}}

Assemble and validate the complete profile.', '{"why_now":"string","one_liner":"string","industry_id":"string","sub_industry":"string","elevator_pitch":"string","customer_profile":"string","founder_fit_score":"string","problem_statement":"string","unfair_advantages":"string","pain_quantification":"string"}', '{"next_steps":"array","pitch_prefill":"object","canvas_prefill":"object","missing_fields":"array","complete_profile":"object","completeness_score":"number"}', 'gemini', '2500', '0.40', '[]', '2026-01-30 02:22:17.528277+00', '2026-01-30 02:22:17.528277+00'), ('57b95cd3-0f6d-44aa-a192-9c72a89a3035', 'pack_due_diligence_prep', '1', 'Generate DD checklist and timeline', 'You are preparing a founder for due diligence.

**Due Diligence Checklist:**
| Category | Documents | Priority |
|----------|-----------|----------|
| **Corporate** | Incorporation, bylaws, cap table | Must have |
| **Financial** | P&L, balance sheet, projections | Must have |
| **Legal** | IP assignments, employment agreements | Must have |
| **Product** | Demo, architecture, roadmap | Important |
| **Customer** | Customer list, case studies, churn | Important |
| **Team** | Org chart, key bios, references | Important |

**Common DD Issues:**
| Issue | Impact | Fix |
|-------|--------|-----|
| Messy cap table | Delay or kill deal | Use Carta, clean up |
| IP not assigned | Deal killer | Get assignment docs |
| No founder vesting | Red flag | Add reverse vesting |
| Outstanding lawsuits | Major concern | Disclose and explain |

**DD Timeline:**
| Phase | Duration |
|-------|----------|
| Initial request | Day 1 |
| Document gathering | Days 1-7 |
| VC review | Days 7-14 |
| Questions | Days 14-21 |
| Reference calls | Days 14-21 |
| Legal DD | Days 21-28 |
| Close | Days 28-35 |

**Current Situation:**
Company: {{company_name}}
Stage: {{stage}}
Existing docs: {{existing_docs}}
Known issues: {{known_issues}}

Generate personalized DD checklist with status tracker.', '{"stage":"string","company_name":"string","known_issues":"string","existing_docs":"string"}', '{"timeline":"object","dd_checklist":"array","missing_docs":"array","reference_prep":"object","issue_remediation":"array","data_room_structure":"object"}', 'claude', '3000', '0.40', '[]', '2026-01-30 01:51:50.745761+00', '2026-01-30 01:51:50.745761+00'), ('5a95d2cc-5e29-4cee-9cce-9dfcd139d43e', 'pack_founder_fit_assessment', '1', 'Assess founder-market fit', 'You are assessing founder-market fit.

**Fit Dimensions:**
| Dimension | Questions | Scoring |
|-----------|-----------|--------|
| Personal Connection | "Why do YOU care?" | 1-10 |
| Domain Expertise | "What specific experience?" | 1-10 |
| Network Access | "Who can you reach?" | 1-10 |
| Unique Insight | "What do you believe others do not?" | 1-10 |
| Commitment Level | "What have you sacrificed?" | 1-10 |

**Founder Information:**
Name: {{founder_name}}
Background: {{founder_background}}
Problem: {{problem_statement}}
Connection to problem: {{connection_to_problem}}

Assess founder-market fit with scoring.', '{"founder_name":"string","problem_statement":"string","founder_background":"string","connection_to_problem":"string"}', '{"gaps":"array","verdict":"string","fit_score":"number","advantages":"array","score_breakdown":"object","enhancement_suggestions":"array"}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:22:17.528277+00', '2026-01-30 02:22:17.528277+00'), ('5d81d4df-3182-46aa-8dd4-790ce76009ca', 'pack_fundraising_readiness', '2', 'Readiness Audit', 'Based on our traction: {{current_traction}}, perform an investment readiness check. 

Return a Markdown table with:
| Area | Strengths | Gaps | Why It Matters to Investors |
Cover competitive position, financial health, and scalability.', '{}', '{"type":"object","properties":{"readiness_table":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('69424ca4-89a1-4b71-b72a-ddd390d8ffd9', 'pack_channel_strategy', '1', 'Build channel strategy with playbooks', 'You are building a channel acquisition strategy.

**Channel Categories:**
| Category | Channels | Best For | CAC Range |
|----------|----------|----------|----------|
| Inbound | SEO, content, social | Long-term, low CAC | $50-$300 |
| Outbound | Cold email, cold call, LinkedIn | Faster, higher CAC | $200-$1000+ |
| Product-led | Freemium, viral, referral | Volume, very low CAC | $10-$100 |
| Paid | Google, Facebook, LinkedIn ads | Fast, scalable | $100-$500+ |
| Partners | Integrations, affiliates | Borrowed audiences | Revenue share |
| Events | Conferences, webinars | High-touch, enterprise | $500-$2000 |

**Context:**
Business: {{business_description}}
Industry: {{industry}}
ICP: {{icp_summary}}
Budget: {{marketing_budget}}
Timeline: {{timeline}}

Build channel strategy.', '{"industry":"string","timeline":"string","icp_summary":"string","marketing_budget":"string","business_description":"string"}', '{"cac_targets":"object","channel_playbooks":"array","90_day_experiments":"array","channel_mix_budget":"object","channel_prioritization":"array"}', 'gemini', '3500', '0.40', '[]', '2026-01-30 02:22:16.756066+00', '2026-01-30 02:22:16.756066+00'), ('6970195c-b176-407f-91b1-ed27c711ed22', 'pack_canvas_solution_revenue', '1', 'Map features to problems and outcomes', 'You are building the Solution box of the Lean Canvas.

**Feature ↔ Problem Mapping:**
| Problem | Feature | Outcome | Metric |
|---------|---------|---------|--------|
| 8 hrs/week on invoicing | Auto-invoice generation | Save 7 hrs/week | Time saved |

**Context:**
Problems: {{problems}}
Customer: {{customer_segment}}
Business: {{business_description}}

Define top 3 features with problem-outcome-metric chain.', '{"problems":"string","customer_segment":"string","business_description":"string"}', '{"feature_1":"object","feature_2":"object","feature_3":"object","mvp_scope":"array","build_vs_buy":"object"}', 'gemini', '2000', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('6edc8232-aa45-4249-9ea1-cf9ea5d8ea42', 'pack_icp_definition', '1', 'Define ICP with 5 layers', 'You are defining the Ideal Customer Profile.

**ICP Framework — The 5 Layers:**
| Layer | What to Define | Example |
|-------|----------------|--------|
| Firmographics | Company characteristics | B2B, 2-10 employees, <$2M revenue |
| Demographics | Person characteristics | Founder/CEO, 25-40 years old |
| Psychographics | Mindset and values | Growth-oriented, time-poor |
| Technographics | Tools they use | Notion, Slack, Stripe |
| Behavioral | Actions they take | Posts weekly, attends meetups |

**Business Context:**
Business: {{business_description}}
Product: {{product_summary}}
Existing customers: {{existing_customers}}
Industry: {{industry}}

Define ICP with scoring criteria.', '{"industry":"string","product_summary":"string","existing_customers":"string","business_description":"string"}', '{"icp_document":"object","anti_personas":"array","where_to_find":"array","icp_interview_script":"array","qualification_criteria":"object"}', 'gemini', '3000', '0.40', '[]', '2026-01-30 02:22:16.756066+00', '2026-01-30 02:22:16.756066+00'), ('708b21ae-5b1b-4b3e-b265-5c43d14636e2', 'pack_onboarding_discovery', '2', 'Extract deep problem statement', 'You are extracting a deep, validated problem statement.

**Problem Discovery Framework:**
| Layer | Question | Purpose |
|-------|----------|--------|
| Surface | "What problem are you solving?" | Get initial framing |
| Who | "Who has this problem?" | Identify customer |
| Struggle | "What is the biggest frustration?" | Find pain point |
| Impact | "What does this cost them?" | Quantify pain |
| Frequency | "How often does this happen?" | Assess urgency |
| Alternatives | "What do they do today?" | Understand landscape |
| Why now | "Why has this not been solved?" | Find timing |

**Initial Input:**
Industry: {{industry_id}}
Business: {{business_description}}
Problem description: {{raw_problem}}

Extract and sharpen the problem statement.', '{"industry_id":"string","raw_problem":"string","business_description":"string"}', '{"why_now":"string","customer_profile":"object","problem_statement":"string","pain_quantification":"object","current_alternatives":"array","validation_confidence":"number"}', 'claude', '2000', '0.50', '[]', '2026-01-30 02:22:17.528277+00', '2026-01-30 02:22:17.528277+00'), ('70cc64aa-87f3-4686-8888-fa360f4bc5c4', 'pack_investor_outreach', '2', 'Use of Funds (3 Buckets)', 'We are raising {{raise_amount}} for {{round_type}}. Main uses: {{capital_use_areas}}.

Split the raise into 3 simple buckets with percentages (e.g. 50% Product & Eng, 30% Growth, 20% Ops). Give 2-3 concrete examples for each bucket.', '{}', '{"type":"object","properties":{"funds_plan":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('7178e76e-a142-470f-8a80-7231ea2e49ee', 'pack_pitch_creation', '1', 'Deck Narrative Structure', 'Develop a 12-slide pitch deck structure for {{startup_name}} targeting {{defined_audience}}. 

Include: Cover, Problem, Solution, Market, Business Model, Traction, GTM, Competition, Financials, Team, Vision, The Ask. Give bullet points for what each slide should say.', '{}', '{"type":"object","properties":{"deck_outline":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('74678fd8-7b51-4f55-9c23-29244afc5931', 'pack_canvas_metrics_advantage', '2', 'Model cost structure and unit economics', 'You are building the Cost Structure box of the Lean Canvas.

**Cost Categories:**
| Category | Examples | Fixed/Variable |
|----------|----------|----------------|
| People | Salaries, contractors | Fixed (semi) |
| Technology | Cloud, tools, APIs | Variable |
| Marketing | Ads, content, events | Variable |
| Operations | Office, legal, accounting | Fixed |
| COGS | Hosting per user, support | Variable |

**Context:**
Business: {{business_description}}
Revenue model: {{revenue_model}}

Model the cost structure with unit economics.', '{"revenue_model":"string","business_description":"string"}', '{"fixed_costs":"object","unit_economics":"object","variable_costs":"object","runway_estimate":"string","first_year_total":"object"}', 'gemini', '2500', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('74ca6ced-3343-4664-8030-bc5cba51351a', 'pack_pipeline_management', '1', 'Analyze pipeline and recommend actions', 'You are managing a fundraising pipeline.

**Pipeline Stages:**
| Stage | Definition | Conversion Target |
|-------|------------|-------------------|
| **Lead** | Identified, not contacted | 100% (baseline) |
| **Contacted** | Emailed or intro''d | 50% of leads |
| **Meeting** | Had first meeting | 30% of contacted |
| **Deep Dive** | Multiple meetings, interested | 50% of meetings |
| **DD** | In due diligence | 50% of deep dive |
| **Term Sheet** | Received offer | 50% of DD |
| **Closed** | Signed and wired | 80% of term sheets |

**Timing and Momentum Tactics:**
- Start meetings same week → Create FOMO
- Share progress updates → Social proof
- Create soft deadline → Force decisions
- Run parallel processes → Multiple offers

**Current Pipeline:**
{{pipeline_data}}

**Recent Updates:**
{{recent_updates}}

Analyze pipeline health and recommend next actions.', '{"pipeline_data":"string","recent_updates":"string"}', '{"priority_actions":"array","weekly_checklist":"array","update_email_draft":"string","momentum_assessment":"string","pipeline_health_score":"number","stage_conversion_analysis":"object"}', 'claude', '2500', '0.40', '[]', '2026-01-30 01:51:17.327704+00', '2026-01-30 01:51:17.327704+00'), ('75e01a01-fec5-4883-89ef-1ebddeeb5b6b', 'pack_industry_pitch', '1', 'Check investor expectations', 'Assess pitch readiness', '{"startup_profile":"object"}', '{"readiness_score":"number"}', 'gemini', '1500', '0.30', '[]', '2026-01-30 01:16:15.145594+00', '2026-01-30 01:16:15.145594+00'), ('77e6cebf-bb1d-4882-8a33-d778f41c9bfd', 'pack_industry_pitch', '2', 'Validate terminology', 'Review terminology', '{"content":"string"}', '{"phrases_to_replace":"array"}', 'gemini', '1000', '0.30', '[]', '2026-01-30 01:16:15.145594+00', '2026-01-30 01:16:15.145594+00'), ('77e7d6f3-9594-46c0-9c73-4ded089fdcfb', 'pack_pitch_optimization', '1', 'Persuasion Analysis', 'Review my pitch deck targeting {{defined_audience}}. 

Provide specific recommendations for:
- Problem Urgency
- Product-Market Fit Clarity
- Market Compellingness
- Traction Credibility
- Team Capability', '{}', '{"type":"object","properties":{"critique":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('7a7d2736-ae81-4a65-a602-e715539b8350', 'pack_canvas_metrics_advantage', '3', 'Identify unfair advantage and moat', 'You are building the Unfair Advantage box of the Lean Canvas.

**Moat Types:**
| Type | Description | Strength |
|------|-------------|----------|
| Network effects | Value increases with users | Very strong |
| Switching costs | Painful to leave | Strong |
| Economies of scale | Cheaper at volume | Strong |
| Brand | Trust and recognition | Moderate |
| Data | Proprietary datasets | Strong |

**Context:**
Business: {{business_description}}
Founder background: {{founder_background}}
Industry: {{industry}}

Identify the unfair advantage with roadmap.', '{"industry":"string","founder_background":"string","business_description":"string"}', '{"honest_assessment":"string","how_it_strengthens":"string","competitive_response":"string","primary_unfair_advantage":"string","roadmap_to_defensibility":"array"}', 'gemini', '2000', '0.50', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('81bcf9bf-3863-4355-b7df-9ee45d9ee09b', 'pack_one_liner', '1', 'One-sentence pitch', 'You are a pitch coach. Company: {{company_name}}. Product: {{product_description}}. Write one crisp sentence.', '{"company_name":"string","product_description":"string"}', '{"one_sentence":"string"}', 'claude', '500', '0.40', '[]', '2026-01-30 01:15:40.398554+00', '2026-01-30 01:15:40.398554+00'), ('8ba1f38e-84e6-4e07-8593-1504a421deb3', 'pack_stage_assessment', '1', 'Determine startup stage objectively', 'You are a startup stage expert who has guided 500+ startups from idea to growth.

**The 5 Stages:**
| Stage | Focus | Duration | Exit Criteria |
|-------|-------|----------|---------------|
| 1. Idea | Problem discovery | 1-3 months | Clear problem, solution hypothesis |
| 2. Validation | Product-market fit | 3-12 months | Repeatable customer acquisition |
| 3. Efficiency | Unit economics | 6-18 months | Positive unit economics |
| 4. Growth | Scaling | 1-3 years | Market leadership trajectory |
| 5. Expansion | New markets | Ongoing | Diversified revenue |

**Startup Information:**
Customer interviews: {{customer_interviews}}
Paying customers: {{paying_customers}}
Retention: {{retention_rate}}
Revenue: {{revenue}}
Growth rate: {{growth_rate}}

Determine stage with justification.', '{"revenue":"string","growth_rate":"string","retention_rate":"string","paying_customers":"string","customer_interviews":"string"}', '{"key_gaps":"array","current_stage":"string","stage_completion_pct":"number","stage_appropriate_focus":"array","stage_inappropriate_activities":"array"}', 'gemini', '2500', '0.30', '[]', '2026-01-30 02:21:28.126431+00', '2026-01-30 02:21:28.126431+00'), ('8d8e2df6-32c7-48cd-ae60-c76b827e01c5', 'pack_one_pager', '1', 'Generate investor one-pager', 'You are creating a one-pager that investors will forward.

**One-Pager Structure:**
| Section | Space | Content |
|---------|-------|--------|
| Header | 10% | Logo, name, one-liner, contact |
| Problem + Solution | 25% | 2-3 sentences each |
| Market + Traction | 25% | TAM/SAM, key metrics (3-4 max) |
| Team + Ask | 25% | Key bios (2-3 people), amount + use |
| Footer | 15% | Website, deck link, next steps |

**Company Information:**
Company: {{company_name}}
One-liner: {{one_liner}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Market: {{market_size}}
Traction: {{traction_metrics}}
Team: {{team_summary}}
Ask: {{fundraise_amount}}
Website: {{website}}
Contact: {{contact_info}}

Generate complete one-pager content.', '{"website":"string","one_liner":"string","market_size":"string","company_name":"string","contact_info":"string","team_summary":"string","fundraise_amount":"string","solution_summary":"string","traction_metrics":"string","problem_statement":"string"}', '{"headline_hook":"string","visual_layout":"object","one_pager_content":"object","key_metrics_highlight":"array","forwardable_intro_email":"string"}', 'claude', '2500', '0.50', '[]', '2026-01-30 02:20:50.774785+00', '2026-01-30 02:20:50.774785+00'), ('93f977b4-9b79-47f4-b9c1-e42ca0770f3d', 'pack_investor_targeting', '1', 'Build prioritized investor list', 'You are building a prioritized investor target list.

**Investor Thesis Matching Factors:**
| Factor | Why It Matters |
|--------|----------------|
| **Stage** | Must match your round |
| **Sector** | Must invest in your space |
| **Check size** | Fund size / 20 = typical check |
| **Geography** | Many prefer local |
| **Ownership target** | Affects interest |

**Investor Prioritization (ABC Method):**
| Tier | Criteria | Approach | Volume |
|------|----------|----------|--------|
| **A (Dream)** | Perfect thesis match, value-add | Warm intro only | 10-15 |
| **B (Strong)** | Good match, would take meeting | Warm or strategic cold | 20-30 |
| **C (Maybe)** | Possible but not ideal | Volume cold | 20-30 |

**Company Information:**
Company: {{company_name}}
Industry: {{industry}}
Stage: {{stage}}
Raise amount: {{raise_amount}}
Location: {{location}}
Existing investors: {{existing_investors}}
Warm connections: {{warm_connections}}

Generate investor target list with thesis match scores and intro paths.', '{"stage":"string","industry":"string","location":"string","company_name":"string","raise_amount":"string","warm_connections":"string","existing_investors":"string"}', '{"intro_strategy":"object","tier_a_investors":"array","tier_b_investors":"array","tier_c_investors":"array","outreach_sequence":"array"}', 'claude', '3000', '0.50', '[]', '2026-01-30 01:50:44.760216+00', '2026-01-30 01:50:44.760216+00'), ('96fd21e0-207e-4dc7-a6a7-5036ecfe950a', 'pack_canvas_problem_customer', '3', 'Craft unique value proposition', 'You are crafting the Unique Value Proposition for the Lean Canvas.

**UVP Formula:**
"For [target customer] who [need/want/struggle with], [Product] is a [category] that [key benefit]. Unlike [competitor], we [key differentiator]."

**Context:**
Problems: {{problems}}
Customer: {{customer_segment}}
Business: {{business_description}}

Craft the UVP with support pillars.', '{"problems":"string","customer_segment":"string","business_description":"string"}', '{"primary_uvp":"string","support_pillars":"array","positioning_statement":"string","differentiation_matrix":"object"}', 'gemini', '2000', '0.50', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('98bf72cd-5d1d-44a6-8222-dbf085f54e5d', 'pack_stage_fundraising_readiness', '1', 'Assess fundraising readiness for stage', 'You are assessing fundraising readiness by stage.

**Requirements by Round:**
| Stage | Round | Amount | What Investors Want | Valuation |
|-------|-------|--------|---------------------|----------|
| Idea | Pre-Seed | $100K-$1M | Team, vision, early traction | $2-$10M |
| Validation | Seed | $1M-$4M | PMF signals, retention | $5-$20M |
| Efficiency | Series A | $5M-$15M | Proven PMF, clear scale path | $20-$80M |
| Growth | Series B | $20M-$50M | Scaling metrics, category lead | $100-$400M |

**Current Status:**
Current stage: {{current_stage}}
Target round: {{target_round}}
Team: {{team_summary}}
Product status: {{product_status}}
Traction: {{traction_metrics}}
Retention: {{retention_rate}}
Revenue: {{revenue}}

Assess readiness with gap analysis.', '{"revenue":"string","target_round":"string","team_summary":"string","current_stage":"string","product_status":"string","retention_rate":"string","traction_metrics":"string"}', '{"gaps":"array","readiness_score":"number","timeline_to_ready":"string","investor_targeting":"object","materials_checklist":"array","requirements_checklist":"array"}', 'gemini', '3000', '0.40', '[]', '2026-01-30 02:21:28.126431+00', '2026-01-30 02:21:28.126431+00'), ('9bd9d933-b585-416c-bc87-3b5b0786d26f', 'pack_canvas_problem_customer', '1', 'Define problem with specificity', 'You are a world-class business model architect who has helped 500+ startups build their Lean Canvas.

**Problem Box Guidelines:**
| Element | Great | Weak |
|---------|------|------|
| Specificity | "SMBs spend 8 hrs/week on manual invoicing" | "Invoicing is hard" |
| Quantification | "$4,000/month lost to late payments" | "They lose money" |
| Existing Alternatives | "Spreadsheets, Quickbooks (limited), hiring bookkeeper" | "No good solutions" |
| Urgency | "Happens every week, pain is growing" | "Sometimes annoying" |

**Context:**
Business: {{business_description}}
Industry: {{industry}}
Target Audience: {{target_audience}}

Define the top 1-3 problems with specificity and quantification.', '{"industry":"string","target_audience":"string","business_description":"string"}', '{"problem_1":"object","problem_2":"object","problem_3":"object","urgency_score":"number","existing_alternatives":"array"}', 'gemini', '2000', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('9cc6fcdb-1c38-4962-8432-f1b2379392d8', 'pack_one_liner', '2', 'Tweet-length pitch', 'Condense to tweet length: {{one_sentence}}', '{"one_sentence":"string"}', '{"tweet_pitch":"string"}', 'gemini', '400', '0.40', '[]', '2026-01-30 01:15:40.398554+00', '2026-01-30 01:15:40.398554+00'), ('a6eb5a53-d3dd-45be-a16a-a074cb161db3', 'pack_idea_validation', '1', 'First principles check', 'You are a startup advisor. The founder is building: {{product_description}} for {{target_audience}}.

Break this down into first principles.', '{"target_audience":"string","product_description":"string"}', '{"assumptions":"array","solution_logic":"string","problem_restated":"string"}', 'gemini', '2000', '0.30', '[]', '2026-01-30 01:15:40.398554+00', '2026-01-30 01:15:40.398554+00'), ('a9a738c2-8e8e-424e-ad16-fd50c4fed702', 'pack_sales_motion', '1', 'Design sales motion and funnel', 'You are designing a repeatable sales process.

**Sales Motion Types:**
| Motion | Description | Best For | ACV |
|--------|-------------|----------|-----|
| Self-serve | Customer buys without help | Low complexity | <$500/yr |
| Sales-assisted | Light touch, demos | Medium | $500-$5K/yr |
| Inside sales | Full process, remote | SMB, mid-market | $5K-$50K/yr |
| Field sales | In-person, long cycle | Enterprise | $50K+/yr |
| Product-led + sales | Self-serve with upgrade help | Combo | Variable |

**Context:**
Business: {{business_description}}
ACV: {{acv}}
Current customers: {{current_customers}}
Current sales process: {{current_process}}

Design the sales motion.', '{"acv":"string","current_process":"string","current_customers":"string","business_description":"string"}', '{"sales_funnel":"object","first_sales_hire":"object","playbook_outline":"array","metrics_dashboard":"object","recommended_motion":"object"}', 'gemini', '3500', '0.40', '[]', '2026-01-30 02:22:16.756066+00', '2026-01-30 02:22:16.756066+00'), ('aaca6458-fc66-4211-bbae-81bd161fdc7b', 'pack_round_narrative', '1', 'Build compelling round narrative', 'You are crafting the story that creates investor conviction.

**Round Narrative Framework:**
| Element | Question Answered | Example |
|---------|-------------------|----------|
| **Why us?** | Why is this team going to win? | "We built payments at Stripe for 5 years" |
| **Why now?** | Why is this the right moment? | "Regulation just changed enabling X" |
| **Why this market?** | Why is this opportunity attractive? | "$50B market growing 30% annually" |
| **Why this product?** | Why does your solution win? | "Only platform that does X, Y, Z" |
| **Why this round?** | Why raise this amount now? | "To hit $3M ARR and raise Series A" |

**Narrative Arc:**
| Beat | Content | Emotional Goal |
|------|---------|----------------|
| **Hook** | Bold claim or surprising fact | Attention |
| **Problem** | The pain that exists | Empathy |
| **Villain** | Why current solutions fail | Frustration |
| **Hero** | Your solution arrives | Hope |
| **Evidence** | Traction and proof | Belief |
| **Vision** | Where this goes | Excitement |
| **Ask** | What you need | Commitment |

**Handling Objections:**
| Objection | Response |
|-----------|----------|
| "Too early" | Show momentum, de-risk |
| "Too crowded" | Show differentiation |
| "Team unproven" | Show experience, advisors |
| "Valuation high" | Show comps, justify |

**Company Information:**
Company: {{company_name}}
Team background: {{team_background}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Market: {{market_size}}
Traction: {{traction_metrics}}
Raise: {{raise_amount}}
Use of funds: {{use_of_funds}}

Build the complete round narrative.', '{"market_size":"string","company_name":"string","raise_amount":"string","use_of_funds":"string","team_background":"string","solution_summary":"string","traction_metrics":"string","problem_statement":"string"}', '{"full_narrative":"string","why_us_why_now":"object","elevator_pitch_30s":"string","key_talking_points":"array","elevator_pitch_2min":"string","elevator_pitch_5min":"string","objection_responses":"object"}', 'claude', '4000', '0.60', '[]', '2026-01-30 01:52:14.74018+00', '2026-01-30 01:52:14.74018+00'), ('ac46565a-2694-4990-a2ea-531211482b83', 'pack_canvas_solution_revenue', '3', 'Design revenue model and pricing', 'You are building the Revenue Streams box of the Lean Canvas.

**Revenue Model Types:**
| Model | How It Works | Best For |
|-------|--------------|----------|
| Subscription | Recurring monthly/annual | Ongoing value delivery |
| Transaction fee | % of each transaction | Payment enablement |
| Usage-based | Pay per use | Variable consumption |
| Freemium | Free + premium | High volume, conversion funnel |

**Context:**
Business: {{business_description}}
Industry: {{industry}}
Solution: {{solution_summary}}

Design the revenue model with pricing tiers.', '{"industry":"string","solution_summary":"string","business_description":"string"}', '{"ltv_estimate":"object","pricing_tiers":"array","year_1_forecast":"object","primary_revenue_model":"object","monetization_experiments":"array"}', 'gemini', '2500', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('ae11fbfb-6411-469d-99ec-f7c9708d280a', 'pack_industry_validation', '2', 'Compare against benchmarks', 'Compare metrics to benchmarks', '{"startup_metrics":"object"}', '{"comparisons":"array"}', 'gemini', '1500', '0.30', '[]', '2026-01-30 01:16:15.145594+00', '2026-01-30 01:16:15.145594+00'), ('afdca5c4-509a-4194-b2fb-62796ee8acac', 'pack_founder_fit', '2', 'Skill Inventory & Market Gaps', 'Hard/Soft Skills: {{skills}}
Target Industry: {{industry}}

Return a Markdown table:
| Skill | Market Demand | Role/Use Case | Gaps/Next Steps |', '{}', '{"type":"object","properties":{"skill_table":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('b060b17e-026c-4fbd-bf88-48f5a9f8fed6', 'pack_discovery_interview', '2', 'Quantify the impact', 'You are continuing a discovery interview. The user has described their pain point.

**Level 2 — Quantify the impact:**
Based on their response: {{pain_response}}

Ask questions to quantify:
- "How much time did that take?"
- "What did that cost you?"
- "What couldn''t you do because of this?"

Probe for specific numbers, not vague estimates.', '{"pain_response":"string"}', '{"time_cost":"string","financial_cost":"string","opportunity_cost":"string"}', 'claude', '1500', '0.50', '[]', '2026-01-30 01:48:59.941591+00', '2026-01-30 01:48:59.941591+00'), ('b68fe54e-24f6-4f11-8193-a9d7a37f1433', 'pack_canvas_problem_customer', '2', 'Identify customer segments and beachhead', 'You are continuing to build the Lean Canvas.

**Customer Segmentation Framework:**
| Level | Questions | Example |
|------|-----------|--------|
| Macro | What industry? | B2B SaaS |
| Meso | What company size/stage? | Seed-stage startups |
| Micro | What specific role? | First-time solo founders |
| Psychographic | What mindset? | Bootstrapping, scrappy, time-poor |
| Behavioral | What actions? | Already using 3+ tools, active on Twitter |

**Problems Identified:**
{{problems}}

Business: {{business_description}}

Define the beachhead customer segment with precision.', '{"problems":"string","business_description":"string"}', '{"tam_sam_som":"object","expansion_path":"array","beachhead_segment":"object","early_adopter_profile":"object"}', 'gemini', '2000', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('b8c61934-266d-4d4e-89fc-f9436ac09797', 'pack_onboarding_discovery', '1', 'Classify industry and sub-vertical', 'You are a startup onboarding expert who has onboarded 10,000+ founders.

**Industry Hierarchy:**
| Industry | Sub-Industries |
|----------|----------------|
| FinTech | Payments, Lending, InsurTech, WealthTech, Banking, RegTech, Crypto |
| Healthcare | HealthTech, MedTech, BioTech, Mental Health, Digital Health, Pharma |
| SaaS | B2B, B2C, Vertical SaaS, Horizontal SaaS, DevTools, ProductOps |
| Marketplace | B2C, B2B, P2P, On-demand, Vertical |
| EdTech | K-12, Higher Ed, Corporate Training, Skill-based, Language |
| Consumer | E-commerce, Social, Entertainment, Gaming, Lifestyle |
| Enterprise | Security, Data, Analytics, Collaboration, HR, Finance |
| Climate | Energy, AgTech, CleanTech, Carbon, Mobility |
| PropTech | Residential, Commercial, Construction, Property Management |
| Logistics | Supply Chain, Last Mile, Freight, Warehousing |
| AI/ML | Infrastructure, Applications, Vertical AI, Agents |
| Hardware | Consumer, Industrial, IoT, Robotics |

**Business Description:**
{{business_description}}

Classify the industry and sub-vertical, then load appropriate industry context.', '{"business_description":"string"}', '{"industry_id":"string","sub_industry":"string","industry_context":"object","next_step_guidance":"string"}', 'gemini', '1500', '0.20', '[]', '2026-01-30 02:22:17.528277+00', '2026-01-30 02:22:17.528277+00'), ('c10b307d-eca9-438d-bd6f-367064bd6e6b', 'pack_gtm_strategy_builder', '1', 'Build complete GTM strategy', 'You are a GTM expert who has led GTM for 100+ product launches and managed $50M+ in marketing spend.

**GTM Strategy Framework:**
| Section | Purpose | Key Decisions |
|---------|---------|---------------|
| Target Market | Who we are selling to | ICP, segments, prioritization |
| Positioning | How we are different | Value prop, competitive position |
| Channels | How we reach them | Channel mix, prioritization |
| Messaging | What we say | Key messages, proof points |
| Pricing | What we charge | Model, tiers |
| Sales Motion | How we sell | Self-serve, assisted, enterprise |
| Launch Plan | How we enter | Timeline, milestones |

**Company Information:**
Business: {{business_description}}
Industry: {{industry}}
Target audience: {{target_audience}}
Product: {{product_summary}}
Current traction: {{traction}}
Budget: {{marketing_budget}}

Create complete GTM strategy with 90-day plan.', '{"industry":"string","traction":"string","product_summary":"string","target_audience":"string","marketing_budget":"string","business_description":"string"}', '{"90_day_plan":"array","channel_mix":"object","key_metrics":"array","gtm_strategy":"object","risk_assessment":"array"}', 'gemini', '4000', '0.40', '[]', '2026-01-30 02:22:16.756066+00', '2026-01-30 02:22:16.756066+00'), ('c3fe9247-3a9e-4b07-9df4-55cf519ba543', 'pack_outreach_strategy', '1', 'Generate outreach templates', 'You are crafting investor outreach that gets meetings.

**Outreach Hierarchy (Best to Worst):**
| Type | Response Rate |
|------|---------------|
| Portfolio founder intro | 60-80% |
| Mutual investor intro | 40-60% |
| Mutual connection intro | 30-50% |
| Operating exec intro | 20-40% |
| Cold email | 5-15% |
| Cold LinkedIn | 3-10% |

**Cold Email Framework:**
| Section | Purpose |
|---------|----------|
| **Hook** | Why you''re emailing THEM |
| **Problem** | What you solve |
| **Traction** | Why to believe |
| **Ask** | What you want |

**Follow-Up Cadence:**
| Day | Action |
|-----|--------|
| 0 | Initial email |
| 3 | Follow-up 1 |
| 7 | Follow-up 2 (add news) |
| 14 | Break-up email |

**Company Information:**
Company: {{company_name}}
One-liner: {{one_liner}}
Traction highlight: {{traction_highlight}}
Raise amount: {{raise_amount}}
Target investor: {{target_investor}}
Investor thesis: {{investor_thesis}}
Connection path: {{connection_path}}

Generate personalized outreach templates.', '{"one_liner":"string","company_name":"string","raise_amount":"string","connection_path":"string","investor_thesis":"string","target_investor":"string","traction_highlight":"string"}', '{"cold_email":"string","followup_1":"string","followup_2":"string","breakup_email":"string","linkedin_message":"string","warm_intro_request":"string"}', 'claude', '2500', '0.60', '[]', '2026-01-30 01:51:17.327704+00', '2026-01-30 01:51:17.327704+00'), ('c50e7b71-ba90-4a3c-ba1e-d73bb82d31d8', 'pack_discovery_interview', '3', 'Explore alternatives and validate urgency', 'You are completing a discovery interview.

**Level 3 — Explore alternatives:**
- "What have you tried before?"
- "Why did those solutions fail?"
- "What would perfect look like?"

**Level 4 — Validate urgency:**
- "How often does this happen?"
- "Is this getting better or worse?"
- "Who else suffers from this?"

**Red Flags to Probe:**
- Vague or theoretical problems (vs. specific, recent, repeated)
- No current workaround attempts (low urgency signal)
- Can''t quantify the cost (may not be a real problem)

Previous responses:
Pain: {{pain_response}}
Impact: {{impact_response}}

Generate the expert output with problem statement, urgency score, and red flags.', '{"pain_response":"string","impact_response":"string"}', '{"red_flags":"array","urgency_score":"number","perfect_solution":"string","problem_statement":"string","alternatives_tried":"array"}', 'claude', '2500', '0.50', '[]', '2026-01-30 01:48:59.941591+00', '2026-01-30 01:48:59.941591+00'), ('cdbe37b1-0262-4159-b62d-ccca072dc751', 'pack_product_strategy', '1', 'Define Solution Goals', 'I''m building a product that helps {{target_user}} solve {{core_problem}} using {{product_approach}}.

Return a Markdown table with the following columns:
| Problem to Solve | Why It Matters | Impact if Solved | How to Measure Success |', '{}', '{"type":"object","properties":{"goals_table":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('cf18c015-cdd3-4b91-be7e-960d205bfc7c', 'pack_discovery_interview', '1', 'Surface the pain', 'You are a discovery interview expert with 10,000+ founder and customer interviews. Your goal is to understand the problem deeply.

**Level 1 — Surface the pain:**
Ask these questions about the user''s problem:
- "Tell me about the last time this happened"
- "Walk me through what you did"
- "What was frustrating about that?"

**Context:**
Target audience: {{target_audience}}
Problem area: {{problem_area}}

Begin by asking one opening question to surface the pain. Be curious, non-judgmental, probing but supportive.', '{"problem_area":"string","target_audience":"string"}', '{"opening_question":"string","probing_followups":"array"}', 'claude', '1500', '0.60', '[]', '2026-01-30 01:48:59.941591+00', '2026-01-30 01:48:59.941591+00'), ('d49e8c24-8317-4d48-9122-62a85930c575', 'pack_oneliner_profile', '1', 'Generate one-liner options', 'You are crafting a memorable, investor-ready one-liner.

**One-Liner Formulas:**
| Formula | Template | Example |
|---------|----------|--------|
| X for Y | "[Known company] for [new market]" | "Stripe for cross-border B2B" |
| Category Killer | "The [category] that [differentiation]" | "The CRM that closes deals" |
| Outcome-First | "[Outcome] for [customer]" | "10x faster payments for SMBs" |
| Problem Solver | "[Problem eliminated] for [customer]" | "No more payment delays" |
| Transformation | "Turn [before] into [after]" | "Turn manual invoicing into cash flow" |

**Company Profile:**
Industry: {{industry_id}}
Problem: {{problem_statement}}
Customer: {{customer_profile}}
Solution: {{solution_summary}}
Founder advantage: {{unfair_advantage}}

Generate 5 one-liner options.', '{"industry_id":"string","customer_profile":"string","solution_summary":"string","unfair_advantage":"string","problem_statement":"string"}', '{"hook_line":"string","recommended":"string","one_liner_options":"array","elevator_pitch_30s":"string"}', 'claude', '2000', '0.60', '[]', '2026-01-30 02:22:17.528277+00', '2026-01-30 02:22:17.528277+00'), ('e373dca0-2d55-40bd-86b6-25c2852b9ba7', 'pack_industry_validation', '3', 'Scan for warning signs', 'Scan for warning signs', '{"current_signals":"object"}', '{"active_warnings":"array"}', 'gemini', '1500', '0.30', '[]', '2026-01-30 01:16:15.145594+00', '2026-01-30 01:16:15.145594+00'), ('e5d0a704-af8e-496d-af6c-b81950ddcd16', 'pack_idea_validation', '2', 'Pitch alignment score', 'You are a pitch coach. Given this idea: {{idea_summary}}

Assess how well it aligns with a strong pitch.', '{"idea_summary":"string"}', '{"improvements":"array","one_liner_draft":"string","readiness_score":"number"}', 'gemini', '1500', '0.40', '[]', '2026-01-30 01:15:40.398554+00', '2026-01-30 01:15:40.398554+00'), ('ecfc31ba-8ec6-4f49-990c-0166c77df3d7', 'pack_deck_critique', '1', 'Evaluate and critique pitch deck', 'You are a pitch deck expert providing VC-level feedback.

**Evaluation Framework:**
| Criterion | Weight | Score 1-10 |
|-----------|--------|------------|
| First 30 seconds (hook) | 15% | |
| Problem clarity | 15% | |
| Solution believability | 10% | |
| Market opportunity | 10% | |
| Traction proof | 15% | |
| Team credibility | 10% | |
| Ask clarity | 10% | |
| Visual quality | 10% | |
| Narrative flow | 5% | |

**Deck Content:**
{{deck_content}}

**Industry:**
{{industry}}

Provide detailed critique with actionable fixes.', '{"industry":"string","deck_content":"string"}', '{"overall_score":"number","top_3_changes":"array","score_breakdown":"object","deal_killer_flags":"array","slide_by_slide_feedback":"array","comparison_to_successful_decks":"string"}', 'claude', '4000', '0.40', '[]', '2026-01-30 02:20:50.774785+00', '2026-01-30 02:20:50.774785+00'), ('f4c21fe0-993e-4ded-9b8c-79820c4e47de', 'pack_pitch_optimization', '2', 'Investor Pitch Visuals', 'Design visual suggestions for:
1. Market Opportunity (TAM/SAM/SOM)
2. Competitive Landscape (Quadrant)
3. Traction (Growth Chart)
4. Use of Funds (Pie Chart)', '{}', '{"type":"object","properties":{"visual_suggestions":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('f7e8a730-2114-4a4b-958e-0b1fffc50fd2', 'pack_founder_fit', '1', 'Founder Connect Analysis', 'Startup: {{business_description}}.
Founder Background: {{experience}}
Motivation: {{personal_motivation}}

Evaluate my founder-market fit. Return:
- Summary of fit
- Standout advantages
- Notable gaps/risks
- Verdict: **Strong/Medium/Weak Fit** + explanation.', '{}', '{"type":"object","properties":{"fit_analysis":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('fc7ed92f-d259-4d67-8649-a1a10a1bc84f', 'pack_product_spec', '1', 'Generate Product Spec', 'I have an idea for a product and I want to turn it into a simple, clear product spec. Here''s what I know so far:

- **What it is or does:** {{business_description}}
- **Who it''s for:** {{target_user}}
- **Why it matters:** {{core_problem}}
- **Important features:** {{proposed_features}}

Take this and return a plain text product spec with the following sections:
- **Product Name:** [suggested name]
- **One-Liner:** [what it does, for whom, and why]
- **Target User:** [who it''s for]
- **Core Problem:** [the main pain point it solves]
- **Key Features:** Feature 1, Feature 2, Feature 3
- **User Flow:** What happens first -> next -> how the user completes their goal
- **Out of Scope:** Anything not being built for now', '{}', '{"type":"object","properties":{"spec":{"type":"string"}}}', 'gemini', '2000', '0.30', '[]', '2026-01-30 02:58:02.853068+00', '2026-01-30 02:58:02.853068+00'), ('fd09eaa2-32d2-45b7-a102-24fd39e3e4f5', 'pack_canvas_solution_revenue', '2', 'Build channel strategy', 'You are building the Channels box of the Lean Canvas.

**Channel Categories:**
| Type | Examples | Best For |
|------|----------|----------|
| Inbound | SEO, content, social | Long-term, low CAC |
| Outbound | Cold email, ads, PR | Fast, scalable, higher CAC |
| Product-led | Freemium, viral, referral | High volume, very low CAC |
| Partner-led | Integrations, resellers | Borrowed audiences |

**Context:**
Business: {{business_description}}
Industry: {{industry}}
Customer: {{customer_segment}}

Recommend channel strategy with playbook.', '{"industry":"string","customer_segment":"string","business_description":"string"}', '{"timeline":"object","cac_estimates":"object","primary_channel":"object","secondary_channels":"array","channel_experiments":"array"}', 'gemini', '2000', '0.40', '[]', '2026-01-30 02:20:16.172956+00', '2026-01-30 02:20:16.172956+00'), ('fe1ceb1c-76d2-4bdd-bb7d-15fe2fe4d851', 'pack_term_sheet_analysis', '1', 'Analyze term sheet terms', 'You are analyzing a term sheet for a founder.

**Key Term Sheet Terms:**
| Term | What It Means | Founder Impact | Negotiability |
|------|---------------|----------------|---------------|
| **Valuation** | Pre-money value | Dilution amount | Moderate |
| **Option pool** | Employee equity | Comes from founders | High |
| **Liquidation preference** | Who gets paid first | Downside protection | Low-Moderate |
| **Participation** | Double-dip or not | Upside sharing | Moderate |
| **Anti-dilution** | Down-round protection | Future dilution | Low |
| **Board seats** | Control and governance | Decision power | Moderate-High |
| **Pro-rata rights** | Follow-on investment | Future dilution | Low |

**Red Flags in Term Sheets:**
| Red Flag | Why It''s Bad |
|----------|--------------|
| Participating preferred | Double-dip on returns |
| Full ratchet anti-dilution | Severe down-round punishment |
| Super-voting rights | Disproportionate control |
| Redemption rights | Can force buyback |
| No-shop >60 days | Too long exclusivity |

**Term Sheet:**
{{term_sheet_text}}

**Other Offers (if any):**
{{other_offers}}

Analyze the term sheet and provide negotiation strategy.', '{"other_offers":"string","term_sheet_text":"string"}', '{"analysis":"object","red_flags":"array","recommendation":"string","counter_proposal":"string","walk_away_criteria":"array","dilution_calculation":"object","negotiation_strategy":"array","standard_vs_concerning":"object"}', 'claude', '3500', '0.30', '[]', '2026-01-30 01:51:50.745761+00', '2026-01-30 01:51:50.745761+00');