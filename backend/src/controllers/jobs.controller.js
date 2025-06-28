const JobService = require('../services/job/job-service');
const { AppError, ERROR_TYPES } = require('../utils/errors/index');
const { success } = require('../utils/helpers/response-helper');

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
            return AppError(
                res,
                ERROR_TYPES.NOT_FOUND,
                'No jobs found matching the search criteria.'
            );
        }

        return success(res, jobs);
    } catch (err) {
        next(err);
    }
};