const AuthService = require('../services/auth/auth-service');
const { success } = require('../utils/helpers/response-helper');
const env = require('../config/env');

exports.signInPasswordless = async (req, res, next) => {
    try {
        const { email } = req.body;
        const authService = new AuthService(env.auth);
        const authClient = authService.getAuthClient();

        const result = await authClient.signInPasswordless(email);
        success(res, result, 'Sign-in link sent!');
    } catch (err) {
        next(err);
    }
};

exports.confirmSignUp = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const authService = new AuthService(env.auth);
        const authClient = authService.getAuthClient();

        const result = await authClient.confirmSignUp(email, code);
        success(res, result, 'Sign-up confirmed!');
    } catch (err) {
        next(err);
    }
};

exports.signOut = async (req, res, next) => {
    try {
        const { accessToken } = req.body;
        const authService = new AuthService(env.auth);
        const authClient = authService.getAuthClient();

        const result = await authClient.signOut(accessToken);
        success(res, result, 'Sign-out successful!');
    } catch (err) {
        next(err);
    }
};