# Worktree Manager

A beautiful TUI (Terminal User Interface) for managing git worktrees - like lazygit, but for worktrees.

Built with [OpenTUI](https://github.com/sst/opentui) and [Bun](https://bun.sh).

## Features

- **Dashboard Layout**: Clean, lazygit-inspired interface with worktree list, details panel, and action bar
- **Worktree Management**: Create, delete, and clean worktrees with interactive wizards
- **Git Status Integration**: Visual indicators for dirty worktrees, staged/modified/untracked files, ahead/behind tracking
- **Branch Information**: See last commit details, author, and timing for each worktree
- **Configuration**: Manage directories and branch prefixes through settings UI
- **Keyboard Navigation**: Vim-style navigation (j/k or arrow keys)

## Installation

### Global Install (npm)

```bash
npm install -g worktree-manager
```

Then run with:

```bash
worktree-manager
# or
wt-manager
```

### Using bunx (no install)

```bash
bunx worktree-manager
```

### From Source

```bash
git clone <your-repo>
cd worktrees-manager
bun install
bun run dev
```

### Compiled Binary

Build a standalone executable:

```bash
bun run build:binary
```

This creates a `worktree-manager` binary you can move to your PATH.

## Usage

Run the TUI from within any git repository:

```bash
worktree-manager
```

### Keyboard Shortcuts

**Navigation:**
- `↑/↓` or `j/k` - Move selection up/down
- `Enter` - Print selected worktree path and exit

**Actions:**
- `c` - Create new worktree (interactive wizard)
- `d` - Delete selected worktree
- `D` - Clean all worktrees (except main)
- `r` - Refresh worktree list
- `s` - Open settings

**Other:**
- `?` - Show help
- `q` or `Esc` - Quit application

## Configuration

Configuration is stored in `~/.worktree-manager`:

```json
{
  "projectsDir": "/Users/you/projects",
  "worktreesDir": "/Users/you/projects/worktrees",
  "defaultBranchPrefix": "",
  "autoRefresh": true,
  "refreshInterval": 5000
}
```

You can edit this through the Settings UI (press `s`) or manually edit the file.

## Development

**Run in development mode:**

```bash
bun run dev
```

**Build for distribution:**

```bash
bun run build          # Build to dist/
bun run build:binary   # Compile standalone binary
```

## Project Structure

```
src/
├── index.tsx              # Entry point
├── components/
│   ├── Dashboard.tsx      # Main layout
│   ├── WorktreeList.tsx   # Worktree list panel
│   ├── DetailsPanel.tsx   # Details panel
│   ├── StatusBar.tsx      # Top status bar
│   └── ActionBar.tsx      # Bottom action bar
├── modals/
│   ├── CreateWorktree.tsx # Creation wizard
│   ├── ConfirmDelete.tsx  # Delete confirmation
│   ├── ConfirmClean.tsx   # Clean confirmation
│   ├── Settings.tsx       # Settings editor
│   └── Help.tsx           # Help modal
├── lib/
│   ├── git.ts            # Git command utilities
│   ├── worktree.ts       # Worktree operations
│   ├── config.ts         # Config management
│   └── types.ts          # TypeScript types
└── hooks/
    └── useWorktrees.ts   # Worktree state hook
```

## Why Worktree Manager?

Git worktrees are powerful but can be cumbersome to manage with CLI commands. This TUI provides:

- Visual overview of all worktrees
- Quick creation with branch management
- Git status at a glance
- Safe deletion with confirmations
- Configuration management

Perfect for developers who:
- Work on multiple features simultaneously
- Need to switch contexts frequently
- Want a visual interface for worktree management
- Love terminal UIs like lazygit

## License

MIT

## Credits

- Built with [OpenTUI](https://github.com/sst/opentui)
- Inspired by [lazygit](https://github.com/jesseduffield/lazygit)
- Powered by [Bun](https://bun.sh)
