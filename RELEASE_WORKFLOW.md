# Automated Release Workflow

## Overview

The Turborepo monorepo is equipped with a complete automated release workflow that ensures code quality, automates versioning, and streamlines deployments. The workflow integrates Commitlint, Semantic Release, and GitHub Actions to provide a seamless development experience.

## Components

### 1. Commitlint
- **Purpose**: Enforces conventional commit message format
- **Integration**: Runs as a commit-msg hook via Lefthook
- **Configuration**: `commitlint.config.js`

### 2. Semantic Release
- **Purpose**: Automated versioning and changelog generation
- **Integration**: Triggered by GitHub Actions on main branch pushes
- **Configuration**: `.releaserc.js`

### 3. GitHub Actions
- **Purpose**: CI/CD pipeline for testing, building, and releasing
- **Workflows**: 
  - `ci.yml` - Pull request and push validation
  - `release.yml` - Automated releases
  - `security.yml` - Security audits and dependency checks
  - `cache-cleanup.yml` - Maintenance tasks

## Workflow Process

### Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feat/new-feature
   
   # Make changes and commit using conventional format
   git add .
   pnpm commit  # Interactive commit with commitizen
   # OR
   git commit -m "feat: add new user authentication"
   
   # Push and create PR
   git push origin feat/new-feature
   ```

2. **Pull Request Validation**
   - Biome formatting and linting checks
   - TypeScript compilation validation
   - Build verification
   - All checks must pass before merge

3. **Release Process**
   - Merge to main branch triggers release workflow
   - Semantic Release analyzes commits since last release
   - Automatically determines version bump (major/minor/patch)
   - Generates changelog
   - Creates GitHub release
   - Updates package.json versions

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Supported Types

- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation changes (no version bump)
- `style`: Code style changes (no version bump)
- `refactor`: Code refactoring (patch version bump)
- `perf`: Performance improvements (patch version bump)
- `test`: Adding or updating tests (no version bump)
- `build`: Build system changes (patch version bump)
- `ci`: CI/CD changes (no version bump)
- `chore`: Maintenance tasks (no version bump)
- `revert`: Revert previous commit (patch version bump)

#### Breaking Changes

Add `BREAKING CHANGE:` in the footer or use `!` after type:

```
feat!: remove deprecated API endpoint

BREAKING CHANGE: The /api/v1/users endpoint has been removed.
Use /api/v2/users instead.
```

#### Scopes (Optional)

Use scopes to indicate which part of the monorepo is affected:

- `web`, `mobile`, `admin`, `landing` - Applications
- `ui`, `utils`, `config`, `types`, `api` - Packages
- `ci`, `deps`, `release`, `security` - Infrastructure
- `docs`, `readme`, `changelog` - Documentation

### Version Bumping Rules

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `feat` | Minor | 1.0.0 → 1.1.0 |
| `fix` | Patch | 1.0.0 → 1.0.1 |
| `perf` | Patch | 1.0.0 → 1.0.1 |
| `refactor` | Patch | 1.0.0 → 1.0.1 |
| `build` | Patch | 1.0.0 → 1.0.1 |
| Breaking Change | Major | 1.0.0 → 2.0.0 |
| `docs`, `style`, `test`, `ci`, `chore` | No bump | 1.0.0 → 1.0.0 |

## Available Commands

### Commit Commands
```bash
# Interactive commit with prompts
pnpm commit

# Validate commit message
echo "feat: add new feature" | pnpm commitlint
```

### Release Commands
```bash
# Dry run release (test without publishing)
pnpm release:dry

# Manual release (normally handled by CI)
pnpm release
```

### Hook Commands
```bash
# Install git hooks
pnpm hooks:install

# Test pre-commit hooks
pnpm hooks:test

# Run specific hook
pnpm hooks:run pre-commit
```

## GitHub Actions Workflows

### CI Workflow (`ci.yml`)
- **Triggers**: Push to main/develop, Pull requests
- **Jobs**: Code quality, type checking, building
- **Caching**: pnpm store and Turborepo cache

### Release Workflow (`release.yml`)
- **Triggers**: Push to main/beta/alpha branches
- **Jobs**: Full validation, build, semantic release
- **Permissions**: Write access for releases and tags

### Security Workflow (`security.yml`)
- **Triggers**: Daily schedule, dependency changes
- **Jobs**: Security audit, license check, CodeQL analysis

### Cache Cleanup (`cache-cleanup.yml`)
- **Triggers**: Weekly schedule
- **Jobs**: Remove old GitHub Actions caches

## Setup Requirements

### Repository Secrets

Add these secrets to your GitHub repository:

```
GITHUB_TOKEN - Automatically provided by GitHub
NPM_TOKEN - For npm package publishing (if needed)
TURBO_TOKEN - For Turborepo remote caching (optional)
```

### Repository Variables

Add these variables to your GitHub repository:

```
TURBO_TEAM - Your Turborepo team name (optional)
```

### Branch Protection

Configure branch protection rules for `main`:

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Include administrators

## Troubleshooting

### Common Issues

1. **Commit message validation fails**
   - Ensure commit follows conventional format
   - Use `pnpm commit` for interactive prompts
   - Check `commitlint.config.js` for allowed types/scopes

2. **Release workflow fails**
   - Verify repository URL in package.json
   - Check GitHub token permissions
   - Ensure all CI checks pass

3. **Build failures**
   - Run `pnpm build` locally to debug
   - Check TypeScript errors with `pnpm check-types`
   - Verify Biome formatting with `pnpm check`

### Manual Recovery

If automatic release fails:

```bash
# Reset to last working state
git reset --hard HEAD~1

# Fix issues and recommit
git add .
git commit -m "fix: resolve release issues"

# Push to trigger new release
git push origin main
```

## Best Practices

1. **Always use conventional commits** - Enables automatic versioning
2. **Keep commits atomic** - One logical change per commit
3. **Write descriptive commit messages** - Helps with changelog generation
4. **Test locally before pushing** - Use `pnpm hooks:test` to validate
5. **Review generated changelogs** - Ensure release notes are accurate
6. **Monitor CI/CD pipelines** - Address failures promptly
7. **Use semantic versioning** - Follow semver principles for breaking changes
