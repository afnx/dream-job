const { OpenAI } = require("openai");
const AIClient = require("./ai-client");
const { AIServiceError, ERROR_TYPES } = require("../../utils/errors");
const mapOpenAIError = require("../../utils/errors/ai-error-mappers/openai");
const adaptJobQueryResponse = require('../../utils/ai-response-parsers/job-query-adapter');
const adaptJobRankingResponse = require('../../utils/ai-response-parsers/job-ranking-adapter');


/**
 * OpenClient Service for interacting with OpenAI's API.
 * 
 * @class
 * @param {object} config - Configuration specific to OpenAI (e.g., apiKey, model).
 * @param {string} config.apiKey - The API key for OpenAI.
 * @param {string} config.model - The model to use for OpenAI requests (e.g., "gpt-3.5-turbo").
 */
class OpenAIClient extends AIClient {
    constructor(config) {
        super(config);
        if (!config || !config.apiKey || !config.model) {
            throw new AIServiceError(
                ERROR_TYPES.CONFIG_ERROR,
                'OpenAIClient is not configured properly. Please provide apiKey and model.',
                500
            );
        }

        this.model = config.model;
        this.openai = new OpenAI({
            apiKey: config.apiKey,
        });

    }

    async extractJobQueryDetails(userInput) {
        try {
            const prompt = `Extract the job title keywords, location, experience, salary, job type, and work preferences from this user input:
            "${userInput}"
            Return in JSON format:
            {
                "keywords": [...], // Array of keywords related to the job title
                "location": "...", // Location for the job search (e.g., "New York", "San Francisco, CA", "California", "remote", or null if not specified)
                "experience": "...", // Experience level (e.g., "entry-level", "mid-level", "senior-level", or null if not specified)
                "salaryMin": ..., // Minimum salary expectation (e.g., 50000, or null if not specified)
                "salaryMax": ..., // Maximum salary expectation (e.g., 100000, or null if not specified)
                "salaryCurrency": "USD", // Currency for the salary (e.g., "USD", "EUR", or null if not specified)
                "jobType": "...", // Job type (e.g., "full-time", "part-time", "contract", "temporary", "internship", or null if not specified)
                "remoteOption": "...",  // Remote work options ("remote", "onsite", "hybrid", or null if not specified)
                "otherPreferences": [...] // Array of any other preferences or requirements
            }`;

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
                temperature: 0.3,
            });

            return adaptJobQueryResponse(response, 'openai');

        } catch (error) {
            throw mapOpenAIError(error, this.config, 'Failed to extract job query details');
        }
    }

    async rankJobListings(userInput, jobListings) {
        try {
            const prompt = `User input: "${userInput}"
                Here are job listings:
                ${JSON.stringify(jobListings, null, 2)}

                Rank them by best match. Return JSON like this:
                [
                {
                    "id": "job_123",
                    "ranking": 1,
                    "title": "...",
                    "company": "...",
                    "reason": "..."
                }
                ]`;

            const response = await this.openai.chat.completions.create({
                model: this.model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500,
                temperature: 0.3,
            });

            return adaptJobRankingResponse(response, 'openai');

        } catch (error) {
            throw mapOpenAIError(error, this.config, 'Failed to rank job listings');
        }
    }
}

module.exports = OpenAIClient;
