const { verifyToken } = require('../services/auth/token-verifier');
const config = require('../config/env');
const { ERROR_TYPES, AuthServiceError } = require('../utils/errors/index');


exports.authenticate = async (req, res, next) => {
    const token = req.cookies['accessToken'];

    if (!token) {
        return next(
            new AuthServiceError(
                ERROR_TYPES.UNAUTHORIZED,
                'Please sign in to continue.',
            ),
        );
    }

    const payload = await verifyToken(token, config.auth);

    if (!payload) {
        return next(
            new AuthServiceError(
                ERROR_TYPES.UNAUTHORIZED, 'Your session has expired or the token is invalid. Please sign in again.',
            ),
        );
    }

    req.user = payload;
    next();
};