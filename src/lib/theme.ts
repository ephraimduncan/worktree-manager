export const COLORS = {
  success: "#90EE90", // Custom light green (avoids terminal theme issues)
  info: "cyan",
  warning: "yellow",
  error: "red",
  background: "black",
} as const;

export type ColorName = typeof COLORS[keyof typeof COLORS];
