const dotenv = require('dotenv');
dotenv.config();

// Load environment variables from .env file
const envVars = process.env;

// Check if required environment variables are set
if (!envVars) {
    throw new Error('Environment variables could not be loaded.');
}

module.exports = {
    // The current environment (e.g., 'dev', 'prod')
    env: envVars.ENV || 'dev',
    // The port number the application will listen on
    port: envVars.NODE_PORT || 5000,
};