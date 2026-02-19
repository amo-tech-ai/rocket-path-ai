# Risk Taxonomy & Prioritization

Unified risk model synthesized from 18 validation frameworks (FI.co, Ash Maurya, Product Compass, Upsilon IT, Siift.ai).

## 15 Risk Domains

```
DESIRABILITY (test first for pre-traction startups)
  Problem Risk       Is this a real, painful, frequent problem?
  Customer Risk      Can you identify, reach, and convert the buyer?
  Channel Risk       Is there a viable, scalable acquisition path?
  Value Prop Risk    Is your offering 10x better than alternatives?

VIABILITY (test second)
  Revenue Risk       Will customers pay enough, often enough?
  Financial Risk     Can you sustain burn rate to PMF?
  Market Risk        Is the market large enough and growing?
  Competition Risk   Can you differentiate and defend position?

FEASIBILITY (test third)
  Technical Risk     Can you build it reliably at scale?
  Team Risk          Do you have the right people and skills?
  Operational Risk   Can you deliver consistently post-launch?

EXTERNAL (monitor continuously)
  Legal Risk         IP, compliance, regulatory barriers
  Pivot Risk         Can you adapt if core assumptions fail?
  Reputational Risk  Data privacy, trust, ethics concerns
  Exit Risk          Acquisition readiness, valuation path
```

## Composite Risk Scoring

```
RISK SCORE = Impact (1-10) x Probability (1-5) = 0-50

Impact:  How badly does the business fail if this assumption is wrong?
         1-3 = inconvenient  |  4-6 = serious  |  7-10 = fatal

Probability:  How likely is it that this assumption IS wrong?
              1 = very unlikely  |  3 = coin flip  |  5 = very likely
```

### Score Interpretation

| Score | Severity | Action |
|------:|----------|--------|
| 35-50 | Fatal | Must validate before ANY building |
| 20-34 | High | Validate within current sprint |
| 10-19 | Medium | Monitor, validate when convenient |
| 1-9 | Low | Accept the risk, move on |

## Prioritization Rules

1. **Pre-traction → desirability risks first** (Ash Maurya Theory of Constraints: for pre-traction startups, the constraint is always acquisition/desirability)
2. **Within a domain → highest risk score first** (FI.co scoring)
3. **Equal scores → cheapest-to-test first** (Iterative.vc cost optimization)
4. **Max 5 active risks in validation queue** (cognitive load management)

## Theory of Constraints (TOC)

Find the ONE bottleneck. For most StartupAI users (pre-traction), the constraint is acquisition.

```
Constraint shifts as you validate:
  Pre-traction  →  Acquisition (Do people want this?)
  Early traction →  Activation (Do they get value quickly?)
  Growing        →  Retention (Do they come back?)
  Scaling        →  Revenue (Does unit economics work at scale?)
```

After each validation cycle, re-diagnose the constraint. Don't optimize production when the bottleneck is acquisition.

## Mapping to Lean Canvas

| Risk Domain | Canvas Box | Pre-Traction Priority |
|-------------|-----------|:---------------------:|
| Problem | Problem | 1 (highest) |
| Customer | Customer Segments | 2 |
| Value Prop | Unique Value Proposition | 3 |
| Channel | Channels | 4 |
| Revenue | Revenue Streams | 5 |
| Competition | Unfair Advantage | 6 |
| Technical | Solution + Key Metrics | 7 |
| Financial | Cost Structure | 8 |
| Team | (not on canvas) | 9 |
| Operational | Key Activities / Resources | 10 |

## Hypothesis Framing

Every risk should be expressed as a testable hypothesis:

```
"We believe [assumption]
 because [current evidence or reasoning].
 If wrong, [consequence to the business].
 We will test by [method]
 and consider it validated when [threshold]."
```

**Example:**
> We believe small SaaS founders need automated competitive intelligence
> because 8/10 interview subjects mentioned spending 5+ hours/week on manual tracking.
> If wrong, our core value proposition fails and there's no product.
> We will test by running a fake-door landing page for 2 weeks
> and consider it validated when 5%+ of visitors sign up for the waitlist.
