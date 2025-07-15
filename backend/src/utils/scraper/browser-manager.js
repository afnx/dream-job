const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();

let browserInstance = null;

// Configure stealth plugin to avoid detection
stealth.enabledEvasions.delete('iframe.contentWindow');
stealth.enabledEvasions.delete('media.codecs');
stealth.enabledEvasions.delete('user-agent-override');
chromium.use(stealth);


/**
 * Returns a singleton instance of a Chromium browser.
 * If the browser instance does not exist, it launches a new headless Chromium browser
 * with specific arguments for sandboxing.
 *
 * @async
 * @function
 * @returns {Promise<import('playwright').Browser>} The singleton Chromium browser instance.
 */
async function getBrowser() {
    if (!browserInstance) {
        browserInstance = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-features=IsolateOrigins,site-per-process',
                '--start-maximized',
            ]
        });
    }
    return browserInstance;
}

/**
 * Closes the current browser instance.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the browser has been closed.
 */
async function closeBrowser() {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
}

module.exports = { getBrowser, closeBrowser };
