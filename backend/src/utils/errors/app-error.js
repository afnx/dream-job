/**
 * Custom application error class for standardized error handling.
 *
 * @class
 * @extends Error
 *
 * @param {string} type - The type or category of the error.
 * @param {string} message - The error message.
 * @param {string|null} [field=null] - The specific field related to the error, if applicable.
 * @param {number} [status=400] - The HTTP status code associated with the error.
 */
class AppError extends Error {
    constructor(type, message, field = null, status = 400) {
        super(message);
        this.type = type;
        this.field = field;
        this.status = status;
    }
}

module.exports = AppError;
