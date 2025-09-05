const express = require('express');
const { validateSignIn, validateConfirmSignIn } = require('../middleware/validate-auth-input');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/sign-in
router.post('/sign-in', validateSignIn, authController.signInPasswordless);
// POST /api/auth/confirm
router.post('/confirm', validateConfirmSignIn, authController.confirmSignIn);
// POST /api/auth/sign-out
router.post('/sign-out', authController.signOut);
// GET /api/auth/me
router.get('/me', authController.getCurrentUser);

module.exports = router;