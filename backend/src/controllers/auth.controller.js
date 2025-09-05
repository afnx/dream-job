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

exports.confirmSignIn = async (req, res, next) => {
    try {
        const { email, code, session } = req.body;
        const authService = new AuthService(env.auth);
        const authClient = authService.getAuthClient();

        const result = await authClient.confirmSignIn(email, code, session);

        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: env.env === 'prod',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        success(res, result, 'Sign-in confirmed!');
    } catch (err) {
        next(err);
    }
};

exports.signOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies['accessToken'];
        const authService = new AuthService(env.auth);
        const authClient = authService.getAuthClient();

        const result = await authClient.signOut(accessToken);

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: env.env === 'prod',
            sameSite: 'none',
        });

        success(res, result, 'Sign-out successful!');
    } catch (err) {
        next(err);
    }
};

exports.getCurrentUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies['accessToken'];
        const authService = new AuthService(env.auth);
        const authClient = authService.getAuthClient();

        const user = await authClient.getUser(accessToken);
        success(res, user, 'User fetched successfully!');
    } catch (err) {
        next(err);
    }
};
