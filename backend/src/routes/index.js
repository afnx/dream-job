const express = require('express');
const config = require('../config/env');
const { authenticate } = require('../middleware/authenticate');

// Import the routes
const jobsRoutes = require('./jobs.route');
const authRoutes = require('./auth.route');

const router = express.Router();

// Define all routes
if (config.auth.provider && config.auth.provider !== 'none') {
    router.use('/auth', authRoutes);
    router.use('/jobs', authenticate, jobsRoutes);
} else {
    router.use('/jobs', jobsRoutes);
}

module.exports = router;