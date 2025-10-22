import { COLORS } from "../lib/theme";

interface Action {
  key: string;
  description: string;
}

const ACTIONS: Action[] = [
  { key: "↑↓", description: "navigate" },
  { key: "enter", description: "select" },
  { key: "c", description: "create" },
  { key: "d", description: "delete" },
  { key: "r", description: "refresh" },
  { key: "s", description: "settings" },
  { key: "?", description: "help" },
  { key: "q", description: "quit" },
];

export function ActionBar() {
  return (
    <box
      style={{
        height: 1,
        width: "100%",
        paddingLeft: 1,
        paddingRight: 1,
        flexDirection: "row",
        gap: 2,
      }}
    >
      {ACTIONS.map((action, idx) => (
        <box key={idx} style={{ flexDirection: "row" }}>
          <text fg={COLORS.highlight}>[{action.key}]</text>
          <text fg={COLORS.dim}> {action.description}</text>
        </box>
      ))}
    </box>
  );
}
