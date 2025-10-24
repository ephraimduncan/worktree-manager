/**
 * Responsive layout utilities and constants
 * Single source of truth for breakpoints and layout calculations
 */

// Breakpoint constants - adjust these to tweak responsive behavior
export const BREAKPOINTS = {
  /** Ultra-compact mode: < 60 cols - minimal spacing, aggressive truncation */
  ULTRA_COMPACT: 60,
  /** Compact mode: < 80 cols - reduced spacing, moderate truncation */
  COMPACT: 80,
  /** Stacked layout: < 110 cols - vertical panel layout instead of side-by-side */
  STACKED: 110,
} as const;

/**
 * Calculate responsive layout flags from terminal width
 * Use this to get consistent breakpoint behavior across components
 */
export function getLayoutFlags(terminalWidth: number) {
  return {
    isUltraCompact: terminalWidth < BREAKPOINTS.ULTRA_COMPACT,
    isCompact: terminalWidth < BREAKPOINTS.COMPACT,
    isStackedLayout: terminalWidth < BREAKPOINTS.STACKED,
  };
}
