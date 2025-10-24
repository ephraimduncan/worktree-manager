/**
 * Text utilities for truncation and formatting
 */

/**
 * Truncates text from the end, adding "..." if needed
 * Used for names, branches, paths that can be cut at any point
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length including ellipsis
 * @returns Truncated text with "..." if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Truncates text with additional safety checks for edge cases
 * Handles scenarios where maxLength is very small (< 3)
 * Used in status bar where space is extremely constrained
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length including ellipsis
 * @returns Truncated text with "..." if needed, or dots if maxLength < 3
 */
export function truncateEnd(text: string, maxLength: number): string {
  if (maxLength <= 0) return "";
  if (text.length <= maxLength) return text;
  if (maxLength <= 3) return ".".repeat(maxLength);
  return text.slice(0, maxLength - 3) + "...";
}
