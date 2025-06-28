const { ERROR_TYPES, ValidationError } = require('../utils/errors/index');

/**
 * Validates user input from request body
 * @param {Object} req - Express request object
 * @param {string} req.body.input - User input to validate
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Error response or calls next()
 */
exports.validateUserInput = (req, res, next) => {
    const input = req.body?.input;
    const errors = [];

    if (typeof input !== 'string') {
        errors.push({
            type: ERROR_TYPES.INVALID_FORMAT,
            field: "input",
            message: 'Input must be a string.'
        });
    } else {
        const trimmedInput = input.trim();
        if (!trimmedInput) {
            errors.push({
                type: ERROR_TYPES.REQUIRED_FIELD,
                field: "input",
                message: 'Input cannot be empty.'
            });
        }
        if (trimmedInput.length > 0 && trimmedInput.length < 3) {
            errors.push({
                type: ERROR_TYPES.VALUE_TOO_SHORT,
                field: "input",
                message: 'Input must be at least 3 characters long.'
            });
        }
        if (trimmedInput.length > 1000) {
            errors.push({
                type: ERROR_TYPES.VALUE_TOO_LONG,
                field: "input",
                message: 'Input is too long. Please keep it under 1000 characters.'
            });
        }
    }

    if (errors.length) {
        return next(new ValidationError(errors));
    }
    next();
};
