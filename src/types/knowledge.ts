/**
 * Knowledge Types
 * Types for vector database and RAG system
 */

/** Matches DB enum knowledge_source_type (14 values). */
export type SourceType =
  | 'deloitte'
  | 'bcg'
  | 'pwc'
  | 'mckinsey'
  | 'cb_insights'
  | 'gartner'
  | 'forrester'
  | 'harvard_business_review'
  | 'mit_sloan'
  | 'yc_research'
  | 'a16z'
  | 'sequoia'
  | 'internal'
  | 'other';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface KnowledgeChunk {
  id: string;
  content: string;
  embedding?: number[];
  source: string;
  sourceType: SourceType;
  year: number;
  sampleSize?: number;
  confidence: ConfidenceLevel;
  category: string;
  tags?: string[];
  createdAt: string;
}

export interface KnowledgeSearchResult {
  id: string;
  content: string;
  source: string;
  confidence: ConfidenceLevel;
  similarity: number;
  documentId?: string;
  documentTitle?: string;
  sectionTitle?: string;
  pageStart?: number;
  pageEnd?: number;
}

export interface KnowledgeSearchRequest {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
  category?: string;
  industry?: string;
}

export interface RAGContext {
  chunks: KnowledgeSearchResult[];
  query: string;
  totalMatches: number;
  averageSimilarity: number;
}

// Category definitions for knowledge organization
export const KNOWLEDGE_CATEGORIES = [
  'market_size',
  'customer_acquisition',
  'unit_economics',
  'churn',
  'pricing',
  'funding',
  'team',
  'product_market_fit',
  'growth',
  'competition',
] as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];
