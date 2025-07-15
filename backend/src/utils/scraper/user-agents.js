const userAgents = [
    {
        // Windows 11, Chrome 124 (latest stable as of mid-2025)
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.207 Safari/537.36',
        platform: 'Win32',
        locale: 'en-US',
        timezoneId: 'America/New_York',
        viewport: { width: 1366, height: 768 },
        isMobile: false
    },
    {
        // macOS Sonoma, Safari 17 (latest stable)
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
        platform: 'MacIntel',
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
        viewport: { width: 1440, height: 900 },
        isMobile: false
    },
    {
        // Android 14, Chrome 124 (latest stable), Pixel 8
        userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.207 Mobile Safari/537.36',
        platform: 'Linux armv8l',
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
        viewport: { width: 412, height: 915 },
        isMobile: true
    },
    {
        // iPhone 15 Pro, iOS 17, Safari
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        platform: 'iPhone',
        locale: 'en-US',
        timezoneId: 'America/New_York',
        viewport: { width: 390, height: 844 },
        isMobile: true
    }
];

/**
 * Returns a random user agent profile, optionally filtered by mobile or desktop.
 *
 * @function
 * @param {Object} [options] - Options for filtering.
 * @param {boolean} [options.isMobile] - If set, filters for mobile (true) or desktop (false) profiles.
 * @returns {Object} A randomly selected user agent profile.
 */
function getRandomAgentProfile(options = {}) {
    let filteredAgents = userAgents;
    if (typeof options.isMobile === 'boolean') {
        filteredAgents = userAgents.filter(agent => agent.isMobile === options.isMobile);
    }
    if (filteredAgents.length === 0) {
        throw new Error('No user agent profiles match the given filter.');
    }
    const randomIndex = Math.floor(Math.random() * filteredAgents.length);
    return filteredAgents[randomIndex];
}

module.exports = { getRandomAgentProfile };