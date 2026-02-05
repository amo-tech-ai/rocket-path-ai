# StartupAI Cached Context

> This file contains stable reference content that should be cached across sessions.
> Updated: 2026-02-02 | Minimum 1024 tokens for Sonnet caching

## Architecture Overview

StartupAI is an AI-powered operating system for startup founders built with:
- **Frontend**: React 18 + TypeScript + Vite 5 + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Row Level Security + Edge Functions)
- **AI**: Gemini 3 (fast operations) + Claude 4.5 (reasoning tasks)
- **Auth**: OAuth via Google and LinkedIn through Supabase

## Directory Structure

```
startupai16L/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (Button, Card, etc.)
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── onboarding/      # Onboarding wizard steps
│   │   ├── projects/        # Project management
│   │   └── crm/             # Customer relationship
│   ├── hooks/
│   │   ├── useAuth.ts       # Authentication state
│   │   ├── useProjects.ts   # Project CRUD
│   │   ├── useCRM.ts        # CRM operations
│   │   └── useTasks.ts      # Task management
│   ├── pages/               # Route components
│   ├── lib/                 # Utilities (cn, formatters)
│   └── integrations/
│       └── supabase/        # Supabase client + types
├── supabase/
│   ├── functions/           # Edge Functions (Deno)
│   │   ├── ai-chat/         # AI conversation endpoint
│   │   ├── onboarding-agent/# Onboarding AI
│   │   └── workflow-trigger/# Automation triggers
│   ├── migrations/          # Database schema
│   └── seeds/               # Test data
├── startup-system/          # PRD, diagrams, roadmaps
└── .claude/                 # Skills, agents, commands
```

## Import Patterns

```typescript
// Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";

// Supabase
import { supabase } from "@/integrations/supabase/client";

// Types
import type { Database } from "@/integrations/supabase/types";
```

## Authentication Pattern

```typescript
// useAuth hook provides:
const { user, loading, signInWithGoogle, signInWithLinkedIn, signOut } = useAuth();

// Protected route wrapper:
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Get user ID in components:
const userId = user?.id;
```

## Supabase Query Patterns

```typescript
// Select with RLS (auto-filters by user)
const { data, error } = await supabase
  .from('projects')
  .select('id, name, status')
  .order('created_at', { ascending: false });

// Insert (user_id set by RLS)
const { data, error } = await supabase
  .from('projects')
  .insert({ name: 'New Project', status: 'active' })
  .select()
  .single();

// Update
const { error } = await supabase
  .from('projects')
  .update({ status: 'completed' })
  .eq('id', projectId);

// Real-time subscription
const channel = supabase
  .channel('projects')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'projects' },
    (payload) => console.log(payload)
  )
  .subscribe();
```

## Edge Function Pattern

```typescript
// supabase/functions/function-name/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    // Create authenticated client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error("Unauthorized");

    // Parse request
    const { action, data } = await req.json();

    // Handle action...

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

## AI Model Selection

| Task Type | Model | Reason |
|-----------|-------|--------|
| Fast extraction, parsing | `gemini-3-flash-preview` | Speed, cost |
| Deep analysis, reports | `gemini-3-pro-preview` | Quality |
| Quick tasks, chat | `claude-haiku-4-5` | Balance |
| Balanced reasoning | `claude-sonnet-4-5` | Default |
| Complex multi-step | `claude-opus-4-5` | Best reasoning |
| Image generation | `gemini-3-pro-image-preview` | Native support |
| Video generation | `veo-3.1-generate-preview` | Native support |

## RLS Policy Pattern

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- User can only see own data
CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

-- User can insert own data
CREATE POLICY "Users can insert own data"
ON table_name FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User can update own data
CREATE POLICY "Users can update own data"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);

-- User can delete own data
CREATE POLICY "Users can delete own data"
ON table_name FOR DELETE
USING (auth.uid() = user_id);
```

## Component Pattern (shadcn/ui)

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FeatureCard({ data, isLoading, error }: Props) {
  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  );
}
```

## Phase System

| Phase | Focus | Weeks |
|-------|-------|-------|
| CORE | Can it work? Foundation, basic features | 1-6 |
| MVP | Does it solve the problem? User validation | 7-12 |
| ADVANCED | Does it help users do better? AI enhancement | 13-16 |
| PRODUCTION | Can it scale? Performance, security | 17-18 |

## Database Schema (Core Tables)

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles | `id`, `full_name`, `email` |
| `startups` | Startup data | `id`, `user_id`, `name`, `stage` |
| `projects` | Project management | `id`, `user_id`, `startup_id`, `name` |
| `tasks` | Task tracking | `id`, `project_id`, `title`, `status` |
| `contacts` | CRM contacts | `id`, `user_id`, `name`, `email` |
| `deals` | Sales pipeline | `id`, `contact_id`, `value`, `stage` |
| `activities` | Timeline events | `id`, `user_id`, `type`, `content` |

## Development Commands

```bash
# Local development
npm run dev              # Start Vite (port 8082)
npm run build            # Production build
npm run lint             # ESLint check
npm run test             # Run Vitest

# Supabase
supabase start           # Local Supabase
supabase db reset        # Reset + apply migrations
supabase functions serve # Local edge functions
supabase db push         # Push migrations to remote

# Git workflow
git status               # Check changes
git add -A && git commit # Commit changes
git push                 # Push to remote
```

## Error Handling Pattern

```typescript
// In hooks
const [error, setError] = useState<Error | null>(null);

try {
  const { data, error: dbError } = await supabase.from('table').select();
  if (dbError) throw dbError;
  return data;
} catch (err) {
  setError(err instanceof Error ? err : new Error('Unknown error'));
  console.error('Operation failed:', err);
}

// In components
{error && (
  <Alert variant="destructive">
    <AlertDescription>{error.message}</AlertDescription>
  </Alert>
)}
```

---

*This context file is designed for prompt caching. Keep content stable and update version date when modified.*
