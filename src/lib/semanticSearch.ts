/**
 * Semantic Search Library
 * File: src/lib/semanticSearch.ts
 * 
 * Handles semantic search using embeddings and similarity matching
 * Finds papers based on meaning rather than exact keywords
 */

/**
 * Embedding response from API
 */
export interface EmbeddingResponse {
  embedding: number[];
  model: string;
  tokens?: number;
}

/**
 * Paper with semantic similarity score
 */
export interface PaperWithScore {
  id: string;
  title: string;
  similarity: number; // 0-100 percentage
  matchReason?: string;
}

/**
 * Semantic search configuration
 */
export interface SemanticSearchConfig {
  minSimilarity: number; // 0-100
  maxResults?: number;
  includeReasoning?: boolean;
}

/**
 * Gets embedding for a text query from the backend
 */
export async function getQueryEmbedding(
  query: string,
  supabase: any,
): Promise<number[]> {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    const { data, error } = await supabase.functions.invoke('get-embedding', {
      body: { 
        text: query.trim(),
        model: 'text-embedding-3-small', // or your preferred model
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to generate embedding');
    }

    if (!data?.embedding || !Array.isArray(data.embedding)) {
      throw new Error('Invalid embedding response');
    }

    return data.embedding;
  } catch (err) {
    console.error('Embedding error:', err);
    throw new Error(
      `Failed to process semantic search: ${
        err instanceof Error ? err.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Calculates cosine similarity between two vectors
 * Returns value between 0 (no similarity) and 1 (identical)
 * 
 * @param vec1 First embedding vector
 * @param vec2 Second embedding vector
 * @returns Similarity score 0-1
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  // Validate vectors
  if (!Array.isArray(vec1) || !Array.isArray(vec2)) {
    console.warn('Invalid vectors provided to cosineSimilarity');
    return 0;
  }

  if (vec1.length === 0 || vec2.length === 0) {
    return 0;
  }

  if (vec1.length !== vec2.length) {
    throw new Error(
      `Vector dimensions must match. Got ${vec1.length} and ${vec2.length}`
    );
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    const v1 = vec1[i];
    const v2 = vec2[i];

    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);

  // Handle edge case where vectors are zero vectors
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Converts cosine similarity (0-1) to percentage (0-100)
 */
export function similarityToPercentage(similarity: number): number {
  const percentage = similarity * 100;
  return Math.round(percentage * 10) / 10; // Round to 1 decimal
}

/**
 * Ranks papers by semantic similarity to query
 */
export function rankBySemanticity(
  papers: any[],
  queryEmbedding: number[],
  config: SemanticSearchConfig = { minSimilarity: 0 }
): PaperWithScore[] {
  if (!papers || papers.length === 0) {
    return [];
  }

  if (!queryEmbedding || queryEmbedding.length === 0) {
    console.warn('Empty query embedding provided');
    return [];
  }

  const scored: PaperWithScore[] = papers
    .map(paper => {
      try {
        const paperEmbedding = paper.embedding || paper.vector;
        if (!paperEmbedding || !Array.isArray(paperEmbedding)) {
          console.warn(`Paper ${paper.id} missing valid embedding`);
          return {
            id: paper.id,
            title: paper.title,
            similarity: 0,
          };
        }

        const similarity = cosineSimilarity(queryEmbedding, paperEmbedding);
        const percentage = similarityToPercentage(similarity);

        return {
          id: paper.id,
          title: paper.title,
          similarity: percentage,
          matchReason: config.includeReasoning
            ? getMatchReason(paper, percentage)
            : undefined,
        };
      } catch (err) {
        console.error(`Error scoring paper ${paper.id}:`, err);
        return {
          id: paper.id,
          title: paper.title,
          similarity: 0,
        };
      }
    })
    .filter(p => p.similarity >= (config.minSimilarity || 0))
    .sort((a, b) => b.similarity - a.similarity);

  if (config.maxResults) {
    return scored.slice(0, config.maxResults);
  }

  return scored;
}

/**
 * Gets a human-readable reason for the semantic match
 */
function getMatchReason(paper: any, similarity: number): string {
  if (similarity >= 90) {
    return 'Highly relevant - very similar meaning';
  } else if (similarity >= 75) {
    return 'Relevant - similar concepts and themes';
  } else if (similarity >= 50) {
    return 'Moderately relevant - some related concepts';
  } else {
    return 'Weakly relevant - distant connection';
  }
}

/**
 * Explains why a paper matched semantically
 */
export function explainSemanticMatch(
  paperConcepts: string[],
  queryConcepts: string[],
  similarityScore: number
): string {
  const matching = paperConcepts.filter(c =>
    queryConcepts.some(q => q.toLowerCase().includes(c.toLowerCase()))
  );

  if (matching.length > 0) {
    const conceptStr = matching.slice(0, 3).join(', ');
    return `${matching.length} matching concepts (${conceptStr}...) - ${similarityScore}% match`;
  }

  return `Semantically related content - ${similarityScore}% similarity`;
}

/**
 * Common semantic synonyms for better search
 */
export const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  'machine learning': [
    'ML',
    'artificial intelligence',
    'AI',
    'deep learning',
    'neural networks',
    'model training',
  ],
  'covid-19': ['SARS-CoV-2', 'coronavirus', 'pandemic', 'COVID', 'C-19'],
  'artificial intelligence': [
    'AI',
    'machine learning',
    'ML',
    'neural networks',
    'deep learning',
    'intelligent systems',
  ],
  'quantum computing': [
    'quantum computation',
    'quantum computer',
    'quantum algorithm',
    'QC',
    'quantum processor',
  ],
  'climate change': [
    'global warming',
    'climate crisis',
    'greenhouse effect',
    'global warming',
    'climate emergency',
  ],
  'renewable energy': [
    'clean energy',
    'sustainable energy',
    'solar energy',
    'wind power',
    'alternative energy',
  ],
  'blockchain': [
    'cryptocurrency',
    'distributed ledger',
    'crypto',
    'decentralized',
    'smart contracts',
  ],
  'crispr': ['gene editing', 'gene therapy', 'genetic engineering', 'gene modification'],
  'neural networks': [
    'deep learning',
    'artificial neural networks',
    'ANN',
    'convolutional networks',
    'RNN',
  ],
  'cancer': [
    'malignancy',
    'oncology',
    'tumor',
    'carcinoma',
    'neoplasm',
  ],
};

/**
 * Suggests related search terms for better semantic coverage
 */
export function suggestSemanticTerms(query: string): string[] {
  const normalized = query.toLowerCase();

  for (const [term, synonyms] of Object.entries(SEMANTIC_SYNONYMS)) {
    if (normalized.includes(term)) {
      return synonyms;
    }
  }

  return [];
}

/**
 * Combines results from keyword and semantic search
 */
export function mergeSearchResults(
  keywordResults: any[],
  semanticResults: any[],
  semanticWeight: number = 0.5 // 0-1, how much to weight semantic
): any[] {
  if (!Array.isArray(keywordResults) || !Array.isArray(semanticResults)) {
    return keywordResults || [];
  }

  if (keywordResults.length === 0) return semanticResults;
  if (semanticResults.length === 0) return keywordResults;

  // Create a map for easy lookup
  const resultMap = new Map<string, any>();

  // Add keyword results with initial score
  keywordResults.forEach((paper, index) => {
    resultMap.set(paper.id, {
      ...paper,
      keywordScore: 1 - index / keywordResults.length,
      semanticScore: 0,
    });
  });

  // Add/merge semantic results
  semanticResults.forEach((paper, index) => {
    const score = paper.similarity / 100; // Convert percentage to 0-1
    const existing = resultMap.get(paper.id);

    if (existing) {
      existing.semanticScore = score;
    } else {
      resultMap.set(paper.id, {
        ...paper,
        keywordScore: 0,
        semanticScore: score,
      });
    }
  });

  // Calculate combined score and sort
  const merged = Array.from(resultMap.values())
    .map(paper => ({
      ...paper,
      combinedScore:
        paper.keywordScore * (1 - semanticWeight) +
        paper.semanticScore * semanticWeight,
    }))
    .sort((a, b) => b.combinedScore - a.combinedScore);

  return merged;
}

/**
 * Validates semantic search configuration
 */
export function validateSemanticConfig(
  config: Partial<SemanticSearchConfig>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (config.minSimilarity !== undefined) {
    if (config.minSimilarity < 0 || config.minSimilarity > 100) {
      errors.push('minSimilarity must be between 0 and 100');
    }
  }

  if (config.maxResults !== undefined) {
    if (config.maxResults < 1 || config.maxResults > 1000) {
      errors.push('maxResults must be between 1 and 1000');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Gets statistics about semantic search results
 */
export function getSemanticStats(results: PaperWithScore[]): {
  count: number;
  averageSimilarity: number;
  maxSimilarity: number;
  minSimilarity: number;
  medianSimilarity: number;
} {
  if (results.length === 0) {
    return {
      count: 0,
      averageSimilarity: 0,
      maxSimilarity: 0,
      minSimilarity: 0,
      medianSimilarity: 0,
    };
  }

  const similarities = results.map(r => r.similarity).sort((a, b) => a - b);
  const sum = similarities.reduce((a, b) => a + b, 0);

  return {
    count: results.length,
    averageSimilarity: Math.round((sum / results.length) * 10) / 10,
    maxSimilarity: Math.max(...similarities),
    minSimilarity: Math.min(...similarities),
    medianSimilarity:
      similarities.length % 2 === 0
        ? (similarities[similarities.length / 2 - 1] +
            similarities[similarities.length / 2]) /
          2
        : similarities[Math.floor(similarities.length / 2)],
  };
}

/**
 * Help text for semantic search
 */
export const SEMANTIC_SEARCH_HELP = `Semantic Search Guide

Semantic search finds papers based on MEANING, not just keywords.

HOW IT WORKS:
  • Converts your query to a mathematical representation
  • Compares with all papers in the database
  • Returns papers with similar meaning

EXAMPLES:
  Simple query: "neural network"
  Finds: Deep learning, CNN, RNN, artificial networks, ...
  
  Simple query: "renewable power"
  Finds: Solar energy, wind power, clean energy, sustainable sources, ...

BENEFITS:
  ✓ Find papers using different terminology
  ✓ Discover related research you might miss
  ✓ Better results for complex concepts

TIPS:
  • Use longer, more descriptive queries
  • Don't worry about exact keywords
  • Combine with keyword search for best results
  • Adjust similarity threshold based on your needs
`;
