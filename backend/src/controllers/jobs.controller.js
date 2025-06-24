const JobService = require('../services/job/job-service');
const env = require('../config/env');

/**
 * Extracts job search criteria from user input and returns matching jobs
 * @param {Object} req - Express request object
 * @param {string} req.body.input - Natural language job search query
 * @param {Object} res - Express response object
 * @returns {Object} Job search results or error response
 */
exports.searchJobs = async (req, res) => {
    try {
        const { input } = req.body;

        const jobService = new JobService();
        const jobs = await jobService.searchJobs(input);

        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(404).json({ error: 'No jobs found matching the criteria.' });
        }

        res.status(200).json({ data: jobs });
    } catch (err) {
        console.error('Error in searching jobs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};