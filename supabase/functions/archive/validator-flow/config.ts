/**
 * validator-flow configuration
 * Centralized config for function URLs and limits
 */

export const FUNCTIONS = {
  start: 'validator-start',
  status: 'validator-status',
} as const;

export const ROUTES = {
  start: 'start',
  status: 'status',
} as const;
