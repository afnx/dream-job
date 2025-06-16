/**
 * Abstract parent class for AI clients.
 */
class AIClient {
  /**
   * Constructor for AIClient.
   * @param {object} config - Configuration object for the AI client.
   */
  constructor(config) {
    if (!config) {
      throw new Error("AIClient requires a configuration object.");
    }
    this.config = config;
  }

  /**
   * Extracts job query details from user input.
   * @param {string} userInput - The user's input string.
   * @returns {Promise<object>} - Extracted details.
   */
  async extractJobQueryDetails(userInput) {
    throw new Error("Not implemented");
  }

  /**
   * Ranks job listings based on the user query.
   * @param {object} userQuery - The user's query object.
   * @param {Array} jobListings - Array of job listings to rank.
   * @returns {Promise<Array>} - Ranked job listings.
   */
  async rankJobListings(userQuery, jobListings) {
    throw new Error("Not implemented");
  }
}

module.exports = AIClient;
