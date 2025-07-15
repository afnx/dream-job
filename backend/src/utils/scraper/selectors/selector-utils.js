/**
 * Escapes CSS selector special characters
 * @param {string} selector - Selector to escape
 * @returns {string} Escaped selector
 */
function escapeCssSelector(selector) {
    return selector.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|/@])/g, '\\$1');
}

/**
 * Builds selector for element with specific ID
 * @param {string} id - Element ID
 * @param {string[]} tagNames - Possible tag names
 * @returns {string} CSS selector
 */
function buildIdSelector(id, tagNames = ['article', 'div']) {
    const safeId = escapeCssSelector(id);
    return tagNames.map(tag => `${tag}#${safeId}`).join(', ');
}

module.exports = {
    escapeCssSelector,
    buildIdSelector
};