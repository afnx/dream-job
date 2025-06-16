const OpenAIClient = require("./openai-client");


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
            throw new Error("AIService is not configured properly. Please provide a provider.");
        }
        this.config = config;
        this.aiProvider = (this.config.provider || "").toLowerCase();
    }

    getAIClient() {
        switch (this.aiProvider) {
            case "openai":
                return new OpenAIClient(this.config);
            default:
                throw new Error(`Unsupported AI provider: ${this.aiProvider}`);
        }
    }

}

module.exports = AIService;
