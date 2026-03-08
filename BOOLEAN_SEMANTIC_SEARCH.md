# Boolean & Semantic Search Implementation Guide

Complete guide for adding advanced search capabilities to your research paper app.

---

## 📚 Overview

### Boolean Search
Allows users to combine search terms with operators:
- `AND` - Both terms must appear: `"machine learning" AND "neural networks"`
- `OR` - Either term can appear: `"COVID-19" OR "SARS-CoV-2"`
- `NOT` - Exclude term: `AI NOT "machine learning"`
- Parentheses for grouping: `(AI OR "machine learning") AND healthcare`

### Semantic Search
Finds papers based on **meaning** rather than exact keywords:
- "Deep learning techniques" finds papers about neural networks, CNN, RNN, etc.
- Works even with different terminology
- Returns **relevance scores** based on semantic similarity
- Can be combined with boolean operators

### Why Both?
- **Boolean**: Precision - exact control over what you want
- **Semantic**: Recall - discover papers using different terminology
- **Combined**: Best of both - precise AND meaning-aware

---

## 🔧 Step 1: Update Types

**File:** `src/types/paper.ts`

Add these new interfaces:

```typescript
// Add new search modes
export type SearchMode = 'simple' | 'boolean' | 'semantic' | 'hybrid';

// Boolean search query parsed structure
export interface BooleanQuery {
  operator: 'AND' | 'OR' | 'NOT';
  terms: (BooleanQuery | string)[];
}

// Extended search filters
export interface SearchFilters {
  yearFrom: number;
  yearTo: number;
  sortBy: 'relevance_score' | 'cited_by_count' | 'publication_date' | 'semantic_similarity';
  subjects: string[];
  // NEW FIELDS
  searchMode: SearchMode;
  semanticWeight?: number; // 0-1, how much to weight semantic similarity
  useBoolean?: boolean;
  minSemanticScore?: number; // 0-100, minimum similarity threshold
}

// For semantic search results
export interface SemanticMatch {
  paperId: string;
  title: string;
  similarity: number; // 0-100 similarity score
  abstractExcerpt?: string;
  matchedConcepts: string[];
}

// Extended Paper with semantic data
export interface PaperWithSemanticData extends Paper {
  semanticScore?: number;
  semanticReason?: string;
  matchedTerms?: string[];
}

// Backend response
export interface SearchResponse {
  papers: PaperWithSemanticData[];
  totalCount: number;
  filteredCount: number;
  page: number;
  perPage: number;
  // NEW FIELDS
  semanticMetadata?: {
    queryEmbedding?: number[];
    averageSimilarity?: number;
    matchStrategy: 'keyword' | 'semantic' | 'hybrid';
  };
}

// For search UI state
export interface SearchUIState {
  mode: SearchMode;
  advancedOpen: boolean;
  showSyntaxHelp: boolean;
}
```

---

## 🔧 Step 2: Create Boolean Search Parser

**File:** Create `src/lib/booleanParser.ts`

```typescript
/**
 * Boolean search query parser and validator
 * Converts user input like "AI AND healthcare NOT risk" into structured format
 */

export class BooleanParseError extends Error {
  constructor(message: string, public position: number) {
    super(message);
    this.name = 'BooleanParseError';
  }
}

export interface ParsedBooleanQuery {
  isValid: boolean;
  terms: string[];
  operators: ('AND' | 'OR' | 'NOT')[];
  error?: string;
}

/**
 * Validates boolean search syntax
 * Checks for:
 * - Balanced parentheses
 * - Valid operators
 * - No invalid syntax like "AND AND" or leading operators
 */
export function validateBooleanQuery(query: string): {
  valid: boolean;
  error?: string;
  suggestions?: string[];
} {
  const trimmed = query.trim();

  // Check empty
  if (!trimmed) {
    return { valid: false, error: 'Query cannot be empty' };
  }

  // Check parentheses balance
  let parenCount = 0;
  for (const char of trimmed) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      return {
        valid: false,
        error: 'Unbalanced parentheses - closing parenthesis without opening',
      };
    }
  }
  if (parenCount !== 0) {
    return {
      valid: false,
      error: 'Unbalanced parentheses - missing closing parenthesis',
    };
  }

  // Check for operators at boundaries
  const operatorPattern = /\b(AND|OR|NOT)\b/i;
  if (/^(AND|OR|NOT)\b/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Query cannot start with an operator',
      suggestions: ['Remove the leading operator', 'Start with a search term'],
    };
  }

  if (/\b(AND|OR)\s*$/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Query cannot end with AND/OR operator',
      suggestions: ['Add a term after the operator', 'Use NOT instead for negation'],
    };
  }

  // Check for consecutive operators
  if (/(AND|OR)\s+(AND|OR)/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Consecutive operators are not allowed',
      suggestions: ['Use only one operator between terms'],
    };
  }

  // Check for quoted strings
  const quoteCount = (trimmed.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    return {
      valid: false,
      error: 'Unbalanced quotes - each opening quote must have a closing quote',
      suggestions: ['Add closing quote: "search term"'],
    };
  }

  return { valid: true };
}

/**
 * Parses boolean search query into structured format
 * @param query - User input query with operators
 * @returns Parsed query structure or error
 */
export function parseBooleanQuery(query: string): ParsedBooleanQuery {
  const validation = validateBooleanQuery(query);
  if (!validation.valid) {
    return {
      isValid: false,
      terms: [],
      operators: [],
      error: validation.error,
    };
  }

  const trimmed = query.trim();
  
  // Extract terms and operators
  const terms: string[] = [];
  const operators: ('AND' | 'OR' | 'NOT')[] = [];

  // Split by operators while preserving quoted strings
  const parts = splitByOperators(trimmed);

  for (const part of parts) {
    if (/^(AND|OR|NOT)$/i.test(part.trim())) {
      operators.push(part.trim().toUpperCase() as 'AND' | 'OR' | 'NOT');
    } else if (part.trim()) {
      terms.push(part.trim());
    }
  }

  return {
    isValid: true,
    terms,
    operators,
  };
}

/**
 * Splits query by operators while preserving quoted strings
 */
function splitByOperators(query: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < query.length) {
    const char = query[i];

    // Handle quotes
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
      i++;
      continue;
    }

    // If in quotes, just add character
    if (inQuotes) {
      current += char;
      i++;
      continue;
    }

    // Check for operators
    if (i < query.length - 2) {
      const word = query.substring(i, i + 3).toUpperCase();
      if (word === 'AND' && /\s/.test(query[i - 1] || ' ') && /\s/.test(query[i + 3] || ' ')) {
        if (current.trim()) parts.push(current.trim());
        parts.push('AND');
        current = '';
        i += 3;
        continue;
      }

      if (word.substring(0, 2) === 'OR' && /\s/.test(query[i - 1] || ' ') && /\s/.test(query[i + 2] || ' ')) {
        if (current.trim()) parts.push(current.trim());
        parts.push('OR');
        current = '';
        i += 2;
        continue;
      }

      if (word.substring(0, 3) === 'NOT' && /\s/.test(query[i - 1] || ' ') && /\s/.test(query[i + 3] || ' ')) {
        if (current.trim()) parts.push(current.trim());
        parts.push('NOT');
        current = '';
        i += 3;
        continue;
      }
    }

    current += char;
    i++;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

/**
 * Converts boolean query to natural language description
 * Helps users understand their query
 */
export function booleanQueryToDescription(query: string): string {
  const parsed = parseBooleanQuery(query);

  if (!parsed.isValid) return 'Invalid query';
  if (parsed.terms.length === 0) return 'No search terms';

  const descriptions: string[] = [];

  for (let i = 0; i < parsed.terms.length; i++) {
    const term = parsed.terms[i];
    const operator = i > 0 ? parsed.operators[i - 1] : undefined;

    if (i === 0) {
      descriptions.push(`Papers about "${term}"`);
    } else {
      switch (operator) {
        case 'AND':
          descriptions.push(`AND also about "${term}"`);
          break;
        case 'OR':
          descriptions.push(`OR about "${term}"`);
          break;
        case 'NOT':
          descriptions.push(`but NOT "${term}"`);
          break;
      }
    }
  }

  return descriptions.join(' ');
}

/**
 * Suggestions for boolean search help
 */
export const BOOLEAN_SEARCH_EXAMPLES = [
  {
    query: '"machine learning" AND healthcare',
    description: 'Papers about machine learning in healthcare',
  },
  {
    query: 'COVID-19 OR coronavirus OR SARS-CoV-2',
    description: 'Papers about COVID using any of these terms',
  },
  {
    query: 'AI AND (diagnosis OR treatment)',
    description: 'Papers about AI in diagnosis or treatment',
  },
  {
    query: 'quantum computing NOT classical',
    description: 'Quantum papers excluding classical computing mentions',
  },
  {
    query: '(neural networks OR deep learning) AND security',
    description: 'Papers on neural networks/deep learning security',
  },
];

export const BOOLEAN_SEARCH_HELP = `
**Boolean Search Syntax**

**AND** - Both terms must appear
Example: "machine learning" AND healthcare

**OR** - Either term can appear  
Example: cancer OR tumor

**NOT** - Exclude a term
Example: AI NOT "machine learning"

**Quotes** - Exact phrase
Example: "open access"

**Parentheses** - Grouping
Example: (AI OR ML) AND healthcare

**Tips:**
- Use quotes for multi-word phrases
- Use NOT to exclude unwanted topics
- Use parentheses to group complex queries
- Operators are case-insensitive
`;
```

---

## 🔧 Step 3: Create Semantic Search Integration

**File:** Create `src/lib/semanticSearch.ts`

```typescript
/**
 * Semantic search - finding papers by meaning, not just keywords
 * Uses embeddings to measure semantic similarity between query and papers
 */

export interface EmbeddingResponse {
  embedding: number[];
  model: string;
}

/**
 * Gets embedding for a text query
 * This would call your backend which calls OpenAI or similar
 */
export async function getQueryEmbedding(
  query: string,
  supabase: any
): Promise<number[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get-embedding', {
      body: { text: query },
    });

    if (error) throw new Error(error.message);
    if (!data?.embedding) throw new Error('No embedding returned');

    return data.embedding;
  } catch (err) {
    console.error('Failed to get embedding:', err);
    throw err;
  }
}

/**
 * Calculates cosine similarity between two vectors
 * Returns value between 0-1 (0 = no similarity, 1 = identical)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Converts similarity score (0-1) to percentage (0-100)
 */
export function similarityToPercentage(similarity: number): number {
  return Math.round(similarity * 100);
}

/**
 * Ranks papers by semantic similarity
 */
export function rankBySemanticity(
  papers: any[],
  queryEmbedding: number[],
  minThreshold: number = 0
): any[] {
  const scored = papers
    .map(paper => ({
      ...paper,
      semanticScore: similarityToPercentage(
        cosineSimilarity(queryEmbedding, paper.embedding)
      ),
    }))
    .filter(p => p.semanticScore >= minThreshold)
    .sort((a, b) => b.semanticScore - a.semanticScore);

  return scored;
}

/**
 * Explains why a paper matched semantically
 * Compares concepts and themes
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
    return `Found ${matching.length} matching concepts: ${matching.join(', ')} (${similarityScore}% similarity)`;
  }

  return `Semantically similar content (${similarityScore}% match)`;
}

/**
 * Detects similar terms that could be used for better semantic search
 * Example: "COVID-19" -> could also search "SARS-CoV-2", "coronavirus"
 */
export const SEMANTIC_SYNONYMS: Record<string, string[]> = {
  'machine learning': ['ML', 'artificial intelligence', 'AI', 'deep learning', 'neural networks'],
  'covid-19': ['SARS-CoV-2', 'coronavirus', 'pandemic'],
  'artificial intelligence': ['AI', 'machine learning', 'ML', 'neural networks', 'deep learning'],
  'quantum computing': ['quantum computation', 'quantum computer', 'quantum algorithm'],
  'climate change': ['global warming', 'climate crisis', 'greenhouse effect'],
  'renewable energy': ['clean energy', 'sustainable energy', 'solar', 'wind'],
};

/**
 * Suggests related search terms for semantic search
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
```

---

## 🔧 Step 4: Create Search Mode UI Components

**File:** Create `src/components/research/SearchModeSelector.tsx`

```typescript
import React from 'react';
import { BookOpen, Zap, Brain, Combine } from 'lucide-react';
import { SearchMode } from '@/types/paper';

interface SearchModeSelectorProps {
  currentMode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
}

export const SearchModeSelector: React.FC<SearchModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes: { id: SearchMode; label: string; description: string; icon: React.ReactNode }[] = [
    {
      id: 'simple',
      label: 'Simple',
      description: 'Basic keyword search',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'boolean',
      label: 'Boolean',
      description: 'AND, OR, NOT operators',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'semantic',
      label: 'Semantic',
      description: 'Search by meaning',
      icon: <Brain className="w-4 h-4" />,
    },
    {
      id: 'hybrid',
      label: 'Hybrid',
      description: 'Boolean + Semantic',
      icon: <Combine className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentMode === mode.id
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
          }`}
          title={mode.description}
        >
          {mode.icon}
          <span>{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SearchModeSelector;
```

---

## 🔧 Step 5: Create Boolean Search Help Component

**File:** Create `src/components/research/BooleanSearchHelp.tsx`

```typescript
import React, { useState } from 'react';
import { HelpCircle, X, Copy, Check } from 'lucide-react';
import {
  BOOLEAN_SEARCH_EXAMPLES,
  BOOLEAN_SEARCH_HELP,
  booleanQueryToDescription,
} from '@/lib/booleanParser';

interface BooleanSearchHelpProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuery?: string;
}

export const BooleanSearchHelp: React.FC<BooleanSearchHelpProps> = ({
  isOpen,
  onClose,
  currentQuery = '',
}) => {
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  if (!isOpen) {
    return (
      <button
        onClick={() => onClose()}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700"
      >
        <HelpCircle className="w-4 h-4" />
        Boolean Help
      </button>
    );
  }

  const copyExample = (query: string) => {
    navigator.clipboard.writeText(query);
    setCopiedExample(query);
    setTimeout(() => setCopiedExample(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            <h2 className="text-lg font-bold">Boolean Search Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Query Analysis */}
          {currentQuery && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">Your Query:</p>
              <p className="text-sm text-blue-800 mb-2">"{currentQuery}"</p>
              <p className="text-xs text-blue-700">
                {booleanQueryToDescription(currentQuery)}
              </p>
            </div>
          )}

          {/* Syntax Help */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Syntax</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="bg-gray-50 p-3 rounded font-mono text-xs whitespace-pre-wrap">
                {BOOLEAN_SEARCH_HELP}
              </div>
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Examples</h3>
            <div className="space-y-2">
              {BOOLEAN_SEARCH_EXAMPLES.map(example => (
                <div
                  key={example.query}
                  className="bg-gray-50 p-3 rounded flex items-start justify-between group"
                >
                  <div>
                    <p className="font-mono text-xs text-indigo-600 mb-1">
                      {example.query}
                    </p>
                    <p className="text-xs text-gray-600">{example.description}</p>
                  </div>
                  <button
                    onClick={() => copyExample(example.query)}
                    className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-indigo-600"
                  >
                    {copiedExample === example.query ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooleanSearchHelp;
```

---

## 🔧 Step 6: Create Semantic Search Options Component

**File:** Create `src/components/research/SemanticSearchOptions.tsx`

```typescript
import React from 'react';
import { Brain, AlertCircle, Zap } from 'lucide-react';

interface SemanticSearchOptionsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  minSimilarity: number;
  onSimilarityChange: (value: number) => void;
  weight: number;
  onWeightChange: (value: number) => void;
}

export const SemanticSearchOptions: React.FC<SemanticSearchOptionsProps> = ({
  enabled,
  onToggle,
  minSimilarity,
  onSimilarityChange,
  weight,
  onWeightChange,
}) => {
  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
      {/* Enable Toggle */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-semibold text-gray-900 cursor-pointer">
          <Brain className="w-5 h-5 text-purple-600" />
          Enable Semantic Search
        </label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => onToggle(e.target.checked)}
          className="w-5 h-5 rounded accent-purple-600"
        />
      </div>

      {enabled && (
        <>
          {/* Similarity Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Similarity: {minSimilarity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={minSimilarity}
              onChange={e => onSimilarityChange(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">
              Only show papers that match the query meaning by at least {minSimilarity}%
            </p>
          </div>

          {/* Semantic Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semantic Weight: {Math.round(weight * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={weight}
              onChange={e => onWeightChange(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-600 mt-1">
              {weight < 0.3 && 'Emphasize keyword matching'}
              {weight >= 0.3 && weight < 0.7 && 'Balanced keyword and semantic'}
              {weight >= 0.7 && 'Emphasize semantic meaning'}
            </p>
          </div>

          {/* Info Box */}
          <div className="flex gap-2 text-xs text-purple-700 bg-white p-2 rounded border border-purple-200">
            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Semantic search finds papers with similar meaning, even if they use different terms. Great for discovering
              related research!
            </p>
          </div>
        </>
      )}

      {!enabled && (
        <div className="flex gap-2 text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>Enable semantic search to find papers by meaning, not just keywords.</p>
        </div>
      )}
    </div>
  );
};

export default SemanticSearchOptions;
```

---

## 🔧 Step 7: Update Search Hook

**File:** Update `src/hooks/usePaperSearch.ts`

```typescript
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Paper, SearchFilters, SearchResponse, SearchMode } from '@/types/paper';
import { validateSearchQuery } from '@/lib/validation';
import { parseBooleanQuery, validateBooleanQuery } from '@/lib/booleanParser';
import { getQueryEmbedding } from '@/lib/semanticSearch';

interface UsePaperSearchReturn {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasSearched: boolean;
  searchMode: SearchMode;
  semanticMetadata?: any;
  searchPapers: (query: string, filters: SearchFilters, page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export function usePaperSearch(): UsePaperSearchReturn {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [lastFilters, setLastFilters] = useState<SearchFilters | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('simple');
  const [semanticMetadata, setSemanticMetadata] = useState<any>(null);

  const searchPapers = useCallback(async (query: string, filters: SearchFilters, page: number = 1) => {
    // Validate based on search mode
    if (filters.searchMode === 'simple') {
      const validation = validateSearchQuery(query);
      if (!validation.valid) {
        setError(validation.error || 'Invalid search query');
        return;
      }
    }

    if (filters.searchMode === 'boolean' || filters.searchMode === 'hybrid') {
      const boolValidation = validateBooleanQuery(query);
      if (!boolValidation.valid) {
        setError(boolValidation.error || 'Invalid boolean syntax');
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setLastQuery(query);
    setLastFilters(filters);
    setHasSearched(true);
    setSearchMode(filters.searchMode || 'simple');

    try {
      let embedding: number[] | undefined;

      // Get embedding for semantic search
      if ((filters.searchMode === 'semantic' || filters.searchMode === 'hybrid') && filters.useBoolean !== false) {
        try {
          embedding = await getQueryEmbedding(query, supabase);
        } catch (err) {
          console.warn('Failed to get semantic embedding, falling back to keyword search', err);
        }
      }

      const { data, error: fnError } = await supabase.functions.invoke('search-papers', {
        body: {
          query: query.trim(),
          searchMode: filters.searchMode || 'simple',
          yearFrom: filters.yearFrom,
          yearTo: filters.yearTo,
          sortBy: filters.sortBy,
          subjects: filters.subjects,
          page,
          perPage: 25,
          // New fields for advanced search
          useBoolean: filters.useBoolean,
          embedding: embedding,
          semanticWeight: filters.semanticWeight,
          minSemanticScore: filters.minSemanticScore,
          isBooleanQuery: /\b(AND|OR|NOT)\b/i.test(query),
        },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to search papers');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const response = data as SearchResponse;

      if (page === 1) {
        setPapers(response.papers);
      } else {
        setPapers(prev => [...prev, ...response.papers]);
      }

      setTotalCount(response.totalCount);
      setCurrentPage(page);
      setSemanticMetadata(response.semanticMetadata);
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      console.error('Search error:', { query, searchMode, error: errorMessage });
      setError(errorMessage);
      if (page === 1) {
        setPapers([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (lastQuery && lastFilters && !isLoading) {
      await searchPapers(lastQuery, lastFilters, currentPage + 1);
    }
  }, [lastQuery, lastFilters, currentPage, isLoading, searchPapers]);

  const clearResults = useCallback(() => {
    setPapers([]);
    setTotalCount(0);
    setCurrentPage(1);
    setHasSearched(false);
    setError(null);
    setSemanticMetadata(null);
  }, []);

  return {
    papers,
    isLoading,
    error,
    totalCount,
    currentPage,
    hasSearched,
    searchMode,
    semanticMetadata,
    searchPapers,
    loadMore,
    clearResults,
  };
}
```

---

## 🔧 Step 8: Update HeroSection Component

**File:** Update `src/components/research/HeroSection.tsx`

Add at top of component:

```typescript
import { SearchModeSelector } from '@/components/research/SearchModeSelector';
import BooleanSearchHelp from '@/components/research/BooleanSearchHelp';
import { SearchMode } from '@/types/paper';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
  hasSearched: boolean;
  searchHistory: SearchHistoryItem[];
  onHistorySelect: (query: string) => void;
  onHistoryRemove: (id: string) => void;
  onHistoryClear: () => void;
  searchMode?: SearchMode; // NEW
  onSearchModeChange?: (mode: SearchMode) => void; // NEW
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  initialQuery = '',
  hasSearched,
  searchHistory,
  onHistorySelect,
  onHistoryRemove,
  onHistoryClear,
  searchMode = 'simple',
  onSearchModeChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showBooleanHelp, setShowBooleanHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ... existing code ...

  return (
    <div className={`relative overflow-hidden transition-all duration-500 ${isCompact ? 'py-6' : 'py-16 lg:py-24'}`}>
      {/* ... existing background ... */}

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* ... existing title section ... */}

        {/* Search form */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Search mode selector - NEW */}
          {!isCompact && (
            <div className="mb-4">
              <SearchModeSelector
                currentMode={searchMode}
                onModeChange={onSearchModeChange || (() => {})}
              />
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                searchMode === 'boolean'
                  ? 'Try: "machine learning" AND healthcare'
                  : searchMode === 'semantic'
                  ? 'Find papers by meaning: AI in healthcare...'
                  : 'Search papers by title, author, topic...'
              }
              className="w-full px-5 py-3 bg-white/95 backdrop-blur rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-600"
            />

            {/* Boolean help button - NEW */}
            {searchMode === 'boolean' && !isCompact && (
              <button
                type="button"
                onClick={() => setShowBooleanHelp(true)}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}

            {/* Search button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-full transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Boolean help modal - NEW */}
          <BooleanSearchHelp
            isOpen={showBooleanHelp}
            onClose={() => setShowBooleanHelp(false)}
            currentQuery={query}
          />
        </form>

        {/* ... existing search history ... */}
      </div>
    </div>
  );
};
```

---

## 🔧 Step 9: Backend Implementation (Supabase Edge Function)

**File:** `supabase/functions/search-papers/index.ts`

This is pseudo-code - adapt to your actual backend:

```typescript
import { serve } from 'https://deno.land/std@0.132.0/http/server.ts';

const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'));

serve(async (req: Request) => {
  const body = await req.json();
  
  const {
    query,
    searchMode,
    embedding,
    semanticWeight = 0.5,
    minSemanticScore = 40,
    useBoolean = false,
    yearFrom,
    yearTo,
    page = 1,
    perPage = 25,
  } = body;

  try {
    let queryResults;

    if (searchMode === 'boolean' || searchMode === 'hybrid') {
      // Use PostgreSQL full-text search with boolean operators
      queryResults = await searchWithBoolean(
        query,
        yearFrom,
        yearTo,
        page,
        perPage
      );
    } else if (searchMode === 'semantic' || (searchMode === 'hybrid' && embedding)) {
      // Use vector similarity search with embeddings
      queryResults = await searchWithSemantic(
        embedding,
        minSemanticScore,
        yearFrom,
        yearTo,
        page,
        perPage
      );
    } else {
      // Simple keyword search
      queryResults = await searchSimple(
        query,
        yearFrom,
        yearTo,
        page,
        perPage
      );
    }

    return new Response(JSON.stringify(queryResults), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
});

async function searchWithBoolean(query, yearFrom, yearTo, page, perPage) {
  // Convert user query to PostgreSQL boolean search format
  const pgQuery = convertToPgBoolean(query);

  const { data, count, error } = await supabaseClient
    .from('papers')
    .select('*', { count: 'exact' })
    .textSearch('full_text_index', pgQuery)
    .gte('year', yearFrom)
    .lte('year', yearTo)
    .order('relevance', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (error) throw error;

  return {
    papers: data,
    totalCount: count,
    page,
    perPage,
    semanticMetadata: { matchStrategy: 'keyword' },
  };
}

async function searchWithSemantic(embedding, minScore, yearFrom, yearTo, page, perPage) {
  // Use pgvector for semantic similarity search
  const { data, error } = await supabaseClient
    .rpc('search_papers_semantic', {
      query_embedding: embedding,
      min_similarity: minScore / 100,
      year_from: yearFrom,
      year_to: yearTo,
      limit: perPage,
      offset: (page - 1) * perPage,
    });

  if (error) throw error;

  return {
    papers: data,
    totalCount: data.length,
    page,
    perPage,
    semanticMetadata: {
      queryEmbedding: embedding,
      matchStrategy: 'semantic',
      averageSimilarity: calculateAverageSimilarity(data),
    },
  };
}

function convertToPgBoolean(query) {
  // Convert "AI AND healthcare" to PostgreSQL format: "AI" & "healthcare"
  return query
    .replace(/\bAND\b/gi, '&')
    .replace(/\bOR\b/gi, '|')
    .replace(/\bNOT\b/gi, '!');
}
```

---

## 📋 Implementation Checklist

- [ ] Update `src/types/paper.ts` with new types
- [ ] Create `src/lib/booleanParser.ts`
- [ ] Create `src/lib/semanticSearch.ts`
- [ ] Create `src/components/research/SearchModeSelector.tsx`
- [ ] Create `src/components/research/BooleanSearchHelp.tsx`
- [ ] Create `src/components/research/SemanticSearchOptions.tsx`
- [ ] Update `src/hooks/usePaperSearch.ts`
- [ ] Update `src/components/research/HeroSection.tsx`
- [ ] Update `src/components/AppLayout.tsx` to handle search modes
- [ ] Create/update Supabase Edge Function for advanced search
- [ ] Setup OpenAI embeddings (or alternative) for semantic search
- [ ] Test boolean queries
- [ ] Test semantic search
- [ ] Test hybrid search mode

---

## 🧪 Testing Examples

```typescript
// Boolean searches to test
"machine learning" AND healthcare
COVID-19 OR coronavirus OR SARS-CoV-2
quantum computing NOT classical
(AI OR "machine learning") AND (diagnosis OR treatment)
renewable energy NOT "fossil fuel"

// Semantic searches to test
"Deep learning techniques"
"Renewable power sources"
"Novel therapeutic approaches"
"Data analysis methodologies"
```

---

## 🚀 Advanced Features (Future)

- [ ] Search history with search modes
- [ ] Save search queries with boolean/semantic tags
- [ ] Search suggestions based on query type
- [ ] Real-time query validation feedback
- [ ] Advanced filter combining with boolean logic
- [ ] Export search results with metadata
- [ ] Create saved searches with automatic alerts

---

## 📚 Resources

- PostgreSQL Full-Text Search: https://www.postgresql.org/docs/current/textsearch.html
- pgvector (for embeddings): https://github.com/pgvector/pgvector
- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings
- Boolean Retrieval: https://nlp.stanford.edu/IR-book/html/htmledition/boolean-retrieval-1.html
