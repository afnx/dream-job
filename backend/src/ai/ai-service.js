const OpenAIClient = require("./openai-client");
const env = require("../config/env");

function getAIClient() {
    const provider = (env.ai.provider || "").toLowerCase();

    switch (provider) {
        case "openai":
            return new OpenAIClient();
        default:
            throw new Error(`Unsupported AI provider: ${provider}`);
    }
}

module.exports = { getAIClient };
