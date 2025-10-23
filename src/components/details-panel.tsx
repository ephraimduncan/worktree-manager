import { getLayoutFlags } from "../lib/responsive";
import { truncate } from "../lib/text-utils";
import { COLORS } from "../lib/theme";
import type { WorktreeWithStatus } from "../lib/types";

interface DetailsPanelProps {
  worktree: WorktreeWithStatus | null;
  terminalWidth: number;
}

export function DetailsPanel({ worktree, terminalWidth }: DetailsPanelProps) {
  const { isStackedLayout, isCompact, isUltraCompact } = getLayoutFlags(terminalWidth);

  const padding = isUltraCompact ? 0.5 : isCompact ? 0.75 : 1;
  const marginLeft = isUltraCompact ? 0.5 : isCompact ? 1 : 2;

  // Calculate max text lengths based on available width
  const panelWidth = isStackedLayout
    ? Math.max(terminalWidth - 6, 20)
    : Math.max(Math.floor(terminalWidth * 0.55) - 6, 20);
  // More aggressive truncation buffer (20 instead of 15) to prevent text overflow
  const maxTextLength = Math.max(panelWidth - 20, 8);

  if (!worktree) {
    return (
      <box
        title="Details"
        borderStyle="rounded"
        style={{
          flexGrow: 1,
          padding,
          backgroundColor: "black",
        }}
      >
        <text fg={COLORS.dim}>Select a worktree to view details</text>
      </box>
    );
  }

  return (
    <box
      title="Details"
      borderStyle="rounded"
      style={{
        flexGrow: 1,
        padding,
        flexDirection: "column",
        gap: isUltraCompact ? 0.5 : 1,
        backgroundColor: "black",
      }}
    >
      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label}>
          <strong>Name:</strong>
        </text>
        <text fg={COLORS.text} style={{ marginLeft }}>
          {truncate(worktree.name, maxTextLength)}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label}>
          <strong>Branch:</strong>
        </text>
        <text fg={COLORS.branch} style={{ marginLeft }}>
          {truncate(worktree.branch, maxTextLength)}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label}>
          <strong>Path:</strong>
        </text>
        <text fg={COLORS.dim} style={{ marginLeft }}>
          {truncate(worktree.path, maxTextLength)}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label}>
          <strong>HEAD:</strong>
        </text>
        <text fg={COLORS.commit} style={{ marginLeft }}>
          {worktree.head?.substring(0, 8) || "N/A"}
        </text>
      </box>

      {worktree.status && (
        <>
          <box style={{ flexDirection: "column" }}>
            <text fg={COLORS.label}>
              <strong>Status:</strong>
            </text>
            <text
              fg={worktree.status.isClean ? COLORS.success : COLORS.modified}
              style={{ marginLeft }}
            >
              {worktree.status.isClean ? "✓ Clean" : "Modified"}
            </text>
          </box>

          {!worktree.status.isClean && (
            <box style={{ flexDirection: "column" }}>
              <text fg={COLORS.success} style={{ marginLeft }}>
                Staged: {worktree.status.staged}
              </text>
              <text fg={COLORS.modified} style={{ marginLeft }}>
                Modified: {worktree.status.modified}
              </text>
              <text fg={COLORS.dim} style={{ marginLeft }}>
                Untracked: {worktree.status.untracked}
              </text>
            </box>
          )}

          {(worktree.status.ahead > 0 || worktree.status.behind > 0) && (
            <box style={{ flexDirection: "column" }}>
              <text fg={COLORS.success} style={{ marginLeft }}>
                Ahead: {worktree.status.ahead}
              </text>
              <text fg={COLORS.error} style={{ marginLeft }}>
                Behind: {worktree.status.behind}
              </text>
            </box>
          )}
        </>
      )}

      {worktree.branchInfo && (
        <box style={{ flexDirection: "column" }}>
          <text fg={COLORS.label}>
            <strong>Last Commit:</strong>
          </text>
          <text fg={COLORS.dim} style={{ marginLeft }}>
            {truncate(worktree.branchInfo.lastCommit, maxTextLength)}
          </text>
          <text fg={COLORS.timestamp} style={{ marginLeft, marginTop: 0 }}>
            {worktree.branchInfo.lastCommitTime}{" "}
          </text>
          <text fg={COLORS.author} style={{ marginLeft }}>
            by {truncate(worktree.branchInfo.lastCommitAuthor, maxTextLength - 4)}
          </text>
        </box>
      )}

      {worktree.isMain && (
        <box style={{ marginTop: isUltraCompact ? 0.5 : 1 }}>
          <text fg={COLORS.warning}>⚠ This is the main repository</text>
        </box>
      )}
    </box>
  );
}
