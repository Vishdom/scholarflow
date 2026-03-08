/**
 * Boolean Search Parser Library
 * File: src/lib/booleanParser.ts
 * 
 * Handles parsing and validation of boolean search queries with
 * AND, OR, NOT operators and parentheses support
 */

export class BooleanParseError extends Error {
  constructor(message: string, public position: number = 0) {
    super(message);
    this.name = 'BooleanParseError';
  }
}

export interface ParsedBooleanQuery {
  isValid: boolean;
  terms: string[];
  operators: ('AND' | 'OR' | 'NOT')[];
  error?: string;
  description?: string;
}

/**
 * Validates boolean search syntax
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

  // Check for minimum length
  if (trimmed.length < 2) {
    return { valid: false, error: 'Query is too short (minimum 2 characters)' };
  }

  // Check parentheses balance
  let parenCount = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      return {
        valid: false,
        error: `Unbalanced parentheses - closing without opening at position ${i}`,
      };
    }
  }

  if (parenCount !== 0) {
    return {
      valid: false,
      error: `Unbalanced parentheses - ${parenCount > 0 ? 'missing closing' : 'extra closing'}`,
    };
  }

  // Check for operators at boundaries
  if (/^\s*(AND|OR|NOT)\b/i.test(trimmed)) {
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
      suggestions: ['Add a term after the operator', 'Use NOT for negation'],
    };
  }

  // Check for consecutive operators (except NOT which can follow AND/OR)
  if (/(AND|OR)\s+(AND|OR)\s/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Consecutive AND/OR operators are not allowed',
      suggestions: ['Ensure each operator has terms on both sides'],
    };
  }

  // Check for quoted strings
  const quoteCount = (trimmed.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    return {
      valid: false,
      error: 'Unbalanced quotes in query',
      suggestions: ['Add closing quote: "search term"'],
    };
  }

  return { valid: true };
}

/**
 * Parses boolean search query into structured format
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
  const terms: string[] = [];
  const operators: ('AND' | 'OR' | 'NOT')[] = [];

  // Split by operators while preserving quoted strings
  const parts = splitByOperators(trimmed);

  for (const part of parts) {
    const cleaned = part.trim().toUpperCase();
    if (cleaned === 'AND' || cleaned === 'OR' || cleaned === 'NOT') {
      operators.push(cleaned as 'AND' | 'OR' | 'NOT');
    } else if (part.trim()) {
      terms.push(part.trim());
    }
  }

  const parsed: ParsedBooleanQuery = {
    isValid: true,
    terms,
    operators,
    description: generateDescription(terms, operators),
  };

  return parsed;
}

/**
 * Splits query by operators while preserving quoted strings
 */
function splitByOperators(query: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const prevChar = i > 0 ? query[i - 1] : ' ';
    const nextTwoChars = query.substring(i, i + 3).toUpperCase();
    const nextThreeChars = query.substring(i, i + 4).toUpperCase();

    // Handle quotes
    if (char === '"' && (i === 0 || query[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
      current += char;
      continue;
    }

    // If in quotes, just add character
    if (inQuotes) {
      current += char;
      continue;
    }

    // Skip whitespace between tokens
    if (/\s/.test(char) && !current.trim()) {
      continue;
    }

    // Check for AND operator
    if (nextThreeChars === 'AND ' && /\s/.test(prevChar)) {
      if (current.trim()) parts.push(current.trim());
      parts.push('AND');
      current = '';
      i += 2;
      continue;
    }

    // Check for OR operator
    if (nextTwoChars === 'OR ' && /\s/.test(prevChar)) {
      if (current.trim()) parts.push(current.trim());
      parts.push('OR');
      current = '';
      i += 1;
      continue;
    }

    // Check for NOT operator
    if (nextThreeChars === 'NOT ' && /\s/.test(prevChar)) {
      if (current.trim()) parts.push(current.trim());
      parts.push('NOT');
      current = '';
      i += 2;
      continue;
    }

    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

/**
 * Generates human-readable description of query
 */
function generateDescription(terms: string[], operators: ('AND' | 'OR' | 'NOT')[]): string {
  if (terms.length === 0) return 'No search terms';

  const descriptions: string[] = [];

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    const operator = i > 0 ? operators[i - 1] : undefined;

    if (i === 0) {
      descriptions.push(`Papers about "${term}"`);
    } else {
      switch (operator) {
        case 'AND':
          descriptions.push(`AND also "${term}"`);
          break;
        case 'OR':
          descriptions.push(`OR "${term}"`);
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
 * Converts boolean query to PostgreSQL full-text search format
 */
export function convertToPgBoolean(query: string): string {
  return query
    .replace(/\bAND\b/gi, '&')
    .replace(/\bOR\b/gi, '|')
    .replace(/\bNOT\b/gi, '!');
}

/**
 * Example boolean search queries with descriptions
 */
export const BOOLEAN_SEARCH_EXAMPLES = [
  {
    query: '"machine learning" AND healthcare',
    description: 'Papers combining machine learning with healthcare applications',
  },
  {
    query: 'COVID-19 OR coronavirus OR SARS-CoV-2',
    description: 'Papers on COVID using any variation of these terms',
  },
  {
    query: 'AI AND (diagnosis OR treatment)',
    description: 'Papers on AI applications in medical diagnosis or treatment',
  },
  {
    query: 'quantum computing NOT classical',
    description: 'Quantum computing papers excluding classical computing',
  },
  {
    query: '(neural networks OR deep learning) AND security',
    description: 'Papers on security aspects of neural networks or deep learning',
  },
  {
    query: '"renewable energy" AND (solar OR wind OR hydro)',
    description: 'Renewable energy papers focusing on specific sources',
  },
];

/**
 * Help text for boolean search syntax
 */
export const BOOLEAN_SEARCH_HELP = `Boolean Search Quick Guide

OPERATORS:
  AND    - Both terms must appear
  OR     - Either term can appear
  NOT    - Exclude a term

SYNTAX:
  "phrase"     - Exact phrase (include quotes)
  (query)      - Group terms with parentheses
  
EXAMPLES:
  "machine learning" AND healthcare
  COVID OR coronavirus OR SARS-CoV-2
  quantum NOT classical
  (AI OR ML) AND (diagnosis OR treatment)

TIPS:
  • Use quotes for multi-word phrases
  • Use NOT to exclude unwanted topics  
  • Use parentheses for complex queries
  • Operators are case-insensitive
  • Maximum 1000 characters per query
`;

/**
 * Escapes special characters in search terms
 */
export function escapeSearchTerm(term: string): string {
  // Escape PostgreSQL special characters
  return term.replace(/[!*\[\]"()\\]/g, '\\$&');
}

/**
 * Checks if a query contains boolean operators
 */
export function hasBooleanOperators(query: string): boolean {
  return /\b(AND|OR|NOT)\b/i.test(query);
}

/**
 * Extracts all terms from a boolean query
 */
export function extractTerms(query: string): string[] {
  const parsed = parseBooleanQuery(query);
  return parsed.terms;
}

/**
 * Validates a complex boolean expression
 */
export function validateComplexBoolean(query: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validation = validateBooleanQuery(query);
  if (!validation.valid) {
    errors.push(validation.error || 'Invalid query');
  }

  // Additional checks
  if (query.length > 1000) {
    warnings.push('Query is very long - results may be less relevant');
  }

  const termCount = (query.match(/"/g) || []).length / 2 + 
    (query.match(/\b\w+\b/g) || []).length;
  if (termCount > 20) {
    warnings.push('Query has many terms - consider simplifying');
  }

  if (/(NOT\s+){2,}/.test(query)) {
    warnings.push('Multiple NOT operators may yield unexpected results');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
