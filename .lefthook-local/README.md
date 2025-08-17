# Local Lefthook Configuration

This directory is for local Lefthook configuration overrides that won't be committed to the repository.

## Usage

Create a `lefthook-local.yml` file in this directory to override or extend the main Lefthook configuration.

### Example: Skip certain hooks locally

```yaml
# .lefthook-local/lefthook-local.yml
pre-commit:
  skip:
    - typescript-check  # Skip TypeScript checks locally for faster commits
```

### Example: Add custom local hooks

```yaml
# .lefthook-local/lefthook-local.yml
pre-commit:
  commands:
    custom-check:
      run: echo "Running my custom check..."
```

### Example: Override hook behavior

```yaml
# .lefthook-local/lefthook-local.yml
pre-commit:
  commands:
    biome-check:
      run: pnpm biome check --write {staged_files} --verbose
```

## Note

Files in this directory are ignored by git and won't affect other team members' workflows.
