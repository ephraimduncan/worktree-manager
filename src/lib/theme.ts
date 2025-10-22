export const COLORS = {
  branch: "#98C379",
  commit: "#E06C75",
  timestamp: "#98C379",
  author: "#61AFEF",

  success: "#98C379",
  modified: "#E5C07B",
  warning: "#E5C07B",
  error: "#E06C75",

  highlight: "#61AFEF",
  label: "#ABB2BF",
  text: "white",
  dim: "gray",

  info: "#61AFEF",
  background: undefined,
} as const;

export type ColorName = (typeof COLORS)[keyof typeof COLORS];
