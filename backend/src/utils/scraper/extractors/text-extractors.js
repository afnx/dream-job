/**
 * Extracts salary information from text
 * @param {string} text - Text to search
 * @returns {string} Salary string or empty string
 */
function extractSalary(text) {
    if (!text) return '';
    const match = text.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*\/\s*\w+)?/);
    return match ? match[0] : '';
}

/**
 * Extracts job type from text
 * @param {string} text - Text to search
 * @returns {string} Job type or empty string
 */
function extractJobType(text) {
    if (!text) return '';
    const match = text.match(/(full|part)-time/i);
    return match ? match[0].toLowerCase() : '';
}

/**
 * Determines remote work option from location text
 * @param {string} locationText - Location description
 * @returns {string} 'remote', 'hybrid', or 'onsite'
 */
function determineRemoteOption(locationText) {
    if (!locationText) return 'onsite';
    
    if (/remote/i.test(locationText)) return 'remote';
    if (/hybrid/i.test(locationText)) return 'hybrid';
    return 'onsite';
}

module.exports = {
    extractSalary,
    extractJobType,
    determineRemoteOption
};