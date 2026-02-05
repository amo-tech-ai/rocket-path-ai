# 104 - Coach Sync

> Bidirectional sync between Validator and Coach panels

---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator (3-panel), Coach Panel |
| **Features** | Main ↔ Coach sync, live updates, click-to-explain, polish |
| **Agents** | - |
| **Edge Functions** | - |
| **Use Cases** | Click score to get explanation, live score updates, seamless UX |
| **Real-World** | "I click 'No customers' concern, coach immediately explains why it matters" |

---

```yaml
---
task_id: 104-coach-sync
title: Coach Sync
diagram_ref: startup-coach-design
phase: MVP
priority: P1
status: Not Started
skill: /frontend-design
ai_model: -
subagents: [frontend-designer, code-reviewer, performance-optimizer]
edge_function: -
schema_tables: []
depends_on: [101-coach-tables, 102-coach-ai, 103-coach-ui]
---
```

---

## Description

Connect the Main panel (Validator) and Coach panel with bidirectional synchronization. When coach mentions a score, highlight it in main panel. When user clicks an element in main panel, coach explains it. Add live score updates during assessment, polish animations, and optimize performance.

## Rationale

**Problem:** Disconnected panels create cognitive overhead.
**Solution:** Synchronized interaction where panels reference each other.
**Impact:** Seamless experience - feels like one integrated tool, not two views.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | click a concern to get explanation | I understand without asking |
| Founder | see scores update live | I see progress as coach assesses |
| Founder | see what coach is referencing | I follow along visually |
| Founder | have smooth animations | the app feels polished |

## Real-World Example

> Coach says: "Your Problem Clarity score is strong at 9/10."
> The Problem Clarity card in the main panel glows briefly.
>
> Later, Alex clicks the "No customers" concern.
> Coach immediately responds: "Right - this is exactly why acquisition
> is your constraint. No customers means..."

---

## Goals

1. **Primary:** Bidirectional sync between Main and Coach panels
2. **Secondary:** Live score updates during assessment
3. **Quality:** < 100ms sync latency, smooth 60fps animations

## Acceptance Criteria

- [ ] Click element in Main → Coach explains it
- [ ] Coach mentions element → Main highlights it
- [ ] Assessment scores update live as coach evaluates
- [ ] Sprint progress updates in real-time
- [ ] Smooth animations for all transitions
- [ ] No performance regression (Lighthouse score maintained)
- [ ] Loading states for all async operations
- [ ] Error recovery with retry options

---

## Sync Behaviors

### Main → Coach (Click to Explain)

| Element Clicked | Coach Response |
|-----------------|----------------|
| Verdict score | Explain overall assessment |
| Strength item | Elaborate on why it's strong |
| Concern item | Explain risk and what to do |
| Evidence block | Deep dive on that dimension |
| Sprint progress | Explain current sprint status |

### Coach → Main (Reference Highlight)

| Coach Mentions | Main Panel Action |
|----------------|-------------------|
| "Your Clarity score..." | Highlight Clarity evidence block |
| "The acquisition constraint..." | Highlight "No customers" concern |
| "Sprint 1 is about..." | Highlight sprint progress section |
| "Looking at your canvas..." | Brief pulse on Evidence section |

---

## Implementation

### Sync Context Provider

```typescript
// src/contexts/CoachSyncContext.tsx

interface CoachSyncContextValue {
  // Main → Coach
  explainElement: (elementType: string, elementId: string) => void;

  // Coach → Main
  highlightedElement: { type: string; id: string } | null;
  clearHighlight: () => void;

  // Live updates
  liveScores: Record<string, number>;
  updateScore: (dimension: string, score: number) => void;
}

export const CoachSyncProvider: React.FC<{ children: React.ReactNode }>;
export const useCoachSync: () => CoachSyncContextValue;
```

### Click Handler in Main Panel

```typescript
// In EvidenceBlocks.tsx
const { explainElement } = useCoachSync();

const handleBlockClick = (dimension: string) => {
  explainElement('evidence', dimension);
  // This triggers coach to explain the dimension
};
```

### Highlight Handler in Main Panel

```typescript
// In VerdictCard.tsx
const { highlightedElement } = useCoachSync();

const isHighlighted = highlightedElement?.type === 'verdict';

return (
  <motion.div
    animate={isHighlighted ? { scale: 1.02, boxShadow: '0 0 20px rgba(var(--primary), 0.3)' } : {}}
    transition={{ duration: 0.3 }}
  >
    {/* content */}
  </motion.div>
);
```

### Live Score Updates

```typescript
// In useCoachSession.ts
const { updateScore } = useCoachSync();

// When coach response includes score update
if (response.stateUpdate?.assessmentScores) {
  Object.entries(response.stateUpdate.assessmentScores).forEach(([dim, score]) => {
    updateScore(dim, score);
  });
}
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Context | `src/contexts/CoachSyncContext.tsx` | Create |
| Provider | `src/pages/Validator.tsx` | Wrap with provider |
| Main Panel | `src/components/validator/EvidenceBlocks.tsx` | Add click handlers |
| Main Panel | `src/components/validator/VerdictCard.tsx` | Add highlight animation |
| Main Panel | `src/components/validator/TradeoffsCard.tsx` | Add click + highlight |
| Main Panel | `src/components/validator/SprintProgress.tsx` | Add live updates |
| Coach Panel | `src/components/coach/CoachPanel.tsx` | Handle explain requests |
| Hook | `src/hooks/useCoachSession.ts` | Add sync integration |

---

## Animation Specifications

### Highlight Animation

```typescript
const highlightVariants = {
  normal: {
    scale: 1,
    boxShadow: 'none'
  },
  highlighted: {
    scale: 1.02,
    boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.3)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};
```

### Score Update Animation

```typescript
const scoreVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

// Number counter animation
<AnimatePresence mode="wait">
  <motion.span key={score} variants={scoreVariants}>
    {score}/10
  </motion.span>
</AnimatePresence>
```

### Message Sync Indicator

```typescript
// When coach is referencing something in main
<motion.div
  className="absolute -left-2 top-1/2 w-1 h-8 bg-primary rounded"
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
/>
```

---

## Performance Optimization

### Debounced Highlights

```typescript
// Prevent rapid highlight flashing
const debouncedHighlight = useDebouncedCallback(
  (element: HighlightElement) => setHighlightedElement(element),
  150
);
```

### Memoized Components

```typescript
// Prevent unnecessary re-renders
const EvidenceBlock = memo(({ dimension, score, isHighlighted }) => {
  // ...
});
```

### Virtualized Message List

```typescript
// For long conversation history
import { Virtuoso } from 'react-virtuoso';

<Virtuoso
  data={messages}
  itemContent={(index, message) => <CoachMessage {...message} />}
  followOutput="smooth"
/>
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Rapid clicks on elements | Debounce, only explain last clicked |
| Coach mentions non-existent element | No highlight, graceful ignore |
| Network lag on explain request | Show loading in coach panel |
| Multiple highlights queued | Show one at a time, queue others |
| User scrolls during highlight | Scroll to highlighted element |
| Mobile: element not visible | Scroll into view, then highlight |

---

## Error Handling

```typescript
// Graceful degradation
const handleExplainError = (error: Error) => {
  toast({
    title: "Couldn't get explanation",
    description: "Try clicking again or ask the coach directly.",
    variant: "destructive"
  });
};
```

---

## Sync Error Recovery

### Error Types and Recovery Strategies

| Error Type | Detection | Recovery Strategy |
|------------|-----------|-------------------|
| Network timeout | Request exceeds 10s | Retry with exponential backoff (1s, 2s, 4s) |
| API 500 error | Response status 500 | Retry once, then show fallback UI |
| WebSocket disconnect | `onclose` event | Auto-reconnect with backoff, queue pending syncs |
| State mismatch | Version conflict | Fetch fresh state from server |
| Realtime subscription lost | Channel error | Resubscribe, refetch last 5 updates |
| Coach unresponsive | No response in 15s | Show "Coach is thinking..." then timeout message |

### Recovery Implementation

```typescript
// src/hooks/useSyncRecovery.ts

interface SyncRecoveryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_OPTIONS: SyncRecoveryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 8000
};

export function useSyncRecovery(options = DEFAULT_OPTIONS) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  const withRetry = async <T>(
    operation: () => Promise<T>,
    onFinalFailure?: () => void
  ): Promise<T | null> => {
    setIsRecovering(true);

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        const result = await operation();
        setRetryCount(0);
        setIsRecovering(false);
        return result;
      } catch (error) {
        setRetryCount(attempt + 1);

        if (attempt < options.maxRetries) {
          const delay = Math.min(
            options.baseDelay * Math.pow(2, attempt),
            options.maxDelay
          );
          await sleep(delay);
        }
      }
    }

    setIsRecovering(false);
    onFinalFailure?.();
    return null;
  };

  return { withRetry, retryCount, isRecovering };
}
```

### WebSocket Reconnection

```typescript
// src/hooks/useRealtimeSync.ts

export function useRealtimeSync(sessionId: string) {
  const [connectionState, setConnectionState] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const pendingUpdates = useRef<SyncUpdate[]>([]);

  const reconnect = useCallback(async () => {
    setConnectionState('reconnecting');

    const channel = supabase
      .channel(`coach:${sessionId}`)
      .on('broadcast', { event: 'sync' }, handleSync)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionState('connected');
          // Flush pending updates
          pendingUpdates.current.forEach(update => processSyncUpdate(update));
          pendingUpdates.current = [];
        }
      });

    // Set timeout for reconnection
    setTimeout(() => {
      if (connectionState === 'reconnecting') {
        setConnectionState('disconnected');
        toast({
          title: "Connection lost",
          description: "Changes may not sync. Refresh to reconnect.",
          action: <Button onClick={reconnect}>Retry</Button>
        });
      }
    }, 10000);
  }, [sessionId]);

  // Auto-reconnect on disconnect
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connectionState === 'disconnected') {
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connectionState, reconnect]);

  return { connectionState, reconnect };
}
```

### State Reconciliation

```typescript
// When local and server state diverge
const reconcileState = async (localState: SessionState, serverState: SessionState) => {
  if (localState.version < serverState.version) {
    // Server is ahead - accept server state
    setLocalState(serverState);
    toast({
      title: "Synced with latest",
      description: "Your view has been updated."
    });
  } else if (localState.version > serverState.version) {
    // Local is ahead - push to server
    await pushStateToServer(localState);
  } else if (localState.hash !== serverState.hash) {
    // Same version but different content - conflict
    toast({
      title: "Sync conflict detected",
      description: "Loading latest version...",
      variant: "warning"
    });
    // Fetch fresh and overwrite
    const fresh = await fetchFreshState(sessionId);
    setLocalState(fresh);
  }
};
```

### Fallback UI States

```typescript
// When sync fails, show appropriate fallback
const SyncStatusIndicator: React.FC<{ state: SyncState }> = ({ state }) => {
  switch (state) {
    case 'syncing':
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    case 'synced':
      return <Check className="h-4 w-4 text-green-500" />;
    case 'error':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Sync failed. Click to retry.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'offline':
      return (
        <Badge variant="outline" className="text-xs">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      );
  }
};
```

### Offline Queue

```typescript
// Queue operations when offline
const useOfflineQueue = () => {
  const queue = useRef<PendingOperation[]>([]);
  const isOnline = useNetworkStatus();

  const enqueue = (operation: PendingOperation) => {
    if (isOnline) {
      executeOperation(operation);
    } else {
      queue.current.push(operation);
      toast({
        title: "Saved offline",
        description: "Will sync when back online."
      });
    }
  };

  // Flush queue when coming back online
  useEffect(() => {
    if (isOnline && queue.current.length > 0) {
      toast({
        title: "Syncing...",
        description: `${queue.current.length} pending changes.`
      });

      Promise.all(queue.current.map(executeOperation))
        .then(() => {
          queue.current = [];
          toast({ title: "All changes synced" });
        })
        .catch(() => {
          toast({
            title: "Some changes failed to sync",
            variant: "destructive"
          });
        });
    }
  }, [isOnline]);

  return { enqueue, pendingCount: queue.current.length };
};
```

---

## Accessibility

- [ ] Highlights announced to screen readers
- [ ] Focus moves appropriately during sync
- [ ] Reduced motion preference respected
- [ ] Touch targets large enough on mobile

### Reduced Motion

```typescript
const prefersReducedMotion = useReducedMotion();

const highlightAnimation = prefersReducedMotion
  ? { outline: '2px solid var(--primary)' }
  : { scale: 1.02, boxShadow: '...' };
```

---

## Testing Requirements

| Type | Coverage |
|------|----------|
| Unit | Sync context, debouncing |
| Integration | Click → explain flow |
| E2E | Full sync scenarios |
| Performance | Animation FPS, render time |

### Test Cases

- [ ] Click evidence block → coach explains
- [ ] Coach mentions dimension → block highlights
- [ ] Score updates animate smoothly
- [ ] Rapid clicks debounced correctly
- [ ] Mobile sync works
- [ ] No performance regression

---

## Performance Benchmarks

| Metric | Target |
|--------|--------|
| Sync latency (click → highlight) | < 100ms |
| Score animation FPS | 60fps |
| Initial load time | < 2s |
| Re-render count on sync | < 3 components |
| Lighthouse Performance | > 90 |

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Performance check
npm run lighthouse

# Manual testing
- Click each evidence block → verify coach responds
- Observe coach mention dimension → verify highlight
- Watch score update animation during assessment
- Test on mobile viewport
- Verify no jank/lag in animations
```

---

## Polish Checklist

- [ ] All loading states have skeletons
- [ ] All errors have recovery actions
- [ ] Animations are smooth (60fps)
- [ ] Touch targets are 44x44px minimum
- [ ] Colors pass contrast check
- [ ] Empty states have helpful messages
- [ ] Focus rings visible for keyboard nav
- [ ] Tooltips for icon-only buttons

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Context pattern | `src/contexts/AuthContext.tsx` |
| Animation | Existing framer-motion usage |
| Debouncing | `src/hooks/useDebounce.ts` |
| Toast notifications | `src/hooks/use-toast.ts` |

---

## Design Document

See: `/tasks/plan/2026-02-04-startup-coach-design.md`
