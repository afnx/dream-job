const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/sign-in
router.post('/sign-in', authController.signInPasswordless);
// POST /api/auth/confirm
router.post('/confirm', authController.confirmSignIn);
// POST /api/auth/sign-out
router.post('/sign-out', authController.signOut);

module.exports = router;