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
        try {
            // Wait briefly to ensure any modals have time to appear
            await randomDelay(500, 1000);

            // Check if modal is present using multiple possible selectors
            const modalSelectors = [
                '[role="dialog"][aria-modal="true"]',
                '[data-zds-component="modal"]',
                '.bg-black.bg-opacity-50.fixed.inset-0',
                '[data-focus-lock-disabled="false"]'
            ];

            let modalFound = false;

            for (const selector of modalSelectors) {
                const modal = await this.page.$(selector);
                if (modal) {
                    modalFound = true;

                    // Try multiple dismiss strategies
                    // Press Escape key
                    await this.page.keyboard.press('Escape');
                    await randomDelay(300, 500);

                    // Check if modal is still there
                    const stillExists = await this.page.$(selector);
                    if (!stillExists) {
                        break;
                    }

                    // Click on backdrop (the semi-transparent overlay)
                    const backdrop = await this.page.$('.bg-black.bg-opacity-50.fixed.inset-0');
                    if (backdrop) {
                        // Get backdrop bounds and click outside the modal content
                        const backdropBox = await backdrop.boundingBox();
                        if (backdropBox) {
                            // Click in top-left corner of backdrop
                            await this.page.mouse.click(
                                backdropBox.x + 10,
                                backdropBox.y + 10
                            );
                            await randomDelay(300, 500);

                            const stillExists2 = await this.page.$(selector);
                            if (!stillExists2) {
                                break;
                            }
                        }
                    }

                    // Look for close button (X) - common patterns
                    const closeSelectors = [
                        'button[aria-label*="close"]',
                        'button[aria-label*="Close"]',
                        'button[title*="close"]',
                        'button[title*="Close"]',
                        '[data-testid*="close"]',
                        '.close',
                        '[aria-label="clear"]'
                    ];

                    for (const closeSelector of closeSelectors) {
                        const closeBtn = await modal.$(closeSelector);
                        if (closeBtn) {
                            await closeBtn.click();
                            await randomDelay(300, 500);

                            const stillExists3 = await this.page.$(selector);
                            if (!stillExists3) {
                                modalFound = false;
                                break;
                            }
                        }
                    }

                    if (!modalFound) break;

                    // Click outside modal content area
                    const modalContent = await modal.$('[role="dialog"]');
                    if (modalContent) {
                        const contentBox = await modalContent.boundingBox();

                        if (contentBox) {
                            // Click outside the modal content but within viewport
                            const outsideX = Math.max(10, contentBox.x - 50);
                            const outsideY = Math.max(10, contentBox.y - 50);

                            await this.page.mouse.click(outsideX, outsideY);
                            await randomDelay(300, 500);

                            const stillExists4 = await this.page.$(selector);
                            if (!stillExists4) {
                                break;
                            }
                        }
                    }

                    break; // Exit the selector loop if we found a modal
                }
            }

            // Add a small delay after dismissal
            await humanDelay('click');

        } catch {
            // Don't throw - continue with scraping even if overlay dismissal fails
        }
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