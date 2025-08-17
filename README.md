# Modern Turborepo Template

A production-ready Turborepo template with modern tooling, best practices, and automated workflows for building scalable TypeScript applications.

## About This Template

This is a comprehensive Turborepo monorepo template designed for rapid development of modern web applications. It includes everything you need to start building scalable projects with TypeScript, React, and cutting-edge development tools.

### Key Features

- **🚀 Modern Stack**: TypeScript, React, TailwindCSS, Vite
- **⚡ Fast Tooling**: Biome for linting/formatting, pnpm for package management
- **🔧 Developer Experience**: Git hooks, conventional commits, automated releases
- **🐳 Docker Ready**: Complete Docker setup with PostgreSQL and Redis
- **📦 Monorepo Structure**: Shared packages and scalable architecture
- **🔄 CI/CD**: Automated testing, building, and release workflows

## What's inside?

This template provides a solid foundation with shared packages ready for your applications:

### Included Packages

- `@repo/ui`: Shared React component library with TailwindCSS styling
- `@repo/typescript-config`: TypeScript configurations for different project types (Next.js, React libraries, etc.)

### Ready for Your Applications

The monorepo structure is prepared for multiple application types:
- Landing pages and marketing sites
- Web applications (Next.js, Vite)
- Mobile app backend services
- Admin dashboards
- API services

Everything is 100% [TypeScript](https://www.typescriptlang.org/) with modern tooling and best practices.

## Using This Template

### Prerequisites

- Node.js 20+
- pnpm 10.14.0+ (recommended package manager)

### Quick Start

1. **Use this template** on GitHub or clone it:
```bash
git clone <template-repository-url>
cd your-project-name
```

2. **Update project details**:
   - Change the `name` in `package.json`
   - Update the repository URL in `package.json`
   - Modify package names from `@repo/*` to `@your-project/*`

3. **Install dependencies**:
```bash
pnpm install
```

4. **Set up development environment**:
```bash
pnpm hooks:install
```

5. **Start building your project**:
```bash
# Create your first app
pnpm gen:app

# Start development
pnpm dev
```

### Development Tools

This Turborepo includes modern development tools:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biome](https://biomejs.dev/) for fast linting and formatting
- [TailwindCSS](https://tailwindcss.com/) for utility-first styling
- [Lefthook](https://github.com/evilmartians/lefthook) for git hooks
- [Semantic Release](https://semantic-release.gitbook.io/) for automated releases

### Build

To build all packages, run:

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=@holeswing/ui
```

### Development

To start development mode:

```bash
# Start development for all packages
pnpm dev

# Start development for specific package
pnpm dev --filter=@holeswing/ui
```

### Template Customization

After using this template, customize it for your project:

1. **Update Package Names**: Change `@repo/*` to `@your-project/*` in:
   - `packages/*/package.json`
   - Import statements throughout the codebase

2. **Configure Environment**:
   - Copy `.env.example` to `.env.local`
   - Update database and service configurations

3. **Generate Applications**:
```bash
# Create a new app (Next.js, Vite, etc.)
pnpm gen:app

# Create a new package
pnpm gen:package
```

4. **Update Repository Settings**:
   - Configure GitHub repository URL
   - Set up CI/CD secrets if needed
   - Enable GitHub Actions for automated releases

### Code Quality

This project uses [Biome](https://biomejs.dev/) for fast linting and formatting of TypeScript, JavaScript, JSX/TSX, and JSON files.

#### Available Commands

```bash
# Format all files
pnpm run format

# Lint and auto-fix
pnpm run lint:fix

# Check formatting and linting (no fixes)
pnpm run check

# Check and auto-fix formatting and linting
pnpm run check:fix
```

#### Features

- **Fast Performance**: Biome is significantly faster than ESLint + Prettier
- **Multi-Language Support**: Native support for TypeScript, JavaScript, JSX/TSX, and JSON
- **TailwindCSS Class Sorting**: Automatically sorts TailwindCSS classes
- **Import Sorting**: Organizes imports automatically
- **Consistent Formatting**: Enforces consistent code style across the monorepo
- **All-in-One Tool**: Single tool for linting, formatting, and import organization

#### Configuration

Biome is configured via `biome.json` at the root of the monorepo. The configuration includes:

- Linting rules for TypeScript, React, and general JavaScript
- Formatting rules with 2-space indentation and 80-character line width
- TailwindCSS class sorting for better maintainability
- Import organization and sorting
- Special overrides for configuration files and TypeScript declaration files

### Git Hooks with Lefthook

This project uses [Lefthook](https://github.com/evilmartians/lefthook) to automatically run code quality checks before commits and pushes, ensuring consistent code quality across the team.

#### What Lefthook Does

- **Pre-commit hooks**: Automatically format and lint staged files before each commit
- **Pre-push hooks**: Run full builds and type checks before pushing to remote
- **Post-checkout/merge hooks**: Automatically install dependencies when package files change

#### Available Hook Commands

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

#### Pre-commit Checks

When you commit, Lefthook automatically runs:

1. **Biome Check**: Formats and lints staged files with auto-fix
2. **TypeScript Check**: Validates type safety (only if TypeScript files are staged)

#### Pre-push Checks

Before pushing to remote, Lefthook runs:

1. **Build Check**: Ensures all packages build successfully
2. **Full Type Check**: Validates TypeScript across all workspaces

#### Configuration

Lefthook is configured via `lefthook.yml` at the root. The configuration is optimized for:

- **Performance**: Only runs checks on staged files when possible
- **Turborepo Integration**: Uses Turbo commands for cross-workspace operations
- **Auto-fixing**: Automatically fixes formatting and linting issues
- **Monorepo Support**: Handles pnpm workspace dependencies correctly

#### First-time Setup

After cloning the repository, run:

```bash
pnpm install
pnpm hooks:install
```

The hooks will then automatically run on every commit and push.

### Automated Release Workflow

This project includes a complete automated release workflow using Commitlint, Semantic Release, and GitHub Actions.

#### Key Features

- **Conventional Commits**: Enforced commit message format for automated versioning
- **Semantic Versioning**: Automatic version bumping based on commit types
- **Changelog Generation**: Automated changelog creation from commit messages
- **GitHub Releases**: Automatic GitHub releases with build artifacts
- **CI/CD Pipeline**: Comprehensive testing and validation before releases

#### Quick Start

```bash
# Use interactive commit prompts
pnpm commit

# Or commit manually with conventional format
git commit -m "feat: add new user dashboard"
git commit -m "fix: resolve authentication bug"
git commit -m "docs: update API documentation"
```

#### Commit Types

- `feat`: New features (minor version bump)
- `fix`: Bug fixes (patch version bump)
- `docs`: Documentation changes (no version bump)
- `style`: Code style changes (no version bump)
- `refactor`: Code refactoring (patch version bump)
- `test`: Adding tests (no version bump)
- `chore`: Maintenance tasks (no version bump)

#### Breaking Changes

Use `!` after type or add `BREAKING CHANGE:` in footer for major version bumps:

```bash
git commit -m "feat!: remove deprecated API"
```

#### Available Commands

```bash
# Interactive commit with prompts
pnpm commit

# Validate commit message format
pnpm commitlint

# Test release process (dry run)
pnpm release:dry

# Manual release (normally automated)
pnpm release
```

For detailed information, see [RELEASE_WORKFLOW.md](./RELEASE_WORKFLOW.md).

## Docker Support

The project includes Docker configuration for development and deployment:

```bash
# Start all services (app, PostgreSQL, Redis)
make docker-up

# Stop all services
make docker-down

# View logs
make docker-logs
```

### Services

- **App**: Main application container (port 3000)
- **PostgreSQL**: Database service (port 5432)
- **Redis**: Caching and session storage (port 6379)
  - Password protected for security
  - Persistent data storage
  - Memory limits configured
  - Production-ready configuration available

## Environment Configuration

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Key environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string with authentication
- `REDIS_PASSWORD`: Redis authentication password
- `NEXTAUTH_URL`: Authentication URL for NextAuth.js
- `NEXTAUTH_SECRET`: Secret key for session encryption

## Remote Caching

Turborepo supports remote caching to share build artifacts across your team:

```bash
# Login to Vercel (for remote caching)
pnpm turbo login

# Link your repository
pnpm turbo link
```

## Template Features

### Automated Code Quality

- **Pre-commit hooks**: Automatically format and lint code before commits
- **Conventional commits**: Enforced commit message format
- **Automated releases**: Semantic versioning and changelog generation
- **Type checking**: Full TypeScript validation across workspaces

### Modern Development Stack

- **Biome**: Fast linting and formatting (replaces ESLint + Prettier)
- **TailwindCSS**: Utility-first CSS framework with class sorting
- **Lefthook**: Git hooks for consistent code quality
- **Semantic Release**: Automated versioning and releases

## Development Workflow

This template follows conventional commits and includes automated workflows:

```bash
# Use interactive commit prompts
pnpm commit

# Or commit manually with conventional format
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
```

### Commit Types

- `feat`: New features (minor version bump)
- `fix`: Bug fixes (patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Docker Support

This template includes production-ready Docker configurations with multi-stage builds, security best practices, and optimized performance.

### Quick Start

```bash
# Development (with hot reload)
make docker-up

# Production
make docker-prod-up

# View logs
make docker-logs
```

### Available Dockerfiles

- **`Dockerfile`**: General-purpose multi-stage build for any app type
- **`Dockerfile.nextjs`**: Optimized for Next.js applications with standalone output
- **`Dockerfile.vite`**: Optimized for Vite apps with Nginx serving static files

### Docker Features

- **Multi-stage builds**: Separate dependency, build, and runtime stages
- **Security**: Non-root user execution, minimal attack surface
- **Performance**: Optimized layer caching, production dependencies only
- **Health checks**: Built-in health monitoring for all services
- **Development support**: Hot reload with volume mounting

### Environment Configurations

#### Development
```bash
# Start development environment
docker-compose up -d

# Includes:
# - Hot reload with volume mounting
# - Development database with logging
# - Redis with permissive settings
```

#### Production
```bash
# Start production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Includes:
# - Optimized builds with security hardening
# - Resource limits and restart policies
# - Nginx reverse proxy with SSL support
# - Production database configuration
```

### Building Specific Apps

```bash
# Build Next.js app
docker build -f Dockerfile.nextjs --build-arg APP_NAME=landing .

# Build Vite app
docker build -f Dockerfile.vite --build-arg APP_NAME=landing .
```

### Docker Commands

```bash
# Development
make docker-up          # Start development services
make docker-down        # Stop services
make docker-logs        # View logs
make docker-build       # Build images
make docker-rebuild     # Rebuild from scratch

# Production
make docker-prod-up     # Start production services
make docker-prod-down   # Stop production services
make docker-prod-build  # Build production images

# Utilities
make docker-clean       # Clean up resources
make docker-reset       # Reset all data (WARNING: destroys data)
```

## Why This Template?

This template was created to provide a modern, production-ready foundation for TypeScript projects with:

- **Zero Configuration**: Everything works out of the box
- **Best Practices**: Industry-standard tooling and workflows
- **Developer Experience**: Fast feedback loops and automated quality checks
- **Scalability**: Monorepo structure that grows with your project
- **Modern Tooling**: Latest versions of all tools with optimal configurations

## Resources

- [Turborepo Documentation](https://turborepo.com/docs)
- [Biome Documentation](https://biomejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Lefthook Documentation](https://github.com/evilmartians/lefthook)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)

## License

This template is open source and available under the [MIT License](LICENSE).
