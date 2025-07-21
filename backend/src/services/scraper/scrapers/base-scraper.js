const { ERROR_TYPES, ScraperServiceError } = require('../../../utils/errors');

class BaseScraper {
    /**
     * Abstract method to scrape data based on the provided query.
     * Subclasses must implement this method to perform data scraping.
     *
     * @param {Object} query - The query parameters for scraping data.
     * @throws {Error} Throws an error if not implemented by subclass.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of data objects.
     */
    async scrape(_query) {
        throw new ScraperServiceError(
            'scrape() must be implemented by subclass',
            ERROR_TYPES.NOT_IMPLEMENTED,
            501
        );
    }
}
module.exports = BaseScraper;