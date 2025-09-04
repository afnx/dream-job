const express = require('express');
const { validateUserInput } = require('../middleware/validate-input');
const { authenticate } = require('../middleware/authenticate');
const { searchJobs } = require('../controllers/jobs.controller');
const config = require('../config/env');

const router = express.Router();

// POST /api/jobs/parse
const middlewares = [validateUserInput, searchJobs];
if (config.auth.provider && config.auth.provider !== 'none') {
    middlewares.unshift(authenticate);
}
router.post("/parse", ...middlewares);

module.exports = router;