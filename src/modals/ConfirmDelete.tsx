import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { removeWorktree } from "../lib/worktree";
import type { Worktree } from "../lib/types";
import { COLORS } from "../lib/theme";

interface ConfirmDeleteProps {
  worktree: Worktree;
  onClose: () => void;
  onSuccess: () => void;
  currentRepo: string;
}

type State = "confirm" | "deleting" | "error";

export function ConfirmDelete({
  worktree,
  onClose,
  onSuccess,
  currentRepo,
}: ConfirmDeleteProps) {
  const [state, setState] = useState<State>("confirm");
  const [error, setError] = useState("");
  const [useForce, setUseForce] = useState(false);

  useKeyboard((key) => {
    if (key.name === "escape") {
      onClose();
    } else if (state === "confirm" && key.sequence === "y") {
      handleConfirm();
    } else if (state === "confirm" && key.sequence === "f") {
      setUseForce(!useForce);
    }
  });

  const handleConfirm = async () => {
    setState("deleting");
    setError("");

    const result = await removeWorktree(worktree.path, {
      force: useForce,
      cwd: currentRepo,
    });

    if (!result.success) {
      setError(result.error || "Failed to delete worktree");
      setState("error");
      return;
    }

    onSuccess();
  };

  const renderContent = () => {
    switch (state) {
      case "confirm":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg="yellow" style={{ fontWeight: "bold" }}>⚠ Delete Worktree</text>

            <box style={{ flexDirection: "column", marginTop: 1 }}>
              <box style={{ flexDirection: "row" }}>
                <text style={{ fontWeight: "bold" }}>Name: </text>
                <text fg="red">{worktree.name}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text style={{ fontWeight: "bold" }}>Branch: </text>
                <text fg="red">{worktree.branch}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text style={{ fontWeight: "bold" }}>Path: </text>
                <text>{worktree.path}</text>
              </box>
            </box>

            {worktree.isMain && (
              <text fg="red" style={{ marginTop: 1 }}>
                ⚠ Warning: This is the main repository!
              </text>
            )}

            <box style={{ flexDirection: "column", marginTop: 2, gap: 1 }}>
              <text fg={COLORS.success}>
                [y] Yes, delete this worktree
              </text>
              <text fg="cyan">
                [f] {useForce ? "✓" : " "} Force delete (ignore uncommitted changes)
              </text>
              <text fg="red">
                [Esc] Cancel
              </text>
            </box>
          </box>
        );

      case "deleting":
        return (
          <box style={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
            <text fg="cyan">Deleting worktree...</text>
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
        top: "30%",
        width: "60%",
        height: "auto",
      }}
    >
      <box
        title="Confirm Delete"
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
