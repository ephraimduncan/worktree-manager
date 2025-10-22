import { useCallback, useEffect, useState } from "react";
import { getRepoRoot } from "../lib/git";
import type { WorktreeWithStatus } from "../lib/types";
import { getBranchInfo, getGitStatus, listWorktrees } from "../lib/worktree";

export function useWorktrees(autoRefresh = false, interval = 5000) {
	const [worktrees, setWorktrees] = useState<WorktreeWithStatus[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentRepo, setCurrentRepo] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const repoRoot = await getRepoRoot();
			if (!repoRoot) {
				throw new Error("Not in a git repository");
			}

			setCurrentRepo(repoRoot);

			const wts = await listWorktrees(repoRoot);

			const enriched = await Promise.all(
				wts.map(async (wt) => {
					const [status, branchInfo] = await Promise.all([
						getGitStatus(wt.path),
						getBranchInfo(wt.path),
					]);

					return {
						...wt,
						status: status || undefined,
						branchInfo: branchInfo || undefined,
					};
				}),
			);

			setWorktrees(enriched);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	useEffect(() => {
		if (!autoRefresh) return;

		const timer = setInterval(refresh, interval);
		return () => clearInterval(timer);
	}, [autoRefresh, interval, refresh]);

	return {
		worktrees,
		isLoading,
		error,
		currentRepo,
		refresh,
	};
}
