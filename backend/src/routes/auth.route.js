const express = require('express');
const authController = require('../controllers/auth.controller');
const config = require('../config/env');


if (config.auth.provider && config.auth.provider !== 'none') {
    const router = express.Router();

    router.post('/sign-in', authController.signInPasswordless);
    router.post('/confirm', authController.confirmSignIn);
    router.post('/sign-out', authController.signOut);
}