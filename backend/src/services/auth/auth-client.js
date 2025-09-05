const { ERROR_TYPES, AuthServiceError } = require('../../utils/errors');


/**
 * Abstract base class for authentication clients.
 * Subclasses should implement authentication methods for specific providers.
 *
 * @class
 * @abstract
 * @param {Object} config - Configuration object for the authentication client.
 * @throws {AuthServiceError} If the configuration object is not provided.
 */
class AuthClient {
    constructor(config) {
        if (!config) {
            throw new AuthServiceError(ERROR_TYPES.CONFIG_ERROR, "AuthClient requires a configuration object.", 500);
        }
        this.config = config;
    }

    /**
     * Initiates a passwordless sign-in process for the given email address.
     *
     * @param {string} _email - The email address of the user attempting to sign in.
     * @throws {AuthServiceError} Throws if the method is not implemented.
     * @returns {Promise<void>}
     */
    async signInPasswordless(_email) {
        throw new AuthServiceError(ERROR_TYPES.NOT_IMPLEMENTED, "signInPasswordless() must be implemented by subclass", 501);
    }

    /**
     * Retrieves the user associated with the provided access token.
     *
     * @param {string} _accessToken - The access token used to identify the user.
     * @throws {AuthServiceError} Throws if the method is not implemented.
     * @returns {Promise<Object>} A promise that resolves to the user object.
     */
    async getUser(_accessToken) {
        throw new AuthServiceError(ERROR_TYPES.NOT_IMPLEMENTED, "getUser() must be implemented by subclass", 501);
    }

    /**
     * Confirms a user's sign in with the provided email and confirmation code.
     *
     * @param {string} _email - The email address of the user to confirm.
     * @param {string} _code - The confirmation code sent to the user's email.
     * @param {string} _session - The session identifier from the initial sign-in attempt.
     * @throws {AuthServiceError} Throws if the method is not implemented by a subclass.
     * @returns {Promise<void>} Resolves when the sign in is confirmed.
     */
    async confirmSignIn(_email, _code, _session) {
        throw new AuthServiceError(ERROR_TYPES.NOT_IMPLEMENTED, "confirmSignIn() must be implemented by subclass", 501);
    }


    /**
     * Signs out the user associated with the provided access token.
     * This method must be implemented by subclasses.
     *
     * @param {string} _accessToken - The access token of the user to sign out.
     * @throws {AuthServiceError} Throws if the method is not implemented.
     * @returns {Promise<void>}
     */
    async signOut(_accessToken) {
        throw new AuthServiceError(ERROR_TYPES.NOT_IMPLEMENTED, "signOut() must be implemented by subclass", 501);
    }
}

module.exports = AuthClient;