/**
 * Documents Agent Hook
 * Frontend interface for Documents AI actions (generation, analysis, search)
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ============================================================================
// Types
// ============================================================================

export type DocumentTemplate = 
  | 'executive_summary'
  | 'one_pager'
  | 'investment_memo'
  | 'pitch_script'
  | 'press_release'
  | 'business_plan';

export interface GeneratedDocument {
  success: boolean;
  document_id?: string;
  title?: string;
  content?: string;
  sections?: {
    heading: string;
    body: string;
  }[];
  word_count?: number;
  error?: string;
}

export interface DocumentAnalysis {
  success: boolean;
  document_id?: string;
  scores?: {
    clarity: number;
    completeness: number;
    persuasiveness: number;
    investor_readiness: number;
    overall: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  error?: string;
}

export interface ImprovedSection {
  success: boolean;
  original?: string;
  improved?: string;
  changes_made?: string[];
  error?: string;
}

export interface SearchResult {
  success: boolean;
  results?: {
    document_id: string;
    title: string;
    type: string;
    snippet: string;
    relevance: number;
    updated_at: string;
  }[];
  total_count?: number;
  error?: string;
}

export interface DocumentSummary {
  success: boolean;
  document_id?: string;
  summary?: string;
  key_points?: string[];
  word_count?: number;
  original_word_count?: number;
  error?: string;
}

export interface VersionComparison {
  success: boolean;
  version_a?: number;
  version_b?: number;
  changes?: {
    type: 'added' | 'removed' | 'modified';
    section: string;
    description: string;
  }[];
  summary?: string;
  error?: string;
}

// ============================================================================
// Helper: Invoke Documents Agent
// ============================================================================

async function invokeDocumentsAgent<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('documents-agent', {
    body: { action, ...payload },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) throw error;
  return data as T;
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Generate a document from template
 */
export function useGenerateDocument() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      template,
      customInstructions
    }: { 
      startupId: string; 
      template: DocumentTemplate;
      customInstructions?: string;
    }) => {
      return invokeDocumentsAgent<GeneratedDocument>('generate_document', {
        startup_id: startupId,
        template,
        custom_instructions: customInstructions,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`${data.title || 'Document'} generated successfully`);
      } else {
        toast.error(data.error || 'Failed to generate document');
      }
    },
    onError: (error) => {
      console.error('Generate document error:', error);
      toast.error('Failed to generate document');
    },
  });
}

/**
 * Analyze document quality and investor-readiness
 */
export function useAnalyzeDocument() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      documentId 
    }: { 
      startupId: string; 
      documentId: string;
    }) => {
      return invokeDocumentsAgent<DocumentAnalysis>('analyze_document', {
        startup_id: startupId,
        document_id: documentId,
      });
    },
    onSuccess: (data) => {
      if (data.success && data.scores) {
        const score = data.scores.overall;
        if (score >= 80) {
          toast.success(`Document score: ${score}/100 - Investor ready!`);
        } else if (score >= 60) {
          toast.info(`Document score: ${score}/100 - Needs improvement`);
        } else {
          toast.warning(`Document score: ${score}/100 - Significant work needed`);
        }
      } else {
        toast.error(data.error || 'Failed to analyze document');
      }
    },
    onError: (error) => {
      console.error('Analyze document error:', error);
      toast.error('Failed to analyze document');
    },
  });
}

/**
 * Improve a specific section of a document
 */
export function useImproveSection() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      documentId,
      sectionName,
      currentContent,
      improvementGoal
    }: { 
      startupId: string; 
      documentId: string;
      sectionName: string;
      currentContent: string;
      improvementGoal?: 'clarity' | 'impact' | 'brevity' | 'persuasiveness';
    }) => {
      return invokeDocumentsAgent<ImprovedSection>('improve_section', {
        startup_id: startupId,
        document_id: documentId,
        section_name: sectionName,
        current_content: currentContent,
        improvement_goal: improvementGoal,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Section improved');
      } else {
        toast.error(data.error || 'Failed to improve section');
      }
    },
    onError: (error) => {
      console.error('Improve section error:', error);
      toast.error('Failed to improve section');
    },
  });
}

/**
 * Search documents by content
 */
export function useSearchDocuments() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      query,
      documentType
    }: { 
      startupId: string; 
      query: string;
      documentType?: string;
    }) => {
      return invokeDocumentsAgent<SearchResult>('search_documents', {
        startup_id: startupId,
        query,
        document_type: documentType,
      });
    },
    onError: (error) => {
      console.error('Search documents error:', error);
      toast.error('Failed to search documents');
    },
  });
}

/**
 * Generate a summary of a document
 */
export function useSummarizeDocument() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      documentId,
      maxWords
    }: { 
      startupId: string; 
      documentId: string;
      maxWords?: number;
    }) => {
      return invokeDocumentsAgent<DocumentSummary>('summarize_document', {
        startup_id: startupId,
        document_id: documentId,
        max_words: maxWords || 200,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Summary generated');
      } else {
        toast.error(data.error || 'Failed to summarize');
      }
    },
    onError: (error) => {
      console.error('Summarize document error:', error);
      toast.error('Failed to summarize document');
    },
  });
}

/**
 * Compare two versions of a document
 */
export function useCompareVersions() {
  return useMutation({
    mutationFn: async ({ 
      startupId, 
      documentId,
      versionA,
      versionB
    }: { 
      startupId: string; 
      documentId: string;
      versionA: number;
      versionB: number;
    }) => {
      return invokeDocumentsAgent<VersionComparison>('compare_versions', {
        startup_id: startupId,
        document_id: documentId,
        version_a: versionA,
        version_b: versionB,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Version comparison ready');
      } else {
        toast.error(data.error || 'Failed to compare versions');
      }
    },
    onError: (error) => {
      console.error('Compare versions error:', error);
      toast.error('Failed to compare versions');
    },
  });
}

// ============================================================================
// Composite Hook
// ============================================================================

export function useDocumentsAgent() {
  return {
    generateDocument: useGenerateDocument(),
    analyzeDocument: useAnalyzeDocument(),
    improveSection: useImproveSection(),
    searchDocuments: useSearchDocuments(),
    summarizeDocument: useSummarizeDocument(),
    compareVersions: useCompareVersions(),
  };
}
