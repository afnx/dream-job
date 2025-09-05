const {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    RespondToAuthChallengeCommand,
    GetUserCommand,
    GlobalSignOutCommand,
    SignUpCommand
} = require('@aws-sdk/client-cognito-identity-provider');

const AuthClient = require('./auth-client');
const { ERROR_TYPES, AuthServiceError } = require("../../utils/errors");
const { hmacSha256Base64, generateRandomPassword } = require('../../utils/hash/index');


/**
 * CognitoAuthClient provides authentication methods using AWS Cognito.
 * Extends the AuthClient base class and implements passwordless sign-in,
 * user retrieval, and sign-up confirmation functionalities.
 *
 * @class
 * @extends AuthClient
 *
 * @param {Object} config - Configuration object.
 * @param {string} config.region - AWS Cognito region.
 * @param {string} config.clientId - AWS Cognito App Client ID.
 * @param {string} config.clientSecret - AWS Cognito App Client Secret.
 */
class CognitoAuthClient extends AuthClient {
    constructor(config) {
        super(config);
        if (!config || !config.region || !config.userPoolId || !config.clientId || !config.clientSecret) {
            throw new AuthServiceError(
                ERROR_TYPES.CONFIG_ERROR,
                'CognitoAuthService is not configured properly. Please provide region, userPoolId, clientId, and clientSecret.',
                500
            );
        }

        this.client = new CognitoIdentityProviderClient({ region: config.region });
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
    }

    async signInPasswordless(email) {
        try {
            const secretHash = hmacSha256Base64(email + this.clientId, this.clientSecret);
            const password = generateRandomPassword(16);

            const command = new SignUpCommand({
                ClientId: this.clientId,
                SecretHash: secretHash,
                Username: email,
                Password: password,
                UserAttributes: [{ Name: 'email', Value: email }]
            });

            await this.client.send(command);
        } catch (error) {
            if (error.name !== "UsernameExistsException") {
                throw new AuthServiceError(
                    ERROR_TYPES.SIGN_IN_ERROR,
                    'Sign-in failed: ' + error.message,
                    500
                );
            }
        }

        try {
            const secretHash = hmacSha256Base64(email + this.clientId, this.clientSecret);
            const command = new InitiateAuthCommand({
                AuthFlow: 'USER_AUTH',
                AuthParameters: {
                    USERNAME: email,
                    PREFERRED_CHALLENGE: 'EMAIL_OTP',
                    SECRET_HASH: secretHash
                },
                ClientId: this.clientId
            });

            const initRes = await this.client.send(command);

            // If successful, return the email and session
            return { email: email, session: initRes.Session };
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
            return { email: response.Username, accessToken: accessToken };
        } catch (error) {
            throw new AuthServiceError(
                ERROR_TYPES.INTERNAL_SERVER_ERROR,
                'Cannot retrieve your account information: ' + error.message,
                500
            );
        }

    }

    async confirmSignIn(email, code, session) {
        try {
            const secretHash = hmacSha256Base64(email + this.clientId, this.clientSecret);
            const command = new RespondToAuthChallengeCommand({
                ClientId: this.clientId,
                ChallengeName: "EMAIL_OTP",
                Session: session,
                ChallengeResponses: {
                    "EMAIL_OTP_CODE": code,
                    "USERNAME": email,
                    "SECRET_HASH": secretHash
                }
            });

            const response = await this.client.send(command);
            const { AuthenticationResult } = response;

            return { email: email, accessToken: AuthenticationResult.AccessToken };
        } catch (error) {
            throw new AuthServiceError(
                ERROR_TYPES.SIGN_IN_ERROR,
                'Sign-in confirmation failed: ' + error.message,
                500
            );
        }
    }

    async signOut(accessToken) {
        try {
            const command = new GlobalSignOutCommand({ AccessToken: accessToken });
            const response = await this.client.send(command);
            return response;
        } catch (error) {
            throw new AuthServiceError(
                ERROR_TYPES.SIGN_OUT_ERROR,
                'Sign-out failed: ' + error.message,
                500
            );
        }
    }
}

module.exports = CognitoAuthClient;