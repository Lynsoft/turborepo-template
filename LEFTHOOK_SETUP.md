# Lefthook Setup Documentation

## Overview

Lefthook has been successfully configured for the Turborepo monorepo to automatically enforce code quality standards through git hooks.

## What's Configured

### Pre-commit Hooks
- **Biome Check**: Automatically formats and lints staged files with auto-fix
- **TypeScript Check**: Validates type safety when TypeScript files are staged

### Pre-push Hooks
- **Build Check**: Ensures all packages build successfully before pushing
- **Full Type Check**: Validates TypeScript across all workspaces

### Post-checkout/merge Hooks
- **Dependency Installation**: Automatically runs `pnpm install` when package files change

## Files Added/Modified

1. **lefthook.yml** - Main Lefthook configuration
2. **package.json** - Added Lefthook scripts and dependency
3. **README.md** - Added comprehensive Lefthook documentation
4. **.gitignore** - Added Lefthook local config exclusion
5. **.lefthook-local/README.md** - Local configuration guide

## Available Commands

```bash
# Install git hooks (run once after cloning)
pnpm hooks:install

# Uninstall git hooks
pnpm hooks:uninstall

# Manually run pre-commit checks
pnpm hooks:test

# Run any hook manually
pnpm hooks:run <hook-name>
```

## Key Features

- **Performance Optimized**: Only runs checks on staged files when possible
- **Turborepo Integration**: Uses Turbo commands for cross-workspace operations
- **Auto-fixing**: Automatically fixes formatting and linting issues
- **Monorepo Support**: Properly handles pnpm workspace dependencies
- **Local Overrides**: Supports local configuration without affecting team

## Team Workflow

1. **First-time setup**: After cloning, run `pnpm install && pnpm hooks:install`
2. **Daily workflow**: Hooks run automatically on commit/push
3. **Manual checks**: Use `pnpm hooks:test` to run pre-commit checks manually
4. **Local customization**: Create `.lefthook-local/lefthook-local.yml` for personal overrides

## Troubleshooting

- If hooks fail, fix the reported issues and commit again
- Use `pnpm hooks:uninstall` and `pnpm hooks:install` to reset hooks
- Check `.lefthook-local/README.md` for local configuration options
- Run individual commands manually to debug issues:
  - `pnpm biome check .`
  - `pnpm check-types`
  - `pnpm build`

## Benefits

- **Consistent Code Quality**: Enforces formatting and linting standards
- **Early Error Detection**: Catches issues before they reach the repository
- **Team Productivity**: Reduces code review time by automating quality checks
- **Build Safety**: Prevents broken builds from being pushed
- **Zero Configuration**: Works out of the box for all team members
