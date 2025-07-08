# Spawndeck CLI

A powerful CLI tool for managing multiple Claude Code instances in parallel using Git worktrees. Run several Claude Code sessions simultaneously on different branches without context switching or repository conflicts.

## Installation

Install globally using npm:

```bash
npm install -g spawndeck
```

## Quick Start

Once installed, use the `spawndeck` command (or `sd` for short):

```bash
# Interactive mode - prompts for branch name and options
spawndeck
# or
sd

# Create a new worktree directly
spawndeck feature-branch-name
# or
sd feature-branch-name

# List all existing worktrees
spawndeck --list
# or
sd --list
```

## Why Spawndeck CLI?

When working with Claude Code on complex projects, you often need to:

- Work on multiple features simultaneously
- Test different approaches in parallel
- Keep separate Claude Code sessions for different tasks
- Avoid conflicts between concurrent development efforts

Spawndeck CLI solves this by creating isolated Git worktrees, each with its own Claude Code instance, allowing true parallel development.

## Features

- **Parallel Claude Code Sessions**: Run multiple Claude Code instances simultaneously on different branches
- **Git Worktree Management**: Create, switch, and manage worktrees with REPO-BRANCH naming (e.g., waiterio-fix-auth)
- **Interactive Workflow**: Colorful prompts guide you through worktree creation and management
- **Smart Branch Handling**: Create new branches or use existing ones, with automatic validation
- **Editor Integration**: Automatically launch Claude Code, VS Code, or work without an editor
- **Seamless Context Switching**: Jump between different Claude Code sessions without losing context
- **Merge Management**: Built-in tools to merge changes between parallel development branches
- **Cleanup Tools**: Remove worktrees and branches when tasks are complete

## Usage

### Basic Usage

Create a new worktree with a branch name:

```bash
spawndeck fix-bug
# or
sd fix-bug
# Creates worktree at ../myrepo-fix-bug
```

### Interactive Mode

Run without arguments for interactive prompts:

```bash
spawndeck
# or
sd
# Prompts for branch name, editor choice, etc.
```

### Command Options

All commands work with both `spawndeck` and `sd`:

```bash
# List all worktrees
spawndeck --list
sd -l

# Choose editor to launch
spawndeck fix-bug --editor code    # Launch VS Code
sd fix-bug --editor claude         # Launch Claude (default)
sd fix-bug --no-editor             # Don't launch any editor

# Pass a prompt to Claude
spawndeck fix-bug --prompt "Fix the authentication bug in login.js"
sd fix-bug -p "Add user profile feature"

# Skip permissions check in Claude (use with caution)
spawndeck fix-bug --dangerously-skip-permissions
sd fix-bug -d

# Select from existing branches
spawndeck --from-existing
sd -x

# Help
spawndeck --help
sd -h
```

## How It Works

1. **Validates** that you're in a git repository
2. **Creates** a worktree in the parent directory with format: `<repo-name>-<branch-name>`
3. **Isolates** each worktree with its own branch and working directory
4. **Launches** Claude Code in the new worktree (keeping each session separate)
5. **Enables** parallel development without interference between sessions

This allows you to have multiple Claude Code instances working on different features simultaneously, each in its own isolated environment.

## Examples

### Managing Multiple Claude Code Sessions

```bash
# Start working on authentication in one Claude Code instance
spawndeck fix-auth-bug

# While that's running, start another Claude Code session for a new feature
sd add-user-profiles

# And another for documentation updates
sd update-docs

# Now you have 3 Claude Code instances running in parallel!
```

### Common Workflows

```bash
# Create a feature branch with a specific task for Claude
spawndeck add-login-feature --prompt "Implement OAuth2 login with Google"

# Work on a bug fix in a separate Claude session
sd fix-memory-leak -p "Find and fix the memory leak in the data processing module"

# Quick fix without launching Claude
sd hotfix-config --no-editor

# Use VS Code for manual editing while Claude works on other branches
spawndeck implement-api --editor code

# Merge your parallel work back to main
sd merge fix-auth-bug

# Clean up completed work
sd remove add-user-profiles
```

## Requirements

- Node.js
- Git
- Claude CLI (optional, for default editor)
- VS Code CLI (optional, if using --editor code)

## Development

This project uses npm for package management and includes:

- Commander.js for CLI argument parsing
- Inquirer.js for interactive prompts
