/**
 * Validates user input from request body
 * @param {Object} req - Express request object
 * @param {string} req.body.input - User input to validate
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Error response or calls next()
 */
exports.validateUserInput = (req, res, next) => {
    const { input } = req.body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
        return res.status(400).json({ error: 'Invalid input: must be a non-empty string.' });
    }

    if (input.length > 1000) {
        return res.status(400).json({ error: 'Input is too long. Please keep it under 1000 characters.' });
    }

    next();
}
