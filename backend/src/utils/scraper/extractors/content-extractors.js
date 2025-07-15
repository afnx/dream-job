/**
 * Extracts text content from DOM elements using selector
 * @param {Element} container - DOM container element
 * @param {string} selector - CSS selector
 * @param {Function} [transformer] - Optional text transformer function
 * @returns {string} Extracted text
 */
function extractText(container, selector, transformer = null) {
    const element = container.querySelector(selector);
    if (!element) return '';

    const text = element.textContent?.trim() || '';
    return transformer ? transformer(text) : text;
}

/**
 * Extracts HTML content from DOM element
 * @param {Element} container - DOM container element
 * @param {string} selector - CSS selector
 * @returns {string} HTML content
 */
function extractHTML(container, selector) {
    const element = container.querySelector(selector);
    return element?.innerHTML?.trim() || '';
}

/**
 * Extracts href attribute from link element
 * @param {Element} container - DOM container element
 * @param {string} selector - CSS selector for link
 * @returns {string} URL or empty string
 */
function extractLink(container, selector) {
    const element = container.querySelector(selector);
    return element?.href || '';
}

/**
 * Finds text in multiple elements that matches a condition
 * @param {Element} container - DOM container element
 * @param {string} selector - CSS selector
 * @param {Function} condition - Function to test text content
 * @returns {string} First matching text or empty string
 */
function findTextByCondition(container, selector, condition) {
    const elements = Array.from(container.querySelectorAll(selector));
    for (const element of elements) {
        const text = element.textContent?.trim() || '';
        if (condition(text)) return text;
    }
    return '';
}

module.exports = {
    extractText,
    extractHTML,
    extractLink,
    findTextByCondition
};