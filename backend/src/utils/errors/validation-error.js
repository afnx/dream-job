const AppError = require('./app-error');

/**
 * Represents a validation error containing multiple field-specific errors.
 *
 * @class
 * @extends AppError
 *
 * @param {Array<{type: string, field: string, message: string}>} errors - 
 *   An array of validation error objects, each containing:
 *   - type: The type/category of the validation error.
 *   - field: The name of the field that failed validation.
 *   - message: A descriptive error message.
 *
 * @throws {Error} If the errors array is not properly structured.
 *
 * @property {Array<{type: string, field: string, message: string}>} errors - 
 *   The array of validation error details.
 */
class ValidationError extends AppError {
    constructor(errors) {
        super('VALIDATION_ERROR', 'Validation failed', null, 422);
        // Validate structure
        if (!Array.isArray(errors) || !errors.every(
            e => e && typeof e.type === 'string' && typeof e.field === 'string' && typeof e.message === 'string'
        )) {
            throw new Error('Each validation error must have type, field, and message');
        }
        this.errors = errors;
    }
}

module.exports = ValidationError;