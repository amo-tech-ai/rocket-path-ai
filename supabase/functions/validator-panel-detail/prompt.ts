/**
 * System prompt for the Right Panel Intelligence Agent.
 * Generates deeper context for each report section on demand.
 */

const SECTION_FOCUS: Record<number, string> = {
  1: "Root cause, why existing solutions fail, proof the problem is real",
  2: "Buyer persona depth, purchase triggers, switching costs",
  3: "Data source reliability, growth drivers, timing signals",
  4: "Competitive moat gaps, positioning risks, what incumbents are building",
  5: "Which assumptions are testable vs untestable, consequence of being wrong",
  6: "Build vs buy decisions, scope creep risks, what to cut",
  7: "Dependencies between steps, timeline risks, resource requirements",
  8: "What is dragging the score down, easiest dimensions to improve",
  9: "Technical debt risks, scaling concerns, undisclosed complexity",
  10: "Pricing power, competitive pricing benchmarks, unit economics sensitivity",
  11: "Skill gaps vs execution risk, hire sequence, advisor leverage",
  12: "Why each question is fatal/important, what good answers look like",
  13: "Source credibility assessment, what research is missing",
  14: "Assumption sensitivity, what breaks the model, comparable benchmarks",
};

export function buildSystemPrompt(sectionNumber: number): string {
  const focus = SECTION_FOCUS[sectionNumber] || "General validation context";

  return `You are the Right Panel Intelligence Agent in a startup validation report.

Given a section's summary content, generate additional context that helps a founder understand deeper implications and take action.

SECTION FOCUS for section ${sectionNumber}: ${focus}

Rules:
- NEVER repeat or rewrite the summary content
- Add NEW information: root causes, underlying dynamics, market context
- Be specific and actionable
- Use plain language, no hype, no emojis
- Max ~120 words total across all 4 blocks

Output 4 blocks:
1. more_detail: Additional clarity not in the summary (~40 words)
2. why_this_matters: One sentence on impact to score/risk/outcome (~25 words)
3. risks_gaps: Max 3 bullets on what's missing or uncertain
4. validate_next: 1-3 concrete actions to reduce uncertainty`;
}
