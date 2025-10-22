import { useKeyboard } from "@opentui/react";
import { COLORS } from "../lib/theme";

interface HelpProps {
  onClose: () => void;
}

export function Help({ onClose }: HelpProps) {
  useKeyboard((key) => {
    if (key.name === "escape" || key.sequence === "?") {
      onClose();
    }
  });

  return (
    <box
      style={{
        position: "absolute",
        left: "15%",
        top: "15%",
        width: "70%",
        height: "auto",
      }}
    >
      <box
        title="Keyboard Shortcuts"
        borderStyle="rounded"
        style={{
          backgroundColor: "black",
          padding: 2,
          flexDirection: "column",
          gap: 1,
        }}
      >
        <text fg={COLORS.label} style={{ fontWeight: "bold" }}>
          Navigation
        </text>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>↑/↓</text>
          <text fg={COLORS.dim}> or </text>
          <text fg={COLORS.highlight}>j/k</text>
          <text> - Move selection up/down</text>
        </box>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>Enter</text>
          <text> - Print selected worktree path and exit</text>
        </box>

        <text fg={COLORS.label} style={{ fontWeight: "bold", marginTop: 1 }}>
          Actions
        </text>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>c</text>
          <text> - Create new worktree</text>
        </box>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>d</text>
          <text> - Delete selected worktree</text>
        </box>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>D</text>
          <text> - Clean all worktrees (except main)</text>
        </box>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>r</text>
          <text> - Refresh worktree list</text>
        </box>

        <text fg={COLORS.label} style={{ fontWeight: "bold", marginTop: 1 }}>
          Other
        </text>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>?</text>
          <text> - Show this help</text>
        </box>
        <box style={{ flexDirection: "row", marginLeft: 2 }}>
          <text fg={COLORS.highlight}>q</text>
          <text fg={COLORS.dim}> or </text>
          <text fg={COLORS.highlight}>Esc</text>
          <text> - Quit application</text>
        </box>

        <text fg={COLORS.dim} style={{ marginTop: 2 }}>
          Press Esc or ? to close
        </text>
      </box>
    </box>
  );
}
