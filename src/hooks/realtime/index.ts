/**
 * Realtime Hooks - Central Export
 *
 * 12 specialized hooks for real-time UI updates:
 * - useDashboardRealtime (consolidated single channel)
 * - useOnboardingRealtime
 * - useCRMRealtime
 * - usePitchDeckRealtime
 * - useInvestorsRealtime
 * - useCanvasRealtime
 * - useDocumentsRealtime
 * - useChatRealtime
 * - useEventsRealtime
 * - useValidatorRealtime
 * - useRealtimeChatRoom
 * - useRealtimeAIChat
 */

// Shared realtime channel hook (new production pattern)
export {
  useRealtimeChannel,
  useTableChanges,
  type RealtimeChannelOptions,
  type RealtimeChannelResult,
  type RealtimeChannelMetrics,
  type TableChangeOptions,
} from './useRealtimeChannel';

// Types
export * from './types';

// Animation utilities
export * from './animations';

// Polling fallback
export { usePollingFallback, type UsePollingFallbackOptions } from './usePollingFallback';

// Module-specific hooks
export { useOnboardingRealtime } from './useOnboardingRealtime';
export { useCRMRealtime } from './useCRMRealtime';
export { usePitchDeckRealtime } from './usePitchDeckRealtime';
export { useInvestorsRealtime } from './useInvestorsRealtime';
export { useCanvasRealtime } from './useCanvasRealtime';
export { useDocumentsRealtime } from './useDocumentsRealtime';
export { useChatRealtime } from './useChatRealtime';
export { useEventsRealtime } from './useEventsRealtime';
export { useRealtimeChatRoom, type UseRealtimeChatRoomOptions, type UseRealtimeChatRoomReturn } from './useRealtimeChatRoom';
export { useRealtimeAIChat, type UseRealtimeAIChatReturn, type RealtimeAIMessage } from './useRealtimeAIChat';
export { useValidatorRealtime, type UseValidatorRealtimeOptions, type UseValidatorRealtimeReturn, type ValidatorFollowupPayload } from './useValidatorRealtime';
export { useKnowledgeIngestRealtime, type IngestProgress } from './useKnowledgeIngestRealtime';
export { useRealtimeHealth, type RealtimeHealthStatus, type RealtimeHealthState } from './useRealtimeHealth';
export { useReportPresence, type ReportViewer } from './useReportPresence';

// Re-export from main subscription hook
export {
  useRealtimeSubscription,
  useDashboardRealtime,
} from '../useRealtimeSubscription';
