const express = require('express');
const { validateUserInput } = require('../middleware/validate-input');
const { getJobs } = require('../controllers/jobs.controller');

const router = express.Router();

// POST /api/jobs/parse
router.post("/parse", validateUserInput, getJobs);

module.exports = router;