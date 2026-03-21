/**
 * Reusable Polling Fallback Hook
 *
 * Starts polling when a Realtime channel is silent for too long.
 * Extracted from useValidatorRealtime's U-01 pattern.
 *
 * Usage:
 *   usePollingFallback({
 *     enabled: isSubscribed && pipelineStatus === 'running',
 *     eventCount,
 *     pollFn: async () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
 *   });
 */

import { useEffect, useRef } from 'react';

export interface UsePollingFallbackOptions {
  /** Whether fallback polling should be active */
  enabled: boolean;
  /** Number of realtime events received (0 = likely no connection) */
  eventCount: number;
  /** Callback executed on each poll interval */
  pollFn: () => Promise<void>;
  /** Milliseconds of silence before starting poll (default: 30_000) */
  silenceThresholdMs?: number;
  /** Poll interval once fallback activates (default: 10_000) */
  pollIntervalMs?: number;
}

export function usePollingFallback({
  enabled,
  eventCount,
  pollFn,
  silenceThresholdMs = 30_000,
  pollIntervalMs = 10_000,
}: UsePollingFallbackOptions): void {
  const pollFnRef = useRef(pollFn);
  pollFnRef.current = pollFn;

  useEffect(() => {
    if (!enabled) return;

    let pollTimer: ReturnType<typeof setInterval> | null = null;
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;

    silenceTimer = setTimeout(() => {
      if (eventCount === 0) {
        console.warn('[usePollingFallback] No events received — starting DB polling fallback');
        pollFnRef.current();
        pollTimer = setInterval(() => pollFnRef.current(), pollIntervalMs);
      }
    }, silenceThresholdMs);

    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [enabled, eventCount, silenceThresholdMs, pollIntervalMs]);
}
