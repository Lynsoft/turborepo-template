# Complete Setup Guide for Automated Release Workflow

## Overview

This guide walks you through setting up the complete automated release workflow for your Turborepo monorepo, including Commitlint, Semantic Release, and GitHub Actions.

## Prerequisites

- Node.js 18+ installed
- pnpm 10.14.0+ installed
- Git repository initialized
- GitHub repository created

## Step 1: Initial Setup

### 1.1 Install Dependencies

All necessary dependencies are already installed:

```bash
# Verify installation
pnpm install
```

### 1.2 Configure Repository URL

Update the repository URL in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/YOUR_REPO.git"
  }
}
```

### 1.3 Install Git Hooks

```bash
# Install Lefthook hooks
pnpm hooks:install
```

## Step 2: GitHub Repository Setup

### 2.1 Create GitHub Repository

1. Create a new repository on GitHub
2. Push your local code to the repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2.2 Configure Repository Settings

#### Branch Protection Rules

Go to Settings → Branches → Add rule for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

#### Required Status Checks

Add these status checks:

- `Code Quality`
- `Type Check`
- `Build`

### 2.3 Repository Secrets (Optional)

Go to Settings → Secrets and variables → Actions:

#### Secrets

- `NPM_TOKEN` - For npm package publishing (if needed)
- `TURBO_TOKEN` - For Turborepo remote caching (optional)

#### Variables

- `TURBO_TEAM` - Your Turborepo team name (optional)

## Step 3: Testing the Workflow

### 3.1 Test Commit Hooks

```bash
# Test pre-commit hooks
pnpm hooks:test

# Test commit message validation
echo "feat: add new feature" | pnpm commitlint
echo "invalid message" | pnpm commitlint  # Should fail
```

### 3.2 Test Interactive Commits

```bash
# Use interactive commit prompts
pnpm commit
```

### 3.3 Test Release Process

```bash
# Test semantic release (dry run)
pnpm release:dry
```

Note: This may fail if the GitHub repository is not accessible, which is normal for initial setup.

## Step 4: First Release

### 4.1 Create Initial Commit

Make sure your first commit follows conventional format:

```bash
git add .
git commit -m "feat: initial project setup with automated release workflow"
git push origin main
```

### 4.2 Verify GitHub Actions

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Verify that workflows are running successfully

### 4.3 Create First Release

The release will be automatically created when you push to main with conventional commits.

## Step 5: Team Onboarding

### 5.1 Team Setup Instructions

Share these instructions with your team:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
pnpm install

# Install git hooks
pnpm hooks:install
```

### 5.2 Development Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feat/new-feature
   ```

2. **Make changes and commit**:
   ```bash
   # Use interactive commit
   pnpm commit
   
   # Or commit manually with conventional format
   git commit -m "feat: add user authentication"
   ```

3. **Push and create PR**:
   ```bash
   git push origin feat/new-feature
   ```

4. **Merge to main** triggers automatic release

## Step 6: Customization

### 6.1 Modify Commit Types

Edit `commitlint.config.js` to add/remove commit types:

```javascript
'type-enum': [
  2,
  'always',
  [
    'feat', 'fix', 'docs', 'style', 'refactor',
    'perf', 'test', 'build', 'ci', 'chore', 'revert',
    'custom-type'  // Add your custom type
  ],
],
```

### 6.2 Modify Release Rules

Edit `.releaserc.js` to customize release behavior:

```javascript
releaseRules: [
  { type: 'feat', release: 'minor' },
  { type: 'fix', release: 'patch' },
  { type: 'custom-type', release: 'patch' },  // Add custom rule
],
```

### 6.3 Modify Scopes

Edit `commitlint.config.js` to add project-specific scopes:

```javascript
'scope-enum': [
  1,
  'always',
  [
    'web', 'mobile', 'admin',  // Your apps
    'ui', 'utils', 'api',      // Your packages
    'your-custom-scope'        // Add your scope
  ],
],
```

## Step 7: Monitoring and Maintenance

### 7.1 Monitor Releases

- Check GitHub Releases page for new releases
- Review generated changelogs
- Monitor GitHub Actions for failures

### 7.2 Regular Maintenance

- Review and update dependencies monthly
- Check security audit results
- Clean up old caches (automated weekly)

### 7.3 Troubleshooting

#### Common Issues

1. **Commit message validation fails**
   - Use `pnpm commit` for guided prompts
   - Check allowed types in `commitlint.config.js`

2. **Release workflow fails**
   - Verify repository URL in `package.json`
   - Check GitHub token permissions
   - Ensure all CI checks pass

3. **Build failures**
   - Run `pnpm build` locally
   - Check TypeScript errors with `pnpm check-types`
   - Verify formatting with `pnpm check`

#### Getting Help

- Check workflow logs in GitHub Actions
- Review configuration files for syntax errors
- Test commands locally before pushing

## Step 8: Advanced Configuration

### 8.1 Monorepo Package Releases

For individual package releases, consider using:

- `@semantic-release/monorepo` plugin
- Separate release configurations per package
- Conditional releases based on changed files

### 8.2 Custom Release Channels

Configure additional release channels in `.releaserc.js`:

```javascript
branches: [
  'main',
  { name: 'beta', prerelease: true },
  { name: 'alpha', prerelease: true },
  { name: 'next', prerelease: true },
],
```

### 8.3 Integration with External Services

- Add deployment steps to release workflow
- Integrate with monitoring services
- Set up notifications for releases

## Conclusion

Your automated release workflow is now fully configured! The system will:

- ✅ Enforce conventional commit messages
- ✅ Run comprehensive CI/CD checks
- ✅ Automatically version releases
- ✅ Generate changelogs
- ✅ Create GitHub releases
- ✅ Maintain code quality standards

For detailed usage instructions, see [RELEASE_WORKFLOW.md](./RELEASE_WORKFLOW.md).
