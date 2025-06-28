const { parseOpenAIJobQuery } = require('./providers/openai');
const { AIServiceError, ERROR_TYPES } = require('../errors/index');

/**
 * Adapts any AI provider's response to the unified job query format.
 * @param {object} response - The raw response from the AI provider.
 * @param {string} provider - The provider name (e.g., 'openai').
 * @returns {object} - Normalized job query details.
 * @throws {AIServiceError} - If the response cannot be adapted.
 */
function adaptJobQueryResponse(response, provider) {
    try {
        switch (provider) {
            case 'openai':
                return parseOpenAIJobQuery(response);
            default:
                throw new AIServiceError(
                    ERROR_TYPES.UNSUPPORTED_PROVIDER,
                    `Provider "${provider}" is not supported.`,
                    500
                );
        }
    } catch (err) {
        throw new AIServiceError(
            ERROR_TYPES.INVALID_RESPONSE,
            err.message,
            502
        );
    }
}

module.exports = adaptJobQueryResponse;