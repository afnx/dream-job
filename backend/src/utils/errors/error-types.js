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
 * @property {string} UNAUTHORIZED - The user is not authorized to perform this action.
 *
 * @property {string} NOT_FOUND - The requested resource was not found.
 * @property {string} ALREADY_EXISTS - The resource already exists.
 * @property {string} CONFLICT - There is a conflict with the current state of the resource.
 * @property {string} DEPENDENCY_ERROR - There is a problem with a dependent resource.
 *
 * @property {string} RATE_LIMIT_EXCEEDED - The rate limit has been exceeded.
 * @property {string} QUOTA_EXCEEDED - The quota has been exceeded.
 * @property {string} TOO_MANY_REQUESTS - Too many requests have been made in a short period.
 *
 * @property {string} EXTERNAL_SERVICE_ERROR - An error occurred with an external service.
 * @property {string} DATABASE_ERROR - A database error occurred.
 * @property {string} TIMEOUT - The operation timed out.
 * @property {string} NETWORK_ERROR - A network error occurred.
 * @property {string} EXTERNAL_SERVICE_UNAVAILABLE - The external service is unavailable.
 * @property {string} SERVICE_UNAVAILABLE - The service is currently unavailable.
 * @property {string} BAD_GATEWAY - Received an invalid response from the upstream server.
 * @property {string} GATEWAY_TIMEOUT - The gateway timed out while waiting for a response.
 * @property {string} PARSE_ERROR - Failed to parse the response or data.
 * @property {string} INVALID_RESPONSE - The response received is invalid.
 * @property {string} REQUEST_FAILED - The request to an external service failed.
 * @property {string} CONNECTION_REFUSED - The connection was refused by the server.
 *
 * @property {string} AI_MODEL_NOT_FOUND - The specified AI model was not found.
 * @property {string} AI_INVALID_API_KEY - The provided API key for AI service is invalid.
 * @property {string} AI_CONTEXT_LENGTH_EXCEEDED - The AI context length has been exceeded.
 * @property {string} AI_INVALID_JOB_LISTINGS - The AI returned invalid job listings.
 * @property {string} AI_INVALID_JSON - The AI returned invalid JSON.
 * @property {string} AI_INVALID_INPUT - The input provided to the AI is invalid.
 * @property {string} AI_CONFIG_ERROR - There is a configuration error with the AI service.
 *
 * @property {string} SCRAPER_NOT_FOUND - The scraper was not found.
 * @property {string} SCRAPER_BLOCKED - The scraper was blocked by the target site.
 * @property {string} SCRAPER_CAPTCHA_REQUIRED - A captcha is required to proceed with scraping.
 * @property {string} SCRAPER_SELECTOR_NOT_FOUND - The required selector was not found during scraping.
 * @property {string} SCRAPER_NAVIGATION_ERROR - An error occurred during navigation in scraping.
 * @property {string} SCRAPER_PARSE_ERROR - Failed to parse data during scraping.
 * @property {string} SCRAPER_PROXY_ERROR - There was a proxy error during scraping.
 * @property {string} SCRAPER_BROWSER_ERROR - The browser encountered an error during scraping.
 * @property {string} SCRAPER_LOGIN_REQUIRED - Login is required for scraping.
 * @property {string} SCRAPER_SESSION_EXPIRED - The scraper session has expired.
 * @property {string} SCRAPER_UNEXPECTED_STRUCTURE - The scraped page structure was unexpected.
 * @property {string} SCRAPER_DUPLICATE_JOB - The job found by the scraper is a duplicate.
 *
 * @property {string} BAD_REQUEST - The request is malformed or invalid.
 * @property {string} UNSUPPORTED_OPERATION - The operation is not supported.
 * @property {string} NOT_IMPLEMENTED - The operation is not implemented.
 * @property {string} INTERNAL_SERVER_ERROR - An internal server error occurred.
 * @property {string} CONFIG_ERROR - There is a configuration error.
 * @property {string} UNSUPPORTED_PROVIDER - The provider is not supported.
 * @property {string} UNKNOWN_ERROR - An unknown error occurred.
 * 
 * @property {string} SIGN_IN_ERROR - Sign-in process failed.
 * @property {string} SIGN_UP_ERROR - Sign-up process failed.
 * @property {string} SIGN_OUT_ERROR - Sign-out process failed.
 * @property {string} EMAIL_ALREADY_REGISTERED - The email is already registered.
 * @property {string} EMAIL_NOT_VERIFIED - The email address has not been verified.
 * @property {string} ACCOUNT_LOCKED - The user account is locked.
 * @property {string} PASSWORD_RESET_ERROR - Password reset process failed.
 * @property {string} PASSWORD_WEAK - The provided password is too weak.
 * @property {string} VERIFICATION_CODE_INVALID - The verification code provided is invalid.
 * @property {string} VERIFICATION_CODE_EXPIRED - The verification code has expired.
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

    // Scraper-specific errors
    SCRAPER_NOT_FOUND: 'SCRAPER_NOT_FOUND',
    SCRAPER_BLOCKED: 'SCRAPER_BLOCKED',
    SCRAPER_CAPTCHA_REQUIRED: 'SCRAPER_CAPTCHA_REQUIRED',
    SCRAPER_SELECTOR_NOT_FOUND: 'SCRAPER_SELECTOR_NOT_FOUND',
    SCRAPER_NAVIGATION_ERROR: 'SCRAPER_NAVIGATION_ERROR',
    SCRAPER_PARSE_ERROR: 'SCRAPER_PARSE_ERROR',
    SCRAPER_PROXY_ERROR: 'SCRAPER_PROXY_ERROR',
    SCRAPER_BROWSER_ERROR: 'SCRAPER_BROWSER_ERROR',
    SCRAPER_LOGIN_REQUIRED: 'SCRAPER_LOGIN_REQUIRED',
    SCRAPER_SESSION_EXPIRED: 'SCRAPER_SESSION_EXPIRED',
    SCRAPER_UNEXPECTED_STRUCTURE: 'SCRAPER_UNEXPECTED_STRUCTURE',
    SCRAPER_DUPLICATE_JOB: 'SCRAPER_DUPLICATE_JOB',

    // General
    BAD_REQUEST: 'BAD_REQUEST',
    UNSUPPORTED_OPERATION: 'UNSUPPORTED_OPERATION',
    NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    CONFIG_ERROR: 'CONFIG_ERROR',
    UNSUPPORTED_PROVIDER: 'UNSUPPORTED_PROVIDER',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',

    // Auth flow errors
    SIGN_IN_ERROR: 'SIGN_IN_ERROR',
    SIGN_UP_ERROR: 'SIGN_UP_ERROR',
    SIGN_OUT_ERROR: 'SIGN_OUT_ERROR',
    EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
    PASSWORD_RESET_ERROR: 'PASSWORD_RESET_ERROR',
    PASSWORD_WEAK: 'PASSWORD_WEAK',
    VERIFICATION_CODE_INVALID: 'VERIFICATION_CODE_INVALID',
    VERIFICATION_CODE_EXPIRED: 'VERIFICATION_CODE_EXPIRED'
};

module.exports = ERROR_TYPES;