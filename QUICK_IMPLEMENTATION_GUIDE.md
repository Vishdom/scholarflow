# Quick Implementation Guide - Ready-to-Use Code

This file contains copy-paste ready code for the most impactful improvements.

---

## 1. Fix Unused Imports (5 minutes)

**File:** `src/contexts/AppContext.tsx`

Replace the entire file with this:

```typescript
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
```

**What changed:** Removed `import { v4 as uuidv4 } from 'uuid';` and `import { toast } from '@/components/ui/use-toast';`

---

## 2. Add Error Boundary (10 minutes)

**File:** Create `src/components/ErrorBoundary.tsx`

```typescript
import React, { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center bg-white rounded-lg shadow-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6 text-sm">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Then update `src/App.tsx`:

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
```

---

## 3. Setup Environment Variables (5 minutes)

**File:** Create `src/lib/supabase.ts` (replace existing)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase configuration. Please create a .env file with:\n' +
    'VITE_SUPABASE_URL=your_url_here\n' +
    'VITE_SUPABASE_ANON_KEY=your_key_here'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**File:** Create `.env.example`

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**File:** Update `.gitignore` (if needed, add these lines)

```
.env
.env.local
.env.*.local
.env.production.local
```

---

## 4. Add Search Validation (10 minutes)

**File:** Create `src/lib/validation.ts`

```typescript
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const VALIDATION_RULES = {
  QUERY_MIN_LENGTH: 2,
  QUERY_MAX_LENGTH: 200,
  YEAR_MIN: 1900,
  YEAR_MAX: new Date().getFullYear() + 1,
} as const;

/**
 * Validates a search query before making a request
 */
export function validateSearchQuery(query: string): ValidationResult {
  const trimmed = query.trim();

  if (!trimmed) {
    return { valid: false, error: 'Search query cannot be empty' };
  }

  if (trimmed.length < VALIDATION_RULES.QUERY_MIN_LENGTH) {
    return {
      valid: false,
      error: `Search query must be at least ${VALIDATION_RULES.QUERY_MIN_LENGTH} characters`,
    };
  }

  if (trimmed.length > VALIDATION_RULES.QUERY_MAX_LENGTH) {
    return {
      valid: false,
      error: `Search query cannot exceed ${VALIDATION_RULES.QUERY_MAX_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validates year range
 */
export function validateYearRange(yearFrom: number, yearTo: number): ValidationResult {
  if (yearFrom < VALIDATION_RULES.YEAR_MIN) {
    return {
      valid: false,
      error: `Year from cannot be before ${VALIDATION_RULES.YEAR_MIN}`,
    };
  }

  if (yearTo > VALIDATION_RULES.YEAR_MAX) {
    return {
      valid: false,
      error: `Year to cannot be after ${VALIDATION_RULES.YEAR_MAX}`,
    };
  }

  if (yearFrom > yearTo) {
    return { valid: false, error: 'Start year cannot be after end year' };
  }

  return { valid: true };
}
```

Now update `src/hooks/usePaperSearch.ts` to use validation:

```typescript
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Paper, SearchFilters, SearchResponse } from '@/types/paper';
import { validateSearchQuery } from '@/lib/validation';

interface UsePaperSearchReturn {
  papers: Paper[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  hasSearched: boolean;
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

  const searchPapers = useCallback(async (query: string, filters: SearchFilters, page: number = 1) => {
    // Validate query
    const validation = validateSearchQuery(query);
    if (!validation.valid) {
      setError(validation.error || 'Invalid search query');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLastQuery(query);
    setLastFilters(filters);
    setHasSearched(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-papers', {
        body: {
          query: query.trim(),
          yearFrom: filters.yearFrom,
          yearTo: filters.yearTo,
          sortBy: filters.sortBy,
          subjects: filters.subjects,
          page,
          perPage: 25,
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
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      console.error('Search error:', { query, error: errorMessage });
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
  }, []);

  return {
    papers,
    isLoading,
    error,
    totalCount,
    currentPage,
    hasSearched,
    searchPapers,
    loadMore,
    clearResults,
  };
}
```

---

## 5. Create Constants File (5 minutes)

**File:** Create `src/constants/index.ts`

```typescript
/**
 * Application-wide constants
 */

export const PAGINATION = {
  PER_PAGE: 25,
  MAX_HISTORY: 10,
} as const;

export const VALIDATION = {
  QUERY_MIN_LENGTH: 2,
  QUERY_MAX_LENGTH: 200,
} as const;

export const TIMEOUTS = {
  DEBOUNCE: 500,
  SEARCH_TIMEOUT: 30000,
} as const;

export const STORAGE_KEYS = {
  SAVED_PAPERS: 'scholarflow_saved_papers',
  SEARCH_HISTORY: 'scholarflow_search_history',
  SEARCH_COLLECTIONS: 'scholarflow_search_collections',
} as const;

export const API_CONFIG = {
  RETRIES: 3,
  TIMEOUT: 30000,
} as const;
```

Then update your hooks to use these constants instead of magic strings:

```typescript
// In useSavedPapers.ts
import { STORAGE_KEYS } from '@/constants';

const STORAGE_KEY = STORAGE_KEYS.SAVED_PAPERS;

// In useSearchHistory.ts
import { STORAGE_KEYS, PAGINATION } from '@/constants';

const STORAGE_KEY = STORAGE_KEYS.SEARCH_HISTORY;
const MAX_HISTORY = PAGINATION.MAX_HISTORY;
```

---

## 6. Add Debounce Hook (10 minutes)

**File:** Create `src/hooks/useDebounce.ts`

```typescript
import { useEffect, useState } from 'react';

/**
 * Debounces a value and returns the debounced version
 * Useful for reducing API calls when user is rapidly changing filters
 * @param value - The value to debounce
 * @param delayMs - Delay in milliseconds (default: 500)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delayMs: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Clean up timer if value changes before delay completes
    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}
```

Then use in `src/components/AppLayout.tsx`:

```typescript
import { useDebounce } from '@/hooks/useDebounce';

const AppLayout: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const debouncedFilters = useDebounce(filters, 500); // Debounce for 500ms

  // ... other code ...

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    // The actual search will happen via effect watching debouncedFilters
  }, []);

  // Apply search when debounced filters change
  React.useEffect(() => {
    if (currentQuery && debouncedFilters !== DEFAULT_FILTERS) {
      searchPapers(currentQuery, debouncedFilters);
    }
  }, [debouncedFilters, currentQuery, searchPapers]);

  // ... rest of component
};
```

---

## 7. Add Accessibility Labels (10 minutes)

Update buttons in `src/components/research/PaperCard.tsx`:

```typescript
const handleCopyCitation = () => {
  const authorStr = paper.authors.map(a => a.name).join(', ');
  const citation = `${authorStr} (${paper.year}). ${paper.title}. ${paper.journal.name}${paper.biblio?.volume ? `, ${paper.biblio.volume}` : ''}${paper.biblio?.issue ? `(${paper.biblio.issue})` : ''}${paper.biblio?.first_page ? `, ${paper.biblio.first_page}` : ''}${paper.biblio?.last_page ? `-${paper.biblio.last_page}` : ''}. ${paper.doi || ''}`;
  navigator.clipboard.writeText(citation);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};

// Add ARIA labels to buttons:
<button
  aria-label={`${isSaved ? 'Remove' : 'Save'} paper: ${paper.title}`}
  onClick={() => onToggleSave(paper)}
  className="..."
>
  {isSaved ? <BookmarkCheck /> : <Bookmark />}
</button>

<button
  aria-label="Copy citation to clipboard"
  onClick={handleCopyCitation}
  className="..."
>
  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
</button>

<button
  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} paper details`}
  onClick={() => setIsExpanded(!isExpanded)}
  className="..."
>
  {isExpanded ? <ChevronUp /> : <ChevronDown />}
</button>

// Add role and aria-label to status indicators
<span
  className={oaColor}
  role="status"
  aria-label={`Open access status: ${paper.oaStatus}`}
>
  {paper.oaStatus.toUpperCase()}
</span>

<span
  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
  role="status"
  aria-label={`Impact factor proxy: ${paper.journal.impactProxy}`}
>
  IF: {paper.journal.impactProxy.toFixed(2)}
</span>
```

---

## 8. Add Basic Memoization (5 minutes)

Update `src/components/research/PaperCard.tsx`:

```typescript
const PaperCard: React.FC<PaperCardProps> = React.memo(
  ({ paper, isSaved, onToggleSave, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    // ... rest of component code ...
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    return (
      prevProps.paper.id === nextProps.paper.id &&
      prevProps.isSaved === nextProps.isSaved &&
      prevProps.index === nextProps.index
    );
  }
);

export default PaperCard;
```

---

## 9. Add JSDoc Comments (15 minutes)

Example for `usePaperSearch.ts`:

```typescript
/**
 * Custom hook for managing paper search functionality
 * 
 * @example
 * const { papers, isLoading, error, searchPapers } = usePaperSearch();
 * 
 * await searchPapers('quantum computing', {
 *   yearFrom: 2020,
 *   yearTo: 2024,
 *   sortBy: 'cited_by_count',
 *   subjects: ['Physics', 'Computer Science']
 * });
 * 
 * @returns Search state and methods
 */
export function usePaperSearch(): UsePaperSearchReturn {
  // ...
}

/**
 * Searches for academic papers with filters and pagination
 * 
 * @param query - Search query string (required, 2-200 characters)
 * @param filters - Search filters including year range, sort order, and subjects
 * @param page - Page number for pagination (default: 1)
 * @throws Error if Supabase function fails or query is invalid
 * @returns Promise that resolves when search completes
 */
const searchPapers = useCallback(async (
  query: string,
  filters: SearchFilters,
  page: number = 1
) => {
  // ...
}, []);

/**
 * Loads the next page of search results
 * Appends new papers to existing results
 * 
 * @returns Promise that resolves when more papers are loaded
 */
const loadMore = useCallback(async () => {
  // ...
}, [lastQuery, lastFilters, currentPage, isLoading, searchPapers]);

/**
 * Clears all search results and resets state
 */
const clearResults = useCallback(() => {
  // ...
}, []);
```

---

## Testing & Next Steps

After implementing these fixes:

1. **Test locally:** `npm run dev`
2. **Build:** `npm run build`
3. **Check no errors:** `npm run lint`

---

## Additional Tools to Consider

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

Install with: `npm install --save-dev <package-name>`

---

## Summary of Changes

| Change | Impact | Effort | Priority |
|--------|--------|--------|----------|
| Fix unused imports | Small bundle size reduction | 5 min | High |
| Add Error Boundary | Better error handling | 10 min | High |
| Setup env variables | Security & maintainability | 5 min | High |
| Add validation | Better UX & data integrity | 10 min | High |
| Create constants | Code maintainability | 5 min | Medium |
| Add debounce | Reduce API calls | 10 min | Medium |
| Add accessibility labels | Better a11y | 10 min | Medium |
| Add memoization | Performance improvement | 5 min | Low |
| Add JSDoc comments | Better documentation | 15 min | Low |

**Total implementation time: ~75 minutes for all 9 improvements**

Good luck! Feel free to ask questions about any of these improvements.
