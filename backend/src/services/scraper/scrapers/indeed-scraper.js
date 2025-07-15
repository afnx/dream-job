const BaseScraper = require('./base-scraper');
const { ERROR_TYPES, ScraperServiceError } = require('../../../utils/errors');

class IndeedScraper extends BaseScraper {
    constructor(options = {}) {
        super(options);
        this.baseUrl = 'https://www.indeed.com/jobs';
    }

    async scrape(query) {
        // TODO: IndeedScraper gets blocked by Cloudflare, implement a workaround
        throw new ScraperServiceError(
            ERROR_TYPES.SCRAPER_NOT_FOUND,
            'IndeedScraper is currently blocked by Cloudflare, scraping is not available.',
            503,
        );
    }

    buildUrl(query) {
        const params = new URLSearchParams({
            q: query.keywords || '',
            l: query.location || '',
            start: query.page * 10 || 0,
        });

        return `${this.baseUrl}?${params.toString()}`;
    }
}

module.exports = IndeedScraper;