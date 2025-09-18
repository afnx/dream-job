const JobRepository = require('../../repositories/job-repository');
const AIService = require('../ai/ai-service');
const ScraperService = require('../scraper/scraper-service');
const { AppError, ERROR_TYPES } = require('../../utils/errors');
const JobQuerySchema = require('../../schemas/job-query.schema');
const JobSchema = require('../../schemas/job.schema');
const { normalizeJobData } = require('../../utils/normalizers');

/**
 * Service class for handling job operations.
 * Utilizes AI to extract and normalize job queries, and interacts with the job repository to fetch job listings.
 *
 * @class
 * @param {Object} aiConfig - Configuration object for the AI service, including provider details.
 * 
 * @property {JobRepository} jobRepository - Repository for job data access.
 * @property {AIService} aiService - Service for AI-powered operations.
 * @property {ScraperService} scraperService - Service for scraping job listings from external sources.
 */
class JobService {
    constructor(aiConfig) {
        this.jobRepository = new JobRepository();
        this.aiService = new AIService(aiConfig);
        this.scraperService = new ScraperService();
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
        const jobs = [];

        // Extract job query details using AI
        const aiClient = this.aiService.getAIClient();
        const aiResult = await aiClient.extractJobQueryDetails(input);

        if (!aiResult || !aiResult.query) {
            throw new AppError(ERROR_TYPES.BAD_REQUEST, 'AI did not return a valid job query');
        }

        // Validate and normalize the extracted job query
        const parsedQuery = JobQuerySchema.parse(aiResult);

        // Search for jobs in the repository
        const savedJobs = await this.jobRepository.searchJobs(parsedQuery);

        if (savedJobs && savedJobs.length) {
            jobs.push(...savedJobs);
        }

        // If not enough jobs found in the repository, scrape jobs from job boards
        if (jobs.length < 20) {
            const scrapedJobs = await this.scraperService.scrapeJobs({
                keywords: parsedQuery.keywords,
                location: parsedQuery.location,
                page: 0
            });

            if (scrapedJobs && scrapedJobs.length) {
                // Validate each scraped job against the JobSchema
                const parsedScrapedJobs = scrapedJobs
                    .map(job => {
                        try {
                            const normalized = normalizeJobData(job);
                            return JobSchema.parse(normalized);
                        } catch {
                            return null;
                        }
                    })
                    .filter(job => job !== null);

                // Save valid scraped jobs to the repository
                if (parsedScrapedJobs.length) {
                    await this.jobRepository.createJobs(parsedScrapedJobs);
                    jobs.push(...parsedScrapedJobs);
                }
            }
        }

        return jobs || [];
    }
}

module.exports = JobService;