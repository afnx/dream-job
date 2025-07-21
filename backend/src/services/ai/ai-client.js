const { AIServiceError, ERROR_TYPES } = require("../../utils/errors");

/**
 * AIClient is an abstract base class for AI-powered job query and ranking services.
 * It provides the interface for extracting job query details from user input and ranking job listings.
 * 
 * @class
 * @param {object} config - Configuration object for the AI client.
 */
class AIClient {
  constructor(config) {
    if (!config) {
      throw new AIServiceError(ERROR_TYPES.CONFIG_ERROR, "AIClient requires a configuration object.", 500);
    }
    this.config = config;
  }

  /**
   * Extracts job query details from user input.
   * @param {string} userInput - The user's input string.
   * @returns {Promise<object>} - Extracted details.
   */
  async extractJobQueryDetails(_userInput) {
    throw new AIServiceError(ERROR_TYPES.NOT_IMPLEMENTED, "extractJobQueryDetails() not implemented.", 501);
  }

  /**
   * Ranks job listings based on the user query.
   * @param {object} userQuery - The user's query object.
   * @param {Array} jobListings - Array of job listings to rank.
   * @returns {Promise<Array>} - Ranked job listings.
   */
  async rankJobListings(_userQuery, _jobListings) {
    throw new AIServiceError(ERROR_TYPES.NOT_IMPLEMENTED, "rankJobListings() not implemented.", 501);
  }
}

module.exports = AIClient;
