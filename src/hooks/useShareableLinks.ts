/**
 * Hook for managing shareable links (generate, list, revoke, fetch by token)
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://yvyesmiczbjqwbqtlidy.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eWVzbWljemJqcXdicXRsaWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NTA1OTcsImV4cCI6MjA4NDAyNjU5N30.eSN491MztXvWR03q4v-Zfc0zrG06mrIxdSRe_FFZDu4";

export interface ShareableLink {
  id: string;
  token: string;
  resource_type: string;
  resource_id: string;
  startup_id: string;
  expires_at: string;
  revoked_at: string | null;
  access_count: number;
  last_accessed_at: string | null;
  created_at: string;
}

/** Expiry options in days (0 = never) */
export type ExpiryOption = 1 | 7 | 30 | 0;

export type ShareErrorCode = 'expired' | 'revoked' | 'invalid' | 'not_found' | 'unknown';
export interface ShareError {
  code: ShareErrorCode;
  message: string;
}

function getExpiresAt(days: ExpiryOption): string | null {
  if (days === 0) return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 100).toISOString(); // ~100 years
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function useShareableLinks() {
  const [loading, setLoading] = useState(false);

  /** Generate a new share link */
  const generateLink = useCallback(async (
    resourceType: 'validation_report' | 'pitch_deck' | 'lean_canvas' | 'decision_log',
    resourceId: string,
    startupId: string,
    expiresInDays: ExpiryOption = 7,
  ): Promise<ShareableLink | null> => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('shareable_links')
        .insert({
          resource_type: resourceType,
          resource_id: resourceId,
          startup_id: startupId,
          created_by: user.id,
          expires_at: getExpiresAt(expiresInDays),
        })
        .select()
        .single();

      if (error) throw error;
      return data as ShareableLink;
    } catch (e) {
      console.error('generateLink error:', e);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Get all active (not revoked, not expired) links for a resource */
  const getActiveLinks = useCallback(async (
    resourceType: string,
    resourceId: string,
  ): Promise<ShareableLink[]> => {
    const { data, error } = await supabase
      .from('shareable_links')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getActiveLinks error:', error);
      return [];
    }
    return (data || []) as ShareableLink[];
  }, []);

  /** Revoke a share link */
  const revokeLink = useCallback(async (linkId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('shareable_links')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', linkId);

    if (error) {
      console.error('revokeLink error:', error);
      return false;
    }
    return true;
  }, []);

  return { generateLink, getActiveLinks, revokeLink, loading };
}

/**
 * Fetch a report using a share token (for public/anon access).
 * Creates a temporary Supabase client with the x-share-token header.
 * Returns typed ShareError for specific error conditions (expired, revoked, invalid, not_found).
 */
export async function fetchReportByToken(token: string): Promise<{ data: Record<string, unknown> | null; error: ShareError | null }> {
  // Create anon client with custom header for RLS token check
  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: { 'x-share-token': token },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // First: fetch the link by token without validity filters (to detect error type)
  const { data: linkCheck, error: checkError } = await anonClient
    .from('shareable_links')
    .select('id, expires_at, revoked_at, resource_id, resource_type')
    .eq('token', token)
    .single();

  if (checkError || !linkCheck) {
    return { data: null, error: { code: 'invalid', message: 'Invalid share link' } };
  }
  if (linkCheck.revoked_at) {
    return { data: null, error: { code: 'revoked', message: 'This link has been revoked' } };
  }
  if (new Date(linkCheck.expires_at) < new Date()) {
    return { data: null, error: { code: 'expired', message: 'This link has expired' } };
  }
  if (linkCheck.resource_type !== 'validation_report') {
    return { data: null, error: { code: 'invalid', message: 'This link does not point to a validation report' } };
  }

  // Fetch the actual report
  const { data: report, error: reportError } = await anonClient
    .from('validator_reports')
    .select('*')
    .eq('id', linkCheck.resource_id)
    .single();

  if (reportError || !report) {
    return { data: null, error: { code: 'not_found', message: 'Report not found' } };
  }

  // Increment access_count via SECURITY DEFINER function (fire-and-forget)
  anonClient.rpc('increment_share_access', {
    share_token: token,
    viewer_ua: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    viewer_referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
  }).then(() => {}, () => {});

  return { data: report, error: null };
}
