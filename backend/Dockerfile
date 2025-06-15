# Use the latest stable Node.js version
# Use the official Node.js image as a base image
FROM node:lts-bookworm-slim

# Create app directory
WORKDIR /app

# Install netcat for healthcheck in entrypoint.sh
# and openssl for certificate generation
RUN apt-get update && apt-get install -y netcat-openbsd openssl

# Copy package files and install dependencies
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the source code
COPY . .

# Ensure the entrypoint script is executable
# This script is used to start the server
RUN chmod +x ./entrypoint.sh

# Start the server using the entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
