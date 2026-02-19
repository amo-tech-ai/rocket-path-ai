/**
 * Industry Playbooks for Validator Follow-up
 * Provides industry-specific probing questions to inject into the AI prompt.
 * Each playbook contains 5-6 targeted questions that a YC partner would ask
 * for that specific vertical.
 */

export interface IndustryPlaybook {
  industry: string;
  keywords: string[];
  questions: string[];
}

const PLAYBOOKS: IndustryPlaybook[] = [
  {
    industry: "SaaS / B2B Software",
    keywords: ["saas", "b2b", "software", "platform", "subscription", "enterprise", "crm", "erp", "api"],
    questions: [
      "What's your current MRR or ARR? How many paying customers?",
      "What's your average contract value and sales cycle length?",
      "Who is the buyer vs. the user? How do you reach them?",
      "What's your churn rate? What drives cancellations?",
      "How does your product integrate with the tools your customers already use?",
      "What would it take to get your first 10 enterprise logos?",
    ],
  },
  {
    industry: "E-commerce / Marketplace",
    keywords: ["ecommerce", "e-commerce", "marketplace", "shop", "store", "retail", "buy", "sell", "merchant"],
    questions: [
      "What's your take rate or commission structure?",
      "How do you solve the chicken-and-egg problem — supply first or demand first?",
      "What's your average order value and repeat purchase rate?",
      "How do you handle logistics, returns, or disputes?",
      "Who are the 3 closest competitors and why would a seller/buyer switch to you?",
    ],
  },
  {
    industry: "FinTech / Payments",
    keywords: ["fintech", "finance", "banking", "payment", "lending", "insurance", "credit", "invest", "wallet", "money"],
    questions: [
      "What regulatory licenses or compliance do you need (e.g., money transmitter, PCI)?",
      "How do you handle fraud prevention and risk management?",
      "What's your revenue model — interchange, subscription, spread, or fee-per-transaction?",
      "Who is your banking partner or BaaS provider?",
      "What's your customer acquisition cost relative to lifetime value?",
    ],
  },
  {
    industry: "HealthTech / MedTech",
    keywords: ["health", "medical", "healthcare", "clinic", "patient", "doctor", "hospital", "pharma", "biotech", "telehealth", "dental", "therapy"],
    questions: [
      "Do you need FDA clearance or other regulatory approval? What's your timeline?",
      "Who pays — the patient, the provider, the payer (insurance), or the employer?",
      "How do you handle HIPAA compliance and patient data security?",
      "What's the clinical evidence or validation behind your approach?",
      "How long is the typical sales cycle in your target health system?",
      "What's the reimbursement pathway — is there a billing code for your service?",
    ],
  },
  {
    industry: "EdTech",
    keywords: ["education", "edtech", "learning", "school", "university", "student", "teacher", "course", "training", "tutor"],
    questions: [
      "Who is the buyer — the institution, the teacher, the student, or the parent?",
      "How do you measure learning outcomes or engagement?",
      "What's your pricing model — per-seat, per-institution, or freemium?",
      "How does your solution fit into existing LMS or curriculum workflows?",
      "What's your evidence of improved outcomes vs. traditional methods?",
    ],
  },
  {
    industry: "AI / ML Tools",
    keywords: ["ai", "artificial intelligence", "machine learning", "ml", "llm", "gpt", "model", "neural", "deep learning", "nlp", "computer vision"],
    questions: [
      "What's your model — fine-tuned open-source, proprietary, or API wrapper?",
      "What's your defensibility beyond the model itself (data moat, workflow, distribution)?",
      "How do you handle accuracy, hallucinations, or edge cases?",
      "What's your compute cost per query and how does it scale?",
      "How do you evaluate quality — what benchmarks or metrics matter to your customers?",
    ],
  },
  {
    industry: "Food / Restaurant",
    keywords: ["food", "restaurant", "dining", "delivery", "kitchen", "menu", "chef", "catering", "cafe", "bar"],
    questions: [
      "Independent restaurants, chains, or fast-food — which segment and what size?",
      "What's the average revenue per location and your price point relative to that?",
      "How do you integrate with existing POS systems (Toast, Square, Clover)?",
      "What's the no-show rate or food waste cost you're targeting?",
      "How many restaurants have you talked to and what was their reaction?",
    ],
  },
  {
    industry: "Real Estate / PropTech",
    keywords: ["real estate", "property", "proptech", "rent", "lease", "landlord", "tenant", "housing", "mortgage", "broker"],
    questions: [
      "Are you targeting residential or commercial? Buyers, sellers, or property managers?",
      "What's your revenue model — per-listing fee, subscription, or transaction commission?",
      "How do you source property data and how fresh is it?",
      "What's the regulatory environment in your target market?",
      "How does your solution reduce time-to-close or vacancy rates?",
    ],
  },
];

/**
 * Detect industry from conversation text using keyword matching.
 * Returns the best-matching playbook or null if no strong match.
 */
export function detectIndustry(conversationText: string): IndustryPlaybook | null {
  const lower = conversationText.toLowerCase();

  let bestMatch: IndustryPlaybook | null = null;
  let bestScore = 0;

  for (const playbook of PLAYBOOKS) {
    const score = playbook.keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = playbook;
    }
  }

  // Require at least 1 keyword match
  return bestScore >= 1 ? bestMatch : null;
}

/**
 * Format playbook questions as a prompt injection string.
 */
export function formatPlaybookPrompt(playbook: IndustryPlaybook): string {
  const questions = playbook.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
  return `\n\n## Industry-Specific Questions (${playbook.industry})
The founder appears to be in the **${playbook.industry}** vertical. When probing or deepening, prioritize these industry-specific questions where relevant:
${questions}

Use these as inspiration — adapt to the founder's specific context rather than asking verbatim.`;
}
