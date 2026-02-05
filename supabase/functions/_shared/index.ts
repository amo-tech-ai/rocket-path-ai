/**
 * Shared Utilities Index
 * Re-exports all shared utilities for convenient imports
 *
 * @example
 * import { corsHeaders, requireAuth, callGemini, create } from '../_shared/index.ts';
 */

// CORS utilities
export {
  corsHeaders,
  handleCors,
  withCors,
} from './cors.ts';

// Authentication utilities
export {
  createUserClient,
  createServiceClient,
  verifyAuth,
  requireAuth,
  requireRole,
  canAccessStartup,
  ensureProfileExists,
  type UserContext,
  type AuthResult,
} from './auth.ts';

// Database utilities
export {
  applyPagination,
  getPaginated,
  getById,
  create,
  update,
  deleteById,
  upsert,
  bulkInsert,
  bulkUpdate,
  getStartupContext,
  getLeanCanvas,
  type PaginationParams,
  type PaginatedResult,
  type SortParams,
} from './database.ts';

// Error handling utilities
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  RateLimitError,
  AIError,
  errorResponse,
  successResponse,
  withErrorHandling,
  createHandler,
  validateRequired,
  validateUUID,
  validateEnum,
  validateRange,
} from './errors.ts';

// AI client utilities
export {
  callGemini,
  callGeminiChat,
  callClaude,
  callClaudeChat,
  callAI,
  parseAIJson,
  calculateCost,
  MODELS,
  type AIResponse,
  type AIOptions,
  type ChatMessage,
  type AIProvider,
} from './ai-client.ts';

// Type definitions
export type {
  // Startup types
  Startup,
  TractionData,
  StartupStage,

  // Assumption types
  Assumption,
  AssumptionStatus,
  AssumptionSource,

  // Experiment types
  Experiment,
  ExperimentType,
  ExperimentStatus,

  // Customer segment types
  CustomerSegment,
  Demographics,
  Psychographics,
  Firmographics,

  // Interview types
  Interview,
  InterviewType,
  InterviewStatus,

  // Interview insight types
  InterviewInsight,
  InsightType,

  // Jobs to be done types
  JobToBeDone,

  // Customer forces types
  CustomerForce,

  // Task types
  Task,
  TaskStatus,
  TaskPriority,
  TaskCategory,

  // Lean Canvas types
  LeanCanvas,

  // AI run types
  AIRun,

  // API types
  ActionRequest,
  ActionResponse,
} from './types.ts';

// Master system prompt
export {
  CORE_IDENTITY,
  LEAN_METHODOLOGY,
  STAGE_GUIDANCE,
  SCREEN_CONTEXT,
  ACTION_PROMPTS,
  RESPONSE_RULES,
  buildMasterPrompt,
  buildMinimalPrompt,
  buildPublicPrompt,
  AGENT_PROMPTS,
  type PromptContext,
} from './master-system-prompt.ts';

// Prompt utilities
export {
  interpolatePrompt,
  validateOutput,
  getStartupContext as getStartupContextForPrompts,
  calculateCost as calculatePromptCost,
  getNextStep,
  getAllSteps,
  createPromptRun,
  updatePromptRun,
  type PromptPack,
  type PromptStep,
  type PromptRun,
  type StartupContext,
  type ValidationResult,
} from './prompt-utils.ts';
