Right Panel Intelligence: ⓘ Button + AI Detail Panel                                                         
                         
 Context

 The Validator Report page (ValidatorReport.tsx) shows a 14-section report. Currently there's a collapsible
 right panel that only contains section navigation links. The user wants to transform this into an AI-powered
 intelligence panel: add an ⓘ button to each section card, and when clicked, fetch deeper context from Gemini
 Flash and display it in the right panel. Main column content stays unchanged. Plan spec:
 tasks/validator/reports/04-report-plan.md.

 Implementation Steps

 Step 1: Edge Function - Schema + Prompt + Handler

 Create supabase/functions/validator-panel-detail/ with 3 files:

 schema.ts - TypeScript interfaces + Gemini JSON schema:
 - PanelDetailResponse: section_number, more_detail (string), why_this_matters (string), risks_gaps (string[],
 max 3), validate_next (string[], max 3)
 - panelDetailResponseSchema: JSON schema object for responseJsonSchema option (G1)

 prompt.ts - System prompt:
 - Section-specific focus table (14 entries from plan doc)
 - Rules: never repeat summary, add NEW info, ~120 words total, plain language
 - Output structure for the 4 blocks

 index.ts - Handler following validator-followup pattern:
 - CORS: getCorsHeaders + handleCors from _shared/cors.ts
 - Auth: supabase.auth.getUser() with forwarded Authorization header
 - Rate limit: RATE_LIMITS.standard (30 req/min)
 - Body: { report_id, section_number, section_title, section_content, score?, dimension_score? }
 - Gemini call: callGemini('gemini-3-flash-preview', prompt, userPrompt, { responseJsonSchema, timeoutMs:
 10000, maxRetries: 1, maxOutputTokens: 512 })
 - Parse: extractJSON<PanelDetailResponse>(result.text)
 - Return: { success: true, data: parsed }

 Step 2: React Hook - src/hooks/useReportPanelDetail.ts

 - In-memory cache: useRef<Map<number, PanelDetailResponse>>
 - State: loading, error, data, currentSection
 - fetchPanelDetail(reportId, sectionNumber, sectionTitle, sectionContent, score?, dimensionScore?):
   - Check cache -> instant return if hit
   - Call supabase.functions.invoke('validator-panel-detail', { body }) on miss
   - Store in cache on success

 Step 3: Right Panel Component - src/components/validator/ReportRightPanel.tsx

 Single component with 4 states:
 - Empty: Icon + "Click the ⓘ button on any section..."
 - Loading: 4 Skeleton blocks (from @/components/ui/skeleton)
 - Error: Red border card with error message
 - Loaded: 4 content blocks with dividers

 Content blocks (inline, no separate InfoBlock/BulletBlock files -- too simple to warrant separate components):
 1. MORE DETAIL - uppercase label + paragraph (~40 words)
 2. WHY THIS MATTERS - uppercase label + paragraph (~25 words)
 3. RISKS & GAPS - uppercase label + bullet list (max 3)
 4. VALIDATE NEXT - uppercase label + bullet list (max 3)

 Props: isOpen, onClose, sectionNumber, sectionTitle, data, loading, error
 Styling: sticky top-20, w-80, order-2, border-l

 Step 4: Modify ValidatorReport.tsx

 State changes (line 125):
 - Replace sectionsOpen with panelOpen + selectedSection
 - Import and use useReportPanelDetail hook
 - Import ReportRightPanel component
 - Add Info to lucide-react imports (alongside existing List, ChevronDown, etc.)
 - Change floating button icon from List to Lightbulb (add import)

 ReportSection component (lines 1213-1271):
 - Add onInfoClick?: (n: number) => void to props
 - Add ⓘ button in header, between badges and chevron
 - e.stopPropagation() to prevent section toggle when clicking ⓘ
 - Hidden on mobile: hidden lg:flex

 Right panel (lines 461-511):
 - Replace section nav links with <ReportRightPanel> component
 - Keep same flex order-2 pattern and floating toggle
 - Change toggle icon to Lightbulb

 Section info handler (add around line 200):
 - handleSectionInfoClick(sectionNumber) callback
 - Maps section number to title + content string from details.*
 - Calls fetchPanelDetail(...) with report context

 All 14 ReportSection usages (lines 516-1200):
 - Add onInfoClick={handleSectionInfoClick} prop to each

 Step 5: Deploy + Test

 1. Deploy: supabase functions deploy validator-panel-detail
 2. Build: npm run build
 3. Browser test: click ⓘ on section 1, verify panel shows 4 blocks
 4. Cache test: click ⓘ on section 1 again, verify instant display
 5. Different section: click ⓘ on section 3, verify content updates

 Files
 ┌────────┬─────────────────────────────────────────────────────┐
 │ Action │                        File                         │
 ├────────┼─────────────────────────────────────────────────────┤
 │ Create │ supabase/functions/validator-panel-detail/index.ts  │
 ├────────┼─────────────────────────────────────────────────────┤
 │ Create │ supabase/functions/validator-panel-detail/schema.ts │
 ├────────┼─────────────────────────────────────────────────────┤
 │ Create │ supabase/functions/validator-panel-detail/prompt.ts │
 ├────────┼─────────────────────────────────────────────────────┤
 │ Create │ src/hooks/useReportPanelDetail.ts                   │
 ├────────┼─────────────────────────────────────────────────────┤
 │ Create │ src/components/validator/ReportRightPanel.tsx       │
 ├────────┼─────────────────────────────────────────────────────┤
 │ Modify │ src/pages/ValidatorReport.tsx                       │
 └────────┴─────────────────────────────────────────────────────┘
 Reuse

 - _shared/gemini.ts: callGemini, extractJSON (no changes)
 - _shared/cors.ts: getCorsHeaders, handleCors (no changes)
 - _shared/rate-limit.ts: checkRateLimit, RATE_LIMITS (no changes)
 - @/components/ui/skeleton: Loading state
 - supabase.functions.invoke: Frontend API call pattern

 Verification

 1. npm run build passes with zero errors
 2. Edge function deploys successfully
 3. Click ⓘ on any section -> panel opens with loading skeleton -> 4 content blocks render
 4. Click ⓘ on same section again -> instant from cache (no network call)
 5. Close panel -> floating toggle visible -> click toggle -> panel opens with empty state
 6. Mobile (<1024px): ⓘ button and panel hidden
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌