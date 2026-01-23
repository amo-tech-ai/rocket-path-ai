# Task 04: Step 3 — Smart Interview

**Status:** READY FOR IMPLEMENTATION
**Priority:** P0 - Critical
**Depends on:** Task 03 (Step 2)
**Estimated:** 4-5 hours
**Backend Actions:** `get_questions`, `process_answer`

---

## Overview

Step 3 is a **conversational interview** with adaptive questions. One question at a time, AI extracts signals and traction data from answers.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Step 3: Smart Interview                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Question 4 of 12                               │  ALEX CHEN             │
│                                                 │  SaaS Advisor          │
│  ┌─────────────────────────────────────────┐   │                        │
│  │                                         │   │  👤 "I've advised      │
│  │  What's your current monthly            │   │      200+ SaaS         │
│  │  recurring revenue (MRR)?               │   │      startups."        │
│  │                                         │   │                        │
│  │  ○ Pre-revenue (no MRR yet)             │   │  ─────────────────     │
│  │                                         │   │                        │
│  │  ○ Less than $1K MRR                    │   │  WHY THIS QUESTION     │
│  │                                         │   │                        │
│  │  ○ $1K - $10K MRR                       │   │  "MRR tells investors  │
│  │                                         │   │   about your growth    │
│  │  ● $10K - $50K MRR          ← selected  │   │   stage and validates  │
│  │                                         │   │   product-market fit." │
│  │  ○ $50K - $100K MRR                     │   │                        │
│  │                                         │   │  ─────────────────     │
│  │  ○ More than $100K MRR                  │   │                        │
│  │                                         │   │  BENCHMARK             │
│  └─────────────────────────────────────────┘   │                        │
│                                                 │  Pre-seed SaaS:        │
│  Answer honestly — accuracy improves your      │  Good: $1K-$10K        │
│  score more than optimism.                     │  Great: $10K+          │
│                                                 │                        │
│  [Skip Question]              [Continue →]     │  ─────────────────     │
│                                                 │                        │
│                                                 │  SIGNALS DETECTED      │
│                                                 │  • b2b_saas            │
│                                                 │  • has_revenue ✨ new  │
│                                                 │  • early_traction      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Files to Create

```
src/components/onboarding/step3/
├── Step3Interview.tsx         # Main step component
├── QuestionCard.tsx           # Question display
├── AnswerOptions.tsx          # Radio/checkbox/chip options
├── AnswerTextInput.tsx        # Text/number input for some questions
├── InterviewProgress.tsx      # Question X of Y progress
├── TopicChecklist.tsx         # Topics covered checklist
├── SignalBadges.tsx           # Detected signals display
├── AdvisorPanel.tsx           # Advisor persona in right panel
└── BenchmarkCard.tsx          # Industry benchmark context
```

---

## Component Specifications

### 1. Step3Interview.tsx

**Purpose:** Main container managing interview flow

```tsx
interface Step3InterviewProps {
  sessionId: string;
  onComplete: () => void;
  initialAnswers: InterviewAnswer[];
  initialSignals: string[];
}

interface InterviewState {
  questions: Question[];
  currentIndex: number;
  answers: InterviewAnswer[];
  signals: string[];
  extractedTraction: TractionData;
  extractedFunding: FundingData;
  advisor: AdvisorPersona;
  isLoading: boolean;
  isProcessing: boolean;
}
```

**State Machine:**
```
LOADING → READY → ANSWERING → PROCESSING → NEXT_QUESTION
                                    ↓
                              INTERVIEW_COMPLETE
```

---

### 2. QuestionCard.tsx

**Purpose:** Display single question with animation

```tsx
interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answerId: string, answerText?: string) => void;
  isProcessing: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'multi_select' | 'text' | 'number';
  options?: QuestionOption[];
  placeholder?: string;
  validation?: { min?: number; max?: number; minLength?: number };
  topic: string;
  why_matters: string;
}

interface QuestionOption {
  id: string;
  text: string;
  emoji?: string; // Optional emoji prefix
}
```

**Animation:**
- Slide in from right on new question
- Fade out to left on answer
- Use Framer Motion for smooth transitions

---

### 3. AnswerOptions.tsx

**Purpose:** Render answer options based on question type

```tsx
interface AnswerOptionsProps {
  type: 'multiple_choice' | 'multi_select' | 'text' | 'number';
  options?: QuestionOption[];
  value: string | string[] | number | null;
  onChange: (value: string | string[] | number) => void;
  disabled: boolean;
}
```

**Multiple Choice (Radio):**
```tsx
<RadioGroup value={value} onValueChange={onChange}>
  {options.map(opt => (
    <RadioGroupItem key={opt.id} value={opt.id}>
      {opt.emoji && <span className="mr-2">{opt.emoji}</span>}
      {opt.text}
    </RadioGroupItem>
  ))}
</RadioGroup>
```

**Multi Select (Checkboxes):**
```tsx
<div className="space-y-2">
  {options.map(opt => (
    <Checkbox
      key={opt.id}
      checked={value.includes(opt.id)}
      onCheckedChange={(checked) => {
        if (checked) onChange([...value, opt.id]);
        else onChange(value.filter(v => v !== opt.id));
      }}
    >
      {opt.text}
    </Checkbox>
  ))}
</div>
```

**Dynamic Chips (AI-Generated):**
```tsx
<div className="flex flex-wrap gap-2">
  {options.map(opt => (
    <Badge
      key={opt.id}
      variant={value === opt.id ? 'default' : 'outline'}
      className="cursor-pointer"
      onClick={() => onChange(opt.id)}
    >
      {opt.text}
    </Badge>
  ))}
</div>
```

---

### 4. InterviewProgress.tsx

**Purpose:** Show question progress

```tsx
interface InterviewProgressProps {
  current: number;
  total: number;
  topicsCovered: string[];
  allTopics: string[];
}
```

**Visual:**
```
Question 4 of 12
████████░░░░░░░░░░░░ 33%

TOPICS
☑ Business Model
☑ Market
☐ Traction
☐ Team
☐ Funding
```

---

### 5. SignalBadges.tsx

**Purpose:** Display accumulated signals

```tsx
interface SignalBadgesProps {
  signals: string[];
  newSignals: string[]; // Highlight recently added
}
```

**Signal Display:**
```tsx
const SIGNAL_LABELS: Record<string, { label: string; color: string }> = {
  b2b_saas: { label: 'B2B SaaS', color: 'bg-blue-100 text-blue-800' },
  has_revenue: { label: 'Has Revenue', color: 'bg-green-100 text-green-800' },
  pre_revenue: { label: 'Pre-Revenue', color: 'bg-gray-100 text-gray-800' },
  raising_seed: { label: 'Raising Seed', color: 'bg-purple-100 text-purple-800' },
  technical_founder: { label: 'Technical Team', color: 'bg-orange-100 text-orange-800' },
  early_traction: { label: 'Early Traction', color: 'bg-teal-100 text-teal-800' },
  product_market_fit: { label: 'PMF Signals', color: 'bg-emerald-100 text-emerald-800' },
};
```

**Animation:** New signals pulse/glow briefly when added.

---

### 6. AdvisorPanel.tsx

**Purpose:** Advisor persona with contextual help

```tsx
interface AdvisorPanelProps {
  advisor: AdvisorPersona;
  currentQuestion: Question;
  benchmark?: BenchmarkData;
}

interface AdvisorPersona {
  name: string;
  title: string;
  avatar?: string;
  intro: string;
}

interface BenchmarkData {
  stage: string;
  industry: string;
  good_range: string;
  great_range: string;
}
```

**Visual:**
```
┌─────────────────────────┐
│  👤 ALEX CHEN           │
│     SaaS Advisor        │
│                         │
│  "I've advised 200+     │
│   SaaS startups from    │
│   idea to Series A."    │
├─────────────────────────┤
│  WHY THIS QUESTION      │
│                         │
│  "{question.why_matters}"│
├─────────────────────────┤
│  BENCHMARK              │
│                         │
│  Pre-seed SaaS:         │
│  Good: $1K-$10K MRR     │
│  Great: $10K+ MRR       │
└─────────────────────────┘
```

---

## Question Flow Logic

### Load Questions
```typescript
const loadQuestions = async () => {
  const { data } = await supabase.functions.invoke('onboarding-agent', {
    body: {
      action: 'get_questions',
      session_id: sessionId,
      answered_question_ids: answers.map(a => a.question_id),
    },
  });

  return {
    questions: data.questions,
    advisor: data.advisor,
  };
};
```

### Process Answer
```typescript
const processAnswer = async (questionId: string, answerId: string, answerText?: string) => {
  setIsProcessing(true);

  const { data } = await supabase.functions.invoke('onboarding-agent', {
    body: {
      action: 'process_answer',
      session_id: sessionId,
      question_id: questionId,
      answer_id: answerId,
      answer_text: answerText,
    },
  });

  // Update state with extracted data
  setSignals(prev => [...new Set([...prev, ...data.signals])]);

  if (data.extracted_data.current_mrr) {
    setExtractedTraction(prev => ({ ...prev, current_mrr: data.extracted_data.current_mrr }));
  }
  if (data.extracted_data.is_raising !== undefined) {
    setExtractedFunding(prev => ({ ...prev, is_raising: data.extracted_data.is_raising }));
  }

  // Move to next question
  setCurrentIndex(prev => prev + 1);
  setIsProcessing(false);
};
```

### Skip Question
```typescript
const skipQuestion = () => {
  // Don't call process_answer, just move forward
  setCurrentIndex(prev => prev + 1);
};
```

---

## Question Types

### Type A: Multiple Choice (Most Common)
```json
{
  "id": "q_mrr",
  "text": "What's your current monthly recurring revenue (MRR)?",
  "type": "multiple_choice",
  "options": [
    { "id": "pre_revenue", "text": "Pre-revenue (no MRR yet)" },
    { "id": "under_1k", "text": "Less than $1K MRR" },
    { "id": "1k_10k", "text": "$1K - $10K MRR" },
    { "id": "10k_50k", "text": "$10K - $50K MRR" },
    { "id": "50k_100k", "text": "$50K - $100K MRR" },
    { "id": "over_100k", "text": "More than $100K MRR" }
  ],
  "topic": "traction",
  "why_matters": "MRR tells investors about your growth stage and validates product-market fit."
}
```

### Type B: Dynamic Chips (AI-Generated)
```json
{
  "id": "q_value_drivers",
  "text": "Which parts of your product deliver the most value to users today?",
  "type": "multi_select",
  "options": [
    { "id": "workflow_automation", "text": "Workflow automation" },
    { "id": "collaboration", "text": "Collaboration / approvals" },
    { "id": "analytics", "text": "Analytics & insights" },
    { "id": "ai_creation", "text": "AI-assisted creation" },
    { "id": "integrations", "text": "Integrations" },
    { "id": "compliance", "text": "Compliance / governance" }
  ],
  "topic": "product",
  "why_matters": "Understanding your value drivers helps investors assess defensibility."
}
```

### Type C: Growth Channel
```json
{
  "id": "q_growth_channel",
  "text": "How are new users finding you right now?",
  "type": "multiple_choice",
  "options": [
    { "id": "founder_led", "text": "Founder-led outreach (manual sales)" },
    { "id": "referrals", "text": "Referrals / word of mouth" },
    { "id": "organic", "text": "Organic inbound (SEO, content, social)" },
    { "id": "partnerships", "text": "Partnerships" },
    { "id": "paid", "text": "Paid acquisition" },
    { "id": "not_active", "text": "Not actively acquiring users yet" }
  ],
  "topic": "traction",
  "why_matters": "Your growth channel reveals scalability potential and CAC efficiency."
}
```

### Type D: Funding Status
```json
{
  "id": "q_raising",
  "text": "Are you currently raising funding?",
  "type": "multiple_choice",
  "options": [
    { "id": "not_raising", "text": "Not raising right now" },
    { "id": "planning", "text": "Planning to raise in 3-6 months" },
    { "id": "actively", "text": "Actively raising now" },
    { "id": "closing", "text": "In final stages / closing" }
  ],
  "topic": "funding",
  "why_matters": "Your funding timeline affects how we prioritize your profile."
}
```

---

## Data Extraction Mapping

| Question Topic | Answer | Extracted Field |
|----------------|--------|-----------------|
| MRR | "$10K-$50K" | `extracted_traction.current_mrr: 30000` |
| Growth Rate | "10-20% MoM" | `extracted_traction.growth_rate: 15` |
| Users | "100-500" | `extracted_traction.users: 300` |
| Raising | "Actively raising" | `extracted_funding.is_raising: true` |
| Target Amount | "$500K" | `extracted_funding.target_amount: 500000` |
| Use of Funds | Multiple select | `extracted_funding.use_of_funds: ["Engineering", "Sales"]` |

---

## Session Updates

After each answer, `process_answer` updates:

```typescript
// wizard_sessions updates
{
  interview_answers: [...existing, newAnswer],
  interview_progress: Math.min((answeredCount / totalQuestions) * 100, 100),
  signals: [...existingSignals, ...newSignals],
  extracted_traction: { ...existing, ...newTraction },
  extracted_funding: { ...existing, ...newFunding },
  last_activity_at: new Date().toISOString(),
}
```

---

## Interview Completion

```typescript
const isInterviewComplete = () => {
  // Complete when all questions answered OR skipped
  return currentIndex >= questions.length;
};

// On completion
useEffect(() => {
  if (isInterviewComplete()) {
    // Allow proceeding to Step 4
    onComplete();
  }
}, [currentIndex, questions.length]);
```

---

## Right Panel Content (Step 3)

```tsx
// WizardAIPanel - Step 3
<div className="space-y-6">
  <AdvisorPanel
    advisor={advisor}
    currentQuestion={questions[currentIndex]}
  />

  <Separator />

  <div>
    <h4 className="font-medium mb-2">Why This Question</h4>
    <p className="text-sm text-muted-foreground">
      {questions[currentIndex]?.why_matters}
    </p>
  </div>

  <Separator />

  <BenchmarkCard
    stage={formData.stage}
    industry={formData.industry}
    topic={questions[currentIndex]?.topic}
  />

  <Separator />

  <div>
    <h4 className="font-medium mb-2">Signals Detected</h4>
    <SignalBadges
      signals={signals}
      newSignals={lastAddedSignals}
    />
  </div>
</div>
```

---

## Loading States

| Action | UI |
|--------|-----|
| Loading questions | Full page skeleton |
| Processing answer | "Continue" button disabled + spinner |
| Skip | Immediate transition (no loading) |

---

## Error Handling

| Error | User Action |
|-------|-------------|
| `get_questions` fails | Show generic questions from fallback |
| `process_answer` fails | Show error toast, allow retry |
| Network error | Queue answer, retry on reconnect |

---

## Accessibility

- Radio buttons keyboard navigable
- Focus moves to next question automatically
- Skip button always accessible
- Progress announced to screen readers

---

## Success Criteria

- [ ] Questions load from `get_questions` action
- [ ] One question displays at a time
- [ ] Answer options render correctly (radio/checkbox/chips)
- [ ] Selecting answer triggers `process_answer`
- [ ] Signals accumulate and display
- [ ] Progress bar updates correctly
- [ ] Topic checklist updates as topics covered
- [ ] Advisor panel shows contextual help
- [ ] Skip button works without blocking
- [ ] Smooth transitions between questions
- [ ] Interview completes after all questions
- [ ] Next button enabled when complete
- [ ] Back button returns to Step 2
- [ ] Extracted traction/funding data saved

---

## Next Task

`05-ui--step4-review.md` - Step 4 Review & Complete

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-01-23 | Initial task specification |
