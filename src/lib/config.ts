import { homedir } from "os";
import { join } from "path";
import type { Config } from "./types";

const CONFIG_FILE = join(homedir(), ".worktrees");

const DEFAULT_CONFIG: Config = {
  worktreesDir: join(homedir(), ".worktrees"),
  defaultBranchPrefix: "",
  autoRefresh: true,
  refreshInterval: 5000,
};

export async function loadConfig(): Promise<Config> {
  try {
    const file = Bun.file(CONFIG_FILE);
    const exists = await file.exists();

    if (!exists) {
      await saveConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }

    const content = await file.text();
    const parsed = JSON.parse(content);

    return {
      ...DEFAULT_CONFIG,
      ...parsed,
    };
  } catch (error) {
    console.error("Failed to load config, using defaults:", error);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(config: Config): Promise<void> {
  try {
    const content = JSON.stringify(config, null, 2);
    await Bun.write(CONFIG_FILE, content);
  } catch (error) {
    console.error("Failed to save config:", error);
    throw error;
  }
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
