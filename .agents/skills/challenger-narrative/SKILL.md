# Challenger Narrative Skill

> Narrative architecture for pitch decks, executive summaries, and investor presentations using the Challenger Sale methodology.
> Feeds into: `pitch-deck-fragment.md` (slide narrative structure), `validator-composer-fragment.md` (Three-Act executive summary), Composer Group D.

## StartupAI Integration

This knowledge feeds into:
- **Pitch Deck Agent**: 5-step Challenger narrative mapped to slide sequence
- **Composer Agent (Group D)**: Three-Act executive summary (Setup -> Tension -> Resolution)
- **Validator Report**: Executive summary follows Challenger "teach, not tell" principle
- **AI Chat Practice Pitch mode**: Coaches founders on Challenger presentation technique

## Challenger 5-Step Narrative

The Challenger methodology builds a presentation that teaches the buyer something new about their own business. The sequence:

### Step 1: The Warmer (Slide 1-2)
**Purpose**: Demonstrate you understand their world better than they expect.

- Lead with an observation about their industry, not your product
- Reference a specific trend, regulatory change, or market shift they recognize
- Build credibility through insight, not credentials
- **Tone**: "We've seen this pattern across [segment]..."

**Example for StartupAI pitch deck**:
> "78% of first-time founders spend their first 6 months building the wrong thing. Not because they're bad at execution -- because they validated against the wrong evidence."

### Step 2: The Reframe (Slide 3-4)
**Purpose**: Challenge their current mental model. Introduce tension.

- Present data that contradicts conventional wisdom in their space
- Show the hidden cost of their current approach
- Create an "aha moment" -- something they haven't considered
- **Tone**: "What most people don't realize is..."

**Reframe formula**: [Common belief] -> [Surprising data] -> [New conclusion]

### Step 3: Rational Drowning (Slide 5-6)
**Purpose**: Quantify the cost of the status quo until it feels untenable.

- Stack 3-4 data points that amplify the problem
- Use concrete numbers: dollars lost, hours wasted, opportunities missed
- Build a sense of urgency through accumulation, not hyperbole
- Each data point makes it harder to defend doing nothing
- **Tone**: Numbers speak louder than adjectives

### Step 4: Emotional Impact (Slide 7)
**Purpose**: Make it personal. Connect the business problem to a human story.

- "Imagine [persona] on a Monday morning..." scenario
- Show the daily reality of the current broken process
- Make the buyer feel the problem, not just understand it
- This is where "the founder's pain" resonates
- **Tone**: Story, not statistics

### Step 5: A New Way + Your Solution (Slide 8-10)
**Purpose**: Present your approach as the natural conclusion, not a sales pitch.

- First: describe the new methodology/framework (not your product)
- Then: show how your product implements that methodology
- The product should feel inevitable -- "of course this is how you'd solve it"
- Include proof points: metrics, customer results, traction
- **Tone**: "Here's what we built, and here's what it does"

## Three-Act Executive Summary

The validator report's executive summary uses a Three-Act narrative:

### Act 1: Setup (2-3 sentences)
- State the opportunity clearly
- Name the target market and problem
- Establish the stakes (what's at risk if unsolved)

### Act 2: Tension (2-3 sentences)
- Present the key risks and challenges discovered
- Name the weakest dimension and why it matters
- Create productive tension -- not doom, but honest assessment

### Act 3: Resolution (2-3 sentences)
- Deliver the verdict (Go / Conditional Go / No-Go)
- State the single most important next action
- End with forward momentum, not a summary

**Anti-pattern**: "In conclusion, this startup has many strengths and some weaknesses."
**Pattern**: "The execution risk is real but addressable: prove customer willingness to pay through 3 founder-led sales in the next 30 days."

## Persuasion Architecture

### Cognitive Biases (Use Ethically)

Map each pitch deck slide to a cognitive bias that strengthens the argument:

| Slide Section | Bias to Leverage | Technique |
|--------------|-----------------|-----------|
| Problem | Loss aversion | Frame as "what you're losing" not "what you could gain" |
| Solution | Anchoring | Show the expensive alternative first, then your approach |
| Market size | Social proof | "X companies already face this" |
| Competition | Contrast effect | Position competitors, then your differentiator |
| Traction | Bandwagon effect | "Growing 40% MoM -- 200 companies onboarded this quarter" |
| Team | Authority bias | Relevant experience, not just credentials |
| Ask | Reciprocity | "We've shown you the data. Here's what we need." |

### Win Theme Labels

Each slide should carry a win theme label -- a short phrase (4-8 words) that captures the slide's core argument:

- **Problem slide**: "The $2.4B Validation Gap"
- **Solution slide**: "7 Agents, 2 Minutes, Real Data"
- **Market slide**: "30M First-Time Founders Worldwide"
- **Traction slide**: "3x Growth in 90 Days"

Win themes are woven through the deck and repeated in the executive summary for narrative coherence.

## Slide-Level Narrative Mapping

| Slide # | Challenger Step | Content | Win Theme |
|---------|----------------|---------|-----------|
| 1 | Warmer | Industry observation + hook | -- |
| 2 | Warmer | Problem statement with quantified cost | "The [X] Problem" |
| 3 | Reframe | Surprising data that challenges assumptions | "What [X] Miss" |
| 4 | Rational Drowning | 3-4 data points quantifying status quo cost | "The Hidden Cost of [X]" |
| 5 | Rational Drowning | Competitive landscape showing inadequacy | "Why Existing [X] Fail" |
| 6 | Emotional Impact | Founder/customer story | "Imagine [Persona]..." |
| 7 | New Way | Solution methodology (not product) | "A Better Way to [X]" |
| 8 | Your Solution | Product demo/screenshots | "How [Product] Works" |
| 9 | Your Solution | Traction + metrics | "[Metric] and Growing" |
| 10 | Your Solution | Team + ask | "The Team Behind [X]" |

## Implementation Checklist

- [ ] Pitch deck agent generates slides following 5-step Challenger sequence
- [ ] Each slide tagged with win theme label
- [ ] Executive summary follows Three-Act structure (Setup -> Tension -> Resolution)
- [ ] Persuasion badge on each slide maps to cognitive bias
- [ ] Narrative step indicator shows which Challenger step the user is on
- [ ] Practice Pitch mode coaches founders on Challenger delivery
