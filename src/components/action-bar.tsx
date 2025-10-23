import { BREAKPOINTS } from "../lib/responsive";
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

interface ActionBarProps {
  terminalWidth: number;
}

function chunkActions(actions: Action[], chunkSize: number): Action[][] {
  const result: Action[][] = [];
  for (let i = 0; i < actions.length; i += chunkSize) {
    result.push(actions.slice(i, i + chunkSize));
  }
  return result;
}

export function ActionBar({ terminalWidth }: ActionBarProps) {
  const isNarrow = terminalWidth < BREAKPOINTS.COMPACT;
  const isMedium = terminalWidth >= BREAKPOINTS.COMPACT && terminalWidth < BREAKPOINTS.STACKED;

  const groupedActions = (() => {
    if (isNarrow) {
      return ACTIONS.map((action) => [action]);
    }
    if (isMedium) {
      return chunkActions(ACTIONS, 4);
    }
    return [ACTIONS];
  })();

  return (
    <box
      style={{
        width: "100%",
        paddingLeft: 1,
        paddingRight: 1,
        flexDirection: "column",
        gap: isNarrow ? 0.5 : 0,
      }}
    >
      {groupedActions.map((group, rowIdx) => (
        <box key={rowIdx} style={{ flexDirection: "row", gap: 2 }}>
          {group.map((action, idx) => (
            <box key={`${rowIdx}-${idx}`} style={{ flexDirection: "row" }}>
              <text fg={COLORS.highlight}>[{action.key}]</text>
              <text fg={COLORS.dim}> {action.description}</text>
            </box>
          ))}
        </box>
      ))}
    </box>
  );
}
