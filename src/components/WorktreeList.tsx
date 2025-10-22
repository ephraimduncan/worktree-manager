import { COLORS } from "../lib/theme";
import type { WorktreeWithStatus } from "../lib/types";

interface WorktreeListProps {
  worktrees: WorktreeWithStatus[];
  selectedIndex: number;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

function truncateAndPad(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 3) + "...";
  }
  return text.padEnd(maxLength, " ");
}

export function WorktreeList({ worktrees, selectedIndex }: WorktreeListProps) {
  if (worktrees.length === 0) {
    return (
      <box
        title="Worktrees"
        borderStyle="single"
        style={{
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text>No worktrees found</text>
      </box>
    );
  }

  return (
    <box
      title={`Worktrees (${worktrees.length})`}
      borderStyle="single"
      style={{
        flexGrow: 1,
        padding: 1,
        flexDirection: "column",
      }}
    >
      {worktrees.map((wt, idx) => {
        const isSelected = idx === selectedIndex;
        const prefix = isSelected ? "▶ " : "  ";
        const nameColor = isSelected ? "cyan" : undefined;
        const branchColor = COLORS.success;

        let statusIndicator = "";
        let statusColor: string | undefined;
        if (wt.status) {
          if (wt.status.isClean) {
            statusIndicator = " ✓";
            statusColor = COLORS.success;
          } else {
            const totalChanges =
              wt.status.staged + wt.status.modified + wt.status.untracked;
            statusIndicator = ` ~${totalChanges}`;
            statusColor = "yellow";
          }
        }

        return (
          <box key={wt.path} style={{ flexDirection: "row", marginBottom: 0 }}>
            <text>{prefix}</text>
            <text fg={nameColor} style={{ fontWeight: "bold" }}>
              {truncateAndPad(wt.name, 20)}
            </text>
            <text fg={branchColor}> ({truncate(wt.branch, 25)})</text>
            {wt.isMain && <text> [main]</text>}
            {statusIndicator && <text fg={statusColor}>{statusIndicator}</text>}
          </box>
        );
      })}
    </box>
  );
}
