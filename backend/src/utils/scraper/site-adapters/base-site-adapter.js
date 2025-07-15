/**
 * Base class for site-specific scraping behaviors
 */
/**
 * Abstract base class for site-specific scraping adapters.
 * Provides a template for handling overlays, simulating activity,
 * waiting for job elements, and retrieving job element identifiers.
 *
 * @abstract
 * @class
 * @param {import('playwright').Page} page - Playwright page instance to operate on.
 * @param {Object} selectors - CSS selectors for locating job elements.
 */
class BaseSiteAdapter {
    /**
     * Creates an instance of the adapter with the provided Playwright page.
     * @param {import('playwright').Page} page - The Playwright page object to interact with.
     * @param {Object} selectors - CSS selectors for job elements.
     */
    constructor(page, selectors) {
        this.page = page;
        this.selectors = selectors;
    }

    /**
     * Handle site-specific modal dismissal or overlay removal
     * @abstract
     */
    async dismissOverlays() {
        throw new Error('dismissOverlays must be implemented by subclass');
    }

    /**
     * Simulate human-like activity on the page
     * @abstract
     */
    async simulateActivity() {
        throw new Error('simulateActivity must be implemented by subclass');
    }
    /**
     * Wait for job elements to appear
     * @abstract
     */
    async waitForJobElements() {
        throw new Error('waitForJobElements must be implemented by subclass');
    }

    /**
     * Get job element identifiers
     * @abstract
     */
    async getJobElementIds() {
        throw new Error('getJobElementIds must be implemented by subclass');
    }
}

module.exports = BaseSiteAdapter;