const crypto = require('crypto');

/**
 * Generates a HMAC SHA256 hash in base64 encoding.
 * @param {string} message - The message to hash.
 * @param {string} secret - The secret key.
 * @returns {string} The base64-encoded hash.
 */
function hmacSha256Base64(message, secret) {
    return crypto
        .createHmac('SHA256', secret)
        .update(message)
        .digest('base64');
}

/**
 * Generates a random password of given length.
 * @param {number} length - The length of the password.
 * @returns {string} The generated password.
 */
function generateRandomPassword(length = 16) {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Ensure at least one of each
    const password = [
        upper[Math.floor(Math.random() * upper.length)],
        lower[Math.floor(Math.random() * lower.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specials[Math.floor(Math.random() * specials.length)]
    ];

    const all = upper + lower + numbers + specials;
    for (let i = password.length; i < length; i++) {
        password.push(all[Math.floor(Math.random() * all.length)]);
    }

    // Shuffle password
    return password.sort(() => Math.random() - 0.5).join('');
}

module.exports = {
    hmacSha256Base64,
    generateRandomPassword,
};