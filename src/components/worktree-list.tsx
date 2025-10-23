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
        borderStyle="rounded"
        style={{
          flexGrow: 1,
          padding: 1,
        }}
      >
        <text fg={COLORS.dim}>No worktrees found</text>
      </box>
    );
  }

  return (
    <box
      title={`Worktrees (${worktrees.length})`}
      borderStyle="rounded"
      style={{
        flexGrow: 1,
        padding: 1,
        flexDirection: "column",
      }}
    >
      {worktrees.map((wt, idx) => {
        const isSelected = idx === selectedIndex;
        const prefix = isSelected ? "▶ " : "  ";
        const nameColor = isSelected ? COLORS.highlight : COLORS.text;
        const branchColor = COLORS.branch;

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
            statusColor = COLORS.modified;
          }
        }

        return (
          <box key={wt.path} style={{ flexDirection: "row", marginBottom: 0 }}>
            <text fg={isSelected ? COLORS.highlight : COLORS.dim}>{prefix}</text>
            <text fg={nameColor} style={{ fontWeight: "bold" }}>
              {truncateAndPad(wt.name, 20)}
            </text>
            <text fg={branchColor}> ({truncate(wt.branch, 25)})</text>
            {wt.isMain && <text fg={COLORS.dim}> [main]</text>}
            {statusIndicator && <text fg={statusColor}>{statusIndicator}</text>}
          </box>
        );
      })}
    </box>
  );
}
