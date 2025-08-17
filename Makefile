# Turborepo Makefile
# Common development tasks

.PHONY: help install dev build lint format test clean setup docker-up docker-down

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development
install: ## Install dependencies
	pnpm install

dev: ## Start development servers
	pnpm dev

build: ## Build all packages and apps
	pnpm build

# Code Quality
lint: ## Run linting
	pnpm lint

format: ## Format code
	pnpm format

check: ## Run Biome check (lint + format)
	pnpm check

check-fix: ## Run Biome check with auto-fix
	pnpm check:fix

test: ## Run tests
	pnpm test

# Git Hooks
hooks-install: ## Install git hooks
	pnpm hooks:install

hooks-test: ## Test git hooks
	pnpm hooks:test

# Cleanup
clean: ## Clean build artifacts and node_modules
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/.next
	rm -rf apps/*/dist
	rm -rf packages/*/dist
	rm -rf .turbo

# Setup
setup: install hooks-install ## Complete project setup
	@echo "✅ Project setup complete!"

# Docker Development
docker-up: ## Start Docker services for development
	docker-compose up -d

docker-down: ## Stop Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-build: ## Build Docker images
	docker-compose build

docker-rebuild: ## Rebuild Docker images from scratch
	docker-compose build --no-cache

# Docker Production
docker-prod-up: ## Start Docker services for production
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

docker-prod-down: ## Stop production Docker services
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

docker-prod-build: ## Build production Docker images
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

docker-prod-logs: ## View production Docker logs
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# Docker Utilities
docker-clean: ## Clean up Docker resources
	docker system prune -f
	docker volume prune -f

docker-reset: ## Reset all Docker data (WARNING: destroys all data)
	docker-compose down -v
	docker system prune -af
	docker volume prune -f

# Release
release: ## Create a release
	pnpm release

release-dry: ## Dry run release
	pnpm release:dry
