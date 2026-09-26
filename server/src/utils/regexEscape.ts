export function escapeRegExp(str: string): string {
  // Escape characters with special meaning in regular expressions
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
