
/**
 * Waits for a random delay between the specified min and max milliseconds.
 *
 * @param {number} [min=500] - The minimum delay in milliseconds.
 * @param {number} [max=1500] - The maximum delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the random delay.
 */
function randomDelay(min = 500, max = 1500) {
    const delay = min + Math.random() * (max - min);
    return new Promise(resolve => setTimeout(resolve, delay));
}


/**
 * Returns a randomized delay (in milliseconds) based on the specified human-like action.
 *
 * @param {string} action - The type of action to simulate ('click', 'type', 'scroll', 'navigate').
 * @returns {Promise<void>} A promise that resolves after the random delay.
 */
function humanDelay(action) {
    const delays = {
        click: [100, 300],
        type: [50, 150],
        scroll: [200, 500],
        navigate: [1000, 3000]
    };

    const [min, max] = delays[action] || [200, 600];
    return randomDelay(min, max);
}

module.exports = {
    randomDelay,
    humanDelay
};