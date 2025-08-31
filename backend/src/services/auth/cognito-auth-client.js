const {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    ConfirmSignUpCommand,
    GetUserCommand
} = require('@aws-sdk/client-cognito-identity-provider');

const AuthClient = require('./auth-client');
const { ERROR_TYPES, AuthServiceError } = require("../../utils/errors");


/**
 * CognitoAuthClient provides authentication methods using AWS Cognito.
 * Extends the AuthClient base class and implements passwordless sign-in,
 * user retrieval, and sign-up confirmation functionalities.
 *
 * @class
 * @extends AuthClient
 *
 * @param {Object} config - Configuration object.
 * @param {string} config.cognito_region - AWS Cognito region.
 * @param {string} config.cognito_client_id - AWS Cognito App Client ID.
 */
class CognitoAuthClient extends AuthClient {
    constructor(config) {
        super(config);
        if (!config || !config.cognito_region || !config.cognito_client_id) {
            throw new AuthServiceError(
                ERROR_TYPES.CONFIG_ERROR,
                'CognitoAuthService is not configured properly. Please provide cognito_region and cognito_client_id.',
                500
            );
        }

        this.client = new CognitoIdentityProviderClient({ region: config.cognito_region });
        this.clientId = config.cognito_client_id;
    }

    async signInPasswordless(email) {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: 'USER_AUTH',
                AuthParameters: {
                    USERNAME: email,
                    PREFERRED_CHALLENGE: 'EMAIL_OTP'
                },
                ClientId: this.clientId
            });

            const response = await this.client.send(command);
            return response;
        } catch (error) {
            throw new AuthServiceError(
                ERROR_TYPES.SIGN_IN_ERROR,
                'Sign-in failed: ' + error.message,
                500
            );
        }
    }

    async getUser(accessToken) {
        try {
            const command = new GetUserCommand({ AccessToken: accessToken });
            const response = await this.client.send(command);
            return response;
        } catch (error) {
            throw new AuthServiceError(
                ERROR_TYPES.GET_USER_ERROR,
                'Cannot retrieve your account information: ' + error.message,
                500
            );
        }

    }

    async confirmSignUp(email, code) {
        try {
            const command = new ConfirmSignUpCommand({
                ClientId: this.clientId,
                Username: email,
                ConfirmationCode: code
            });
            const response = await this.client.send(command);
            return response;
        } catch (error) {
            throw new AuthServiceError(
                ERROR_TYPES.CONFIRM_SIGN_UP_ERROR,
                'Sign-up confirmation failed: ' + error.message,
                500
            );
        }
    }
}

module.exports = CognitoAuthClient;