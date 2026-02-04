# Playbooks

> Industry expertise for the coach

---

## What Playbooks Do

Coach uses playbooks to give **industry-specific** advice:

```
User: "I'm building a fintech app"
Coach: (loads fintech playbook) → knows regulations, benchmarks, competitors
```

---

## Available Industries (21)

| Industry | Key Expertise |
|----------|---------------|
| AI SaaS | Model costs, API pricing, usage-based billing |
| Fintech | Compliance, interchange, trust-building |
| Healthcare | HIPAA, reimbursement, clinical validation |
| E-commerce | AOV, CAC, fulfillment, DTC vs marketplace |
| Education | B2C vs B2B2C, completion rates, credentialing |
| Cybersecurity | Enterprise sales, compliance drivers |
| Legal/Professional | Billable hours, matter management |
| Travel/Hospitality | Seasonality, booking margins |
| Logistics | Unit economics, last-mile |
| Retail | Inventory, omnichannel |
| Fashion | Seasons, returns, influencers |
| Events | Ticketing, sponsors, attendance |
| Photography | Project-based, packages |
| Video Production | Scope creep, deliverables |
| Content Marketing | Engagement, attribution |
| Social Media | Algorithms, virality |
| CRM/Sales | Pipeline, conversion |
| Financial Services | AUM, advisory fees |
| + more | See `docs/playbooks/` |

---

## Playbook Structure

Each playbook contains:

| Section | Content |
|---------|---------|
| **Overview** | Industry size, growth, trends |
| **Business Models** | Common models, pricing |
| **Benchmarks** | Key metrics, targets |
| **Competitors** | Major players, positioning |
| **Regulations** | Compliance requirements |
| **Go-to-Market** | Channels that work |
| **Risks** | Common failure modes |

---

## How Coach Uses Playbooks

```
1. User selects industry (onboarding)
2. Coach loads playbook into context
3. Coach references benchmarks in advice
4. Coach warns about industry-specific risks
```

**Example:**
```
Coach: "For SaaS, you want monthly churn under 5%.
        You're at 8% - that's a red flag.
        Let's design an experiment to improve retention."
```

---

## Playbook Selection

| User Industry | Playbook Loaded |
|---------------|-----------------|
| SaaS | `ai-saas.md` |
| Fintech | `fintech.md` |
| Healthcare | `healthcare.md` |
| E-commerce | `ecommerce-pure.md` or `retail-ecommerce.md` |
| Unknown | `general` (startup fundamentals) |

---

## Key Benchmarks by Industry

### SaaS
| Metric | Target |
|--------|--------|
| Monthly churn | < 5% |
| LTV:CAC | > 3:1 |
| Payback period | < 12 months |
| NRR | > 100% |

### Marketplace
| Metric | Target |
|--------|--------|
| Take rate | 10-20% |
| Liquidity | > 70% |
| Repeat rate | > 30% |

### E-commerce
| Metric | Target |
|--------|--------|
| CAC | < 30% of first order |
| Repeat rate | > 25% |
| Return rate | < 20% |

---

## Prompt Injection

When coach responds, industry context is injected:

```
System: You are a startup coach.
        Industry: SaaS
        Benchmarks: {from playbook}
        Risks: {from playbook}
        Competitors: {from playbook}

        Use this context when advising the founder.
```

---

## Storage

Playbooks stored as markdown in:
```
docs/playbooks/
├── ai-saas.md
├── fintech.md
├── healthcare.md
└── ... (21 files)
```

**Not in database** - loaded at runtime based on startup.industry.

---

## Future: Vector Search

When we add RAG:
- Chunk playbooks into embeddings
- Retrieve relevant sections dynamically
- More precise context injection

**Not needed for MVP** - full playbook in context works.

---

## Keep It Simple

- 21 playbooks ready to use
- Load based on industry
- Inject into coach prompt
- Reference benchmarks in advice
