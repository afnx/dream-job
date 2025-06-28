const JobRepository = require('../../repositories/job-repository');
const AIService = require('../ai/ai-service');
const { normalizedJobQuery } = require('../../utils/normalizers');
const { AppError, ERROR_TYPES } = require('../../utils/errors');

/**
 * Service class for handling job operations.
 * Utilizes AI to extract and normalize job queries, and interacts with the job repository to fetch job listings.
 *
 * @class
 * @param {Object} aiConfig - Configuration object for the AI service, including provider details.
 * 
 * @property {JobRepository} jobRepository - Repository for job data access.
 * @property {AIService} aiService - Service for AI-powered operations.
 */
class JobService {
    constructor(aiConfig) {
        this.jobRepository = new JobRepository();
        this.aiService = new AIService(aiConfig);
    }

    /**
     * Searches for jobs based on the provided input using AI-powered query extraction and normalization.
     *
     * This method performs the following steps:
     * 1. Uses an AI client to extract job query details from the input.
     * 2. Normalizes the extracted job query.
     * 3. Searches for jobs in the repository using the normalized query.
     * 4. (Planned) Scrapes jobs if no results are found.
     * 5. (Planned) Ranks the job listings using AI.
     *
     * @async
     * @param {string} input - The raw input string containing job search criteria.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of job objects. Returns an empty array if no jobs are found.
     * @throws {Error} If the AI fails to extract a valid job query or if the search process encounters an error.
     */
    async searchJobs(input) {
        try {
            const aiClient = this.aiService.getAIClient();

            // Extract job query details using AI
            const aiResult = await aiClient.extractJobQueryDetails(input);

            if (!aiResult || !aiResult.query) {
                throw new AppError(ERROR_TYPES.BAD_REQUEST, 'AI did not return a valid job query');
            }

            // Normalize the job query
            const normalizedQuery = normalizedJobQuery(aiResult);

            // Search for jobs using the normalized query
            const jobs = await this.jobRepository.searchJobs(normalizedQuery);

            if (!jobs || jobs.length === 0) {
                // TODO: Implement logic to scrape jobs if no results found
            }

            // TODO: Rank the job listings using AI

            return jobs || [];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = JobService;