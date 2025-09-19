const { OpenAI } = require("openai");
const { zodTextFormat } = require("openai/helpers/zod");

const AIClient = require("./ai-client");
const { AIServiceError, ERROR_TYPES } = require("../../utils/errors");
const mapOpenAIError = require("../../utils/errors/ai-error-mappers/openai");
const JobQuerySchema = require("../../schemas/job-query.schema");


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
            const response = await this.openai.responses.parse({
                model: this.model,
                max_output_tokens: 10000,
                input: [
                    {
                        role: "system",
                        content: "Extract the job information."
                    },
                    {
                        role: "user",
                        content: `${userInput}`,
                    },
                ],
                text: {
                    format: zodTextFormat(JobQuerySchema, "jobQuery"),
                },
            });

            const jobQueryDetails = response.output_parsed;
            return jobQueryDetails;
        } catch (error) {
            throw mapOpenAIError(error, this.config, 'Failed to extract job query details');
        }
    }

    async rankJobListings(_userInput, _jobListings) {
        // TODO: Implement ranking logic using OpenAI
        throw new AIServiceError(
            ERROR_TYPES.NOT_IMPLEMENTED,
            'Job ranking is not yet implemented for OpenAIClient.',
            501
        );
    }
}

module.exports = OpenAIClient;
