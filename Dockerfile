# Use the latest stable Node.js version
# Use the official Node.js image as a base image
FROM node:22.14

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
