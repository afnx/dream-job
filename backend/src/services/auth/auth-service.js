const CognitoAuthClient = require('./cognito-auth-client');
const { ERROR_TYPES, AuthServiceError } = require('../../utils/errors');

/**
 * AuthService is responsible for managing authentication providers and returning the appropriate authentication client
 * based on the provided configuration. It supports multiple authentication providers and ensures that the service
 * is properly configured before use.
 *
 * @class
 * @param {Object} config - The configuration object for the authentication service.
 * @param {string} config.provider - The authentication provider to use (e.g., "cognito").
 * @throws {AuthServiceError} If the configuration is missing or invalid.
 *
 * @example
 * const authService = new AuthService({ provider: 'cognito', ...otherConfig });
 * const authClient = authService.getAuthClient();
 */
class AuthService {
    constructor(config) {
        if (!config || !config.provider) {
            throw new AuthServiceError(
                ERROR_TYPES.CONFIG_ERROR,
                "AuthService is not configured properly. Please provide a provider.",
                500
            );
        }
        this.config = config;
        this.authProvider = (this.config.provider || "").toLowerCase();
    }

    /**
     * Returns an authentication client instance based on the configured authentication provider.
     *
     * @throws {AuthServiceError} If the authentication provider is unsupported.
     * @returns {import('./auth-client')} An instance of the authentication client.
     */
    getAuthClient() {
        switch (this.authProvider) {
            case "cognito":
                return new CognitoAuthClient(this.config.cognito);
            default:
                throw new AuthServiceError(
                    ERROR_TYPES.UNSUPPORTED_PROVIDER,
                    `Unsupported Auth provider: ${this.authProvider}`,
                    400
                );
        }
    }
}

module.exports = AuthService;