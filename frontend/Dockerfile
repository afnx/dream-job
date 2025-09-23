FROM node:lts-alpine AS base

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl libc6-compat

# Install all dependencies for development/build
FROM base AS deps-dev

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

# Install only production dependencies
FROM base AS deps-prod

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

# Development stage
FROM base AS dev

ENV NODE_ENV=development

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "dev"]

# Build stage (for production)
FROM base AS build

ENV NODE_ENV=production

COPY --from=deps-prod /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production stage
FROM base AS prod

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/package*.json ./
COPY --from=deps-prod /app/node_modules ./node_modules

RUN chown -R nextjs:nodejs ./node_modules

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=1m --timeout=5s --start-period=1m --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

CMD ["npm", "start"]