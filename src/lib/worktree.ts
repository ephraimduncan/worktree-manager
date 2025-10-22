import { basename, normalize, resolve } from "path";
import { execGit } from "./git";
import type { BranchInfo, GitStatus, Worktree } from "./types";
import { MAIN_WORKTREE_DELETE_ERROR } from "./types";

export async function listWorktrees(cwd?: string): Promise<Worktree[]> {
  const result = await execGit(["worktree", "list", "--porcelain"], { cwd });

  if (!result.success) {
    return [];
  }

  const worktrees: Worktree[] = [];
  const lines = result.stdout.split("\n");
  let current: Partial<Worktree> = {};

  for (const line of lines) {
    if (line.startsWith("worktree ")) {
      if (current.path) {
        worktrees.push(current as Worktree);
      }
      current = {
        path: line.substring(9).trim(),
        isPrunable: false,
        isMain: false,
      };
    } else if (line.startsWith("HEAD ")) {
      current.head = line.substring(5).trim();
    } else if (line.startsWith("branch ")) {
      current.branch = line
        .substring(7)
        .trim()
        .replace(/^refs\/heads\//, "");
    } else if (line.startsWith("detached")) {
      current.branch = "HEAD (detached)";
    } else if (line.startsWith("prunable ")) {
      current.isPrunable = true;
    } else if (line === "") {
      if (current.path) {
        worktrees.push(current as Worktree);
        current = {};
      }
    }
  }

  if (current.path) {
    worktrees.push(current as Worktree);
  }

  return worktrees.map((wt, idx) => ({
    ...wt,
    isMain: idx === 0,
    name: basename(wt.path),
    branch: wt.branch || "HEAD (detached)",
  }));
}

export async function createWorktree(
  path: string,
  branch: string,
  options: {
    createBranch?: boolean;
    baseBranch?: string;
    cwd?: string;
  } = {}
): Promise<{ success: boolean; error?: string }> {
  const { createBranch = false, baseBranch = "HEAD", cwd } = options;

  try {
    const args = ["worktree", "add"];

    if (createBranch) {
      args.push("-b", branch);
    }

    args.push(path);

    if (createBranch && baseBranch !== "HEAD") {
      args.push(baseBranch);
    } else if (!createBranch) {
      args.push(branch);
    }

    const result = await execGit(args, { cwd, throwOnError: true });

    return { success: result.success };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function removeWorktree(
  path: string,
  options: { force?: boolean; cwd?: string } = {}
): Promise<{ success: boolean; error?: string }> {
  const { force = false, cwd } = options;

  const mainPath = await getMainWorktree(cwd);

  if (!mainPath) {
    return {
      success: false,
      error: "Unable to identify main worktree - deletion blocked for safety",
    };
  }

  const normalizedPath = normalize(resolve(path));
  const normalizedMainPath = normalize(resolve(mainPath));

  if (normalizedPath === normalizedMainPath) {
    return {
      success: false,
      error: MAIN_WORKTREE_DELETE_ERROR,
    };
  }

  try {
    const args = ["worktree", "remove"];

    if (force) {
      args.push("--force");
    }

    args.push(path);

    const result = await execGit(args, { cwd, throwOnError: true });

    return { success: result.success };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getGitStatus(path: string): Promise<GitStatus | null> {
  try {
    const statusResult = await execGit(["status", "--porcelain"], {
      cwd: path,
    });
    const branchResult = await execGit(["branch", "--show-current"], {
      cwd: path,
    });

    if (!statusResult.success) return null;

    const lines = statusResult.stdout.split("\n").filter((l) => l.trim());

    const status: GitStatus = {
      isClean: lines.length === 0,
      staged: 0,
      modified: 0,
      untracked: 0,
      ahead: 0,
      behind: 0,
      currentBranch: branchResult.stdout || "HEAD",
    };

    for (const line of lines) {
      const code = line.substring(0, 2);
      if (code[0] !== " " && code[0] !== "?") {
        status.staged++;
      }
      if (code[1] === "M" || code[1] === "D") {
        status.modified++;
      }
      if (code === "??") {
        status.untracked++;
      }
    }

    const revListResult = await execGit(
      ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"],
      { cwd: path }
    );

    if (revListResult.success) {
      const [ahead, behind] = revListResult.stdout.split("\t").map(Number);
      status.ahead = ahead || 0;
      status.behind = behind || 0;
    }

    return status;
  } catch (error) {
    return null;
  }
}

export async function getBranchInfo(path: string): Promise<BranchInfo | null> {
  try {
    const branchResult = await execGit(["branch", "--show-current"], {
      cwd: path,
    });
    if (!branchResult.success) return null;

    const branch = branchResult.stdout;

    const commitResult = await execGit(
      ["log", "-1", "--format=%H|%ar|%an|%s"],
      { cwd: path }
    );

    if (!commitResult.success) return null;

    const [hash, time, author, message] = commitResult.stdout.split("|");

    const remoteResult = await execGit(
      ["rev-parse", "--abbrev-ref", `${branch}@{upstream}`],
      { cwd: path }
    );

    return {
      name: branch,
      remote: remoteResult.success ? remoteResult.stdout : null,
      lastCommit: message || "",
      lastCommitTime: time || "",
      lastCommitAuthor: author || "",
    };
  } catch (error) {
    return null;
  }
}

export async function getMainWorktree(cwd?: string): Promise<string | null> {
  const worktrees = await listWorktrees(cwd);
  const main = worktrees.find((wt) => wt.isMain);
  return main?.path ?? null;
}
