/**
 * Parses relative date strings to ISO dates
 * @param {string} text - Text containing date information
 * @returns {string} ISO date string or empty string
 */
function parseRelativeDate(text) {
    if (!text) return '';

    // "Posted X days ago"
    let match = text.match(/Posted\s*(\d+)\s*days?\s*ago/i);
    if (match) {
        const daysAgo = parseInt(match[1], 10);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString();
    }

    // "Posted today"
    if (/Posted\s*today/i.test(text)) {
        return new Date().toISOString();
    }

    // "Posted yesterday"
    if (/Posted\s*yesterday/i.test(text)) {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString();
    }

    // "Original Posting: May 23, 2025"
    match = text.match(/Original Posting:\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i);
    if (match) {
        return new Date(match[1].trim()).toISOString();
    }

    return '';
}

module.exports = {
    parseRelativeDate
};