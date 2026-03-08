# Boolean & Semantic Search - Step-by-Step Integration Guide

Complete guide to integrate boolean and semantic search into your app.

---

## 📋 Quick Overview

This guide adds two advanced search capabilities:
- **Boolean Search**: Precise queries with AND, OR, NOT operators
- **Semantic Search**: Find papers by meaning, not just keywords
- **Hybrid**: Use both together for best results

---

## 🚀 Step 1: Copy New Files

Copy these files to your project:

```
src/lib/booleanParser.ts              ← Boolean query parsing & validation
src/lib/semanticSearch.ts             ← Semantic search utilities
src/components/research/SearchModeSelector.tsx    ← UI for search modes
src/components/research/BooleanSearchHelp.tsx     ← Help modal
```

All files are ready to use - just copy them directly!

---

## 🔧 Step 2: Update Types

**File:** `src/types/paper.ts`

Replace the `SearchFilters` interface:

```typescript
export type SearchMode = 'simple' | 'boolean' | 'semantic' | 'hybrid';

export interface SearchFilters {
  yearFrom: number;
  yearTo: number;
  sortBy: 'relevance_score' | 'cited_by_count' | 'publication_date' | 'semantic_similarity';
  subjects: string[];
  // NEW FIELDS FOR ADVANCED SEARCH
  searchMode: SearchMode;
  semanticWeight?: number; // 0-1, how much to weight semantic similarity
  useBoolean?: boolean;
  minSemanticScore?: number; // 0-100, minimum similarity threshold
}

// Add new interfaces
export interface PaperWithSemanticData extends Paper {
  semanticScore?: number;
  semanticReason?: string;
  matchedTerms?: string[];
}
```

Update `SearchResponse`:

```typescript
export interface SearchResponse {
  papers: PaperWithSemanticData[];
  totalCount: number;
  filteredCount: number;
  page: number;
  perPage: number;
  // NEW FIELD
  semanticMetadata?: {
    queryEmbedding?: number[];
    averageSimilarity?: number;
    matchStrategy: 'keyword' | 'semantic' | 'hybrid';
  };
}
```

---

## 🔧 Step 3: Update AppLayout Component

**File:** `src/components/AppLayout.tsx`

Add these imports:

```typescript
import { SearchMode } from '@/types/paper';
import SearchModeSelector from '@/components/research/SearchModeSelector';
import { useState as useStateAdv } from 'react';
```

Update DEFAULT_FILTERS:

```typescript
const DEFAULT_FILTERS: SearchFilters = {
  yearFrom: 2000,
  yearTo: 2026,
  sortBy: 'relevance_score',
  subjects: [],
  // NEW FIELDS
  searchMode: 'simple',
  semanticWeight: 0.5,
  minSemanticScore: 40,
};
```

Add state variables in AppLayout:

```typescript
const AppLayout: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [searchMode, setSearchMode] = useState<SearchMode>('simple');
  // ... rest of state ...

  const handleSearchModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode);
    const newFilters: SearchFilters = {
      ...filters,
      searchMode: mode,
    };
    setFilters(newFilters);
  }, [filters]);

  // ... rest of component
};
```

---

## 🔧 Step 4: Update HeroSection Component

**File:** `src/components/research/HeroSection.tsx`

Add imports:

```typescript
import SearchModeSelector from '@/components/research/SearchModeSelector';
import BooleanSearchHelp from '@/components/research/BooleanSearchHelp';
import { HelpCircle } from 'lucide-react';
import { SearchMode } from '@/types/paper';
```

Update props interface:

```typescript
interface HeroSectionProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
  hasSearched: boolean;
  searchHistory: SearchHistoryItem[];
  onHistorySelect: (query: string) => void;
  onHistoryRemove: (id: string) => void;
  onHistoryClear: () => void;
  // NEW PROPS
  searchMode?: SearchMode;
  onSearchModeChange?: (mode: SearchMode) => void;
}
```

Add in component body:

```typescript
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
        {/* ... existing title ... */}

        {/* ADD THIS: Search mode selector */}
        {!isCompact && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Search Mode:</p>
            <SearchModeSelector
              currentMode={searchMode}
              onModeChange={onSearchModeChange || (() => {})}
            />
          </div>
        )}

        {/* Search form */}
        <form onSubmit={handleSubmit} className="relative">
          {/* Search input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                searchMode === 'boolean'
                  ? 'Example: "machine learning" AND healthcare'
                  : searchMode === 'semantic'
                  ? 'Find papers by meaning: neural networks...'
                  : 'Search by title, topic, author...'
              }
              className="w-full px-5 py-3 bg-white/95 backdrop-blur rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900 placeholder-gray-600 pr-24"
            />

            {/* Boolean help button */}
            {searchMode === 'boolean' && !isCompact && (
              <button
                type="button"
                onClick={() => setShowBooleanHelp(true)}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 transition-colors"
                title="Boolean search help"
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
        </form>

        {/* Boolean help modal */}
        <BooleanSearchHelp
          isOpen={showBooleanHelp}
          onClose={() => setShowBooleanHelp(false)}
          onSelectExample={(query) => {
            setQuery(query);
            inputRef.current?.focus();
          }}
          currentQuery={query}
        />

        {/* ... rest of component ... */}
      </div>
    </div>
  );
};
```

Pass new props from AppLayout:

```typescript
<HeroSection
  onSearch={handleSearch}
  isLoading={isLoading}
  initialQuery={currentQuery}
  hasSearched={hasSearched}
  searchHistory={searchHistory}
  onHistorySelect={handleHistorySelect}
  onHistoryRemove={removeHistoryItem}
  onHistoryClear={clearHistory}
  searchMode={searchMode}
  onSearchModeChange={handleSearchModeChange}
/>
```

---

## 🔧 Step 5: Update usePaperSearch Hook

**File:** `src/hooks/usePaperSearch.ts`

Add imports:

```typescript
import { SearchMode } from '@/types/paper';
import { validateBooleanQuery } from '@/lib/booleanParser';
import { getQueryEmbedding } from '@/lib/semanticSearch';
```

Update hook signature:

```typescript
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
  // ... existing state ...
  const [searchMode, setSearchMode] = useState<SearchMode>('simple');
  const [semanticMetadata, setSemanticMetadata] = useState<any>(null);

  const searchPapers = useCallback(async (
    query: string,
    filters: SearchFilters,
    page: number = 1
  ) => {
    // Validate query based on search mode
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
      if (
        (filters.searchMode === 'semantic' || filters.searchMode === 'hybrid') &&
        filters.useBoolean !== false
      ) {
        try {
          embedding = await getQueryEmbedding(query, supabase);
        } catch (err) {
          console.warn('Semantic embedding failed, using keyword search', err);
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
          // Advanced search fields
          embedding: embedding,
          semanticWeight: filters.semanticWeight || 0.5,
          minSemanticScore: filters.minSemanticScore || 40,
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
      console.error('Search error:', errorMessage);
      setError(errorMessage);
      if (page === 1) {
        setPapers([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ... rest of hook ...

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

## 🔧 Step 6: Display Semantic Scores (Optional)

**File:** `src/components/research/PaperCard.tsx`

Add semantic score badge if available:

```typescript
// In the paper card, add this near the title:
{paper.semanticScore !== undefined && (
  <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full ml-2">
    <Brain className="w-3 h-3" />
    {Math.round(paper.semanticScore)}% match
  </div>
)}
```

---

## 🔧 Step 7: Backend - Supabase Edge Function

**File:** `supabase/functions/search-papers/index.ts`

Add this to your existing search function:

```typescript
import { serve } from 'https://deno.land/std@0.132.0/http/server.ts';

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_ANON_KEY')
);

serve(async (req: Request) => {
  const body = await req.json();
  
  const {
    query,
    searchMode = 'simple',
    embedding,
    semanticWeight = 0.5,
    minSemanticScore = 40,
    yearFrom,
    yearTo,
    page = 1,
    perPage = 25,
  } = body;

  try {
    let results;

    if (searchMode === 'boolean') {
      results = await searchBoolean(query, yearFrom, yearTo, page, perPage);
    } else if (searchMode === 'semantic' && embedding) {
      results = await searchSemantic(embedding, minSemanticScore, yearFrom, yearTo, page, perPage);
    } else if (searchMode === 'hybrid' && embedding) {
      results = await searchHybrid(query, embedding, semanticWeight, yearFrom, yearTo, page, perPage);
    } else {
      results = await searchSimple(query, yearFrom, yearTo, page, perPage);
    }

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});

// Boolean search using PostgreSQL
async function searchBoolean(query, yearFrom, yearTo, page, perPage) {
  // Convert "AI AND healthcare" to PostgreSQL: "AI" & "healthcare"
  const pgQuery = query
    .replace(/\bAND\b/gi, '&')
    .replace(/\bOR\b/gi, '|')
    .replace(/\bNOT\b/gi, '!');

  const { data, count } = await supabaseClient
    .from('papers')
    .select('*', { count: 'exact' })
    .textSearch('fts_column', pgQuery)
    .gte('year', yearFrom)
    .lte('year', yearTo)
    .order('cited_by_count', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  return {
    papers: data || [],
    totalCount: count || 0,
    page,
    perPage,
    semanticMetadata: { matchStrategy: 'keyword' },
  };
}

// Semantic search using pgvector
async function searchSemantic(embedding, minScore, yearFrom, yearTo, page, perPage) {
  const { data } = await supabaseClient
    .rpc('search_papers_semantic', {
      query_embedding: embedding,
      min_similarity: minScore / 100,
      year_from: yearFrom,
      year_to: yearTo,
      limit: perPage,
      offset: (page - 1) * perPage,
    });

  return {
    papers: (data || []).map(p => ({
      ...p,
      semanticScore: Math.round(p.similarity * 100),
    })),
    totalCount: data?.length || 0,
    page,
    perPage,
    semanticMetadata: {
      matchStrategy: 'semantic',
      averageSimilarity: data?.length > 0
        ? Math.round(data.reduce((sum, p) => sum + p.similarity, 0) / data.length * 100)
        : 0,
    },
  };
}

// Hybrid: combine both
async function searchHybrid(query, embedding, weight, yearFrom, yearTo, page, perPage) {
  const keyword = await searchBoolean(query, yearFrom, yearTo, 1, perPage * 2);
  const semantic = await searchSemantic(embedding, 40, yearFrom, yearTo, 1, perPage * 2);

  // Merge and deduplicate
  const merged = new Map();
  
  keyword.papers.forEach((p, i) => {
    merged.set(p.id, {
      ...p,
      keywordScore: 1 - (i / keyword.papers.length),
      semanticScore: 0,
    });
  });

  semantic.papers.forEach((p, i) => {
    const existing = merged.get(p.id);
    const semScore = p.semanticScore / 100;
    if (existing) {
      existing.semanticScore = semScore;
    } else {
      merged.set(p.id, { ...p, keywordScore: 0, semanticScore: semScore });
    }
  });

  const combined = Array.from(merged.values())
    .map(p => ({
      ...p,
      combinedScore: p.keywordScore * (1 - weight) + p.semanticScore * weight,
    }))
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice((page - 1) * perPage, page * perPage);

  return {
    papers: combined,
    totalCount: merged.size,
    page,
    perPage,
    semanticMetadata: { matchStrategy: 'hybrid' },
  };
}
```

---

## 📋 Testing Checklist

Test these search queries:

### Boolean Searches
- [ ] `"machine learning" AND healthcare`
- [ ] `COVID-19 OR coronavirus`
- [ ] `quantum computing NOT classical`
- [ ] `(AI OR ML) AND (diagnosis OR treatment)`

### Semantic Searches
- [ ] `neural networks` (should find: deep learning, CNN, RNN, etc.)
- [ ] `renewable energy` (should find: solar, wind, clean power, etc.)
- [ ] `genetic modification` (should find: CRISPR, gene therapy, etc.)

### Hybrid Searches
- [ ] Combine boolean operators with semantic meaning

---

## 🐛 Troubleshooting

### Boolean Queries Not Working
- Check PostgreSQL full-text search is enabled
- Ensure `tsvector` column exists in papers table
- Verify operators are correctly converted to PG syntax

### Semantic Search Failing
- Check OpenAI/embedding API is accessible
- Verify `pgvector` extension is installed
- Ensure embedding vectors are stored in database

### Performance Issues
- Add indexes to embedding column: `CREATE INDEX ON papers USING ivfflat (embedding)`
- Cache embeddings to avoid re-computing
- Batch queries for better performance

---

## 📚 Next Steps

1. **Add search analytics** - Track which search modes users prefer
2. **Implement saved searches** - Save boolean/semantic queries
3. **Create search templates** - Pre-built queries for common topics
4. **Add search suggestions** - Autocomplete for operators and terms
5. **Export results** - Save search results with metadata

---

## 🎓 Resources

- PostgreSQL Full-Text Search: https://www.postgresql.org/docs/current/textsearch.html
- pgvector: https://github.com/pgvector/pgvector
- OpenAI Embeddings API: https://platform.openai.com/docs/guides/embeddings
- Information Retrieval: https://nlp.stanford.edu/IR-book/

---

## ✅ Summary

You now have:
- ✅ Boolean search with AND, OR, NOT operators
- ✅ Semantic search using embeddings
- ✅ Hybrid search combining both approaches
- ✅ UI components for search mode selection
- ✅ Help modal for boolean syntax
- ✅ Type-safe TypeScript implementation

Happy searching! 🔍
