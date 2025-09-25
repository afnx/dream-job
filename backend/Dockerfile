FROM node:lts-bookworm-slim AS base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  netcat-openbsd openssl curl \
  libglib2.0-0 libnspr4 libnss3 \
  libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libexpat1 libxcb1 libxkbcommon0 libatspi2.0-0 libx11-6 libxcomposite1 \
  libxdamage1 libxext6 libxfixes3 libxrandr2 libgbm1 libcairo2 \
  libpango-1.0-0 libasound2

# Install all dependencies for development/build
FROM base AS deps-dev

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

# Install Playwright and its dependencies
RUN npx playwright install --with-deps

# Install only production dependencies
FROM base AS deps-prod

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

# Install Playwright and its dependencies
RUN npx playwright install --with-deps

# Development stage
FROM base AS dev

ENV NODE_ENV=development

COPY --from=deps-dev /app/node_modules ./node_modules
COPY --from=deps-dev /root/.cache/ms-playwright /root/.cache/ms-playwright
COPY . .

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Production stage
FROM base AS prod

ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=deps-dev /root/.cache/ms-playwright /root/.cache/ms-playwright
COPY package*.json ./
COPY entrypoint.sh ./
COPY prisma ./prisma
COPY src ./src

RUN chown -R appuser:nodejs ./node_modules ./package*.json ./entrypoint.sh ./prisma ./src

RUN chmod +x ./entrypoint.sh

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=1m --timeout=5s --start-period=1m --retries=3 \
  CMD curl -f http://localhost:5000 || exit 1

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
