const ValidationError = require('./validation-error');
const AppError = require('./app-error');
const AIServiceError = require('./ai-service-error');

/**
 * Enum for standardized error types used throughout the application.
 *
 * @readonly
 * @enum {string}
 *
 * @property {string} REQUIRED_FIELD - A required field is missing.
 * @property {string} INVALID_FORMAT - The provided value does not match the expected format.
 * @property {string} VALUE_TOO_SHORT - The value is shorter than the minimum allowed length.
 * @property {string} VALUE_TOO_LONG - The value exceeds the maximum allowed length.
 * @property {string} INVALID_VALUE - The value provided is invalid.
 * @property {string} VALUE_NOT_ALLOWED - The value is not permitted.
 * @property {string} VALUE_NOT_UNIQUE - The value must be unique but is duplicated.
 * @property {string} OUT_OF_RANGE - The value is outside the allowed range.
 * @property {string} MISMATCH - The values do not match as required.
 *
 * @property {string} AUTH_REQUIRED - Authentication is required.
 * @property {string} INVALID_CREDENTIALS - Provided credentials are invalid.
 * @property {string} FORBIDDEN - The action is forbidden.
 * @property {string} TOKEN_EXPIRED - The authentication token has expired.
 * @property {string} TOKEN_INVALID - The authentication token is invalid.
 *
 * @property {string} NOT_FOUND - The requested resource was not found.
 * @property {string} ALREADY_EXISTS - The resource already exists.
 * @property {string} CONFLICT - There is a conflict with the current state of the resource.
 * @property {string} DEPENDENCY_ERROR - There is a problem with a dependent resource.
 *
 * @property {string} RATE_LIMIT_EXCEEDED - The rate limit has been exceeded.
 * @property {string} QUOTA_EXCEEDED - The quota has been exceeded.
 *
 * @property {string} EXTERNAL_SERVICE_ERROR - An error occurred with an external service.
 * @property {string} DATABASE_ERROR - A database error occurred.
 * @property {string} TIMEOUT - The operation timed out.
 * @property {string} NETWORK_ERROR - A network error occurred.
 *
 * @property {string} BAD_REQUEST - The request is malformed or invalid.
 * @property {string} UNSUPPORTED_OPERATION - The operation is not supported.
 * @property {string} NOT_IMPLEMENTED - The operation is not implemented.
 * @property {string} INTERNAL_SERVER_ERROR - An internal server error occurred.
 */
const ERROR_TYPES = {
    // Validation errors
    REQUIRED_FIELD: 'REQUIRED_FIELD',
    INVALID_FORMAT: 'INVALID_FORMAT',
    VALUE_TOO_SHORT: 'TOO_SHORT',
    VALUE_TOO_LONG: 'TOO_LONG',
    INVALID_VALUE: 'INVALID_VALUE',
    VALUE_NOT_ALLOWED: 'VALUE_NOT_ALLOWED',
    VALUE_NOT_UNIQUE: 'VALUE_NOT_UNIQUE',
    OUT_OF_RANGE: 'OUT_OF_RANGE',
    MISMATCH: 'MISMATCH',

    // Authentication & Authorization
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',

    // Resource errors
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    CONFLICT: 'CONFLICT',
    DEPENDENCY_ERROR: 'DEPENDENCY_ERROR',

    // Rate limiting & quota
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',

    // External & system errors
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    TIMEOUT: 'TIMEOUT',
    NETWORK_ERROR: 'NETWORK_ERROR',
    EXTERNAL_SERVICE_UNAVAILABLE: 'EXTERNAL_SERVICE_UNAVAILABLE',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    BAD_GATEWAY: 'BAD_GATEWAY',
    GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
    PARSE_ERROR: 'PARSE_ERROR',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    REQUEST_FAILED: 'REQUEST_FAILED',
    CONNECTION_REFUSED: 'CONNECTION_REFUSED',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    UNAUTHORIZED: 'UNAUTHORIZED',

    // AI-specific errors
    AI_MODEL_NOT_FOUND: 'AI_MODEL_NOT_FOUND',
    AI_INVALID_API_KEY: 'AI_INVALID_API_KEY',
    AI_CONTEXT_LENGTH_EXCEEDED: 'AI_CONTEXT_LENGTH_EXCEEDED',
    AI_INVALID_JOB_LISTINGS: 'AI_INVALID_JOB_LISTINGS',
    AI_INVALID_JSON: 'AI_INVALID_JSON',
    AI_INVALID_INPUT: 'AI_INVALID_INPUT',
    AI_CONFIG_ERROR: 'AI_CONFIG_ERROR',

    // General
    BAD_REQUEST: 'BAD_REQUEST',
    UNSUPPORTED_OPERATION: 'UNSUPPORTED_OPERATION',
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    CONFIG_ERROR: 'CONFIG_ERROR',
    UNSUPPORTED_PROVIDER: 'UNSUPPORTED_PROVIDER',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

module.exports = {
    ValidationError,
    AppError,
    AIServiceError,
    ERROR_TYPES
};