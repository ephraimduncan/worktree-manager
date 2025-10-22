export interface GitCommandOptions {
  cwd?: string;
  throwOnError?: boolean;
}

export interface GitCommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

export async function execGit(
  args: string[],
  options: GitCommandOptions = {}
): Promise<GitCommandResult> {
  const { cwd = process.cwd(), throwOnError = false } = options;

  try {
    const proc = Bun.spawn(["git", ...args], {
      cwd,
      stdout: "pipe",
      stderr: "pipe",
    });

    const [stdout, stderr] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);

    await proc.exited;

    const result: GitCommandResult = {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: proc.exitCode ?? 0,
      success: (proc.exitCode ?? 0) === 0,
    };

    if (throwOnError && !result.success) {
      throw new Error(`Git command failed: ${stderr || stdout}`);
    }

    return result;
  } catch (error) {
    if (throwOnError) {
      throw error;
    }

    return {
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: 1,
      success: false,
    };
  }
}

export async function getRepoRoot(cwd?: string): Promise<string | null> {
  const result = await execGit(["rev-parse", "--show-toplevel"], { cwd });
  return result.success ? result.stdout : null;
}

export async function isGitRepo(cwd?: string): Promise<boolean> {
  const result = await execGit(["rev-parse", "--git-dir"], { cwd });
  return result.success;
}

export async function getCurrentBranch(cwd?: string): Promise<string | null> {
  const result = await execGit(["branch", "--show-current"], { cwd });
  return result.success ? result.stdout : null;
}

export async function listBranches(cwd?: string): Promise<string[]> {
  const result = await execGit(["branch", "-a"], { cwd });
  if (!result.success) return [];

  return result.stdout
    .split("\n")
    .map((line) => line.replace(/^\*?\s+/, "").trim())
    .filter((line) => line && !line.startsWith("remotes/origin/HEAD"));
}

export async function branchExists(
  branchName: string,
  cwd?: string
): Promise<boolean> {
  const result = await execGit(
    ["show-ref", "--verify", "--quiet", `refs/heads/${branchName}`],
    { cwd }
  );
  return result.success;
}

export async function isValidRef(ref: string, cwd?: string): Promise<boolean> {
  const result = await execGit(["check-ref-format", "--branch", ref], { cwd });
  return result.success;
}
