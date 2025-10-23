import { truncate } from "../lib/text-utils";
import { COLORS } from "../lib/theme";
import type { WorktreeWithStatus } from "../lib/types";

interface WorktreeListProps {
  worktrees: WorktreeWithStatus[];
  selectedIndex: number;
  terminalWidth: number;
  stacked: boolean;
  compact: boolean;
}

function calculatePanelWidth(terminalWidth: number, stacked: boolean): number {
  const estimated = stacked ? terminalWidth : Math.floor(terminalWidth * 0.45);
  return Math.max(estimated - 6, 20);
}

export function WorktreeList({
  worktrees,
  selectedIndex,
  terminalWidth,
  stacked,
  compact,
}: WorktreeListProps) {
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

  const panelWidth = calculatePanelWidth(terminalWidth, stacked);
  const showBranchOnOwnLine = panelWidth < 60 || compact;

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

        const nameMaxLength = showBranchOnOwnLine
          ? Math.max(panelWidth - 8, 8)
          : Math.max(Math.min(28, Math.floor(panelWidth * 0.4)), 10);
        const branchMaxLength = showBranchOnOwnLine
          ? Math.max(panelWidth - 8, 8)
          : Math.max(Math.min(36, panelWidth - nameMaxLength - 8), 10);

        const truncatedName = truncate(wt.name, nameMaxLength);
        const truncatedBranch = truncate(wt.branch, branchMaxLength);

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

        if (showBranchOnOwnLine) {
          return (
            <box
              key={wt.path}
              style={{ flexDirection: "column", marginBottom: 0.5 }}
            >
              <box style={{ flexDirection: "row" }}>
                <text fg={isSelected ? COLORS.highlight : COLORS.dim}>
                  {prefix}
                </text>
                <text fg={nameColor}>
                  <strong>{truncatedName}</strong>
                </text>
                {wt.isMain && panelWidth >= 60 && (
                  <text fg={COLORS.dim} style={{ marginLeft: 1 }}>
                    [main]
                  </text>
                )}
              </box>
              <box style={{ flexDirection: "row", marginLeft: 2 }}>
                <text fg={branchColor}>{truncatedBranch}</text>
                {statusIndicator && panelWidth >= 60 && (
                  <text fg={statusColor} style={{ marginLeft: 1 }}>
                    {statusIndicator.trim()}
                  </text>
                )}
              </box>
            </box>
          );
        }

        return (
          <box key={wt.path} style={{ flexDirection: "row", marginBottom: 0 }}>
            <text fg={isSelected ? COLORS.highlight : COLORS.dim}>
              {prefix}
            </text>
            <text fg={nameColor}>
              <strong>{truncatedName}</strong>
            </text>
            <text fg={branchColor}> ({truncatedBranch})</text>
            {wt.isMain && <text fg={COLORS.dim}> [main]</text>}
            {statusIndicator && <text fg={statusColor}>{statusIndicator}</text>}
          </box>
        );
      })}
    </box>
  );
}
