/**
 * Semantic Release configuration for Turborepo monorepo
 * Automates versioning, changelog generation, and releases based on conventional commits
 *
 * @see https://semantic-release.gitbook.io/semantic-release/
 */

module.exports = {
  // Branches that trigger releases
  branches: [
    "main",
    "master",
    {
      name: "beta",
      prerelease: true,
    },
    {
      name: "alpha",
      prerelease: true,
    },
  ],

  // Plugins configuration
  plugins: [
    // Analyze commits to determine release type
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          // Custom release rules for monorepo
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { type: "perf", release: "patch" },
          { type: "revert", release: "patch" },
          { type: "docs", release: false },
          { type: "style", release: false },
          { type: "chore", release: false },
          { type: "refactor", release: "patch" },
          { type: "test", release: false },
          { type: "build", release: "patch" },
          { type: "ci", release: false },

          // Breaking changes always trigger major release
          { breaking: true, release: "major" },

          // Scope-based rules for monorepo packages
          { scope: "deps", release: "patch" },
          { scope: "security", release: "patch" },
        ],
        parserOpts: {
          noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
        },
      },
    ],

    // Generate release notes
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "✨ Features" },
            { type: "fix", section: "🐛 Bug Fixes" },
            { type: "perf", section: "🚀 Performance Improvements" },
            { type: "revert", section: "⏪ Reverts" },
            { type: "docs", section: "📚 Documentation", hidden: false },
            { type: "style", section: "💎 Styles", hidden: true },
            { type: "chore", section: "♻️ Chores", hidden: true },
            { type: "refactor", section: "📦 Code Refactoring" },
            { type: "test", section: "🚨 Tests", hidden: true },
            { type: "build", section: "🛠 Build System" },
            { type: "ci", section: "⚙️ Continuous Integration", hidden: true },
          ],
        },
        writerOpts: {
          commitsSort: ["subject", "scope"],
        },
      },
    ],

    // Generate changelog
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle:
          "# Changelog\n\nAll notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.",
      },
    ],

    // Update package.json version (for monorepo root)
    [
      "@semantic-release/npm",
      {
        npmPublish: false, // Don't publish root package
        tarballDir: "dist",
      },
    ],

    // Execute custom commands for Turborepo builds
    [
      "@semantic-release/exec",
      {
        verifyReleaseCmd: "pnpm build && pnpm check-types",
        prepareCmd: "pnpm build",
        publishCmd:
          'echo "Build completed successfully for version ${nextRelease.version}"',
      },
    ],

    // Commit changelog and package.json changes
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "package.json",
          "pnpm-lock.yaml",
          "apps/*/package.json",
          "packages/*/package.json",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],

    // Create GitHub release
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "dist/*.tgz",
            label: "Distribution packages",
          },
        ],
        successComment: false,
        failComment: false,
        releasedLabels: ["released"],
        addReleases: "bottom",
      },
    ],
  ],

  // Global options
  preset: "conventionalcommits",
  tagFormat: "v${version}",

  // CI configuration
  ci: true,
  dryRun: false,

  // Repository information
  repositoryUrl: process.env.GITHUB_REPOSITORY
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}.git`
    : undefined,
};
