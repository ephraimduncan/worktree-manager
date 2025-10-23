export interface Config {
  worktreesDir: string;
  defaultBranchPrefix: string;
  autoRefresh: boolean;
  refreshInterval: number;
}

export interface Worktree {
  path: string;
  branch: string;
  head: string;
  isPrunable: boolean;
  isMain: boolean;
  name: string;
}

export interface GitStatus {
  isClean: boolean;
  staged: number;
  modified: number;
  untracked: number;
  ahead: number;
  behind: number;
  currentBranch: string;
}

export interface BranchInfo {
  name: string;
  remote: string | null;
  lastCommit: string;
  lastCommitTime: string;
  lastCommitAuthor: string;
}

export interface WorktreeWithStatus extends Worktree {
  status?: GitStatus;
  branchInfo?: BranchInfo;
}

export type ModalType = 'none' | 'create' | 'delete' | 'clean' | 'settings' | 'help';

export interface AppState {
  worktrees: WorktreeWithStatus[];
  selectedIndex: number;
  currentRepo: string | null;
  isLoading: boolean;
  error: string | null;
  modal: ModalType;
  config: Config;
}

export interface CreateWorktreeFormData {
  name: string;
  branchName: string;
  createNewBranch: boolean;
  baseBranch: string;
}

export const MAIN_WORKTREE_DELETE_ERROR = "Cannot delete main repository - other worktrees depend on it";
