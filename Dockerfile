# Use the latest stable Node.js version
# Use the official Node.js image as a base image
FROM node:22.14

# Create app directory
WORKDIR /app

# Install netcat for healthcheck in entrypoint.sh
RUN apt-get update && apt-get install -y netcat-openbsd

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Ensure the entrypoint script is executable
# This script is used to start the server
RUN chmod +x ./entrypoint.sh

# Expose the port your app runs on
EXPOSE 5000

# Start the server using the entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
