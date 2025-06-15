const dotenv = require('dotenv');
dotenv.config();

// Load environment variables from .env file
const envVars = process.env;

// Check if required environment variables are set
if (!envVars) {
    throw new Error('Environment variables could not be loaded.');
}

module.exports = {
    // Project Configuration
    env: envVars.ENV,

    // Backend Configuration
    port: envVars.NODE_PORT,
    host: envVars.NODE_HOST,
    apiPrefix: envVars.NODE_API_PREFIX,
    apiVersion: envVars.NODE_API_VERSION,
    apiBaseUrl: envVars.NODE_API_BASE_URL,

    // Database Configuration
    database: {
        host: envVars.DATABASE_HOST,
        port: parseInt(envVars.DATABASE_PORT),
        user: envVars.DATABASE_USER,
        password: envVars.DATABASE_PASSWORD,
        name: envVars.DATABASE_NAME,
        url: envVars.DATABASE_URL
    },

    // AI Configuration
    ai: {
        provider: envVars.AI_PROVIDER,
        apiKey: envVars.AI_API_KEY,
        model: envVars.AI_MODEL
    },

    // Frontend Configuration
    frontend: {
        port: parseInt(envVars.REACT_PORT),
        host: envVars.REACT_HOST,
        url: envVars.REACT_APP_URL
    }
};