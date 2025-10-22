import { COLORS } from "../lib/theme";
import type { WorktreeWithStatus } from "../lib/types";

interface DetailsPanelProps {
  worktree: WorktreeWithStatus | null;
}

export function DetailsPanel({ worktree }: DetailsPanelProps) {
  if (!worktree) {
    return (
      <box
        title="Details"
        borderStyle="rounded"
        style={{
          flexGrow: 1,
          padding: 1,
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
        padding: 1,
        flexDirection: "column",
        gap: 1,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
          Name:
        </text>
        <text fg={COLORS.text} style={{ marginLeft: 2 }}>
          {worktree.name}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
          Branch:
        </text>
        <text fg={COLORS.branch} style={{ marginLeft: 2 }}>
          {worktree.branch}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
          Path:
        </text>
        <text fg={COLORS.dim} style={{ marginLeft: 2 }}>
          {worktree.path}
        </text>
      </box>

      <box style={{ flexDirection: "column" }}>
        <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
          HEAD:
        </text>
        <text fg={COLORS.commit} style={{ marginLeft: 2 }}>
          {worktree.head?.substring(0, 8) || "N/A"}
        </text>
      </box>

      {worktree.status && (
        <>
          <box style={{ flexDirection: "column" }}>
            <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
              Status:
            </text>
            <text
              fg={worktree.status.isClean ? COLORS.success : COLORS.modified}
              style={{ marginLeft: 2 }}
            >
              {worktree.status.isClean ? "✓ Clean" : "Modified"}
            </text>
          </box>

          {!worktree.status.isClean && (
            <box style={{ flexDirection: "column" }}>
              <text fg={COLORS.success} style={{ marginLeft: 2 }}>
                Staged: {worktree.status.staged}
              </text>
              <text fg={COLORS.modified} style={{ marginLeft: 2 }}>
                Modified: {worktree.status.modified}
              </text>
              <text fg={COLORS.dim} style={{ marginLeft: 2 }}>
                Untracked: {worktree.status.untracked}
              </text>
            </box>
          )}

          {(worktree.status.ahead > 0 || worktree.status.behind > 0) && (
            <box style={{ flexDirection: "column" }}>
              <text fg={COLORS.success} style={{ marginLeft: 2 }}>
                Ahead: {worktree.status.ahead}
              </text>
              <text fg={COLORS.error} style={{ marginLeft: 2 }}>
                Behind: {worktree.status.behind}
              </text>
            </box>
          )}
        </>
      )}

      {worktree.branchInfo && (
        <box style={{ flexDirection: "column" }}>
          <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
            Last Commit:
          </text>
          <text fg={COLORS.dim} style={{ marginLeft: 2 }}>
            {worktree.branchInfo.lastCommit}
          </text>
          <text fg={COLORS.timestamp} style={{ marginLeft: 2, marginTop: 0 }}>
            {worktree.branchInfo.lastCommitTime}{" "}
          </text>
          <text fg={COLORS.author} style={{ marginLeft: 2 }}>
            by {worktree.branchInfo.lastCommitAuthor}
          </text>
        </box>
      )}

      {worktree.isMain && (
        <box style={{ marginTop: 1 }}>
          <text fg={COLORS.warning}>⚠ This is the main repository</text>
        </box>
      )}
    </box>
  );
}
