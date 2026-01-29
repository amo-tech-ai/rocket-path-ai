/**
 * Realtime Hooks - Central Export
 * 
 * 10 specialized hooks for real-time UI updates:
 * - useDashboardRealtime (existing, enhanced)
 * - useOnboardingRealtime
 * - useCRMRealtime
 * - usePitchDeckRealtime
 * - useTasksRealtime (existing, enhanced)
 * - useInvestorsRealtime
 * - useCanvasRealtime
 * - useDocumentsRealtime
 * - useChatRealtime
 * - useEventsRealtime
 */

// Shared realtime channel hook (new production pattern)
export { 
  useRealtimeChannel, 
  useTableChanges,
  type RealtimeChannelOptions,
  type RealtimeChannelResult,
  type TableChangeOptions,
} from './useRealtimeChannel';

// Types
export * from './types';

// Animation utilities
export * from './animations';

// Module-specific hooks
export { useOnboardingRealtime } from './useOnboardingRealtime';
export { useCRMRealtime } from './useCRMRealtime';
export { usePitchDeckRealtime } from './usePitchDeckRealtime';
export { useInvestorsRealtime } from './useInvestorsRealtime';
export { useCanvasRealtime } from './useCanvasRealtime';
export { useDocumentsRealtime } from './useDocumentsRealtime';
export { useChatRealtime } from './useChatRealtime';
export { useEventsRealtime } from './useEventsRealtime';

// Re-export enhanced versions from main subscription hook
export { 
  useRealtimeSubscription,
  useDashboardRealtime,
  useTasksRealtime,
  useDealsRealtime,
} from '../useRealtimeSubscription';
