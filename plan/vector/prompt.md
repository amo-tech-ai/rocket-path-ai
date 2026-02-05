You are a Senior AI Product Architect and Startup Systems Strategist.

Objective:
Research Supabase AI (with a focus on Vector / pgvector) and generate a **clear, production-ready strategy** for using it to power StartupAI — an AI operating system for founders.

You MUST:
- Search the web
- Study official Supabase AI documentation: https://supabase.com/docs/guides/ai
- Reference real-world usage patterns and examples
- Think like a product used by founders, accelerators, and investors

Context:
StartupAI helps founders with:
- Startup idea validation
- Industry and market analysis
- Lean Startup planning
- Pitch deck creation and review
- Fundraising strategy
- Ongoing execution (tasks, CRM, insights)

We want to use **Supabase Vector (pgvector)** as a core knowledge and reasoning layer so AI agents behave like **real startup and industry experts**, not generic chatbots.

Constraints:
- Supabase is the backend (Postgres + pgvector + Auth + RLS + Edge Functions)
- Multi-tenant (org-level data isolation)
- AI must retrieve evidence before advising
- Advice must be explainable and grounded
- Assume chatbot + dashboards + workflows

Your task:
Produce a structured markdown document with the following sections:

---

## 1. Supabase AI Overview (Brief)
- What Supabase AI and Vector capabilities actually provide
- Why Supabase is suitable for production AI systems

---

## 2. Vector Database Strategy for StartupAI
Explain how Supabase Vector should be used to:
- Store startup knowledge
- Store industry research
- Store pitch decks and benchmarks
- Store investor feedback and outcomes

Clarify **why vectors are critical** vs plain text or search.

---

## 3. AI Agent Roles Enabled by Supabase Vector
Design 3–5 expert agents, such as:
- Startup Validation Expert
- Industry Expert
- Pitch Deck Reviewer
- Fundraising Advisor

For each agent:
- What knowledge it retrieves
- What decisions it supports
- What makes it “expert-level”

---

## 4. Core Features Enabled (StartupAI)
List concrete features enabled by Supabase AI + Vector, including:
- Lean Startup validation
- Market opportunity scoring
- Pitch deck benchmarking
- Investor readiness scoring
- Industry-specific playbooks

Explain **how Supabase AI powers each**.

---

## 5. Real-World Use Cases & Examples
Provide real or realistic examples of:
- Founders using AI to validate ideas
- AI reviewing pitch decks using benchmarks
- AI advising on fundraising strategy
- AI comparing startups within an industry

Tie each example back to Supabase Vector usage.

---

## 6. How Retrieval Works (High-Level)
Describe the flow:
User question → vector retrieval → reasoning → advice

Include:
- When vectors are used
- When structured DB queries are used
- When web search is optional

---

## 7. Benefits of Using Supabase  
Explain benefits clearly:
- Security (RLS)
- Simplicity (single backend)
- Explainability
- Scalability
- Cost and control

Compare briefly to:
- Pure web-search-based AI
how can we use both 
---

## 8. Acceptance Criteria
Define what success looks like:
- How we know the AI is acting like an expert
- How answers are validated
- How hallucinations are prevented

---

## Output Requirements
- Use **Markdown**
- Clear headings and bullet points
- Practical, product-focused
- No fluff, no theory-only sections
- Think like this will be handed to an engineering + product team

Do NOT write code unless it is essential to explain the concept.
Focus on strategy, architecture, and real-world application.
