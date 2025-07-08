# Spawndeck Monorepo

This is the monorepo for spawndeck.com, containing:

- **spawndeck-cli**: A powerful CLI tool for managing multiple Claude Code instances in parallel using Git worktrees
- **spawndeck-www**: Landing pages and marketing site for spawndeck.com

## Structure

This monorepo uses npm workspaces to manage multiple packages:

```
spawndeck/
├── spawndeck-cli/     # CLI tool (published to npm)
├── spawndeck-www/     # Website and landing pages
└── package.json       # Root workspace configuration
```

## Development

```bash
# Install all dependencies for all workspaces
npm install

# Run tests across all workspaces
npm test

# Run linting across all workspaces
npm run lint

# Format code
npm run format
```

## Packages

### spawndeck-cli

The CLI tool that helps developers manage multiple Claude Code instances in parallel. Install globally with:

```bash
npm install -g spawndeck
```

See [spawndeck-cli/README.md](./spawndeck-cli/README.md) for more details.

### spawndeck-www

The marketing website and landing pages for spawndeck.com.

See [spawndeck-www/README.md](./spawndeck-www/README.md) for more details.
