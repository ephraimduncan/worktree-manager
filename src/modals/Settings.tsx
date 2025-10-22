import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { saveConfig } from "../lib/config";
import { COLORS } from "../lib/theme";
import type { Config } from "../lib/types";

interface SettingsProps {
	config: Config;
	onClose: () => void;
	onSave: (config: Config) => void;
}

type Field = "projectsDir" | "worktreesDir" | "defaultBranchPrefix";

export function Settings({ config, onClose, onSave }: SettingsProps) {
	const [editedConfig, setEditedConfig] = useState<Config>(config);
	const [focusedField, setFocusedField] = useState<Field>("projectsDir");
	const [inputValue, setInputValue] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useKeyboard((key) => {
		if (key.name === "escape") {
			onClose();
		} else if (key.name === "tab") {
			const fields: Field[] = [
				"projectsDir",
				"worktreesDir",
				"defaultBranchPrefix",
			];
			const currentIndex = fields.indexOf(focusedField);
			const nextIndex = (currentIndex + 1) % fields.length;
			setFocusedField(fields[nextIndex]!);
			setInputValue("");
		} else if (key.sequence === "s" && key.ctrl) {
			handleSave();
		}
	});

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await saveConfig(editedConfig);
			onSave(editedConfig);
		} finally {
			setIsSaving(false);
		}
	};

	const handleFieldSubmit = (field: Field) => {
		if (inputValue.trim()) {
			setEditedConfig({
				...editedConfig,
				[field]: inputValue.trim(),
			});
			setInputValue("");
		}
	};

	return (
		<box
			style={{
				position: "absolute",
				left: "10%",
				top: "15%",
				width: "80%",
				height: "auto",
			}}
		>
			<box
				title="Settings"
				borderStyle="rounded"
				style={{
					backgroundColor: "black",
					padding: 2,
					flexDirection: "column",
					gap: 1,
				}}
			>
				<text fg={COLORS.label} style={{ fontWeight: "bold" }}>
					Configuration
				</text>

				<box style={{ flexDirection: "column", marginTop: 1 }}>
					<text
						fg={focusedField === "projectsDir" ? COLORS.highlight : COLORS.label}
						style={{ fontWeight: "bold" }}
					>
						Projects Directory:
					</text>
					<text fg={COLORS.dim} style={{ marginLeft: 2 }}>
						{editedConfig.projectsDir}
					</text>
					{focusedField === "projectsDir" && (
						<input
							focused
							placeholder="Enter new path..."
							onInput={setInputValue}
							onSubmit={() => handleFieldSubmit("projectsDir")}
							style={{ marginTop: 1 }}
						/>
					)}
				</box>

				<box style={{ flexDirection: "column" }}>
					<text
						fg={focusedField === "worktreesDir" ? COLORS.highlight : COLORS.label}
						style={{ fontWeight: "bold" }}
					>
						Worktrees Directory:
					</text>
					<text fg={COLORS.dim} style={{ marginLeft: 2 }}>
						{editedConfig.worktreesDir}
					</text>
					{focusedField === "worktreesDir" && (
						<input
							focused
							placeholder="Enter new path..."
							onInput={setInputValue}
							onSubmit={() => handleFieldSubmit("worktreesDir")}
							style={{ marginTop: 1 }}
						/>
					)}
				</box>

				<box style={{ flexDirection: "column" }}>
					<text
						fg={
							focusedField === "defaultBranchPrefix"
								? COLORS.highlight
								: COLORS.label
						}
						style={{ fontWeight: "bold" }}
					>
						Default Branch Prefix:
					</text>
					<text fg={COLORS.dim} style={{ marginLeft: 2 }}>
						{editedConfig.defaultBranchPrefix || "(none)"}
					</text>
					{focusedField === "defaultBranchPrefix" && (
						<input
							focused
							placeholder="e.g., username, feature, etc."
							onInput={setInputValue}
							onSubmit={() => handleFieldSubmit("defaultBranchPrefix")}
							style={{ marginTop: 1 }}
						/>
					)}
				</box>

				{isSaving ? (
					<text fg={COLORS.highlight} style={{ marginTop: 2 }}>
						Saving...
					</text>
				) : (
					<box style={{ flexDirection: "column", marginTop: 2, gap: 1 }}>
						<text fg={COLORS.highlight}>[Tab] Switch field</text>
						<text fg={COLORS.success}>[Ctrl+S] Save changes</text>
						<text fg={COLORS.error}>[Esc] Close without saving</text>
					</box>
				)}
			</box>
		</box>
	);
}
