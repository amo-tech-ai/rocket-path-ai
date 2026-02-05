/**
 * Database Utilities
 * Provides common database operations and helpers for Edge Functions
 */

import { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

// =============================================================================
// Types
// =============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SortParams {
  column: string;
  ascending?: boolean;
}

// =============================================================================
// Query Helpers
// =============================================================================

/**
 * Apply pagination to a query
 */
export function applyPagination(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  params: PaginationParams
) {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100); // Cap at 100
  const offset = params.offset ?? (page - 1) * limit;

  return query.range(offset, offset + limit - 1);
}

/**
 * Get paginated results with total count
 */
export async function getPaginated<T>(
  supabase: SupabaseClient,
  table: string,
  params: PaginationParams & {
    select?: string;
    filters?: Record<string, unknown>;
    sort?: SortParams;
  }
): Promise<PaginatedResult<T>> {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100);
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from(table)
    .select(params.select || '*', { count: 'exact' });

  // Apply filters
  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    }
  }

  // Apply sorting
  if (params.sort) {
    query = query.order(params.sort.column, {
      ascending: params.sort.ascending ?? true,
    });
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }

  return {
    data: (data || []) as T[],
    total: count || 0,
    page,
    limit,
    hasMore: (count || 0) > offset + limit,
  };
}

// =============================================================================
// CRUD Helpers
// =============================================================================

/**
 * Get a single record by ID
 */
export async function getById<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select?: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select(select || '*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(`Failed to get ${table}: ${error.message}`);
  }

  return data as T;
}

/**
 * Create a new record
 */
export async function create<T>(
  supabase: SupabaseClient,
  table: string,
  data: Partial<T>,
  select?: string
): Promise<T> {
  const { data: created, error } = await supabase
    .from(table)
    .insert(data)
    .select(select || '*')
    .single();

  if (error) {
    throw new Error(`Failed to create ${table}: ${error.message}`);
  }

  return created as T;
}

/**
 * Update a record by ID
 */
export async function update<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  data: Partial<T>,
  select?: string
): Promise<T> {
  const { data: updated, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select(select || '*')
    .single();

  if (error) {
    throw new Error(`Failed to update ${table}: ${error.message}`);
  }

  return updated as T;
}

/**
 * Delete a record by ID
 */
export async function deleteById(
  supabase: SupabaseClient,
  table: string,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
}

/**
 * Upsert a record (insert or update)
 */
export async function upsert<T>(
  supabase: SupabaseClient,
  table: string,
  data: Partial<T>,
  onConflict?: string,
  select?: string
): Promise<T> {
  const { data: upserted, error } = await supabase
    .from(table)
    .upsert(data, {
      onConflict: onConflict || 'id',
    })
    .select(select || '*')
    .single();

  if (error) {
    throw new Error(`Failed to upsert ${table}: ${error.message}`);
  }

  return upserted as T;
}

// =============================================================================
// Bulk Operations
// =============================================================================

/**
 * Bulk insert records
 */
export async function bulkInsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: Partial<T>[],
  select?: string
): Promise<T[]> {
  if (records.length === 0) return [];

  const { data, error } = await supabase
    .from(table)
    .insert(records)
    .select(select || '*');

  if (error) {
    throw new Error(`Failed to bulk insert ${table}: ${error.message}`);
  }

  return (data || []) as T[];
}

/**
 * Bulk update records
 */
export async function bulkUpdate<T>(
  supabase: SupabaseClient,
  table: string,
  ids: string[],
  data: Partial<T>
): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase
    .from(table)
    .update(data)
    .in('id', ids);

  if (error) {
    throw new Error(`Failed to bulk update ${table}: ${error.message}`);
  }
}

// =============================================================================
// Startup Context Helpers
// =============================================================================

/**
 * Get startup context for AI prompts
 */
export async function getStartupContext(
  supabase: SupabaseClient,
  startupId: string
): Promise<Record<string, unknown>> {
  const { data: startup, error } = await supabase
    .from('startups')
    .select(`
      id,
      name,
      description,
      tagline,
      industry,
      stage,
      target_market,
      target_customers,
      unique_value,
      business_model,
      raise_amount,
      website_url,
      metadata,
      key_features,
      competitors
    `)
    .eq('id', startupId)
    .single();

  if (error || !startup) {
    throw new Error(`Failed to fetch startup: ${error?.message || 'Not found'}`);
  }

  return {
    startup_id: startup.id,
    startup_name: startup.name || '',
    company_name: startup.name || '',
    description: startup.description || '',
    one_liner: startup.tagline || '',
    industry: startup.industry || '',
    stage: startup.stage || '',
    target_market: startup.target_market || '',
    target_customers: startup.target_customers || [],
    unique_value: startup.unique_value || '',
    business_model: startup.business_model || '',
    key_features: startup.key_features || [],
    competitors: startup.competitors || [],
    raise_amount: startup.raise_amount,
    website_url: startup.website_url,
    ...(startup.metadata as Record<string, unknown> || {}),
  };
}

/**
 * Get lean canvas for a startup
 */
export async function getLeanCanvas(
  supabase: SupabaseClient,
  startupId: string
): Promise<Record<string, unknown> | null> {
  const { data: canvas } = await supabase
    .from('lean_canvases')
    .select('*')
    .eq('startup_id', startupId)
    .eq('is_current', true)
    .single();

  return canvas as Record<string, unknown> | null;
}
