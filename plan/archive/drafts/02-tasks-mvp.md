# MVP Phase Tasks

> **Version:** 1.0 | **Updated:** 2026-02-02
> **Phase:** MVP (Weeks 7-12)
> **Question:** Does it solve the main problem?
> **Milestone:** Users can validate ideas reliably

---

## Executive Summary

The MVP phase delivers the core value of StartupAI: helping founders validate their business ideas through the Lean Canvas, Validation Lab, and AI-powered guidance via Atlas.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MVP PHASE TASK FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Week 7-8              Week 9-10             Week 11-12                    │
│   ─────────             ──────────            ───────────                   │
│   CNV-001 → CNV-005     VAL-001 → VAL-005    CHT-001 → CHT-005             │
│   Lean Canvas           Validation Lab        Atlas Chat                    │
│   AGT-001               AGT-002               AGT-003                       │
│                                                                              │
│   Deliverable:          Deliverable:          Deliverable:                  │
│   Canvas + AI Assist    Experiments Work      Full AI Guidance             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Supabase Schema Additions

```sql
-- Migration: 20260202100000_mvp_schema.sql

-- 1. Lean Canvas Versions
CREATE TABLE IF NOT EXISTS public.lean_canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  problem JSONB DEFAULT '[]',
  customer_segments JSONB DEFAULT '[]',
  uvp TEXT,
  solution JSONB DEFAULT '[]',
  channels JSONB DEFAULT '[]',
  revenue JSONB DEFAULT '[]',
  costs JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '[]',
  unfair_advantage TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Assumptions
CREATE TABLE IF NOT EXISTS public.assumptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  canvas_block TEXT NOT NULL,
  content TEXT NOT NULL,
  impact INTEGER DEFAULT 5,
  uncertainty INTEGER DEFAULT 5,
  status TEXT DEFAULT 'untested',
  experiment_id UUID REFERENCES public.experiments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Experiments
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  assumption_id UUID REFERENCES public.assumptions(id),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  hypothesis TEXT,
  success_criteria JSONB DEFAULT '{}',
  sample_size INTEGER,
  duration_days INTEGER,
  status TEXT DEFAULT 'draft',
  results JSONB DEFAULT '{}',
  learning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 4. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  agent_used TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Prompt Pack Progress
CREATE TABLE IF NOT EXISTS public.prompt_pack_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  pack_id TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  responses JSONB DEFAULT '{}',
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_lean_canvases_startup ON public.lean_canvases(startup_id);
CREATE INDEX idx_assumptions_startup ON public.assumptions(startup_id);
CREATE INDEX idx_experiments_startup ON public.experiments(startup_id);
CREATE INDEX idx_chat_messages_startup ON public.chat_messages(startup_id);

-- RLS Policies
ALTER TABLE public.lean_canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_pack_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own startup's data
CREATE POLICY "Users access own canvases" ON public.lean_canvases
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );

CREATE POLICY "Users access own assumptions" ON public.assumptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );

CREATE POLICY "Users access own experiments" ON public.experiments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );

CREATE POLICY "Users access own chat messages" ON public.chat_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );

CREATE POLICY "Users access own prompt progress" ON public.prompt_pack_progress
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.startups WHERE id = startup_id AND user_id = auth.uid())
  );
```

---

## Task: CNV-001 — Canvas Editor Shell

```yaml
---
task_id: CNV-001
title: Create Lean Canvas Editor Shell
diagram_ref: D-06
behavior: "Canvas page shows 9-block grid layout"
prd_ref: "Section 5: Lean Canvas System"
phase: MVP
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/startup]
subagents: [frontend-designer, startup-expert]
---
```

### User Story

> **As a** founder
> **I want** to see my Lean Canvas in a visual grid layout
> **So that** I can understand and edit my business model

### Real-World Example

*Chen opens the Canvas page and sees all 9 blocks laid out in the classic Lean Canvas format. The Problem block shows content from onboarding. Incomplete blocks are highlighted with a subtle prompt to fill them.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Lean Canvas for EcoPackage                               [Export] [History ▾] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┬───────────────────────────────┬─────────────────────┐     │
│  │    PROBLEM      │         SOLUTION              │   UNFAIR ADVANTAGE  │     │
│  │                 │                               │                      │     │
│  │  1. E-commerce  │  1. Compostable boxes        │  Patent-pending      │     │
│  │     plastic     │  2. Custom branding          │  material formula    │     │
│  │     waste       │  3. Bulk pricing             │                      │     │
│  │  2. Brand image │                               │  ✏️ Edit             │     │
│  │     damage      │  ✏️ Edit                      │                      │     │
│  │                 │                               │                      │     │
│  │  ✏️ Edit        │                               │                      │     │
│  ├─────────────────┼───────────────────────────────┼─────────────────────┤     │
│  │     KEY         │         UVP                   │       CHANNELS      │     │
│  │    METRICS      │                               │                      │     │
│  │                 │  "Packaging that's           │  • Direct sales      │     │
│  │  • CAC          │   good for Earth and         │  • Shopify app       │     │
│  │  • LTV          │   your bottom line"          │  • Trade shows       │     │
│  │  • Repeat rate  │                               │                      │     │
│  │                 │  ✏️ Edit                      │  ✏️ Edit             │     │
│  │  ✏️ Edit        │                               │                      │     │
│  ├─────────────────┼───────────────────────────────┼─────────────────────┤     │
│  │    CUSTOMER     │                               │   REVENUE STREAMS   │     │
│  │    SEGMENTS     │        COST STRUCTURE         │                      │     │
│  │                 │                               │  • Per-unit pricing  │     │
│  │  E-commerce     │  • Materials                  │  • Volume discounts  │     │
│  │  brands selling │  • Manufacturing             │  • Custom orders     │     │
│  │  $1M-10M/year   │  • Fulfillment               │                      │     │
│  │                 │                               │  ✏️ Edit             │     │
│  │  ✏️ Edit        │  ✏️ Edit                      │                      │     │
│  └─────────────────┴───────────────────────────────┴─────────────────────┘     │
│                                                                                  │
│  Canvas Score: 72% complete   [💡 Get AI Suggestions]   [Extract Assumptions]   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Canvas Page**
   ```typescript
   // src/pages/Canvas.tsx
   export function CanvasPage() {
     const { startup } = useStartup();
     const { data: canvas, isLoading } = useCanvas(startup?.id);

     if (isLoading) return <CanvasSkeleton />;

     return (
       <DashboardLayout>
         <div className="space-y-6">
           <header className="flex justify-between items-center">
             <h1 className="text-2xl font-bold">
               Lean Canvas for {startup?.name}
             </h1>
             <div className="flex gap-2">
               <Button variant="outline">Export</Button>
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="outline">History ▾</Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent>
                   <VersionHistory canvasId={canvas?.id} />
                 </DropdownMenuContent>
               </DropdownMenu>
             </div>
           </header>

           <CanvasGrid canvas={canvas} />

           <footer className="flex justify-between items-center">
             <CanvasScore score={canvas?.score || 0} />
             <div className="flex gap-2">
               <Button variant="outline">
                 <Sparkles className="h-4 w-4 mr-2" />
                 Get AI Suggestions
               </Button>
               <Button variant="outline">Extract Assumptions</Button>
             </div>
           </footer>
         </div>
       </DashboardLayout>
     );
   }
   ```

2. **Create Canvas Grid Component**
   ```typescript
   // src/components/canvas/CanvasGrid.tsx
   const BLOCK_LAYOUT = [
     // Row 1
     { id: 'problem', col: '1', row: '1 / 3', title: 'Problem' },
     { id: 'solution', col: '2', row: '1 / 3', title: 'Solution' },
     { id: 'uvp', col: '3', row: '1 / 2', title: 'Unique Value Proposition' },
     { id: 'unfair_advantage', col: '4', row: '1 / 2', title: 'Unfair Advantage' },
     // Row 2
     { id: 'metrics', col: '1', row: '3 / 4', title: 'Key Metrics' },
     { id: 'channels', col: '4', row: '2 / 3', title: 'Channels' },
     // Row 3
     { id: 'customer_segments', col: '2', row: '3 / 4', title: 'Customer Segments' },
     { id: 'costs', col: '3', row: '2 / 4', title: 'Cost Structure' },
     { id: 'revenue', col: '4', row: '3 / 4', title: 'Revenue Streams' },
   ];

   export function CanvasGrid({ canvas }: { canvas: LeanCanvas }) {
     return (
       <div className="grid grid-cols-4 gap-4 min-h-[600px]">
         {BLOCK_LAYOUT.map((block) => (
           <CanvasBlock
             key={block.id}
             block={block}
             content={canvas[block.id as keyof LeanCanvas]}
             style={{
               gridColumn: block.col,
               gridRow: block.row,
             }}
           />
         ))}
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/pages/Canvas.tsx` | Create |
| `src/components/canvas/CanvasGrid.tsx` | Create |
| `src/components/canvas/CanvasBlock.tsx` | Create |
| `src/components/canvas/CanvasSkeleton.tsx` | Create |
| `src/hooks/useCanvas.ts` | Create |

### Acceptance Criteria

- [ ] Canvas page loads with 9-block grid
- [ ] Each block shows title and content
- [ ] Blocks are clickable for editing
- [ ] Export button visible
- [ ] History dropdown shows versions
- [ ] Canvas score displays completion %

### Effort

- **Time:** 6-8 hours
- **Complexity:** Medium

---

## Task: CNV-002 — Block Editor Component

```yaml
---
task_id: CNV-002
title: Create Canvas Block Editor
diagram_ref: D-06
behavior: "User can edit individual canvas blocks"
prd_ref: "Section 5.1: The 9 Blocks"
phase: MVP
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/startup]
subagents: [frontend-designer]
depends_on: CNV-001
---
```

### User Story

> **As a** founder
> **I want** to click on a canvas block and edit it
> **So that** I can iteratively refine my business model

### Real-World Example

*Amanda clicks the "Problem" block. A modal slides in from the right showing her current entries (3 problems listed). She adds a 4th problem, reorders them by drag-drop, and clicks "Save". The canvas updates immediately.*

### UI/UX Layout (Block Editor Modal)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                                      PROBLEM BLOCK      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  What are the top 3 problems your customers face?               │
│                                                                  │
│  Tip: Focus on pain points, not features you want to build.     │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ≡ 1. E-commerce companies waste $50B/year on plastic     │  │
│  │      packaging that damages their brand                   │  │
│  │                                                    [×]    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ≡ 2. Customers increasingly boycott brands using         │  │
│  │      non-sustainable packaging                            │  │
│  │                                                    [×]    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ≡ 3. Sustainable alternatives are 3x more expensive      │  │
│  │                                                    [×]    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [+ Add another problem]                                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 💡 AI Suggestion:                                         │  │
│  │ "Regulations are tightening - EU bans single-use plastic │  │
│  │  packaging by 2030"                                       │  │
│  │                                   [Use This] [Get More]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                    [Cancel]  [Save Changes]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Block Editor Sheet**
   ```typescript
   // src/components/canvas/BlockEditor.tsx
   interface BlockEditorProps {
     block: CanvasBlockConfig;
     content: string[] | string;
     onSave: (content: string[] | string) => void;
     onClose: () => void;
   }

   export function BlockEditor({ block, content, onSave, onClose }: BlockEditorProps) {
     const [items, setItems] = useState<string[]>(
       Array.isArray(content) ? content : [content]
     );
     const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

     const sensors = useSensors(
       useSensor(PointerSensor),
       useSensor(KeyboardSensor)
     );

     const handleDragEnd = (event: DragEndEvent) => {
       const { active, over } = event;
       if (active.id !== over?.id) {
         setItems((items) => {
           const oldIndex = items.indexOf(active.id as string);
           const newIndex = items.indexOf(over?.id as string);
           return arrayMove(items, oldIndex, newIndex);
         });
       }
     };

     const getAiSuggestion = async () => {
       const { data } = await supabase.functions.invoke('lean-canvas-agent', {
         body: {
           action: 'suggest_content',
           block: block.id,
           current_content: items,
           startup_id
         }
       });
       setAiSuggestion(data.suggestion);
     };

     return (
       <Sheet open onOpenChange={onClose}>
         <SheetContent className="w-[500px]">
           <SheetHeader>
             <SheetTitle>{block.title}</SheetTitle>
             <SheetDescription>{BLOCK_TIPS[block.id]}</SheetDescription>
           </SheetHeader>

           <div className="py-6 space-y-4">
             <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
               <SortableContext items={items}>
                 {items.map((item, index) => (
                   <SortableItem
                     key={item}
                     id={item}
                     index={index}
                     onRemove={() => setItems(items.filter((_, i) => i !== index))}
                     onUpdate={(value) => {
                       const newItems = [...items];
                       newItems[index] = value;
                       setItems(newItems);
                     }}
                   />
                 ))}
               </SortableContext>
             </DndContext>

             <Button
               variant="ghost"
               onClick={() => setItems([...items, ''])}
             >
               + Add another {block.singularName}
             </Button>

             {aiSuggestion && (
               <Card className="bg-blue-50 dark:bg-blue-950">
                 <CardContent className="p-4">
                   <p className="text-sm mb-2">💡 AI Suggestion:</p>
                   <p className="text-sm">{aiSuggestion}</p>
                   <div className="flex gap-2 mt-2">
                     <Button size="sm" onClick={() => {
                       setItems([...items, aiSuggestion]);
                       setAiSuggestion(null);
                     }}>
                       Use This
                     </Button>
                     <Button size="sm" variant="ghost" onClick={getAiSuggestion}>
                       Get More
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             )}
           </div>

           <SheetFooter>
             <Button variant="outline" onClick={onClose}>Cancel</Button>
             <Button onClick={() => {
               onSave(items.filter(Boolean));
               onClose();
             }}>
               Save Changes
             </Button>
           </SheetFooter>
         </SheetContent>
       </Sheet>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/components/canvas/BlockEditor.tsx` | Create |
| `src/components/canvas/SortableItem.tsx` | Create |
| `src/lib/canvasConstants.ts` | Create |

### Acceptance Criteria

- [ ] Clicking block opens editor
- [ ] Items are editable inline
- [ ] Drag-drop reordering works
- [ ] Add/remove items works
- [ ] AI suggestion button works
- [ ] Save persists to database

### Effort

- **Time:** 6-8 hours
- **Complexity:** Medium

---

## Task: CNV-003 — AI Content Suggestion

```yaml
---
task_id: CNV-003
title: Implement AI Content Suggestion for Blocks
diagram_ref: D-06
behavior: "AI suggests content when user opens block"
prd_ref: "Section 5.2: Canvas AI Features"
phase: MVP
priority: P1
status: Not Started
percent_complete: 0
category: Full Stack
primary_skill: /gemini
secondary_skills: [/edge-functions, /startup]
subagents: [ai-agent-dev, startup-expert]
depends_on: CNV-002
---
```

### User Story

> **As a** founder stuck on a canvas block
> **I want** AI to suggest content based on my context
> **So that** I can overcome writer's block

### Real-World Example

*Mark is stuck on the "Unfair Advantage" block. He clicks "Get AI Help" and Atlas suggests: "Based on your founder profiles showing 15 years in sustainable materials R&D, your unfair advantage is: 'Deep domain expertise in biodegradable polymers + existing relationships with major e-commerce platforms.'" Mark edits it slightly and saves.*

### Implementation Steps

1. **Create Edge Function**
   ```typescript
   // supabase/functions/lean-canvas-agent/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

   const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);

   const BLOCK_PROMPTS = {
     problem: `Suggest 3 specific problems for this startup's target market.
               Focus on quantifiable pain points (time, money, frustration).
               Each problem should be 1-2 sentences.`,

     customer_segments: `Define the ideal early adopter segment.
                         Be psychographic (behavior, values) not just demographic.
                         Include specific job titles or roles when relevant.`,

     uvp: `Generate 3 unique value proposition options.
           Each must be under 120 characters.
           Format: "We help [customer] achieve [outcome] by [method]."`,

     solution: `Suggest 3 MVP features that directly address the stated problems.
                Focus on outcomes, not technical features.
                Each should be testable in under 2 weeks.`,

     channels: `Recommend 3 customer acquisition channels.
                Prioritize channels where early adopters hang out.
                Include specific tactics (not just "social media").`,

     revenue: `Suggest revenue model options based on industry and customer type.
               Include pricing anchors and willingness-to-pay considerations.`,

     costs: `Identify the main cost categories.
             Estimate relative size (high/medium/low).
             Flag any costs that scale with users.`,

     metrics: `Recommend the One Metric That Matters (OMTM) for current stage.
               Add 3-4 supporting metrics.
               Include target values based on industry benchmarks.`,

     unfair_advantage: `Identify what could be truly defensible.
                        Consider: founder expertise, relationships, data, network effects.
                        Be honest - "none yet" is valid.`
   };

   serve(async (req) => {
     const { action, block, current_content, startup_id } = await req.json();

     // Verify JWT
     const authHeader = req.headers.get("Authorization");
     const supabase = createClient(
       Deno.env.get("SUPABASE_URL")!,
       Deno.env.get("SUPABASE_ANON_KEY")!,
       { global: { headers: { Authorization: authHeader! } } }
     );

     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error("Unauthorized");

     // Load startup context
     const { data: startup } = await supabase
       .from('startups')
       .select('*, playbooks!startup_playbooks(*)')
       .eq('id', startup_id)
       .single();

     if (action === 'suggest_content') {
       const model = genAI.getGenerativeModel({
         model: "gemini-3-flash-preview",
         generationConfig: {
           responseMimeType: "application/json",
           responseSchema: {
             type: "object",
             properties: {
               suggestion: { type: "string" },
               reasoning: { type: "string" }
             }
           }
         }
       });

       const prompt = `You are helping a ${startup.industry} startup complete their Lean Canvas.

       Startup: ${startup.name}
       Description: ${startup.description}
       Stage: ${startup.stage}
       Current ${block} content: ${JSON.stringify(current_content)}

       ${BLOCK_PROMPTS[block]}

       Provide ONE specific suggestion that builds on their existing content.
       Be concise and actionable.`;

       const result = await model.generateContent(prompt);
       const response = JSON.parse(result.response.text());

       return new Response(JSON.stringify({
         success: true,
         suggestion: response.suggestion,
         reasoning: response.reasoning
       }), {
         headers: { "Content-Type": "application/json" }
       });
     }

     if (action === 'detect_bias') {
       const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

       const prompt = `Analyze this Lean Canvas Problem block for "solution-first thinking":

       Content: ${JSON.stringify(current_content)}

       Solution-first thinking = describing a feature/solution instead of a customer pain point.

       Return JSON: { hasBias: boolean, explanation: string, suggestion: string }`;

       const result = await model.generateContent(prompt);
       return new Response(result.response.text(), {
         headers: { "Content-Type": "application/json" }
       });
     }
   });
   ```

### Core MVP Prompt for Block Suggestions

```
You are a Lean Startup methodology expert helping founders complete their Lean Canvas.

CONTEXT:
- Startup: {name}
- Industry: {industry}
- Stage: {stage}
- Current block: {block_name}
- Existing content: {current_content}
- Playbook: {playbook_name}

TASK: {block_specific_prompt}

RULES:
1. Be specific to this startup's context, not generic
2. Reference industry benchmarks when relevant
3. If the existing content shows bias (solution-first thinking), flag it
4. Suggest ONE thing, not multiple options
5. Keep suggestions under 100 words
6. Format for easy editing by the founder

OUTPUT FORMAT:
{
  "suggestion": "The specific content suggestion",
  "reasoning": "Why this suggestion fits their context",
  "warning": null | "Warning if bias detected"
}
```

### Files

| File | Action |
|------|--------|
| `supabase/functions/lean-canvas-agent/index.ts` | Create |
| `src/components/canvas/AiSuggestionCard.tsx` | Create |

### Acceptance Criteria

- [ ] "Get AI Suggestion" button triggers edge function
- [ ] Suggestion appears in UI
- [ ] User can accept or regenerate
- [ ] Bias detection warns on solution-first thinking
- [ ] Context includes startup data and playbook

### Effort

- **Time:** 8-10 hours
- **Complexity:** High

---

## Task: CNV-004 — Assumption Extraction

```yaml
---
task_id: CNV-004
title: Extract Assumptions from Canvas
diagram_ref: D-06
behavior: "System auto-extracts testable assumptions from canvas"
prd_ref: "Section 5.2: Canvas AI Features"
phase: MVP
priority: P1
status: Not Started
percent_complete: 0
category: Full Stack
primary_skill: /gemini
secondary_skills: [/edge-functions, /startup]
subagents: [ai-agent-dev, startup-expert]
depends_on: CNV-003
---
```

### User Story

> **As a** founder
> **I want** assumptions automatically extracted from my canvas
> **So that** I can prioritize what to validate first

### Real-World Example

*After Priya completes her Problem and Customer blocks, she clicks "Extract Assumptions". The system identifies 5 assumptions:*
1. *"SMB e-commerce owners spend 3+ hours/week on packaging decisions" (High Impact, High Uncertainty)*
2. *"Customers will pay 20% more for eco-friendly packaging" (High Impact, Medium Uncertainty)*
*She can click any assumption to design an experiment.*

### UI/UX Layout (Assumption List)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Assumptions from your Lean Canvas                        [Extract More]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Risk Score: Impact × Uncertainty    [Sort: Risk ▾]                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 🔴 HIGH RISK                                                            ││
│  │                                                                          ││
│  │ ⬜ SMB e-commerce owners spend 3+ hours/week on packaging decisions     ││
│  │    From: Problem block   |   Impact: 9   |   Uncertainty: 8             ││
│  │    Status: Untested                              [Design Experiment →]  ││
│  │                                                                          ││
│  │ ⬜ Customers will pay 20% premium for eco-friendly packaging            ││
│  │    From: Revenue block   |   Impact: 10  |   Uncertainty: 7             ││
│  │    Status: Untested                              [Design Experiment →]  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 🟡 MEDIUM RISK                                                          ││
│  │                                                                          ││
│  │ ✅ E-commerce is growing 15% YoY in target segment                      ││
│  │    From: Customer block  |   Impact: 6   |   Uncertainty: 3             ││
│  │    Status: Validated (via market research)                              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Add Extraction Logic to Edge Function**
   ```typescript
   // In lean-canvas-agent/index.ts

   if (action === 'extract_assumptions') {
     const { data: canvas } = await supabase
       .from('lean_canvases')
       .select('*')
       .eq('startup_id', startup_id)
       .order('version', { ascending: false })
       .limit(1)
       .single();

     const model = genAI.getGenerativeModel({
       model: "gemini-3-pro-preview",
       generationConfig: {
         responseMimeType: "application/json",
         responseSchema: {
           type: "object",
           properties: {
             assumptions: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   content: { type: "string" },
                   source_block: { type: "string" },
                   impact: { type: "number" },
                   uncertainty: { type: "number" },
                   experiment_type: { type: "string" }
                 }
               }
             }
           }
         }
       }
     });

     const prompt = `Analyze this Lean Canvas and extract testable assumptions.

     Canvas:
     - Problem: ${JSON.stringify(canvas.problem)}
     - Customer Segments: ${JSON.stringify(canvas.customer_segments)}
     - UVP: ${canvas.uvp}
     - Solution: ${JSON.stringify(canvas.solution)}
     - Channels: ${JSON.stringify(canvas.channels)}
     - Revenue: ${JSON.stringify(canvas.revenue)}
     - Costs: ${JSON.stringify(canvas.costs)}
     - Metrics: ${JSON.stringify(canvas.metrics)}
     - Unfair Advantage: ${canvas.unfair_advantage}

     For each assumption:
     1. Write it as a testable hypothesis ("X will Y")
     2. Score Impact (1-10): How much does being wrong hurt?
     3. Score Uncertainty (1-10): How unsure are we?
     4. Suggest experiment type: interview, landing_page, concierge, wizard_of_oz, preorder

     Extract 5-10 assumptions, prioritizing high-impact, high-uncertainty ones.`;

     const result = await model.generateContent(prompt);
     const { assumptions } = JSON.parse(result.response.text());

     // Save to database
     for (const assumption of assumptions) {
       await supabase.from('assumptions').insert({
         startup_id,
         canvas_block: assumption.source_block,
         content: assumption.content,
         impact: assumption.impact,
         uncertainty: assumption.uncertainty
       });
     }

     return new Response(JSON.stringify({ success: true, assumptions }));
   }
   ```

2. **Create Assumption List Component**
   ```typescript
   // src/components/canvas/AssumptionList.tsx
   export function AssumptionList({ startupId }: { startupId: string }) {
     const { data: assumptions } = useAssumptions(startupId);

     const sortedAssumptions = useMemo(() => {
       return [...(assumptions || [])].sort((a, b) => {
         const riskA = a.impact * a.uncertainty;
         const riskB = b.impact * b.uncertainty;
         return riskB - riskA;
       });
     }, [assumptions]);

     const getRiskLevel = (impact: number, uncertainty: number) => {
       const risk = impact * uncertainty;
       if (risk >= 50) return 'high';
       if (risk >= 25) return 'medium';
       return 'low';
     };

     return (
       <div className="space-y-4">
         <header className="flex justify-between">
           <h2 className="text-lg font-semibold">Assumptions from your Lean Canvas</h2>
           <Button onClick={extractAssumptions}>Extract More</Button>
         </header>

         {['high', 'medium', 'low'].map((level) => {
           const filtered = sortedAssumptions.filter(
             (a) => getRiskLevel(a.impact, a.uncertainty) === level
           );
           if (filtered.length === 0) return null;

           return (
             <Card key={level}>
               <CardHeader>
                 <CardTitle className={cn(
                   level === 'high' && 'text-red-500',
                   level === 'medium' && 'text-yellow-500',
                   level === 'low' && 'text-green-500'
                 )}>
                   {level.toUpperCase()} RISK
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 {filtered.map((assumption) => (
                   <AssumptionCard
                     key={assumption.id}
                     assumption={assumption}
                     onDesignExperiment={() => navigate(`/validation?assumption=${assumption.id}`)}
                   />
                 ))}
               </CardContent>
             </Card>
           );
         })}
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `supabase/functions/lean-canvas-agent/index.ts` | Modify |
| `src/components/canvas/AssumptionList.tsx` | Create |
| `src/components/canvas/AssumptionCard.tsx` | Create |
| `src/hooks/useAssumptions.ts` | Create |

### Acceptance Criteria

- [ ] "Extract Assumptions" generates 5-10 assumptions
- [ ] Each assumption has impact/uncertainty scores
- [ ] Assumptions saved to database
- [ ] Risk level grouping works
- [ ] "Design Experiment" links to Validation Lab

### Effort

- **Time:** 6-8 hours
- **Complexity:** Medium

---

## Task: VAL-001 — Experiment Designer

```yaml
---
task_id: VAL-001
title: Create Experiment Designer
diagram_ref: D-07
behavior: "User can design validation experiments"
prd_ref: "Section 6: Validation Lab"
phase: MVP
priority: P0
status: Not Started
percent_complete: 0
category: Full Stack
primary_skill: /feature-dev
secondary_skills: [/startup, /gemini]
subagents: [startup-expert, ai-agent-dev]
depends_on: CNV-004
---
```

### User Story

> **As a** founder with a risky assumption
> **I want** help designing a validation experiment
> **So that** I can test it systematically

### Real-World Example

*Tom selects his assumption "SMB owners will pay 20% more for eco packaging" and clicks "Design Experiment". Atlas suggests a "Pre-order Test" with:*
- *Hypothesis: "If we offer eco-packaging at $1.20/unit (vs $1.00 standard), 10% of visitors will pre-order"*
- *Success Criteria: ≥10% conversion rate*
- *Sample Size: 100 unique visitors*
- *Duration: 2 weeks*
*Tom tweaks the numbers and starts the experiment.*

### UI/UX Layout (Experiment Designer)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Design Your Experiment                                              [×]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Testing: "SMB owners will pay 20% premium for eco-friendly packaging"      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Experiment Type                                                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐              │
│  │ Interview  │ │ Landing    │ │ Pre-order  │ │ Concierge  │              │
│  │            │ │ Page       │ │   ✓        │ │            │              │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘              │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Hypothesis                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ If we offer eco-packaging at $1.20/unit (vs $1.00 standard), at least  ││
│  │ 10% of landing page visitors will click "Pre-order Now"                ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│  💡 AI generated based on your assumption                                   │
│                                                                              │
│  Success Criteria                                                           │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐        │
│  │ Metric: Conversion Rate      │  │ Target: ≥10%                 │        │
│  └──────────────────────────────┘  └──────────────────────────────┘        │
│                                                                              │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐        │
│  │ Sample Size: 100 visitors    │  │ Duration: 14 days            │        │
│  └──────────────────────────────┘  └──────────────────────────────┘        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  What you'll need:                                                          │
│  ☐ Landing page with pricing                                                │
│  ☐ Payment integration (or fake door)                                       │
│  ☐ Traffic source ($100-500 ad budget recommended)                          │
│                                                                              │
│                               [Save as Draft]  [Start Experiment →]          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Edge Function**
   ```typescript
   // supabase/functions/experiment-designer/index.ts
   const EXPERIMENT_TYPES = {
     interview: {
       name: 'Customer Interview',
       sampleSize: { min: 10, recommended: 15, max: 30 },
       duration: { min: 7, recommended: 14, max: 28 },
       successMetric: 'problem_severity_rating',
       requirements: ['Interview script', 'Calendar availability', 'Recording tool']
     },
     landing_page: {
       name: 'Landing Page Test',
       sampleSize: { min: 50, recommended: 100, max: 500 },
       duration: { min: 7, recommended: 14, max: 30 },
       successMetric: 'signup_rate',
       requirements: ['Landing page', 'Email capture', 'Traffic source']
     },
     preorder: {
       name: 'Pre-order Test',
       sampleSize: { min: 50, recommended: 100, max: 200 },
       duration: { min: 14, recommended: 21, max: 30 },
       successMetric: 'preorder_rate',
       requirements: ['Pricing page', 'Payment form', 'Traffic source']
     },
     concierge: {
       name: 'Concierge MVP',
       sampleSize: { min: 5, recommended: 10, max: 20 },
       duration: { min: 14, recommended: 28, max: 60 },
       successMetric: 'satisfaction_score',
       requirements: ['Manual process', 'Customer access', 'Feedback collection']
     }
   };

   serve(async (req) => {
     const { action, assumption_id, experiment_type, startup_id } = await req.json();

     if (action === 'generate_experiment') {
       const { data: assumption } = await supabase
         .from('assumptions')
         .select('*')
         .eq('id', assumption_id)
         .single();

       const { data: startup } = await supabase
         .from('startups')
         .select('*')
         .eq('id', startup_id)
         .single();

       const typeConfig = EXPERIMENT_TYPES[experiment_type];

       const model = genAI.getGenerativeModel({
         model: "gemini-3-pro-preview",
         generationConfig: {
           responseMimeType: "application/json"
         }
       });

       const prompt = `Design a ${typeConfig.name} experiment to test this assumption:

       Assumption: "${assumption.content}"
       Startup: ${startup.name} - ${startup.description}
       Industry: ${startup.industry}

       Generate:
       1. A specific hypothesis in "If [action], then [measurable outcome]" format
       2. Success criteria with specific numeric target
       3. Sample size recommendation
       4. Duration recommendation
       5. Step-by-step execution plan

       Return JSON with: hypothesis, success_metric, success_target, sample_size, duration_days, execution_steps`;

       const result = await model.generateContent(prompt);
       const experiment = JSON.parse(result.response.text());

       return new Response(JSON.stringify({
         success: true,
         experiment: {
           ...experiment,
           type: experiment_type,
           requirements: typeConfig.requirements
         }
       }));
     }
   });
   ```

### Core MVP Prompt for Experiments

```
You are a Lean Startup validation expert designing experiments.

CONTEXT:
- Startup: {name} ({industry})
- Assumption to test: {assumption_content}
- Experiment type: {type}
- Stage: {stage}

EXPERIMENT DESIGN RULES:
1. Hypothesis must be falsifiable: "If [action], then [measurable outcome]"
2. Success criteria must be numeric and specific
3. Sample size follows statistical significance rules:
   - Interviews: 10-15 for qualitative insights
   - Landing pages: 100+ visitors for 10%+ conversion detection
   - Pre-orders: 50+ for willingness-to-pay validation
4. Duration should balance learning speed with statistical validity
5. Execution steps should be actionable for a solo founder

OUTPUT:
{
  "hypothesis": "If we X, then Y% of Z will W",
  "success_metric": "metric_name",
  "success_target": "≥X%",
  "sample_size": 100,
  "duration_days": 14,
  "execution_steps": ["Step 1...", "Step 2..."],
  "learning_goal": "What we'll know after this experiment"
}
```

### Files

| File | Action |
|------|--------|
| `supabase/functions/experiment-designer/index.ts` | Create |
| `src/pages/Validation.tsx` | Create |
| `src/components/validation/ExperimentDesigner.tsx` | Create |
| `src/components/validation/ExperimentTypeSelector.tsx` | Create |

### Acceptance Criteria

- [ ] Experiment type selector with 4+ options
- [ ] AI generates hypothesis from assumption
- [ ] Success criteria are editable
- [ ] Requirements checklist displayed
- [ ] Can save draft or start experiment
- [ ] Saved experiments appear in list

### Effort

- **Time:** 8-10 hours
- **Complexity:** High

---

## Task: CHT-001 — Chat Interface

```yaml
---
task_id: CHT-001
title: Create Atlas Chat Interface
diagram_ref: D-11
behavior: "User can chat with Atlas AI"
prd_ref: "Section 9: Atlas AI Advisor"
phase: MVP
priority: P0
status: Not Started
percent_complete: 0
category: Frontend
primary_skill: /frontend-design
secondary_skills: [/sdk-agent]
subagents: [frontend-designer, ai-agent-dev]
---
```

### User Story

> **As a** founder with a question
> **I want** to chat with Atlas
> **So that** I get context-aware guidance

### Real-World Example

*At 11pm, Kira has a question about pricing strategy. She opens Atlas chat and types "How should I price my B2B SaaS product?". Atlas responds with specific advice based on her industry (SaaS), stage (MVP), and what she's already entered in her canvas.*

### UI/UX Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  💬 Atlas AI                                              [New Chat] [⚙️]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Today                                                                   ││
│  │                                                                          ││
│  │  👤 You                                                        11:02 PM ││
│  │  How should I price my B2B SaaS product?                                ││
│  │                                                                          ││
│  │  🤖 Atlas                                                      11:02 PM ││
│  │  Based on your SaaS product targeting SMB e-commerce (from your        ││
│  │  customer segment), here's a pricing framework:                         ││
│  │                                                                          ││
│  │  1. **Value-based pricing**: Your eco-packaging saves ~$5K/year        ││
│  │     in brand damage prevention. Price at 10-20% of value saved.        ││
│  │                                                                          ││
│  │  2. **Industry benchmarks**: B2B SaaS for SMB typically runs           ││
│  │     $50-200/month per seat.                                             ││
│  │                                                                          ││
│  │  3. **Your stage**: At MVP, start with a simple tier and add           ││
│  │     complexity later based on feedback.                                 ││
│  │                                                                          ││
│  │  **Recommendation**: Start at $99/month with a 14-day free trial.      ││
│  │                                                                          ││
│  │  Want me to help you design a pricing experiment to validate this?     ││
│  │                                                                          ││
│  │  [Yes, design experiment] [Show alternatives] [Update Canvas]           ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 💬 Ask Atlas anything...                                        [Send] ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Suggested: "Help with UVP" | "Design experiment" | "Analyze metrics"      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Chat Page**
   ```typescript
   // src/pages/Chat.tsx
   export function ChatPage() {
     const { startup } = useStartup();
     const [messages, setMessages] = useState<ChatMessage[]>([]);
     const [input, setInput] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const messagesEndRef = useRef<HTMLDivElement>(null);

     const { data: history } = useChatHistory(startup?.id);

     useEffect(() => {
       if (history) setMessages(history);
     }, [history]);

     const sendMessage = async () => {
       if (!input.trim()) return;

       const userMessage: ChatMessage = {
         role: 'user',
         content: input,
         created_at: new Date().toISOString()
       };

       setMessages((prev) => [...prev, userMessage]);
       setInput('');
       setIsLoading(true);

       try {
         const { data } = await supabase.functions.invoke('ai-chat', {
           body: {
             message: input,
             startup_id: startup?.id,
             screen: 'chat'
           }
         });

         const assistantMessage: ChatMessage = {
           role: 'assistant',
           content: data.response,
           agent_used: data.agent_used,
           actions: data.actions,
           created_at: new Date().toISOString()
         };

         setMessages((prev) => [...prev, assistantMessage]);
       } catch (error) {
         toast.error('Failed to get response from Atlas');
       } finally {
         setIsLoading(false);
       }
     };

     return (
       <DashboardLayout>
         <div className="flex flex-col h-[calc(100vh-120px)]">
           <header className="flex justify-between items-center pb-4 border-b">
             <h1 className="text-xl font-bold flex items-center gap-2">
               <Bot className="h-5 w-5" />
               Atlas AI
             </h1>
             <div className="flex gap-2">
               <Button variant="outline" size="sm">New Chat</Button>
               <Button variant="ghost" size="sm">
                 <Settings className="h-4 w-4" />
               </Button>
             </div>
           </header>

           <div className="flex-1 overflow-y-auto py-4 space-y-4">
             {messages.map((message, index) => (
               <MessageBubble key={index} message={message} />
             ))}
             {isLoading && <TypingIndicator />}
             <div ref={messagesEndRef} />
           </div>

           <footer className="pt-4 border-t">
             <div className="flex gap-2">
               <Input
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask Atlas anything..."
                 onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
               />
               <Button onClick={sendMessage} disabled={isLoading}>
                 <Send className="h-4 w-4" />
               </Button>
             </div>
             <div className="flex gap-2 mt-2">
               {SUGGESTED_PROMPTS.map((prompt) => (
                 <Button
                   key={prompt}
                   variant="ghost"
                   size="sm"
                   onClick={() => setInput(prompt)}
                 >
                   {prompt}
                 </Button>
               ))}
             </div>
           </footer>
         </div>
       </DashboardLayout>
     );
   }
   ```

2. **Create Message Bubble Component**
   ```typescript
   // src/components/chat/MessageBubble.tsx
   export function MessageBubble({ message }: { message: ChatMessage }) {
     const isUser = message.role === 'user';

     return (
       <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
         <div className={cn(
           "max-w-[80%] rounded-lg p-4",
           isUser ? "bg-primary text-primary-foreground" : "bg-muted"
         )}>
           <div className="flex items-center gap-2 mb-2 text-sm opacity-70">
             {isUser ? (
               <>
                 <User className="h-4 w-4" />
                 You
               </>
             ) : (
               <>
                 <Bot className="h-4 w-4" />
                 Atlas
                 {message.agent_used && (
                   <Badge variant="secondary" className="text-xs">
                     {message.agent_used}
                   </Badge>
                 )}
               </>
             )}
             <span>{formatTime(message.created_at)}</span>
           </div>

           <div className="prose prose-sm dark:prose-invert">
             <ReactMarkdown>{message.content}</ReactMarkdown>
           </div>

           {message.actions && (
             <div className="flex gap-2 mt-4">
               {message.actions.map((action) => (
                 <Button key={action.id} size="sm" variant="outline">
                   {action.label}
                 </Button>
               ))}
             </div>
           )}
         </div>
       </div>
     );
   }
   ```

### Files

| File | Action |
|------|--------|
| `src/pages/Chat.tsx` | Create |
| `src/components/chat/MessageBubble.tsx` | Create |
| `src/components/chat/TypingIndicator.tsx` | Create |
| `src/hooks/useChatHistory.ts` | Create |

### Acceptance Criteria

- [ ] Chat interface renders with message history
- [ ] User can type and send messages
- [ ] Atlas responds with markdown-formatted text
- [ ] Action buttons appear when relevant
- [ ] Suggested prompts help users start
- [ ] Loading indicator during AI response

### Effort

- **Time:** 6-8 hours
- **Complexity:** Medium

---

## Task: AGT-001 — Canvas Agent Edge Function

```yaml
---
task_id: AGT-001
title: Implement Canvas Agent
diagram_ref: D-08
behavior: "AI agent guides canvas completion with context"
prd_ref: "Section 9.2: Specialized Agents"
phase: MVP
priority: P0
status: Not Started
percent_complete: 0
category: Backend
primary_skill: /gemini
secondary_skills: [/edge-functions, /startup]
subagents: [ai-agent-dev, startup-expert]
depends_on: CNV-003
---
```

### Implementation

See CNV-003 for the lean-canvas-agent implementation. This task covers additional capabilities:

1. **Block-specific guidance**
2. **Bias detection**
3. **Assumption extraction**
4. **Cross-block consistency checks**

### Files

| File | Action |
|------|--------|
| `supabase/functions/lean-canvas-agent/index.ts` | Modify |

---

## Task: CHT-003 — Context Builder

```yaml
---
task_id: CHT-003
title: Implement Chat Context Builder
diagram_ref: D-11
behavior: "Chat includes startup context for relevant responses"
prd_ref: "Section 9.3: Knowledge Injection"
phase: MVP
priority: P0
status: Not Started
percent_complete: 0
category: Backend
primary_skill: /gemini
secondary_skills: [/edge-functions, /startup]
subagents: [ai-agent-dev]
depends_on: CHT-001
---
```

### User Story

> **As a** founder chatting with Atlas
> **I want** responses based on my startup's context
> **So that** advice is specific to my situation, not generic

### Implementation Steps

1. **Create ai-chat Edge Function**
   ```typescript
   // supabase/functions/ai-chat/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

   const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY")!);

   const CORE_IDENTITY = `You are Atlas, the AI advisor for StartupAI.
   You help startup founders validate ideas, build products, and grow companies.

   Your methodology is based on:
   - Lean Startup (Eric Ries)
   - Customer Development (Steve Blank)
   - Running Lean (Ash Maurya)
   - The Mom Test (Rob Fitzpatrick)

   RULES:
   1. Always reference the founder's specific context
   2. Suggest ONE specific next action
   3. Challenge assumptions constructively
   4. Never encourage building before validation
   5. Link advice to metrics when possible`;

   async function buildContext(supabase: any, startup_id: string, screen: string) {
     // Load startup data
     const { data: startup } = await supabase
       .from('startups')
       .select('*, startup_playbooks(*, playbooks(*))')
       .eq('id', startup_id)
       .single();

     // Load canvas
     const { data: canvas } = await supabase
       .from('lean_canvases')
       .select('*')
       .eq('startup_id', startup_id)
       .order('version', { ascending: false })
       .limit(1)
       .single();

     // Load recent experiments
     const { data: experiments } = await supabase
       .from('experiments')
       .select('*')
       .eq('startup_id', startup_id)
       .order('created_at', { ascending: false })
       .limit(5);

     // Load recent messages for conversation context
     const { data: messages } = await supabase
       .from('chat_messages')
       .select('*')
       .eq('startup_id', startup_id)
       .order('created_at', { ascending: false })
       .limit(10);

     const playbook = startup?.startup_playbooks?.[0]?.playbooks;

     return `
     ${CORE_IDENTITY}

     CURRENT CONTEXT:

     Startup: ${startup?.name}
     Description: ${startup?.description}
     Industry: ${startup?.industry}
     Stage: ${startup?.stage}
     Playbook: ${playbook?.name || 'None assigned'}

     Lean Canvas:
     - Problem: ${JSON.stringify(canvas?.problem || [])}
     - Customer Segments: ${JSON.stringify(canvas?.customer_segments || [])}
     - UVP: ${canvas?.uvp || 'Not defined'}
     - Solution: ${JSON.stringify(canvas?.solution || [])}
     - Canvas Score: ${canvas?.score || 0}%

     Recent Experiments:
     ${experiments?.map(e => `- ${e.name} (${e.status}): ${e.learning || 'In progress'}`).join('\n') || 'None yet'}

     Current Screen: ${screen}

     STAGE-SPECIFIC GUIDANCE (${startup?.stage}):
     ${STAGE_GUIDANCE[startup?.stage] || 'Focus on validation before building.'}

     Previous conversation:
     ${messages?.slice().reverse().map(m => `${m.role}: ${m.content}`).join('\n') || 'New conversation'}
     `;
   }

   serve(async (req) => {
     const { message, startup_id, screen } = await req.json();

     // Verify JWT
     const authHeader = req.headers.get("Authorization");
     const supabase = createClient(
       Deno.env.get("SUPABASE_URL")!,
       Deno.env.get("SUPABASE_ANON_KEY")!,
       { global: { headers: { Authorization: authHeader! } } }
     );

     const { data: { user } } = await supabase.auth.getUser();
     if (!user) throw new Error("Unauthorized");

     // Build context
     const context = await buildContext(supabase, startup_id, screen);

     // Generate response
     const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

     const result = await model.generateContent([
       { role: 'user', parts: [{ text: context }] },
       { role: 'user', parts: [{ text: message }] }
     ]);

     const response = result.response.text();

     // Save messages
     await supabase.from('chat_messages').insert([
       { startup_id, role: 'user', content: message, context: { screen } },
       { startup_id, role: 'assistant', content: response, agent_used: 'atlas' }
     ]);

     return new Response(JSON.stringify({
       success: true,
       response,
       agent_used: 'atlas'
     }), {
       headers: { "Content-Type": "application/json" }
     });
   });
   ```

### Core MVP Prompt (Atlas System)

```
You are Atlas, the AI advisor for StartupAI.

IDENTITY:
- Expert in Lean Startup methodology
- Validation-first philosophy
- Direct but supportive communication style
- Always specific to the founder's context

CONTEXT FORMAT:
The system provides:
1. Startup profile (name, industry, stage)
2. Current Lean Canvas state
3. Recent experiments and learnings
4. Playbook for industry-specific guidance
5. Conversation history

RESPONSE RULES:
1. Reference specific data from context (e.g., "Your Problem block mentions...")
2. Suggest ONE specific next action
3. End with a question or action button when appropriate
4. Use markdown for formatting
5. Keep responses concise (under 300 words)
6. Never give generic advice - always tie to their data

FORBIDDEN:
- "You should build X" (encourage validation first)
- Generic startup advice not tied to their context
- Suggesting features before problem validation
- Long theoretical explanations

STAGE-SPECIFIC BEHAVIOR:
- Idea: Focus on problem clarity and customer interviews
- PSF: Focus on experiments and assumption testing
- MVP: Focus on scope and sprint planning
- Traction: Focus on metrics and growth
- Scale: Focus on fundraising and team
```

### Files

| File | Action |
|------|--------|
| `supabase/functions/ai-chat/index.ts` | Create/Modify |
| `supabase/functions/_shared/buildContext.ts` | Create |
| `supabase/functions/_shared/stageGuidance.ts` | Create |

### Acceptance Criteria

- [ ] Context includes startup profile
- [ ] Context includes canvas state
- [ ] Context includes recent experiments
- [ ] Context includes playbook data
- [ ] Responses reference specific user data
- [ ] Stage-appropriate guidance applied

### Effort

- **Time:** 8-10 hours
- **Complexity:** High

---

## Remaining MVP Tasks Summary

| Task ID | Title | Effort |
|---------|-------|--------|
| CNV-005 | Canvas Scoring Algorithm | 3-4 hours |
| VAL-002 | Interview Script Generator | 4-6 hours |
| VAL-003 | Landing Page Builder Integration | 4-6 hours |
| VAL-004 | Results Tracker | 4-6 hours |
| VAL-005 | Learning Log | 3-4 hours |
| CHT-002 | Message History & Persistence | 3-4 hours |
| CHT-004 | Agent Routing Logic | 4-6 hours |
| CHT-005 | Tool Execution (Actions) | 6-8 hours |
| AGT-002 | Experiment Designer Agent | 4-6 hours |
| AGT-003 | Atlas Orchestrator | 6-8 hours |

---

## Phase Validation

**MVP Phase is complete when:**

- [ ] User can view and edit all 9 Lean Canvas blocks
- [ ] AI suggests content for each block
- [ ] Assumptions are auto-extracted from canvas
- [ ] User can design validation experiments
- [ ] Experiment results are tracked
- [ ] Atlas chat works with full context
- [ ] At least 3 AI agents are functional

---

## Next Phase

After MVP completion, proceed to [`03-tasks-advanced.md`](03-tasks-advanced.md) for:
- Task Orchestration
- Pitch Deck Builder
- PMF Assessment
- Investor CRM

---

*Generated by Claude Code — 2026-02-02*
