/**
 * Parses OpenAI's response to the unified job query format.
 * @param {object} response
 * @returns {object}
 */
function parseOpenAIJobQuery(response) {
    if (!response?.choices?.[0]?.message?.content) {
        throw new Error('No content received');
    }

    const content = response.choices[0].message.content.trim();

    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Not a valid object');
    }

    return {
        keywords: parsed.keywords,
        location: parsed.location,
        experience: parsed.experience,
        salaryMin: parsed.salaryMin,
        salaryMax: parsed.salaryMax,
        salaryCurrency: parsed.salaryCurrency,
        jobType: parsed.jobType,
        remoteOption: parsed.remoteOption,
        otherPreferences: parsed.otherPreferences
    };
}

/**
 * Parses and sanitizes a job ranking response from the OpenAI API.
 *
 * @param {Object} response - The response object from OpenAI API.
 * @returns {Array<Object>} An array of sanitized job ranking objects, each containing:
 */
function parseOpenAIJobRanking(response) {
    if (!response?.choices?.[0]?.message?.content) {
        throw new Error('No content received');
    }

    const content = response.choices[0].message.content.trim();

    let parsed;
    try {
        parsed = JSON.parse(content);
    } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }

    // Validate parsed response is an array
    if (!Array.isArray(parsed)) {
        throw new Error('Not a valid array');
    }

    // Validate each ranking item and sanitize
    const sanitizedRankings = parsed
        .filter(item => item && typeof item === 'object')
        .map((item, index) => ({
            id: item.id || `unknown_${index}`,
            ranking: typeof item.ranking === 'number' ? item.ranking : index + 1,
            title: typeof item.title === 'string' ? item.title : 'Unknown Title',
            company: typeof item.company === 'string' ? item.company : 'Unknown Company',
            reason: typeof item.reason === 'string' ? item.reason : 'No reason provided'
        }));

    return sanitizedRankings;
}

module.exports = { parseOpenAIJobQuery, parseOpenAIJobRanking };