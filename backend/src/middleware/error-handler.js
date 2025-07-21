const { AppError, ValidationError, AIServiceError, ERROR_TYPES } = require('../utils/errors/index');
const { error: errorResponse } = require('../utils/helpers/response-helper');

module.exports = (err, req, res, _next) => {
    if (err instanceof ValidationError) {
        return errorResponse(res, err.errors, err.message, err.status);
    }
    if (err instanceof AppError) {
        return errorResponse(
            res,
            [{ type: err.type, message: err.message }],
            err.message,
            err.status
        );
    }
    if (err instanceof AIServiceError) {
        return errorResponse(
            res,
            [{ type: err.type, message: err.message }],
            err.message,
            err.status
        );
    }
    return errorResponse(
        res,
        [
            {
                type: err.type || ERROR_TYPES.INTERNAL_SERVER_ERROR,
                message: err.message || 'Internal server error'
            }
        ],
        'Internal server error',
        err.status || 500
    );
};