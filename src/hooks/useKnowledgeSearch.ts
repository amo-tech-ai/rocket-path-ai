/**
 * useKnowledgeSearch Hook
 * Semantic search across knowledge chunks for RAG
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
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          action: 'search_knowledge',
          query: request.query,
          matchThreshold: request.matchThreshold || 0.75,
          matchCount: request.matchCount || 5,
          category: request.category,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) throw error;
      
      const context: RAGContext = {
        chunks: data.results || [],
        query: request.query,
        totalMatches: data.results?.length || 0,
        averageSimilarity: data.results?.reduce((acc: number, r: KnowledgeSearchResult) => acc + r.similarity, 0) / (data.results?.length || 1) || 0,
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
    return `[${index + 1}] ${chunk.content} (Source: ${chunk.source}, Confidence: ${chunk.confidence})`;
  }).join('\n\n');
  
  return `
RELEVANT INDUSTRY DATA (use for citations):
${formattedChunks}

Note: When referencing these statistics, cite the source and confidence level.
`;
}

export default useKnowledgeSearch;
