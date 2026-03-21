// Supabase client configuration
// Uses environment variables for flexibility across environments
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase connection — requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    // Bypass navigator.locks to prevent deadlocks in single-tab / embedded contexts.
    // Supabase's default lock uses navigator.locks which can deadlock when a stale
    // tab or browsing context holds the lock indefinitely.
    lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
  },
  realtime: {
    params: {
      log_level: import.meta.env.DEV ? 'info' : 'warn',
    },
    // Exponential backoff: 1s, 2s, 4s, 8s... max 30s
    reconnectAfterMs: (tries: number) =>
      Math.min(1000 * Math.pow(2, tries), 30_000),
  },
});