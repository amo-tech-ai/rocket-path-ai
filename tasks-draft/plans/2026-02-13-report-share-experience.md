# Report Share Experience Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the share experience for validator reports — OG meta, view tracking, print styles, embed support, and error handling polish.

**Architecture:** 5 sub-prompts (SHR-18A–E) building on existing ~80% infrastructure. Migration + RPC first (18B), then frontend changes (18A/C/D/E). All modifications are additive — no breaking changes to existing flows.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind + shadcn/ui + Supabase (PostgreSQL + RLS + Edge Functions/Deno)

**Design Spec:** `tasks/prompts/design/18-report-share-experience.md`

**Style Guide:** `tasks/style-guide/lean-style-guide.md`

---

## Task 1: SHR-18B — Create share_views table + increment_share_access RPC

**Files:**
- Create: migration via `mcp__supabase__apply_migration`

**Step 1: Apply the migration**

Use the Supabase MCP `apply_migration` tool with name `share_view_tracking` and this SQL:

```sql
-- Enable pgcrypto for digest() function (IP hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- share_views table — per-view tracking
CREATE TABLE share_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES shareable_links(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent text,
  referrer text,
  country text
);

CREATE INDEX idx_share_views_link_id ON share_views(link_id);
CREATE INDEX idx_share_views_viewed_at ON share_views(viewed_at DESC);

ALTER TABLE share_views ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view analytics for their own links
CREATE POLICY "share_views_select_owner" ON share_views
  FOR SELECT TO authenticated
  USING (
    link_id IN (
      SELECT id FROM shareable_links
      WHERE created_by = auth.uid()
    )
  );

-- Service role can insert
CREATE POLICY "share_views_insert_service" ON share_views
  FOR INSERT TO service_role
  WITH CHECK (true);

-- increment_share_access RPC — called by fetchReportByToken
CREATE OR REPLACE FUNCTION increment_share_access(
  share_token text,
  viewer_ip text DEFAULT NULL,
  viewer_ua text DEFAULT NULL,
  viewer_referrer text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_link_id uuid;
BEGIN
  SELECT id INTO v_link_id
  FROM shareable_links
  WHERE token = share_token
    AND revoked_at IS NULL
    AND expires_at > now();

  IF v_link_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE shareable_links
  SET access_count = access_count + 1,
      last_accessed_at = now()
  WHERE id = v_link_id;

  INSERT INTO share_views (link_id, ip_hash, user_agent, referrer)
  VALUES (
    v_link_id,
    CASE WHEN viewer_ip IS NOT NULL
      THEN encode(digest(viewer_ip || 'startupai-salt', 'sha256'), 'hex')
      ELSE NULL
    END,
    left(viewer_ua, 500),
    left(viewer_referrer, 2000)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION increment_share_access TO anon;
GRANT EXECUTE ON FUNCTION increment_share_access TO authenticated;
```

**Step 2: Verify migration applied**

Run SQL via `mcp__supabase__execute_sql`:
```sql
SELECT count(*) FROM information_schema.tables WHERE table_name = 'share_views';
SELECT count(*) FROM pg_proc WHERE proname = 'increment_share_access';
```
Expected: both return 1.

**Step 3: Test the RPC**

Run SQL:
```sql
-- Should succeed silently (no valid token matches)
SELECT increment_share_access('fake-token-123', '127.0.0.1', 'TestAgent', 'https://test.com');
```
Expected: no error (silently returns for invalid tokens).

---

## Task 2: SHR-18B — Update useShareableLinks hook to pass tracking data

**Files:**
- Modify: `src/hooks/useShareableLinks.ts`

**Step 1: Update the RPC call in fetchReportByToken**

In `src/hooks/useShareableLinks.ts`, find the existing fire-and-forget RPC call (around line 148):

```typescript
// Current:
anonClient.rpc('increment_share_access', { share_token: token }).then(() => {});
```

Replace with:

```typescript
// Updated: pass tracking data
anonClient.rpc('increment_share_access', {
  share_token: token,
  viewer_ua: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  viewer_referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
}).catch(() => {}); // Fire and forget
```

**Step 2: Verify build**

Run: `npm run build`
Expected: clean build, no TS errors.

---

## Task 3: SHR-18C — Add print styles to index.css

**Files:**
- Modify: `src/index.css` (append at end)

**Step 1: Add @media print block**

Append to the end of `src/index.css`:

```css
/* ========== PRINT STYLES ========== */
@media print {
  /* Hide non-content elements */
  header, footer, nav,
  .sidebar, .sticky-score-bar,
  [data-no-print], .no-print,
  button, .share-dialog,
  .scroll-to-top {
    display: none !important;
  }

  /* Reset backgrounds for ink savings */
  body, .bg-background, .bg-card, .bg-background-secondary {
    background: white !important;
  }

  /* Force full width */
  main, .report-container, .report-content {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 0.5in !important;
  }

  /* Keep sections together */
  .report-section {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 0.25in;
  }

  /* Charts scale properly */
  svg {
    max-width: 100% !important;
    height: auto !important;
  }

  /* Show link URLs */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.75em;
    color: #676F7E;
  }
  a[href^="#"]::after,
  a[href^="javascript"]::after {
    content: none;
  }

  /* Print header (hidden on screen) */
  .print-header {
    display: block !important;
    text-align: center;
    padding: 0.25in 0;
    border-bottom: 2px solid #0E6249;
    margin-bottom: 0.25in;
  }

  /* Page setup */
  @page {
    size: A4;
    margin: 0.75in 0.5in;
  }

  /* Avoid orphan headings */
  h1, h2, h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* Score circle retains color */
  .score-circle {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: clean build.

---

## Task 4: SHR-18C — Add print header to ReportV2Layout + print button

**Files:**
- Modify: `src/components/validator/report/ReportV2Layout.tsx`
- Modify: `src/pages/ValidatorReport.tsx`
- Modify: `src/pages/SharedReport.tsx`

**Step 1: Add print-only header to ReportV2Layout**

In `ReportV2Layout.tsx`, add just above the first `<SectionShell>` or report content:

```tsx
{/* Print-only header — hidden on screen */}
<div className="print-header hidden">
  <p className="font-display text-lg" style={{ color: '#0E6249' }}>StartupAI</p>
  <p className="text-sm" style={{ color: '#676F7E' }}>
    Validation Report — Generated {report?.created_at ? new Date(report.created_at).toLocaleDateString() : ''}
  </p>
</div>
```

**Step 2: Add print button to ValidatorReport action bar**

In `ValidatorReport.tsx`, add a print button next to the existing Download/Share buttons. Import `Printer` from lucide-react:

```tsx
import { Printer } from 'lucide-react';
```

Add button:
```tsx
<Button variant="outline" size="sm" onClick={() => window.print()} className="no-print">
  <Printer className="h-4 w-4 mr-2" />
  Print
</Button>
```

**Step 3: Add print button to SharedReport action area**

Same pattern — add a Print button near the top of the shared report (before the CTA section).

**Step 4: Verify build**

Run: `npm run build`
Expected: clean build.

---

## Task 5: SHR-18A — Create share-meta edge function

**Files:**
- Create: `supabase/functions/share-meta/index.ts`

**Step 1: Create the edge function**

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  // Token from query param or path
  const token = url.searchParams.get("token") || url.pathname.split("/").pop();

  if (!token || token === "share-meta") {
    return new Response("Missing token", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Look up report via share token
  const { data: link } = await supabase
    .from("shareable_links")
    .select("resource_id, expires_at, revoked_at")
    .eq("token", token)
    .eq("resource_type", "validation_report")
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  const appUrl = Deno.env.get("APP_URL") || "https://startupai.app";

  if (!link) {
    // Invalid/expired — redirect to SPA (it handles error display)
    return new Response(null, {
      status: 302,
      headers: { Location: `${appUrl}/share/report/${token}` },
    });
  }

  const { data: report } = await supabase
    .from("validation_reports")
    .select("score, summary, details")
    .eq("id", link.resource_id)
    .single();

  const startupName = (report?.details as Record<string, unknown>)?.startup_name || "Startup";
  const score = report?.score || 0;
  const rawSummary = report?.summary || "AI-powered startup validation report";
  // Escape HTML entities and truncate
  const summary = String(rawSummary)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, 160);
  const safeTitle = String(startupName)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const ogImage = `${appUrl}/og-share.png`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Startup Validation: ${safeTitle} — Score ${score}/100 | StartupAI</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="Startup Validation: ${safeTitle} — Score ${score}/100" />
  <meta property="og:description" content="${summary}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${appUrl}/share/report/${token}" />
  <meta property="og:site_name" content="StartupAI" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Startup Validation: ${safeTitle}" />
  <meta name="twitter:description" content="${summary}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta http-equiv="refresh" content="0;url=${appUrl}/share/report/${token}" />
</head>
<body>
  <p>Redirecting to <a href="${appUrl}/share/report/${token}">StartupAI Validation Report</a>...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...corsHeaders,
    },
  });
});
```

**Step 2: Deploy with --no-verify-jwt**

Run: `supabase functions deploy share-meta --no-verify-jwt`
Expected: successful deploy. This is a public endpoint for social crawlers.

**Step 3: Test with curl**

Run: `curl -s "https://<project-url>/functions/v1/share-meta?token=<valid-token>" | head -20`
Expected: HTML with OG meta tags.

---

## Task 6: SHR-18A — Create static OG image placeholder

**Files:**
- Create: `public/og-share.png`

**Step 1: Create a placeholder OG image**

Create a simple 1200x630 branded PNG for social previews. For MVP, generate a minimal SVG-based image or use a solid color card:

Create `public/og-share.svg` (1200x630) with StartupAI branding:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FBFAF9"/>
  <rect x="0" y="0" width="1200" height="8" fill="#0E6249"/>
  <text x="600" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="#181D25">Startup Validation Report</text>
  <text x="600" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#676F7E">AI-powered idea validation by StartupAI</text>
  <text x="600" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#0E6249">StartupAI</text>
  <rect x="0" y="622" width="1200" height="8" fill="#0E6249"/>
</svg>
```

Then convert to PNG (or serve the SVG — most social platforms accept it). For simplicity, save as SVG and reference it. If PNG is strictly required, use an online SVG-to-PNG converter at 1200x630.

**Note:** Phase 2 can generate dynamic OG images with score/startup name per report.

---

## Task 7: SHR-18D — Create EmbedReport page

**Files:**
- Create: `src/pages/EmbedReport.tsx`
- Modify: `src/App.tsx` (add route)

**Step 1: Create EmbedReport.tsx**

```tsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchReportByToken } from "@/hooks/useShareableLinks";
import { ReportV2Layout } from "@/components/validator/report/ReportV2Layout";
import { Loader2, Clock, Lock, AlertTriangle } from "lucide-react";

type ErrorType = "expired" | "revoked" | "invalid" | "unknown";

export default function EmbedReport() {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const sectionsParam = searchParams.get("sections");
  const sections = sectionsParam ? sectionsParam.split(",") : undefined;

  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorType("invalid");
      setLoading(false);
      return;
    }

    async function load() {
      const { data, error } = await fetchReportByToken(token!);
      if (error) {
        if (typeof error === "string") {
          if (error.includes("expired")) setErrorType("expired");
          else if (error.includes("revoked")) setErrorType("revoked");
          else if (error.includes("Invalid")) setErrorType("invalid");
          else setErrorType("unknown");
        } else {
          setErrorType("unknown");
        }
        setLoading(false);
        return;
      }
      if (data) {
        setReport(data);
      }
      setLoading(false);
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (errorType) {
    const errors = {
      expired: { icon: Clock, text: "This link has expired" },
      revoked: { icon: Lock, text: "This link has been revoked" },
      invalid: { icon: AlertTriangle, text: "Invalid share link" },
      unknown: { icon: AlertTriangle, text: "Report not found" },
    };
    const err = errors[errorType];
    const Icon = err.icon;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-3 p-8">
        <Icon className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">{err.text}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <ReportV2Layout report={report} sections={sections} />
      <div className="sticky bottom-0 bg-card border-t border-border py-1 px-4 text-center">
        <a
          href="https://startupai.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Powered by StartupAI
        </a>
      </div>
    </div>
  );
}
```

**Step 2: Add route in App.tsx**

Add lazy import near the other lazy imports:
```tsx
const EmbedReport = lazy(() => import("./pages/EmbedReport"));
```

Add route near the SharedReport route (public, no ProtectedRoute):
```tsx
<Route path="/embed/report/:token" element={<EmbedReport />} />
```

**Step 3: Add optional `sections` prop to ReportV2Layout**

In `ReportV2Layout.tsx`, add `sections?: string[]` to the props interface. When provided, only render sections whose key is in the array. When undefined, render all sections (backwards compatible).

Each section gets a key like: `"hero"`, `"problem"`, `"customer"`, `"market"`, `"competition"`, `"risks"`, `"mvp"`, `"nextsteps"`, `"scores"`, `"tech"`, `"revenue"`, `"team"`, `"questions"`, `"resources"`, `"financials"`.

Wrap each section render with:
```tsx
{(!sections || sections.includes("hero")) && <ReportHero ... />}
{(!sections || sections.includes("problem")) && <ProblemCard ... />}
// etc.
```

**Step 4: Verify build**

Run: `npm run build`
Expected: clean build.

---

## Task 8: SHR-18D — Add embed tab to ShareDialog

**Files:**
- Modify: `src/components/sharing/ShareDialog.tsx`

**Step 1: Add Tabs to ShareDialog**

Import `Tabs, TabsList, TabsTrigger, TabsContent` from `@/components/ui/tabs`.

Wrap the existing dialog content in a `<TabsContent value="share">` and add a new `<TabsContent value="embed">`.

The embed tab shows:
- A read-only textarea with the iframe snippet
- Section checkboxes (all checked by default)
- A "Copy Embed Code" button

```tsx
// State for embed
const [embedSections, setEmbedSections] = useState<string[]>([]);
const allSections = ["hero", "problem", "customer", "market", "competition", "risks", "mvp", "nextsteps"];

// Generate embed URL
const embedUrl = useMemo(() => {
  const base = `${window.location.origin}/embed/report/${links[0]?.token || ''}`;
  if (embedSections.length === 0 || embedSections.length === allSections.length) return base;
  return `${base}?sections=${embedSections.join(',')}`;
}, [links, embedSections]);

const embedCode = `<iframe src="${embedUrl}" width="100%" height="800" frameborder="0" style="border: 1px solid #E5E2DC; border-radius: 8px;"></iframe>`;
```

**Step 2: Verify build**

Run: `npm run build`
Expected: clean build.

---

## Task 9: SHR-18E — Typed error codes in useShareableLinks

**Files:**
- Modify: `src/hooks/useShareableLinks.ts`
- Modify: `src/pages/SharedReport.tsx`

**Step 1: Add ShareError type and update fetchReportByToken**

In `useShareableLinks.ts`, add the type:

```typescript
export type ShareErrorCode = 'expired' | 'revoked' | 'invalid' | 'not_found' | 'unknown';
export interface ShareError {
  code: ShareErrorCode;
  message: string;
}
```

Update `fetchReportByToken` to return `{ data, error: ShareError | null }`:

Before fetching the report, check the token status:

```typescript
// Check if token exists at all (fetch without validity filters)
const { data: linkCheck, error: checkError } = await anonClient
  .from('shareable_links')
  .select('id, expires_at, revoked_at, resource_id, resource_type')
  .eq('token', token)
  .single();

if (checkError || !linkCheck) {
  return { data: null, error: { code: 'invalid' as const, message: 'Invalid share link' } };
}
if (linkCheck.revoked_at) {
  return { data: null, error: { code: 'revoked' as const, message: 'This link has been revoked' } };
}
if (new Date(linkCheck.expires_at) < new Date()) {
  return { data: null, error: { code: 'expired' as const, message: 'This link has expired' } };
}
if (linkCheck.resource_type !== 'validation_report') {
  return { data: null, error: { code: 'invalid' as const, message: 'This link does not point to a validation report' } };
}

// Now fetch the report using the resource_id we already have
const { data: report, error: reportError } = await anonClient
  .from('validator_reports')
  .select('*')
  .eq('id', linkCheck.resource_id)
  .single();

if (reportError || !report) {
  return { data: null, error: { code: 'not_found' as const, message: 'Report not found' } };
}
```

**Important RLS note:** This requires the anon policy on `shareable_links` to allow reading tokens regardless of expiry/revocation status (for error detection). Apply this migration:

```sql
-- Drop the existing restrictive anon policy
DROP POLICY IF EXISTS "links_public_read" ON shareable_links;

-- New policy: anon can read any link matching their x-share-token (for error detection)
CREATE POLICY "links_anon_check_status" ON shareable_links
  FOR SELECT TO anon
  USING (token = current_setting('request.headers', true)::json->>'x-share-token');
```

**Step 2: Update SharedReport.tsx to use typed errors**

Replace the string-matching error detection:

```typescript
// Old:
if (error.includes('expired')) setErrorType('expired');

// New:
if (error && typeof error === 'object' && 'code' in error) {
  setErrorType(error.code === 'not_found' ? 'unknown' : error.code);
} else {
  setErrorType('unknown');
}
```

Also update EmbedReport.tsx similarly.

**Step 3: Verify build**

Run: `npm run build`
Expected: clean build.

---

## Task 10: SHR-18E — Create useShareAnalytics hook

**Files:**
- Create: `src/hooks/useShareAnalytics.ts`

**Step 1: Create the hook**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ShareView {
  id: string;
  viewed_at: string;
  user_agent: string | null;
  referrer: string | null;
  ip_hash: string | null;
}

interface ViewsByDay {
  date: string;
  count: number;
}

interface ShareAnalytics {
  totalViews: number;
  uniqueViews: number;
  viewsByDay: ViewsByDay[];
  recentViews: ShareView[];
  loading: boolean;
  refresh: () => Promise<void>;
}

function parseUserAgent(ua: string | null): string {
  if (!ua) return 'Unknown';
  const browser = ua.includes('Chrome') ? 'Chrome' :
    ua.includes('Safari') ? 'Safari' :
    ua.includes('Firefox') ? 'Firefox' :
    ua.includes('Edge') ? 'Edge' : 'Other';
  const os = ua.includes('Mac') ? 'Mac' :
    ua.includes('Windows') ? 'Win' :
    ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' :
    ua.includes('Android') ? 'Android' :
    ua.includes('Linux') ? 'Linux' : '';
  return os ? `${browser}/${os}` : browser;
}

function parseReferrer(ref: string | null): string {
  if (!ref) return 'Direct';
  try {
    const host = new URL(ref).hostname;
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter/X';
    if (host.includes('facebook')) return 'Facebook';
    if (host.includes('slack')) return 'Slack';
    if (host.includes('google')) return 'Google';
    return host.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

export function useShareAnalytics(linkId: string | null): ShareAnalytics {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);
  const [viewsByDay, setViewsByDay] = useState<ViewsByDay[]>([]);
  const [recentViews, setRecentViews] = useState<ShareView[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!linkId) return;
    setLoading(true);
    try {
      // Fetch all views for this link
      const { data: views, error } = await supabase
        .from('share_views')
        .select('*')
        .eq('link_id', linkId)
        .order('viewed_at', { ascending: false })
        .limit(100);

      if (error || !views) {
        setLoading(false);
        return;
      }

      setTotalViews(views.length);

      // Unique by ip_hash
      const uniqueHashes = new Set(views.map(v => v.ip_hash).filter(Boolean));
      setUniqueViews(uniqueHashes.size);

      // Views by day (last 7 days)
      const dayMap = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayMap.set(d.toISOString().slice(0, 10), 0);
      }
      for (const v of views) {
        const day = v.viewed_at.slice(0, 10);
        if (dayMap.has(day)) {
          dayMap.set(day, (dayMap.get(day) || 0) + 1);
        }
      }
      setViewsByDay(Array.from(dayMap.entries()).map(([date, count]) => ({ date, count })));

      // Recent views (last 10)
      setRecentViews(views.slice(0, 10));
    } finally {
      setLoading(false);
    }
  }, [linkId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { totalViews, uniqueViews, viewsByDay, recentViews, loading, refresh };
}

export { parseUserAgent, parseReferrer };
```

**Step 2: Verify build**

Run: `npm run build`
Expected: clean build.

---

## Task 11: SHR-18E — Add analytics expandable section to ShareDialog

**Files:**
- Modify: `src/components/sharing/ShareDialog.tsx`

**Step 1: Import the analytics hook and helpers**

```typescript
import { useShareAnalytics, parseUserAgent, parseReferrer } from '@/hooks/useShareAnalytics';
```

**Step 2: Add analytics toggle per link**

For each link in the list, add a collapsible "Analytics" section triggered by clicking the Eye icon or an expand button. When expanded, it shows:
- Total views / unique views
- Simple sparkline (7 bars using inline divs)
- Recent views list (parsed UA and referrer)

**Step 3: Add 30s auto-refresh**

```typescript
useEffect(() => {
  if (!open) return;
  loadLinks();
  const interval = setInterval(loadLinks, 30_000);
  return () => clearInterval(interval);
}, [open]);
```

**Step 4: Verify build**

Run: `npm run build`
Expected: clean build.

**Step 5: Run full test suite**

Run: `npm run test`
Expected: all tests pass.

---

## Execution Summary

| Task | Sub-Prompt | Type | Depends On |
|:----:|:----------:|------|:----------:|
| 1 | 18B | Migration + RPC | — |
| 2 | 18B | Hook update | Task 1 |
| 3 | 18C | Print CSS | — |
| 4 | 18C | Print header + button | Task 3 |
| 5 | 18A | Edge function | — |
| 6 | 18A | OG image | — |
| 7 | 18D | Embed page + route | — |
| 8 | 18D | Embed tab in dialog | Task 7 |
| 9 | 18E | Typed error codes | Task 1 |
| 10 | 18E | Analytics hook | Task 1 |
| 11 | 18E | Analytics in dialog | Task 10 |

**Parallelizable groups:**
- Group 1: Tasks 1, 3, 5, 6, 7 (all independent)
- Group 2: Tasks 2, 4, 8 (after their dependencies)
- Group 3: Tasks 9, 10, 11 (after Task 1)
