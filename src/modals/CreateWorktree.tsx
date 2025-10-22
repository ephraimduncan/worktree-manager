import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { createWorktree } from "../lib/worktree";
import { isValidRef } from "../lib/git";
import type { CreateWorktreeFormData } from "../lib/types";
import { COLORS } from "../lib/theme";

interface CreateWorktreeProps {
  onClose: () => void;
  onSuccess: () => void;
  currentRepo: string;
  worktreesDir: string;
  defaultBranchPrefix: string;
}

type Step = "name" | "branch" | "confirm" | "creating" | "error";

export function CreateWorktree({
  onClose,
  onSuccess,
  currentRepo,
  worktreesDir,
  defaultBranchPrefix,
}: CreateWorktreeProps) {
  const [step, setStep] = useState<Step>("name");
  const [formData, setFormData] = useState<CreateWorktreeFormData>({
    name: "",
    branchName: "",
    createNewBranch: true,
    baseBranch: "HEAD",
  });
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  useKeyboard((key) => {
    if (key.name === "escape") {
      onClose();
    }
  });

  const handleNameSubmit = async () => {
    if (!inputValue.trim()) {
      setError("Name cannot be empty");
      return;
    }

    const sanitized = inputValue.trim().replace(/\s+/g, "-").replace(/\/+/g, "/");

    const branchName = defaultBranchPrefix
      ? `${defaultBranchPrefix}/${sanitized}`
      : sanitized;

    const valid = await isValidRef(branchName, currentRepo);
    if (!valid) {
      setError("Invalid worktree/branch name");
      return;
    }

    setFormData({
      ...formData,
      name: sanitized,
      branchName,
    });
    setInputValue("");
    setError("");
    setStep("branch");
  };

  const handleBranchSubmit = () => {
    const baseBranch = inputValue.trim() || "HEAD";
    setFormData({
      ...formData,
      baseBranch,
    });
    setInputValue("");
    setError("");
    setStep("confirm");
  };

  const handleConfirm = async () => {
    setStep("creating");
    setError("");

    const worktreePath = `${worktreesDir}/${formData.name}`;

    const result = await createWorktree(worktreePath, formData.branchName, {
      createBranch: formData.createNewBranch,
      baseBranch: formData.baseBranch,
      cwd: currentRepo,
    });

    if (!result.success) {
      setError(result.error || "Failed to create worktree");
      setStep("error");
      return;
    }

    onSuccess();
  };

  const renderStep = () => {
    switch (step) {
      case "name":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
              Step 1: Worktree Name
            </text>
            <text>Enter a name for the new worktree:</text>
            <input
              focused
              placeholder="e.g., feature-auth, bugfix-123"
              onInput={setInputValue}
              onSubmit={handleNameSubmit}
              style={{ marginTop: 1 }}
            />
            {error && <text fg={COLORS.error}>{error}</text>}
            <text fg={COLORS.dim} style={{ marginTop: 1 }}>
              Press Enter to continue, Esc to cancel
            </text>
          </box>
        );

      case "branch":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
              Step 2: Base Branch
            </text>
            <text>Branch will be created as:</text>
            <text fg={COLORS.branch} style={{ marginLeft: 2 }}>
              {formData.branchName}
            </text>
            <text style={{ marginTop: 1 }}>
              Enter base branch (leave empty for current HEAD):
            </text>
            <input
              focused
              placeholder="main, develop, or leave empty"
              onInput={setInputValue}
              onSubmit={handleBranchSubmit}
              style={{ marginTop: 1 }}
            />
            <text fg={COLORS.dim} style={{ marginTop: 1 }}>
              Press Enter to continue, Esc to cancel
            </text>
          </box>
        );

      case "confirm":
        return (
          <box style={{ flexDirection: "column", gap: 1 }}>
            <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
              Confirm Creation
            </text>

            <box style={{ flexDirection: "column", marginTop: 1 }}>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Worktree:{" "}
                </text>
                <text fg={COLORS.text}>{formData.name}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Branch:{" "}
                </text>
                <text fg={COLORS.branch}>{formData.branchName}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Base:{" "}
                </text>
                <text fg={COLORS.dim}>{formData.baseBranch}</text>
              </box>
              <box style={{ flexDirection: "row" }}>
                <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
                  Path:{" "}
                </text>
                <text fg={COLORS.dim}>
                  {worktreesDir}/{formData.name}
                </text>
              </box>
            </box>

            <box style={{ flexDirection: "row", gap: 2, marginTop: 2 }}>
              <text fg={COLORS.success}>Press Enter to create</text>
              <text fg={COLORS.dim}>|</text>
              <text fg={COLORS.error}>Press Esc to cancel</text>
            </box>
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

  useKeyboard((key) => {
    if (step === "confirm" && key.name === "return") {
      handleConfirm();
    }
  });

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
        {renderStep()}
      </box>
    </box>
  );
}
