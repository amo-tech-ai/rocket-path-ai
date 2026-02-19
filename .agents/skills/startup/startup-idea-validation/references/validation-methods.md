# Validation Methods Matrix

Method selection guide synthesized from Iterative.vc, FI.co, Failory, and Startup Grind.

## Methods by Cost & Value

| Method | Cost | Time | Info Value | Best For |
|--------|:----:|:----:|:----------:|----------|
| **Online Research** | Free | Hours | Low | Market size, competitors, trends |
| **Surveys** | Low | Days | Low | Initial signal, broad patterns |
| **Customer Interviews** | Low | 1-2 weeks | Medium | Problem validation, pain discovery |
| **Landing Page / Fake Door** | Medium | Days | **High** | Demand validation, messaging test |
| **Mockup / Prototype** | Medium | 1-2 weeks | Medium | UX validation, concept testing |
| **Pre-Sales** | Medium | 2-4 weeks | **Very High** | Willingness to pay, PMF signal |
| **Actual Usage / MVP** | High | 4-8 weeks | Very High | Product-market fit confirmation |

## Decision Tree: Which Method?

```
Is this a DESIRABILITY risk? (problem, customer, channel, value prop)
  YES → Have you talked to 10+ target users?
         NO  → Customer Interviews
         YES → Do interviews confirm the pain?
                NO  → PIVOT the value prop or customer segment
                YES → Fake Door / Landing Page
                       Did 5%+ sign up or click "buy"?
                         NO  → Revise messaging, retest
                         YES → Pre-Sell with real pricing
                                Did people PAY?
                                  NO  → Niceness gap — pivot pricing or offering
                                  YES → BUILD MVP

  NO → Is this a VIABILITY risk? (revenue, financial, market, competition)
        YES → Financial modeling + competitor revenue analysis + pricing tests
        NO  → Is this a FEASIBILITY risk? (technical, team, operational)
               YES → Technical spike / prototype / team assessment
               NO  → EXTERNAL risk → Legal review / regulatory research
```

## Signal Strength Scale

Not all evidence is equal. Rate every experiment result:

| Level | Signal | Example | Confidence |
|:-----:|--------|---------|:----------:|
| 1 | **Verbal** | "I'd use that" / "Great idea" | Very Low |
| 2 | **Engagement** | Clicked, browsed, spent time | Low |
| 3 | **Signup** | Email, waitlist, free trial | Medium |
| 4 | **Payment** | Paid deposit, pre-order, subscription | High |
| 5 | **Referral** | Told others, brought a friend | Very High |

### The Niceness Gap (Failory)

The gap between what people say and what they do with money. Most founders get stuck at Level 1-2 and mistake verbal enthusiasm for validation.

**Rule:** An idea is NOT validated until you have Level 3+ signal. Level 4 (payment) is the gold standard for pre-traction validation.

## Experiment Design Template

For each risk in the validation queue:

```
EXPERIMENT CARD
  Risk:       [from risk taxonomy]
  Hypothesis: "We believe [X] because [Y]. If wrong, [Z]."
  Method:     [from decision tree above]
  Duration:   [timeboxed — 1 week / 2 weeks / 1 month]
  SMART Goal: [specific, measurable threshold]
  Pass:       [what result = validated]
  Fail:       [what result = invalidated]
  Cost:       [time + money budget]
```

**Example:**
```
  Risk:       Customer Risk — can we reach indie SaaS founders?
  Hypothesis: "We believe we can acquire indie SaaS founders through
               Twitter/X and IndieHackers because that's where they
               congregate. If wrong, our CAC will be too high."
  Method:     Landing Page / Fake Door
  Duration:   2 weeks
  SMART Goal: 100 unique visitors, 8+ email signups (8% conversion)
  Pass:       8%+ signup rate
  Fail:       <3% signup rate after messaging iteration
  Cost:       $50 ads + 4 hours setup
```

## Pre-Register Thresholds

Before running any experiment, write down:
1. **Pass threshold** — what number means "validated"
2. **Fail threshold** — what number means "invalidated"
3. **Ambiguous zone** — what result means "need more data"
4. **Stop rule** — when to stop regardless (time or spend cap)

This prevents moving goalposts after seeing results (confirmation bias defense).

## Method Selection by Stage

| Founder Stage | Primary Methods | Skip |
|--------------|-----------------|------|
| Idea only | Research + Interviews | MVP, pre-sales |
| Problem validated | Fake door + Surveys | MVP |
| Demand validated | Pre-sales + Prototype | Surveys |
| Pre-sales confirmed | MVP + Actual usage | Research, surveys |
