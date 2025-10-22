import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { removeWorktree } from "../lib/worktree";
import type { Worktree } from "../lib/types";
import { COLORS } from "../lib/theme";

interface ConfirmCleanProps {
  worktrees: Worktree[];
  onClose: () => void;
  onSuccess: () => void;
  currentRepo: string;
}

type State = "confirm" | "cleaning" | "error" | "complete";

export function ConfirmClean({
  worktrees,
  onClose,
  onSuccess,
  currentRepo,
}: ConfirmCleanProps) {
  const [state, setState] = useState<State>("confirm");
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(0);

  const nonMainWorktrees = worktrees.filter((wt) => !wt.isMain);

  useKeyboard((key) => {
    if (key.name === "escape" || (state === "complete" && key.name === "return")) {
      if (state === "complete") {
        onSuccess();
      } else {
        onClose();
      }
    } else if (state === "confirm" && key.sequence === "y") {
      handleConfirm();
    }
  });

  const handleConfirm = async () => {
    setState("cleaning");
    setError("");

    let count = 0;
    for (const wt of nonMainWorktrees) {
      const result = await removeWorktree(wt.path, {
        cwd: currentRepo,
      });

      if (result.success) {
        count++;
        setDeleted(count);
      }
    }

    if (count === 0 && nonMainWorktrees.length > 0) {
      setError("Failed to delete any worktrees");
      setState("error");
      return;
    }

    setState("complete");
  };

  const renderContent = () => {
    switch (state) {
      case "confirm":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg="yellow" style={{ fontWeight: "bold" }}>⚠ Clean All Worktrees</text>

            <box style={{ flexDirection: "row", marginTop: 1 }}>
              <text>This will delete </text>
              <text>{nonMainWorktrees.length}</text>
              <text> worktree{nonMainWorktrees.length !== 1 ? "s" : ""}:</text>
            </box>

            <box style={{ flexDirection: "column", marginTop: 1, maxHeight: 10 }}>
              {nonMainWorktrees.slice(0, 5).map((wt) => (
                <text key={wt.path} style={{ marginLeft: 2 }}>
                  • {wt.name} ({wt.branch})
                </text>
              ))}
              {nonMainWorktrees.length > 5 && (
                <text style={{ marginLeft: 2 }}>
                  ... and {nonMainWorktrees.length - 5} more
                </text>
              )}
            </box>

            <box style={{ flexDirection: "column", marginTop: 2, gap: 1 }}>
              <text fg={COLORS.success}>[y] Yes, delete all worktrees</text>
              <text fg="red">[Esc] Cancel</text>
            </box>
          </box>
        );

      case "cleaning":
        return (
          <box style={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
            <text fg="cyan">Cleaning worktrees...</text>
            <text>
              Deleted: {deleted} / {nonMainWorktrees.length}
            </text>
          </box>
        );

      case "complete":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg={COLORS.success} style={{ fontWeight: "bold" }}>✓ Success</text>
            <text>
              Deleted {deleted} worktree{deleted !== 1 ? "s" : ""}
            </text>
            <text style={{ marginTop: 1 }}>
              Press Enter to continue
            </text>
          </box>
        );

      case "error":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg="red" style={{ fontWeight: "bold" }}>Error</text>
            <text>{error}</text>
            <text style={{ marginTop: 1 }}>
              Press Esc to close
            </text>
          </box>
        );

      default:
        return null;
    }
  };

  return (
    <box
      style={{
        position: "absolute",
        left: "20%",
        top: "25%",
        width: "60%",
        height: "auto",
      }}
    >
      <box
        title="Clean Worktrees"
        borderStyle="double"
        style={{
          backgroundColor: "black",
          padding: 2,
          flexDirection: "column",
        }}
      >
        {renderContent()}
      </box>
    </box>
  );
}
