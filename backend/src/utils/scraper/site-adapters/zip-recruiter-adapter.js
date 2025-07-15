const BaseSiteAdapter = require('./base-site-adapter');
const { randomDelay } = require('../core/timing-utils');
const { humanDelay } = require('../core/timing-utils');

/**
 * Adapter for scraping job data from ZipRecruiter using a Playwright page.
 *
 * @class
 * @extends BaseSiteAdapter
 * @param {import('playwright').Page} page - The Playwright page instance to operate on.
 *
 * @property {Object} selectors - CSS selectors for locating job cards, right pane, and job title.
 * @property {string} selectors.jobCards - Selector for job card elements.
 * @property {string} selectors.rightPane - Selector for the right pane element.
 * @property {string} selectors.title - Selector for the job title element.
 *
 * @method dismissOverlays - Dismisses ZipRecruiter-specific overlays by simulating a mouse click in a random corner.
 * @method simulateActivity - Simulates user activity by scrolling the page.
 * @method waitForJobCards - Waits for job card elements to appear on the page.
 * @method getJobCardIds - Retrieves the IDs of all job card elements on the page.
 */
class ZipRecruiterAdapter extends BaseSiteAdapter {
    constructor(page, selectors) {
        super(page, selectors);
    }

    async dismissOverlays() {
        // ZipRecruiter-specific modal dismissal by clicking in corner
        const corner = Math.random() > 0.5 ? 'right' : 'left';
        const viewportSize = this.page.viewportSize();
        const x = corner === 'right'
            ? Math.floor(viewportSize.width - Math.random() * 50 - 10)
            : Math.floor(Math.random() * 50 + 10);
        const y = Math.floor(Math.random() * 50 + 10);

        await this.page.mouse.move(x, y);
        await humanDelay('click');
        await this.page.mouse.down();
        await randomDelay(50, 150);
        await this.page.mouse.up();
        await humanDelay('click');
    }

    async simulateActivity() {
        // Move mouse to the middle of the right pane and scroll using mouse wheel
        await this.page.evaluate((selector) => {
            const pane = document.querySelector(selector);
            if (!pane) return null;
            const rect = pane.getBoundingClientRect();
            return {
                x: Math.floor(rect.left + rect.width / 2),
                y: Math.floor(rect.top + rect.height / 2)
            };
        }, this.selectors.rightPane).then(async (coords) => {
            if (coords) {
                await this.page.mouse.move(coords.x, coords.y);
                await this.page.mouse.wheel(0, 400); // scroll down
            }
        });
        await humanDelay('scroll');
    }

    async waitForJobElements() {
        return this.page.waitForSelector(this.selectors.jobCards, { timeout: 15000 });
    }

    async getJobElementIds() {
        return this.page.$$eval(this.selectors.jobCards, cards =>
            cards.map(card => card.id)
        );
    }
}

module.exports = ZipRecruiterAdapter;