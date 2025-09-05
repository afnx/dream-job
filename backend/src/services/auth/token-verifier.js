const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { ERROR_TYPES, AuthServiceError } = require('../../utils/errors');

/**
 * Verifies a JWT using the specified provider.
 * @param {string} token - The JWT to verify.
 * @param {Object} config - The configuration object for the authentication service.
 * @param {string} config.provider - The authentication provider to use (e.g., "cognito").
 * @param {Object} config.cognito - The Cognito-specific configuration.
 * @returns {Promise<object>} Decoded payload.
 */
async function verifyToken(token, config) {

    switch (config.provider) {
        case 'cognito':
            return await verifyCognitoToken(token, config.cognito);
        default:
            throw new AuthServiceError(
                ERROR_TYPES.UNSUPPORTED_PROVIDER,
                `Unsupported Auth provider: ${config.provider}`,
            );
    }
}

async function verifyCognitoToken(token, config) {
    try {
        const verifier = CognitoJwtVerifier.create({
            userPoolId: config.userPoolId,
            tokenUse: 'access',
            clientId: config.clientId,
        });

        return await verifier.verify(token);
    } catch {
        // Token verification failed
        return null;
    }
}

module.exports = { verifyToken };