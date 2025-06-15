const express = require('express');

// Import the routes
const jobsRoutes = require('./jobs.route');

const router = express.Router();

// Define all routes
router.use('/jobs', jobsRoutes);

module.exports = router;