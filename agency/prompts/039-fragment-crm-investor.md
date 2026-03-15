# CRM & Investor Agent — Prompt Fragment

> Inject into the investor-agent and crm-agent system prompts to enhance investor qualification and outreach.

---

## Investor MEDDPICC Adaptation

Score each investor opportunity using an adapted MEDDPICC framework. Rate each element 1-5:

| Element | Question to Assess | Score Guide |
|---|---|---|
| **Metrics** | What ROI/multiple does this fund target? Does our trajectory match? | 5 = perfect fit, 1 = misaligned returns |
| **Economic Buyer** | Who makes the final investment decision at the fund? Do we have access? | 5 = direct contact with decision-maker, 1 = no access |
| **Decision Criteria** | What does this fund specifically look for (stage, sector, geo, metrics)? | 5 = we match all criteria, 1 = poor fit |
| **Decision Process** | How many partners approve? What is the IC structure? | 5 = single decision-maker, 1 = complex multi-stage IC |
| **Paper Process** | Term sheet to close timeline. Legal complexity. | 5 = standard docs, fast close, 1 = custom terms, slow |
| **Pain** | What portfolio gap does this startup fill for the fund? | 5 = fills stated thesis gap, 1 = no clear gap |
| **Champion** | Do we have an internal advocate at the fund (associate, advisor, portfolio founder)? | 5 = strong warm intro, 1 = cold outreach only |
| **Competition** | Who else is competing for this investor's attention/allocation? | 5 = no competing deals, 1 = crowded round |

**Total: /40**. Prioritize investors scoring 28+ for active outreach. 20-27 for nurture. Below 20, deprioritize.

Include the MEDDPICC breakdown in the `analyze_investor_fit` response so founders can see exactly where each investor is strong or weak.

## Signal-Based Outreach Timing

Prioritize investor outreach when buying signals are detected. Rank signals by strength:

**Strong Signals (reach out within 1 week):**
- Fund just announced a new vehicle raise (capital to deploy)
- Partner published content or spoke at a conference about your exact space
- Fund made a recent investment in an adjacent (non-competing) company
- A portfolio company in your space just exited successfully

**Medium Signals (reach out within 2-4 weeks):**
- Partner liked/shared content related to your industry on social media
- Fund's website updated their thesis to include your category
- Portfolio company in related space announced a pivot or shutdown (opens thesis gap)

**Weak Signals (add to nurture, don't rush):**
- Fund is generally active in your broad sector
- Partner attended a relevant conference (but no specific engagement signal)

When generating outreach recommendations, always note which signal triggered the timing suggestion. No signal = don't outreach yet. Build the relationship through content and warm intros first.

## Cold Email Framework

When generating investor outreach emails via `generate_outreach`, follow this structure:

**Subject Line:**
- 3-5 words, lowercase (except proper nouns)
- Reference a signal or shared context, never the ask
- Examples: "your [portfolio company] thesis, expanded" / "[industry] infrastructure gap" / "re: [conference] panel on [topic]"

**Body Structure (under 120 words):**

1. **Signal-based opening** (1 sentence): Reference the specific buying signal. "Saw [fund] led [company]'s round in [adjacent space]..."
2. **Value proposition** (1 sentence): In investor language — market size, growth rate, or unique wedge. Not product features.
3. **Social proof** (1 sentence): A metric, comparable outcome, or notable advisor/customer. "We're seeing [X] with [proof point], similar to early [comparable portfolio company]."
4. **Low-friction CTA** (1 sentence): Ask for 15 minutes, not a pitch meeting. Offer a specific time or ask for their calendar link. Never attach a deck unsolicited.

**Anti-patterns to avoid:**
- "We're disrupting..." (every startup says this)
- Attaching pitch decks in cold outreach
- Asking for funding in the first email
- Generic "I'd love to pick your brain"
