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
            <text fg={COLORS.warning} style={{ fontWeight: "bold" }}>
              ⚠ Delete Worktree
            </text>

            <box style={{ flexDirection: "column", marginTop: 1 }}>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Name:{" "}
                </text>
                <text fg={COLORS.error}>{worktree.name}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Branch:{" "}
                </text>
                <text fg={COLORS.branch}>{worktree.branch}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Path:{" "}
                </text>
                <text fg={COLORS.dim}>{worktree.path}</text>
              </box>
            </box>

            {worktree.isMain && (
              <text fg={COLORS.error} style={{ marginTop: 1 }}>
                ⚠ Warning: This is the main repository!
              </text>
            )}

            <box style={{ flexDirection: "column", marginTop: 2, gap: 1 }}>
              <text fg={COLORS.highlight}>
                [y] Yes, delete this worktree
              </text>
              <text fg={COLORS.dim}>
                [f] {useForce ? "✓" : " "} Force delete (ignore uncommitted changes)
              </text>
              <text fg={COLORS.error}>[Esc] Cancel</text>
            </box>
          </box>
        );

      case "deleting":
        return (
          <box style={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
            <text fg={COLORS.highlight}>Deleting worktree...</text>
          </box>
        );

      case "error":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg={COLORS.error} style={{ fontWeight: "bold" }}>
              Error
            </text>
            <text>{error}</text>
            <text fg={COLORS.dim} style={{ marginTop: 1 }}>
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
        borderStyle="rounded"
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
