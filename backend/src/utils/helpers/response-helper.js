/**
 * Sends a successful JSON response.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {Object} [data={}] - The data to send in the response.
 * @param {string} [message=''] - Optional message to include in the response.
 * @param {Object} [meta={}] - Optional metadata to include in the response.
 * @returns {void}
 */
exports.success = (res, data = {}, message = '', meta = {}) => {
    res.status(200).json({
        success: true,
        data,
        meta,
        message
    });
};


/**
 * Sends an error JSON response.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {Array} [errors=[]] - Array of error details.
 * @param {string} [message='An error occurred'] - Error message to include in the response.
 * @param {number} [status=400] - HTTP status code for the response.
 * @returns {void}
 */
exports.error = (res, errors = [], message = 'An error occurred', status = 400) => {
    res.status(status).json({
        success: false,
        errors,
        message
    });
};