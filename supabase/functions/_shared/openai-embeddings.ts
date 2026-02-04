/**
 * OpenAI Embeddings Utility
 * Uses text-embedding-3-small model (1536 dimensions)
 */

const OPENAI_API_URL = "https://api.openai.com/v1/embeddings";

export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
}

/**
 * Generate embedding for a single text using OpenAI's text-embedding-3-small
 * @param text - Text to embed
 * @returns Embedding vector (1536 dimensions) and token count
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Clean and normalize text
  const cleanedText = text.replace(/\n/g, " ").trim();
  
  if (!cleanedText) {
    throw new Error("Text cannot be empty");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: cleanedText,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenAI Embeddings] API error ${response.status}:`, errorText);
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (response.status === 401) {
      throw new Error("Invalid OpenAI API key");
    }
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    embedding: data.data[0].embedding,
    tokens: data.usage?.total_tokens || 0,
  };
}

/**
 * Generate embeddings for multiple texts in batch
 * @param texts - Array of texts to embed
 * @returns Array of embedding results
 */
export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Clean and normalize texts
  const cleanedTexts = texts.map(t => t.replace(/\n/g, " ").trim()).filter(t => t);
  
  if (cleanedTexts.length === 0) {
    return [];
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: cleanedTexts,
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenAI Embeddings] Batch API error ${response.status}:`, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const tokensPerItem = Math.ceil((data.usage?.total_tokens || 0) / cleanedTexts.length);
  
  return data.data.map((item: { embedding: number[]; index: number }) => ({
    embedding: item.embedding,
    tokens: tokensPerItem,
  }));
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same dimensions");
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Format embedding vector for Supabase pgvector storage
 * Returns a string representation like "[0.1, 0.2, ...]"
 */
export function formatEmbeddingForStorage(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}
