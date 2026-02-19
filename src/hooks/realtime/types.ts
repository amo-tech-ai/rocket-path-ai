/**
 * Realtime Event Types & Payloads
 * Based on docs/dashboard/tasks/98-supabase-realtime.md
 */

// ============ Channel Patterns ============
export type RealtimeChannel =
  | `dashboard:${string}:events`
  | `onboarding:${string}:events`
  | `canvas:${string}:events`
  | `crm:${string}:events`
  | `pitchdeck:${string}:events`
  | `tasks:${string}:events`
  | `investors:${string}:events`
  | `documents:${string}:events`
  | `chat:${string}:events`
  | `events:${string}:events`;

// ============ Event Types (21 total) ============
export type RealtimeEventType =
  // Dashboard events
  | 'health_score_updated'
  | 'priorities_refreshed'
  | 'risk_detected'
  | 'alignment_updated'
  | 'strategy_synced'
  // Onboarding events
  | 'enrichment_url_completed'
  | 'enrichment_context_completed'
  | 'enrichment_founder_completed'
  | 'readiness_score_updated'
  // CRM events
  | 'contact_enriched'
  | 'deal_scored'
  | 'pipeline_analyzed'
  // Pitch Deck events
  | 'slide_completed'
  | 'deck_ready'
  // Tasks events
  | 'tasks_generated'
  // Investor events
  | 'investor_scored'
  // Canvas events
  | 'canvas_prefilled'
  | 'canvas_saved'
  | 'canvas_validated'
  | 'box_suggested'
  // Document events
  | 'document_analyzed'
  // Event module events
  | 'event_enriched';

// ============ Event Payloads ============
export interface BaseRealtimePayload {
  eventType: RealtimeEventType;
  timestamp: string;
  entityId?: string;
}

export interface HealthScorePayload extends BaseRealtimePayload {
  eventType: 'health_score_updated';
  oldScore: number;
  newScore: number;
  changedCategory?: string;
  trend: 'up' | 'down' | 'stable';
}

export interface PrioritiesPayload extends BaseRealtimePayload {
  eventType: 'priorities_refreshed';
  priorities: Array<{
    id: string;
    title: string;
    priority: number;
    dueDate?: string;
  }>;
}

export interface RiskPayload extends BaseRealtimePayload {
  eventType: 'risk_detected';
  riskType: 'deal' | 'task' | 'investor' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  suggestedAction?: string;
}

export interface EnrichmentPayload extends BaseRealtimePayload {
  eventType: 'enrichment_url_completed' | 'enrichment_context_completed' | 'enrichment_founder_completed';
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface ReadinessScorePayload extends BaseRealtimePayload {
  eventType: 'readiness_score_updated';
  score: number;
  categories: Record<string, number>;
}

export interface ContactEnrichedPayload extends BaseRealtimePayload {
  eventType: 'contact_enriched';
  contactId: string;
  oldScore?: number;
  newScore: number;
  enrichedFields: string[];
}

export interface DealScoredPayload extends BaseRealtimePayload {
  eventType: 'deal_scored';
  dealId: string;
  oldProbability?: number;
  newProbability: number;
  stage: string;
  nextSteps?: string[];
}

export interface SlideCompletedPayload extends BaseRealtimePayload {
  eventType: 'slide_completed';
  deckId: string;
  slideIndex: number;
  totalSlides: number;
  slideScore?: number;
}

export interface DeckReadyPayload extends BaseRealtimePayload {
  eventType: 'deck_ready';
  deckId: string;
  signalStrength: number;
  totalSlides: number;
}

export interface TasksGeneratedPayload extends BaseRealtimePayload {
  eventType: 'tasks_generated';
  tasks: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  source: 'ai' | 'user';
}

export interface InvestorScoredPayload extends BaseRealtimePayload {
  eventType: 'investor_scored';
  investorId: string;
  fitScore: number;
  categories: Record<string, number>;
  warmPaths?: number;
}

export interface CanvasPayload extends BaseRealtimePayload {
  eventType: 'canvas_prefilled' | 'canvas_saved' | 'canvas_validated';
  documentId: string;
  boxes?: Record<string, { status: 'complete' | 'needs_work' | 'missing' }>;
  overallScore?: number;
}

export interface DocumentAnalyzedPayload extends BaseRealtimePayload {
  eventType: 'document_analyzed';
  documentId: string;
  qualityScore: number;
  suggestions: string[];
}

// Union type for all payloads
export type RealtimePayload =
  | HealthScorePayload
  | PrioritiesPayload
  | RiskPayload
  | EnrichmentPayload
  | ReadinessScorePayload
  | ContactEnrichedPayload
  | DealScoredPayload
  | SlideCompletedPayload
  | DeckReadyPayload
  | TasksGeneratedPayload
  | InvestorScoredPayload
  | CanvasPayload
  | DocumentAnalyzedPayload;

// ============ Hook Return Types ============
export interface DashboardRealtimeState {
  healthScore: number | null;
  healthTrend: 'up' | 'down' | 'stable';
  priorities: PrioritiesPayload['priorities'];
  risks: RiskPayload[];
  alignment: number | null;
  lastUpdate: string | null;
}

export interface OnboardingRealtimeState {
  urlEnrichment: { status: 'idle' | 'loading' | 'success' | 'error'; data?: Record<string, unknown> };
  contextEnrichment: { status: 'idle' | 'loading' | 'success' | 'error'; data?: Record<string, unknown> };
  founderEnrichment: { status: 'idle' | 'loading' | 'success' | 'error'; data?: Record<string, unknown> };
  readinessScore: number | null;
  currentStep: number;
}

export interface CRMRealtimeState {
  enrichedContacts: Map<string, ContactEnrichedPayload>;
  dealScores: Map<string, DealScoredPayload>;
  pipelineAlerts: RiskPayload[];
}

export interface PitchDeckRealtimeState {
  isGenerating: boolean;
  slidesCompleted: number;
  totalSlides: number;
  slideScores: Map<number, number>;
  signalStrength: number | null;
}

export interface TasksRealtimeState {
  newTasks: TasksGeneratedPayload['tasks'];
  priorities: PrioritiesPayload['priorities'];
  bottlenecks: RiskPayload[];
}

export interface InvestorsRealtimeState {
  fitScores: Map<string, InvestorScoredPayload>;
  readinessUpdates: ReadinessScorePayload[];
}

export interface CanvasRealtimeState {
  validationScores: Record<string, { status: 'complete' | 'needs_work' | 'missing' }>;
  overallScore: number | null;
  lastSaved: string | null;
  activeEditors: string[];
}

export interface DocumentsRealtimeState {
  analysisResults: Map<string, DocumentAnalyzedPayload>;
}

export interface ChatRealtimeState {
  streamingMessage: string;
  isStreaming: boolean;
  routeLinks: Array<{ module: string; action: string }>;
}

export interface EventsRealtimeState {
  recommendations: Array<{ eventId: string; matchScore: number }>;
  sponsorMatches: Array<{ name: string; fitScore: number }>;
}

// ============ RT-1: Validator Pipeline Events ============
export type ValidatorRealtimeEventType =
  | 'agent_started'
  | 'agent_completed'
  | 'agent_failed'
  | 'pipeline_complete'
  | 'pipeline_failed';

export interface ValidatorAgentPayload {
  sessionId: string;
  agent: string;
  step: number;
  totalSteps: number;
  timestamp: number;
  durationMs?: number;
  error?: string;
}

export interface ValidatorPipelineCompletePayload {
  sessionId: string;
  timestamp: number;
  status: 'complete' | 'partial' | 'failed';
  score?: number;
  reportId?: string;
  durationMs?: number;
  error?: string;
}

export type ValidatorAgentStatus = 'queued' | 'running' | 'ok' | 'partial' | 'failed' | 'skipped';

export interface ValidatorRealtimeAgent {
  name: string;
  step: number;
  status: ValidatorAgentStatus;
  durationMs?: number;
  error?: string;
}

export interface ValidatorRealtimeState {
  agents: ValidatorRealtimeAgent[];
  pipelineStatus: 'running' | 'complete' | 'partial' | 'failed';
  reportId: string | null;
  score: number | null;
  lastEvent: ValidatorRealtimeEventType | null;
  isConnected: boolean;
}
