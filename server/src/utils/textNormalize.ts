import { escapeRegExp } from './regexEscape.js';

/**
 * Normalizes text for safe, case-insensitive, whitespace-agnostic comparisons.
 */
export const normalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Canonical mapping for tech keywords with special characters or common aliases
 */
const CANONICAL_ALIASES: Record<string, string[]> = {
  'c++': ['cpp', 'c / c++', 'c/c++'],
  'cpp': ['c++'],
  'c#': ['c-sharp', 'csharp'],
  '.net': ['dotnet', '.net core', 'asp.net'],
  'asp.net': ['.net', 'dotnet', 'asp.net core'],
  'node.js': ['node', 'nodejs'],
  'node': ['node.js', 'nodejs'],
  'react.js': ['react', 'reactjs'],
  'react': ['react.js', 'reactjs'],
  'next.js': ['next', 'nextjs'],
  'vue.js': ['vue', 'vuejs'],
  'express.js': ['express', 'expressjs'],
  'express': ['express.js'],
  'rest api': ['rest apis', 'restful apis', 'restful api', 'rest'],
  'restful apis': ['rest api', 'rest apis', 'restful api', 'rest'],
  'rest apis': ['rest api', 'restful apis', 'restful api', 'rest'],
  'git/github': ['git', 'github'],
  'github': ['git/github'],
  'git': ['git/github'],
  'mongodb': ['mongo', 'nosql'],
  'postgresql': ['postgres', 'sql'],
  'postgres': ['postgresql', 'sql'],
  'mysql': ['sql', 'mariadb'],
  'oauth': ['oauth2', 'oauth 2.0'],
  'jwt': ['json web tokens', 'json web token'],
  'dsa': ['data structures', 'algorithms', 'data structures and algorithms'],
  'oop': ['object-oriented programming', 'object oriented programming', 'oops'],
};

/**
 * Safely checks if a keyword occurs in raw or structured text without crashing
 * on special characters like +, ., #, /, (, ), etc.
 * Uses normalized text matching, boundary checking, and alias resolution.
 */
export function matchKeywordInText(
  keyword: string,
  rawText: string,
  visited: Set<string> = new Set<string>()
): boolean {
  if (!keyword || !rawText) return false;

  const normKw = normalizeText(keyword);
  const normText = normalizeText(rawText);
  if (!normKw || !normText) return false;

  if (visited.has(normKw)) return false;
  visited.add(normKw);

  // 1. Direct match check with boundary
  if (normText.includes(normKw)) {
    // Check boundaries to avoid accidental collisions (e.g., "go" inside "good" or "java" inside "javascript")
    const startsWithWord = /^[a-z0-9]/i.test(normKw);
    const endsWithWord = /[a-z0-9]$/i.test(normKw);

    const prefix = startsWithWord ? '(?:^|[^a-z0-9_])' : '(?:^|\\s)';
    // If ends with non-word symbol like '+' or '#', avoid following with another '+' or '#'
    let suffix = '(?=[^a-z0-9_]|$)';
    if (!endsWithWord) {
      if (normKw.endsWith('+')) suffix = '(?=[^+a-z0-9_]|$)';
      else if (normKw.endsWith('#')) suffix = '(?=[^#a-z0-9_]|$)';
      else suffix = '(?=[^a-z0-9_]|$)';
    }

    try {
      const escaped = escapeRegExp(normKw);
      const safeRegex = new RegExp(`${prefix}${escaped}${suffix}`, 'i');
      if (safeRegex.test(normText)) {
        return true;
      }
    } catch {
      // Safe fallback to normalized includes
      return true;
    }
  }

  // 2. Check canonical aliases / synonyms
  const aliases = CANONICAL_ALIASES[normKw];
  if (aliases) {
    for (const alias of aliases) {
      if (matchKeywordInText(alias, rawText, visited)) {
        return true;
      }
    }
  }

  // 3. Trailing 's' plural / singular tolerance
  if (normKw.endsWith('s')) {
    const singular = normKw.slice(0, -1);
    if (singular.length > 2 && matchKeywordInText(singular, rawText, visited)) {
      return true;
    }
  } else {
    const plural = normKw + 's';
    if (matchKeywordInText(plural, rawText, visited)) {
      return true;
    }
  }

  // 4. Dot-suffix tolerance (e.g. "react.js" <-> "react", "node.js" <-> "node")
  if (normKw.endsWith('.js')) {
    const base = normKw.slice(0, -3);
    if (base.length > 2 && matchKeywordInText(base, rawText, visited)) {
      return true;
    }
  }

  // 5. Slash tolerance (e.g. "git/github" -> check "git" or "github")
  if (normKw.includes('/')) {
    const parts = normKw.split('/').map((p) => p.trim()).filter(Boolean);
    if (parts.some((p) => matchKeywordInText(p, rawText, visited))) {
      return true;
    }
  }

  return false;
}
