const { extractText, extractHTML, extractLink, findTextByCondition } = require('../extractors/content-extractors');
const { parseRelativeDate } = require('../extractors/date-extractors');
const { extractSalary, extractJobType, determineRemoteOption } = require('../extractors/text-extractors');

/**
 * Injects all utility functions into the page context
 * @param {import('playwright').Page} page - The Playwright page instance
 */
async function injectPageUtilities(page) {
    await page.addInitScript(
        `
        // Inject all utility functions into window object
        window.extractText = (${extractText.toString()});
        window.extractHTML = (${extractHTML.toString()});
        window.extractLink = (${extractLink.toString()});
        window.findTextByCondition = (${findTextByCondition.toString()});
        window.extractSalary = (${extractSalary.toString()});
        window.extractJobType = (${extractJobType.toString()});
        window.determineRemoteOption = (${determineRemoteOption.toString()});
        window.parseRelativeDate = (${parseRelativeDate.toString()});
        `
    );
}

module.exports = {
    extractText,
    extractHTML,
    extractLink,
    findTextByCondition,
    extractSalary,
    extractJobType,
    determineRemoteOption,
    parseRelativeDate,
    injectPageUtilities
};