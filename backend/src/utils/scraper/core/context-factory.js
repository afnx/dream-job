const { getRandomAgentProfile } = require('../user-agents');

/**
 * Creates a new browser context with stealth settings to evade detection.
 *
 * @async
 * @param {import('playwright').Browser} browser - The Playwright browser instance.
 * @param {Object} [options={}] - Optional configuration.
 * @param {boolean} [options.isMobile=false] - Whether to use a mobile agent profile.
 * @param {Object} [options.contextOptions] - Additional options for browser.newContext().
 * @param {Object} [options.extraHeaders] - Extra HTTP headers to set.
 * @returns {Promise<import('playwright').BrowserContext>} The configured browser context.
 */
async function createStealthContext(browser, options = {}) {
    const agentProfile = getRandomAgentProfile({
        isMobile: options.isMobile || false
    });

    const context = await browser.newContext({
        userAgent: agentProfile.userAgent,
        viewport: agentProfile.viewport || { width: 1280, height: 800 },
        isMobile: agentProfile.isMobile || false,
        timezoneId: agentProfile.timezoneId,
        locale: agentProfile.locale,
        ...options.contextOptions
    });

    await context.setExtraHTTPHeaders({
        'User-Agent': agentProfile.userAgent,
        'Accept-Language': agentProfile.locale + ',en;q=0.9',
        ...options.extraHeaders
    });

    // Anti-detection script
    await context.addInitScript((profile) => {
        Object.defineProperty(navigator, 'platform', { get: () => profile.platform });
        Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 });
        Object.defineProperty(navigator, 'doNotTrack', { get: () => '1' });
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    }, agentProfile);

    return context;
}

module.exports = { createStealthContext };