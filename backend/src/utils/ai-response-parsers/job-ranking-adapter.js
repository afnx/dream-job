const { parseOpenAIJobRanking } = require('./providers/openai');
const { AIServiceError, ERROR_TYPES } = require('../errors/index');

/**
 * Adapts the job ranking response from a specified AI provider.
 *
 * @param {object} response - The raw response from the AI provider.
 * @param {string} provider - The provider name (e.g., 'openai').
 * @returns {object} - Normalized job query details.
 * @throws {AIServiceError} - If the response cannot be adapted.
 */
function adaptJobRankingResponse(response, provider) {
    try {
        switch (provider) {
            case 'openai':
                return parseOpenAIJobRanking(response);
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

module.exports = adaptJobRankingResponse;