---
name: api-wiring
description: Use when connecting Supabase edge function backends to React frontend hooks and UI components. Triggers on "wire", "connect backend", "hook up", "frontend wiring", "create hook for", "call edge function".
---

# API Wiring

## Overview

Wire existing Supabase Edge Functions to React hooks and UI. The most common task type — 30+ tasks need backend-to-frontend wiring.

## When to Use

- Connecting edge function to React hook
- Creating `use<Domain>` hook
- Wiring AI agent responses to UI
- Any task described as "wire X to frontend"

## Workflow

### Phase 1: Audit Backend

1. Read `supabase/functions/<name>/index.ts`
2. List all actions (switch cases)
3. Note request shape: `{ action, ...params }`
4. Note response shape per action
5. Check auth requirements

### Phase 2: Create Hook

`src/hooks/use<Domain>.ts`:

```typescript
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function invokeAgent(action: string, params: Record<string, unknown> = {}) {
  const { data, error } = await supabase.functions.invoke("<function-name>", {
    body: { action, ...params },
  });
  if (error) throw error;
  return data;
}

export function useDomainItems() {
  return useQuery({
    queryKey: ["domain-items"],
    queryFn: () => invokeAgent("list_items"),
  });
}

export function useCreateDomainItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { name: string }) => invokeAgent("create_item", params),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["domain-items"] }),
  });
}
```

### Phase 3: Wire to UI

```typescript
import { useDomainItems, useCreateDomainItem } from "@/hooks/useDomain";
import { useToast } from "@/hooks/use-toast";

export default function DomainPage() {
  const { data, isLoading, error } = useDomainItems();
  const createItem = useCreateDomainItem();
  const { toast } = useToast();

  const handleCreate = async (values: FormData) => {
    try {
      await createItem.mutateAsync(values);
      toast({ title: "Created successfully" });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) return <Skeleton />;
  if (error) return <Alert variant="destructive">{error.message}</Alert>;
  return (/* render data */);
}
```

## Checklist

- [ ] Edge function actions documented
- [ ] Hook in `src/hooks/` using `supabase.functions.invoke()`
- [ ] React Query for caching
- [ ] Query invalidation on mutations
- [ ] Loading + error states
- [ ] Toast notifications
- [ ] Tested in browser with real auth
