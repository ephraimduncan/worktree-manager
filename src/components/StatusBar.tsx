interface StatusBarProps {
  repoPath: string | null;
  worktreeCount: number;
}

export function StatusBar({ repoPath, worktreeCount }: StatusBarProps) {
  const title = "Worktree Manager";
  const repoName = repoPath ? repoPath.split("/").pop() : "No Repository";
  const count = `(${worktreeCount} worktree${worktreeCount !== 1 ? "s" : ""})`;

  return (
    <box
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "black",
        paddingLeft: 1,
        paddingRight: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <text fg="cyan" style={{ fontWeight: "bold" }}>{title}</text>
      <box style={{ flexDirection: "row" }}>
        <text>{repoName} </text>
        <text>{count}</text>
      </box>
    </box>
  );
}
