/**
 * useKnowledgeSearch Hook
 * Semantic search across knowledge chunks using OpenAI text-embedding-3-small
 */

import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { KnowledgeSearchResult, KnowledgeSearchRequest, RAGContext } from '@/types/knowledge';

interface UseKnowledgeSearchReturn {
  search: (request: KnowledgeSearchRequest) => Promise<RAGContext>;
  results: KnowledgeSearchResult[];
  isSearching: boolean;
  error: Error | null;
  lastContext: RAGContext | null;
}

export function useKnowledgeSearch(): UseKnowledgeSearchReturn {
  const [results, setResults] = useState<KnowledgeSearchResult[]>([]);
  const [lastContext, setLastContext] = useState<RAGContext | null>(null);
  
  const searchMutation = useMutation({
    mutationFn: async (request: KnowledgeSearchRequest): Promise<RAGContext> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }
      
      // Call the dedicated knowledge-search edge function with hybrid search
      const { data, error } = await supabase.functions.invoke('knowledge-search', {
        body: {
          query: request.query,
          match_threshold: request.matchThreshold || 0.5,
          match_count: request.matchCount || 10,
          filter_category: request.category || null,
          filter_industry: request.industry || null,
          hybrid: true,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      
      // Map response to typed results (includes citation fields from hybrid search)
      const mappedResults: KnowledgeSearchResult[] = (data.results || []).map((r: {
        id: string;
        content: string;
        source: string;
        confidence: 'high' | 'medium' | 'low';
        similarity: number;
        document_id?: string;
        document_title?: string;
        section_title?: string;
        page_start?: number;
        page_end?: number;
      }) => ({
        id: r.id,
        content: r.content,
        source: r.source,
        confidence: r.confidence as 'high' | 'medium' | 'low',
        similarity: r.similarity,
        documentId: r.document_id,
        documentTitle: r.document_title,
        sectionTitle: r.section_title,
        pageStart: r.page_start,
        pageEnd: r.page_end,
      }));
      
      const context: RAGContext = {
        chunks: mappedResults,
        query: request.query,
        totalMatches: mappedResults.length,
        averageSimilarity: mappedResults.reduce((acc, r) => acc + r.similarity, 0) / (mappedResults.length || 1),
      };
      
      return context;
    },
    onSuccess: (context) => {
      setResults(context.chunks);
      setLastContext(context);
    },
  });
  
  const search = useCallback(async (request: KnowledgeSearchRequest): Promise<RAGContext> => {
    return searchMutation.mutateAsync(request);
  }, [searchMutation]);
  
  return {
    search,
    results,
    isSearching: searchMutation.isPending,
    error: searchMutation.error as Error | null,
    lastContext,
  };
}

/**
 * Format RAG context for AI prompt injection
 */
export function formatRAGContext(context: RAGContext): string {
  if (context.chunks.length === 0) {
    return '';
  }
  
  const formattedChunks = context.chunks.map((chunk, index) => {
    const title = chunk.documentTitle || chunk.source;
    const section = chunk.sectionTitle ? ` — ${chunk.sectionTitle}` : '';
    const page = chunk.pageStart != null ? `, p.${chunk.pageStart}` : '';
    return `[${index + 1}] ${chunk.content} (Source: ${title}${section}${page}, Confidence: ${chunk.confidence})`;
  }).join('\n\n');
  
  return `
RELEVANT INDUSTRY DATA (use for citations):
${formattedChunks}

Note: When referencing these statistics, cite the source and confidence level.
`;
}

export default useKnowledgeSearch;
