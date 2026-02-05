# StartupAI Remaining Modules Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the remaining 13% of StartupAI by implementing Documents, Settings, and connecting deployed edge functions to frontend hooks.

**Architecture:** Each task wires existing deployed edge functions to React Query hooks, or builds missing UI pages using existing shadcn/ui components and the established DashboardLayout pattern.

**Tech Stack:** React 18, TypeScript, TanStack Query, shadcn/ui, Supabase Edge Functions (Deno), Tailwind CSS

---

## Priority Order

| Priority | Module | Current | Target | Impact |
|----------|--------|---------|--------|--------|
| P0 | Hook-to-Edge wiring | 0% | 100% | 5 hooks call Supabase directly instead of their deployed edge functions |
| P1 | Documents Module | 10% | 80% | Core feature, placeholder only |
| P2 | Settings Module | 30% | 80% | User-facing, placeholder tabs |
| P3 | Projects Detail Page | 60% | 90% | Missing detail view |

### Deferred (P3+, not in this plan)
- GTM Strategy Module (0%) — needs product design first
- Discovery Module (0%) — needs product design first
- Strategy Module (0%) — needs product design first

---

## Task 1: Wire CRM Hook to crm-agent Edge Function

**Files:**
- Modify: `src/hooks/useCRM.ts`

**Context:** `crm-agent` edge function is deployed and handles contact/deal AI operations. The `useCRM` hook currently makes direct Supabase queries. Add an `invokeCRMAgent` helper that calls the edge function for AI-powered operations while keeping direct queries for CRUD.

**Step 1:** Read `src/hooks/useCRM.ts` and `supabase/functions/crm-agent/index.ts` to understand current patterns.

**Step 2:** Add `invokeCRMAgent` function using the same `supabase.functions.invoke` pattern from `src/hooks/onboarding/invokeAgent.ts`.

**Step 3:** Verify the hook exports correctly and existing CRUD operations still work.

**Step 4:** Commit: `feat: wire useCRM hook to crm-agent edge function`

---

## Task 2: Wire Investor Hook to investor-agent Edge Function

**Files:**
- Modify: `src/hooks/useInvestors.ts`

**Step 1:** Read both files, add `invokeInvestorAgent` helper.

**Step 2:** Wire AI matching/scoring operations to edge function.

**Step 3:** Commit: `feat: wire useInvestors hook to investor-agent edge function`

---

## Task 3: Wire Events Hook to event-agent Edge Function

**Files:**
- Modify: `src/hooks/useEvents.ts` (or equivalent)

**Step 1:** Read both files, add `invokeEventAgent` helper.

**Step 2:** Wire AI enrichment operations to edge function.

**Step 3:** Commit: `feat: wire useEvents hook to event-agent edge function`

---

## Task 4: Wire Documents Hook to documents-agent Edge Function

**Files:**
- Modify: `src/hooks/useDocuments.ts` (or create if missing)

**Step 1:** Read `supabase/functions/documents-agent/index.ts` to understand available actions.

**Step 2:** Create or modify the hook with `invokeDocumentsAgent` + React Query mutations.

**Step 3:** Commit: `feat: wire useDocuments hook to documents-agent edge function`

---

## Task 5: Wire Chatbot Hook to chatbot-agent Edge Function

**Files:**
- Modify: `src/hooks/useChatbot.ts` (or equivalent)

**Step 1:** Read `supabase/functions/chatbot-agent/index.ts`.

**Step 2:** Create or modify the hook with `invokeChatbotAgent`.

**Step 3:** Commit: `feat: wire useChatbot hook to chatbot-agent edge function`

---

## Task 6: Documents Module — List & Upload Page

**Files:**
- Modify: `src/pages/Documents.tsx` (currently placeholder)
- Create: `src/components/documents/DocumentsList.tsx`
- Create: `src/components/documents/DocumentUpload.tsx`

**Step 1:** Read current `Documents.tsx` placeholder and the documents table schema.

**Step 2:** Build `DocumentsList` with TanStack Query fetching from `documents` table. Use `Table` component from shadcn/ui.

**Step 3:** Build `DocumentUpload` with Supabase Storage upload + documents-agent for AI processing.

**Step 4:** Wire into `Documents.tsx` page with DashboardLayout.

**Step 5:** Commit: `feat: implement documents list and upload page`

---

## Task 7: Documents Module — AI Generate & Detail View

**Files:**
- Create: `src/components/documents/DocumentDetail.tsx`
- Create: `src/components/documents/AIGenerateDialog.tsx`

**Step 1:** Build document detail view with content display.

**Step 2:** Build AI generate dialog that calls `documents-agent` for document generation.

**Step 3:** Commit: `feat: add document detail view and AI generation`

---

## Task 8: Settings Module — Profile & Appearance Tabs

**Files:**
- Modify: `src/pages/Settings.tsx`
- Create: `src/components/settings/ProfileSettings.tsx`
- Create: `src/components/settings/AppearanceSettings.tsx`

**Step 1:** Read current Settings placeholder.

**Step 2:** Build ProfileSettings with avatar upload (Cloudinary), name/email display, timezone.

**Step 3:** Build AppearanceSettings with theme toggle (already have dark mode support in Tailwind config).

**Step 4:** Wire tabs into Settings page.

**Step 5:** Commit: `feat: implement settings profile and appearance tabs`

---

## Task 9: Settings Module — Notifications & Account Tabs

**Files:**
- Create: `src/components/settings/NotificationSettings.tsx`
- Create: `src/components/settings/AccountSettings.tsx`

**Step 1:** Build NotificationSettings with email preference toggles.

**Step 2:** Build AccountSettings with account deletion flow (with confirmation dialog).

**Step 3:** Commit: `feat: implement settings notification and account tabs`

---

## Task 10: Projects Detail Page

**Files:**
- Create: `src/pages/ProjectDetail.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1:** Read existing projects list page and data model.

**Step 2:** Build ProjectDetail page with project info, tasks list, team members.

**Step 3:** Add route `/projects/:id` in App.tsx.

**Step 4:** Commit: `feat: implement project detail page`

---

## Verification Checklist

After all tasks:
1. `npm run build` — zero errors
2. `npm run lint` — zero errors
3. `npm run test` — all pass
4. Manual test: navigate to Documents, Settings, Project detail pages
5. Verify edge function calls work via browser Network tab
