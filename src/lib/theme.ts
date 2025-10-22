// git-recent inspired color palette, adapted for TUI readability
// Uses soft, terminal-friendly colors that work on both light and dark backgrounds
export const COLORS = {
  // Primary colors (git-recent inspired)
  branch: "#98C379", // Branch names (soft green, primary identifier)
  commit: "#E06C75", // Commit hashes (soft red, readable)
  timestamp: "#98C379", // Timestamps (soft green)
  author: "#61AFEF", // Authors/metadata (soft blue)

  // Status colors
  success: "#98C379", // Clean status (green)
  modified: "#E5C07B", // Modified files (amber/yellow)
  warning: "#E5C07B", // Warnings
  error: "#E06C75", // Errors (red)

  // UI colors
  highlight: "#61AFEF", // Selected items (blue)
  label: "#ABB2BF", // Labels (muted gray)
  text: "white", // Default text
  dim: "gray", // Secondary text

  // Keep legacy names for backward compatibility
  info: "#61AFEF",
  background: undefined, // No background for native terminal feel
} as const;

export type ColorName = (typeof COLORS)[keyof typeof COLORS];
