const OpenAIClient = require("./openai-client");
const { ERROR_TYPES, AIServiceError } = require("../../utils/errors");

class AIService {
    /**
    * Service class for managing AI provider clients.
    *
    * @class
    * @param {Object} config - Configuration object for the AI service.
    * @param {string} config.provider - The name of the AI provider (e.g., "openai").
    */
    constructor(config) {
        if (!config || !config.provider) {
            throw new AIServiceError(
                ERROR_TYPES.CONFIG_ERROR,
                "AIService is not configured properly. Please provide a provider.",
                500
            );
        }
        this.config = config;
        this.aiProvider = (this.config.provider || "").toLowerCase();
    }

    /**
    * Get the appropriate AI client based on the configured provider
    * @returns {import('./ai-client')} The AI client instance
    */
    getAIClient() {
        switch (this.aiProvider) {
            case "openai":
                return new OpenAIClient(this.config);
            default:
                throw new AIServiceError(
                    ERROR_TYPES.UNSUPPORTED_PROVIDER,
                    `Unsupported AI provider: ${this.aiProvider}`,
                    400
                );
        }
    }

}

module.exports = AIService;
