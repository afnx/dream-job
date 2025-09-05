const AppError = require('./app-error');

/**
 * Represents an error specific to Auth service operations.
 *
 * @class
 * @extends AppError
 * @param {string} type - The type or category of the Auth service error.
 * @param {string} message - A descriptive error message.
 * @param {number} [status=500] - The HTTP status code associated with the error.
 */
class AuthServiceError extends AppError {
    constructor(type, message, status = 500) {
        super(type, message, null, status);
    }
}

module.exports = AuthServiceError;