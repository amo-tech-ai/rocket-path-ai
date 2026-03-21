# Deal Strategist Skill

> Domain knowledge for MEDDPICC deal qualification, competitive positioning, and Challenger messaging.
> Feeds into: `investor-agent` edge function (deal qualification, investor scoring), `crm-agent` (deal scoring, pipeline analysis).

## MEDDPICC Framework

Every opportunity is scored against all eight elements (1-5 each, /40 total). A deal without all eight answered is a deal you do not understand.

### Element Definitions

| Element | What to Assess | Score 5 | Score 1 |
|---------|---------------|---------|---------|
| **Metrics** | Quantifiable business outcome the buyer needs | Buyer-validated, CFO-approved dollar impact | Vague "better efficiency" with no numbers |
| **Economic Buyer** | Person who controls budget and can say yes | Direct access, engaged in evaluation | Not identified, or access blocked |
| **Decision Criteria** | Technical, business, commercial evaluation criteria | Documented, influenced toward our strengths | Guessing, or criteria favor competitor |
| **Decision Process** | Steps from evaluation to signed contract | Fully mapped with owners and approvals | Unknown steps, unmapped timeline |
| **Paper Process** | Legal, procurement, security review | Timeline known, process initiated | Not discussed, procurement unknown |
| **Identify Pain** | Specific, quantified business problem | Quantified cost of inaction ($X/yr lost) | "We need a better tool" with no cost |
| **Champion** | Internal advocate with power + access + motivation | Tests passed: brokers access, sells internally | Friendly contact who takes calls, no power |
| **Competition** | Direct competitors, internal build, do-nothing | Mapped, positioning strategy per zone | No awareness of competitive landscape |

### Scoring Thresholds

| Total Score | Verdict | Action |
|-------------|---------|--------|
| 32-40 | Strong pipeline | Forecast confidently, accelerate close |
| 24-31 | Battling | Winnable if gaps close within 2 weeks |
| 16-23 | At risk | Address critical gaps or qualify out |
| Below 16 | Unqualified | Do not invest time; disqualify or nurture |

### Deal Assessment Template

```markdown
# Deal Assessment: [Account / Investor Name]

## MEDDPICC Score: [X/40]

| Element           | Score | Evidence                              | Gap / Risk                           |
|-------------------|-------|---------------------------------------|--------------------------------------|
| Metrics           | ?/5   |                                       |                                      |
| Economic Buyer    | ?/5   |                                       |                                      |
| Decision Criteria | ?/5   |                                       |                                      |
| Decision Process  | ?/5   |                                       |                                      |
| Paper Process     | ?/5   |                                       |                                      |
| Identify Pain     | ?/5   |                                       |                                      |
| Champion          | ?/5   |                                       |                                      |
| Competition       | ?/5   |                                       |                                      |

## Verdict: [Strong / Battling / At Risk / Unqualified]
## Next Actions:
1. [Action] — owner: [who] — deadline: [when]
2. ...
```

## Competitive Positioning

### Winning / Battling / Losing Zones

For every active competitor, categorize evaluation criteria into three zones:

- **Winning Zone**: Your differentiation is clear and the buyer values it. Amplify these. Push for heavier weighting in the decision.
- **Battling Zone**: Both vendors are credible. Shift to adjacent factors (implementation speed, TCO, ecosystem) where you can separate.
- **Losing Zone**: Competitor is genuinely stronger. Do not attack. Reposition: "They are excellent at X. Our customers typically find that Y matters more at scale because..."

### Laying Competitive Landmines

During discovery, ask questions that surface requirements where you are strongest. These are legitimate business questions that illuminate gaps in the competitor's approach.

**Example**: If your platform handles multi-entity consolidation natively and the competitor requires middleware, ask early: "How are you handling data consolidation across your subsidiary entities today? What breaks when you add a new entity?"

### Red Flags That Kill Deals

- Single-threaded to one contact who is not the economic buyer
- No compelling event or consequence of inaction
- Champion who will not grant access to the economic buyer
- Decision criteria that map perfectly to a competitor's strengths
- "We just need to see a demo" with no discovery completed
- Procurement timeline unknown or undiscussed
- Buyer initiated contact but cannot articulate the business problem

## Challenger Messaging: 6-Step Commercial Teaching

Standard discovery puts the buyer in control and produces commoditized conversations. Challenger methodology leads with a disruptive insight, then connects it to a problem they did not know they had.

| Step | Purpose | Example |
|------|---------|---------|
| 1. **Warmer** | Demonstrate understanding of their world | Reference a pattern common to their industry/segment |
| 2. **Reframe** | Challenge current assumptions | "Most companies approach this by [conventional method]. Data shows why that breaks at scale." |
| 3. **Rational Drowning** | Quantify cost of status quo | Stack benchmarks, case studies, industry data until current approach feels untenable |
| 4. **Emotional Impact** | Make it personal | Who on their team feels this pain daily? What happens to the exec who owns this if it is not solved? |
| 5. **A New Way** | Present the alternative approach | Not your product yet -- the methodology or framework that solves it differently |
| 6. **Your Solution** | Connect product to the new way | Product feels like the inevitable conclusion, not a sales pitch |

## Value Articulation Framework

Structure every value conversation around three pillars:

1. **What problems do we solve?** Be specific to the buyer's context. Generic value props signal you have not done discovery.
2. **How do we solve them differently?** Differentiation must be provable and relevant. "We have AI" is not differentiation. "Our ML model reduces false positives by 74% because we train on your historical data" is.
3. **What measurable outcomes do customers achieve?** Proof points, not promises. Reference customers in their industry, at their scale, with quantified results.

## Pipeline Inspection Questions

When reviewing any opportunity, systematically probe:

- "What has changed since last week?" -- momentum or stall
- "When did you last speak to the economic buyer?" -- access or assumption
- "What does the champion say happens next?" -- coaching or silence
- "Who else is the buyer evaluating?" -- competitive awareness or blind spot
- "What happens if they do nothing?" -- urgency or convenience
- "What is the paper process and have you started it?" -- timeline reality
- "What specific event is driving the timeline?" -- compelling event or artificial deadline

## Success Metrics

| Metric | Target |
|--------|--------|
| Forecast accuracy (commit deals) | 85%+ close rate |
| Win rate on qualified pipeline (28+/40) | 35%+ |
| Average deal size vs unqualified baseline | 20%+ larger |
| Cycle time reduction | 15% through early disqualification |
| Pipeline hygiene | < 10% older than 2x average cycle |
| Competitive win rate (when positioning applied) | 60%+ |

## StartupAI Integration Points

- **investor-agent EF**: MEDDPICC framework adapted for investor qualification (Metrics = fundraise target, Economic Buyer = GP/decision-maker, Pain = portfolio gap your startup fills, Champion = warm intro source)
- **crm-agent EF**: Deal scoring uses MEDDPICC total score, competitive zone analysis surfaces in deal insights, red flags trigger stalled-deal alerts
- **AI Chat**: When founders ask about deal strategy or investor conversations, reference Challenger 6-step sequence and pipeline inspection questions
- **Validator scoring**: Competition dimension uses Winning/Battling/Losing zone framework to assess competitive landscape
