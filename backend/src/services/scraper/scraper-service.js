const { ERROR_TYPES, ScraperServiceError } = require('../../utils/errors');

/**
 * Service class for managing scraper modules.
 *
 * @class
 */
class ScraperService {
    /**
     * List of supported scraper names.
     * @type {Array<string>}
     */
    static SCRAPER_LIST = ['indeed', 'zip-recruiter'];

    /**
     * @param {Object} config - Configuration for scrapers.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Scrapes jobs using the provided query and list of scrapers.
     * If no scrapers are specified, uses all available scrapers.
     *
     * @param {Object} query - The job search query.
     * @param {Array<string>} [scrapers] - List of scraper names to use.
     * @returns {Promise<Array<Object>>} - Array of job results.
     */
    async scrapeJobs(query, scrapers = []) {
        const availableScrapers = ScraperService.SCRAPER_LIST;
        const selectedScrapers = scrapers.length > 0 ? scrapers : availableScrapers;
        const results = [];

        for (const scraperName of selectedScrapers) {
            try {
                const scraper = this.getScraper(scraperName);
                const jobs = await scraper.scrape(query);
                results.push(...jobs);
            } catch (err) {
                console.error(`Error scraping with ${scraperName}: ${err.message}`);
            }
        }

        return results;
    }

    /**
     * Returns an instance of a scraper based on the provided scraper type.
     *
     * @param {string} scraper - The type of scraper to instantiate (e.g., 'indeed', 'zip-recruiter').
     * @returns {import('./scrapers/base-scraper')} An instance of the requested scraper.
     * @throws {ScraperServiceError} If the scraper type is unknown.
     */
    getScraper(scraper) {
        if (!ScraperService.SCRAPER_LIST.includes(scraper)) {
            throw new ScraperServiceError(
                `Unknown scraper type: ${scraper}`,
                ERROR_TYPES.SCRAPER_NOT_FOUND
            );
        }

        // Convert scraper name to file path
        const scraperFile = `./scrapers/${scraper}-scraper`;
        const ScraperClass = require(scraperFile);
        return new ScraperClass(this.config);
    }
}

module.exports = ScraperService;