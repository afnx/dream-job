# Use the latest stable Node.js version
# Use the official Node.js image as a base image
FROM node:lts-bookworm-slim

# Create app directory
WORKDIR /app

# Install netcat for healthcheck in entrypoint.sh
# and openssl for certificate generation
RUN apt-get update && apt-get install -y netcat-openbsd openssl

# Install necessary libraries for Puppeteer/Playwright
RUN apt-get update && apt-get install -y \
  libglib2.0-0 libnspr4 libnss3 \
  libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libexpat1 libxcb1 libxkbcommon0 libatspi2.0-0 libx11-6 libxcomposite1 \
  libxdamage1 libxext6 libxfixes3 libxrandr2 libgbm1 libcairo2 \
  libpango-1.0-0 libasound2

# Copy package files and install dependencies
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install

# Install Playwright and its dependencies
RUN npx playwright install --with-deps

# Copy the rest of the source code
COPY . .

# Ensure the entrypoint script is executable
# This script is used to start the server
RUN chmod +x ./entrypoint.sh

# Start the server using the entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
