import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { basename } from "path";
import { createWorktree } from "../lib/worktree";
import { isValidRef } from "../lib/git";
import { COLORS } from "../lib/theme";

interface CreateWorktreeProps {
  onClose: () => void;
  onSuccess: () => void;
  currentRepo: string;
  worktreesDir: string;
  defaultBranchPrefix: string;
}

type Status = "input" | "creating" | "error";

export function CreateWorktree({
  onClose,
  onSuccess,
  currentRepo,
  worktreesDir,
  defaultBranchPrefix,
}: CreateWorktreeProps) {
  const [status, setStatus] = useState<Status>("input");
  const [branchName, setBranchName] = useState("");
  const [error, setError] = useState("");

  const projectName = basename(currentRepo).toLowerCase();

  const sanitizedBranch = branchName
    .trim()
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

  const worktreeName = sanitizedBranch
    ? `${projectName}-${sanitizedBranch}`
    : "";

  const worktreePath = worktreeName
    ? `${worktreesDir}/${worktreeName}`
    : "";

  const fullBranchName = branchName.trim();

  useKeyboard((key) => {
    if (key.name === "escape") {
      onClose();
    }
  });

  const handleSubmit = async () => {
    if (!branchName.trim()) {
      setError("Branch name cannot be empty");
      return;
    }

    const valid = await isValidRef(fullBranchName, currentRepo);
    if (!valid) {
      setError("Invalid branch name");
      return;
    }

    setStatus("creating");
    setError("");

    const result = await createWorktree(worktreePath, fullBranchName, {
      createBranch: true,
      baseBranch: "HEAD",
      cwd: currentRepo,
    });

    if (!result.success) {
      setError(result.error || "Failed to create worktree");
      setStatus("error");
      return;
    }

    onSuccess();
  };

  const renderContent = () => {
    switch (status) {
      case "input":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
              Create New Worktree
            </text>

            <text style={{ marginTop: 1 }}>Enter branch name:</text>
            <input
              focused
              placeholder="e.g., feat/add-editor, bugfix/login-issue"
              onInput={setBranchName}
              onSubmit={handleSubmit}
              style={{ marginTop: 1 }}
            />

            {error && (
              <text fg={COLORS.error} style={{ marginTop: 1 }}>
                {error}
              </text>
            )}

            {branchName.trim() && !error && (
              <box
                style={{
                  flexDirection: "column",
                  marginTop: 2,
                  padding: 1,
                  borderStyle: "rounded",
                }}
              >
                <text fg={COLORS.dim} style={{ fontWeight: "bold" }}>
                  Preview:
                </text>
                <box style={{ flexDirection: "row", marginTop: 1 }}>
                  <text fg={COLORS.label}>Branch: </text>
                  <text fg={COLORS.branch}>{fullBranchName}</text>
                </box>
                <box style={{ flexDirection: "row" }}>
                  <text fg={COLORS.label}>Worktree: </text>
                  <text fg={COLORS.text}>{worktreeName}</text>
                </box>
                <box style={{ flexDirection: "row" }}>
                  <text fg={COLORS.label}>Path: </text>
                  <text fg={COLORS.dim}>{worktreePath}</text>
                </box>
                <box style={{ flexDirection: "row" }}>
                  <text fg={COLORS.label}>Base: </text>
                  <text fg={COLORS.dim}>HEAD</text>
                </box>
              </box>
            )}

            <text fg={COLORS.dim} style={{ marginTop: 1 }}>
              Press Enter to create, Esc to cancel
            </text>
          </box>
        );

      case "creating":
        return (
          <box style={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
            <text fg={COLORS.highlight}>Creating worktree...</text>
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
        left: "10%",
        top: "20%",
        width: "80%",
        height: "auto",
      }}
    >
      <box
        title="Create Worktree"
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
