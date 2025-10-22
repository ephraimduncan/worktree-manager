import { useKeyboard } from "@opentui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWorktrees } from "../hooks/useWorktrees";
import { loadConfig } from "../lib/config";
import { COLORS } from "../lib/theme";
import type { Config, ModalType } from "../lib/types";
import { MAIN_WORKTREE_DELETE_ERROR } from "../lib/types";
import { ConfirmClean } from "../modals/ConfirmClean";
import { ConfirmDelete } from "../modals/ConfirmDelete";
import { CreateWorktree } from "../modals/CreateWorktree";
import { Help } from "../modals/Help";
import { Settings } from "../modals/Settings";
import { ActionBar } from "./ActionBar";
import { DetailsPanel } from "./DetailsPanel";
import { StatusBar } from "./StatusBar";
import { WorktreeList } from "./WorktreeList";

export function Dashboard() {
	const { worktrees, isLoading, error, currentRepo, refresh } = useWorktrees();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [modal, setModal] = useState<ModalType>("none");
	const [config, setConfig] = useState<Config | null>(null);
	const [notification, setNotification] = useState<string | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const selectedWorktree = worktrees[selectedIndex] || null;

	const showNotification = useCallback((message: string, duration = 1500) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		setNotification(message);
		timeoutRef.current = setTimeout(() => {
			setNotification(null);
			timeoutRef.current = null;
		}, duration);
	}, []);

	useEffect(() => {
		loadConfig().then(setConfig);
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	useKeyboard((key) => {
		if (notification) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			setNotification(null);
			return;
		}

		if (modal !== "none") {
			return;
		}

		if (key.name === "up" || key.sequence === "k") {
			setSelectedIndex((prev) => Math.max(0, prev - 1));
		} else if (key.name === "down" || key.sequence === "j") {
			setSelectedIndex((prev) => Math.min(worktrees.length - 1, prev + 1));
		} else if (key.name === "return") {
			if (selectedWorktree) {
				console.log(selectedWorktree.path);
				process.exit(0);
			}
		} else if (key.sequence === "r") {
			refresh();
		} else if (key.sequence === "q" || key.name === "escape") {
			process.exit(0);
		} else if (key.sequence === "c") {
			setModal("create");
		} else if (key.sequence === "d") {
			if (selectedWorktree?.isMain) {
				showNotification(MAIN_WORKTREE_DELETE_ERROR);
				return;
			}
			setModal("delete");
		} else if (key.sequence === "D") {
			setModal("clean");
		} else if (key.sequence === "?") {
			setModal("help");
		} else if (key.sequence === "s") {
			setModal("settings");
		}
	});

	if (error) {
		return (
			<box
				style={{
					width: "100%",
					height: "100%",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<text fg="red">Error: {error}</text>
				<text style={{ marginTop: 1 }}>Press 'q' to quit</text>
			</box>
		);
	}

	if (isLoading && worktrees.length === 0) {
		return (
			<box
				style={{
					width: "100%",
					height: "100%",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<text fg="cyan">Loading worktrees...</text>
			</box>
		);
	}

	return (
		<box style={{ width: "100%", height: "100%", flexDirection: "column" }}>
			<StatusBar repoPath={currentRepo} worktreeCount={worktrees.length} />

			<box style={{ flexGrow: 1, flexDirection: "row", padding: 1, gap: 1 }}>
				<box style={{ width: "40%", flexDirection: "column" }}>
					<WorktreeList worktrees={worktrees} selectedIndex={selectedIndex} />
				</box>

				<box style={{ width: "60%", flexDirection: "column" }}>
					<DetailsPanel worktree={selectedWorktree} />
				</box>
			</box>

			<ActionBar />

			{modal === "create" && config && currentRepo && (
				<CreateWorktree
					onClose={() => setModal("none")}
					onSuccess={() => {
						setModal("none");
						refresh();
					}}
					currentRepo={currentRepo}
					worktreesDir={config.worktreesDir}
					defaultBranchPrefix={config.defaultBranchPrefix}
				/>
			)}

			{modal === "delete" && selectedWorktree && currentRepo && (
				<ConfirmDelete
					worktree={selectedWorktree}
					onClose={() => setModal("none")}
					onSuccess={() => {
						setModal("none");
						refresh();
					}}
					currentRepo={currentRepo}
				/>
			)}

			{modal === "clean" && currentRepo && (
				<ConfirmClean
					worktrees={worktrees}
					onClose={() => setModal("none")}
					onSuccess={() => {
						setModal("none");
						refresh();
					}}
					currentRepo={currentRepo}
				/>
			)}

			{modal === "help" && <Help onClose={() => setModal("none")} />}

			{modal === "settings" && config && (
				<Settings
					config={config}
					onClose={() => setModal("none")}
					onSave={(newConfig) => {
						setConfig(newConfig);
						setModal("none");
					}}
				/>
			)}

			{notification && (
				<box
					style={{
						position: "absolute",
						bottom: 0,
						width: "100%",
						justifyContent: "center",
					}}
				>
					<text fg={COLORS.error}>{notification}</text>
				</box>
			)}
		</box>
	);
}
