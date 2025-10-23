import { BREAKPOINTS } from "../lib/responsive";
import { truncateEnd } from "../lib/text-utils";
import { COLORS } from "../lib/theme";

interface StatusBarProps {
  repoPath: string | null;
  worktreeCount: number;
  terminalWidth: number;
}

export function StatusBar({
  repoPath,
  worktreeCount,
  terminalWidth,
}: StatusBarProps) {
  const title = "Worktree Manager";
  const repoName = repoPath
    ? repoPath.split("/").pop() || repoPath
    : "No Repository";
  const count = `(${worktreeCount} worktree${worktreeCount !== 1 ? "s" : ""})`;

  const isCompact = terminalWidth < BREAKPOINTS.COMPACT;
  const titleAvailable = Math.max(terminalWidth - 4, 4);
  const titleDisplay = truncateEnd(
    title,
    Math.min(title.length, titleAvailable)
  );
  const availableForRepo = Math.max(
    terminalWidth - (isCompact ? 4 : titleDisplay.length + count.length + 6),
    6
  );
  const repoDisplay = truncateEnd(repoName, availableForRepo);

  return (
    <box
      style={{
        width: "100%",
        paddingLeft: 1,
        paddingRight: 1,
        flexDirection: isCompact ? "column" : "row",
        justifyContent: isCompact ? "flex-start" : "space-between",
        gap: isCompact ? 0.5 : 0,
      }}
    >
      <text fg={COLORS.highlight}>
        <strong>{titleDisplay}</strong>
      </text>
      <box style={{ flexDirection: "row" }}>
        <text fg={COLORS.text}>{repoDisplay}</text>
        {!isCompact && <text fg={COLORS.dim}> {count}</text>}
      </box>
      {isCompact && <text fg={COLORS.dim}>{count}</text>}
    </box>
  );
}
