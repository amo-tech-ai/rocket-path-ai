/**
 * Development Session Storage
 * Stores wizard sessions in localStorage for dev mode to bypass RLS
 */

import { DEV_MOCK_USER_ID } from './devConfig';
import type { WizardSession, WizardFormData } from '@/hooks/onboarding/types';

const STORAGE_KEY = 'dev_wizard_session';

export function getDevSession(): WizardSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return {
      id: data.id,
      user_id: DEV_MOCK_USER_ID,
      startup_id: data.startup_id || null,
      current_step: data.current_step || 1,
      status: data.status || 'in_progress',
      form_data: (data.form_data || {}) as WizardFormData,
      ai_extractions: data.ai_extractions || null,
      extracted_traction: data.extracted_traction || null,
      extracted_funding: data.extracted_funding || null,
      profile_strength: data.profile_strength || null,
      interview_answers: data.interview_answers || [],
      interview_progress: data.interview_progress || 0,
      started_at: data.started_at || new Date().toISOString(),
      completed_at: data.completed_at || null,
    };
  } catch {
    return null;
  }
}

export function saveDevSession(session: Partial<WizardSession>): string {
  if (typeof window === 'undefined') {
    throw new Error('localStorage not available');
  }
  
  const existing = getDevSession();
  const sessionId = existing?.id || `dev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Merge form_data if both exist
  const existingFormData = existing?.form_data || {};
  const newFormData = session.form_data || {};
  const mergedFormData = { ...existingFormData, ...newFormData };

  const updated: WizardSession = {
    id: sessionId,
    user_id: DEV_MOCK_USER_ID,
    startup_id: session.startup_id ?? existing?.startup_id ?? null,
    current_step: session.current_step ?? existing?.current_step ?? 1,
    status: (session.status as 'in_progress' | 'completed') ?? existing?.status ?? 'in_progress',
    form_data: mergedFormData,
    ai_extractions: session.ai_extractions ?? existing?.ai_extractions ?? null,
    extracted_traction: session.extracted_traction ?? existing?.extracted_traction ?? null,
    extracted_funding: session.extracted_funding ?? existing?.extracted_funding ?? null,
    profile_strength: session.profile_strength ?? existing?.profile_strength ?? null,
    interview_answers: session.interview_answers ?? existing?.interview_answers ?? [],
    interview_progress: session.interview_progress ?? existing?.interview_progress ?? 0,
    started_at: existing?.started_at ?? new Date().toISOString(),
    completed_at: session.completed_at ?? existing?.completed_at ?? null,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return sessionId;
}

export function deleteDevSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
