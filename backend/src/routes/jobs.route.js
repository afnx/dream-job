const express = require('express');
const { validateUserInput } = require('../middleware/validate-input');
const { searchJobs } = require('../controllers/jobs.controller');

const router = express.Router();

// POST /api/jobs/parse
router.post("/parse", validateUserInput, searchJobs);

module.exports = router;