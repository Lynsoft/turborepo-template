# ----------------------
#  Dependencies stage
# ----------------------
FROM node:22-alpine AS deps

WORKDIR /app

# Install pnpm globally with specific version
RUN npm install -g pnpm@10.14.0

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S worker -u 1001

# Copy package files for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json biome.json ./

# Copy package.json files from all workspaces for proper dependency resolution
COPY packages/*/package.json ./packages/*/
COPY apps/*/package.json ./apps/*/ 2>/dev/null || true

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile || pnpm install

# ----------------------
#  Build stage
# ----------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S worker -u 1001

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/turbo.json ./turbo.json
COPY --from=deps /app/biome.json ./biome.json

# Copy source code and configuration files
COPY packages ./packages
COPY apps ./apps
COPY tsconfig.json ./tsconfig.json 2>/dev/null || true

# Build all packages and apps using Turborepo
RUN pnpm turbo build

# ----------------------
#  Production stage
# ----------------------
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Install pnpm in runtime (needed for running the app)
RUN npm install -g pnpm@10.14.0

# Create same non-root user in runtime
RUN addgroup -g 1001 -S nodejs && \
    adduser -S worker -u 1001

# Copy package.json files for runtime
COPY package.json pnpm-workspace.yaml ./
COPY --from=builder /app/turbo.json ./turbo.json

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Copy built packages (dist folders)
COPY --from=builder /app/packages/*/dist ./packages/*/dist/ 2>/dev/null || true
COPY --from=builder /app/packages/*/package.json ./packages/*/

# Copy built apps (dist, .next, or build folders)
COPY --from=builder /app/apps/*/.next ./apps/*/.next/ 2>/dev/null || true
COPY --from=builder /app/apps/*/dist ./apps/*/dist/ 2>/dev/null || true
COPY --from=builder /app/apps/*/build ./apps/*/build/ 2>/dev/null || true
COPY --from=builder /app/apps/*/package.json ./apps/*/ 2>/dev/null || true

# Copy any additional runtime files
COPY --from=builder /app/apps/*/public ./apps/*/public/ 2>/dev/null || true

# Add health check (customize the endpoint based on your app)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

# Expose port (adjust based on your app)
EXPOSE 3000

# Change to non-root user
USER worker

# Start the application (customize based on your main app)
# For Next.js apps: CMD ["pnpm", "start"]
# For Node.js apps: CMD ["node", "apps/api/dist/index.js"]
# For now, using a generic start command
CMD ["pnpm", "start"]
