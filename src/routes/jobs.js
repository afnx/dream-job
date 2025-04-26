const express = require('express');
const router = express.Router();
const { getJobs } = require('../controllers/jobsController');

router.get('/', getJobs);

module.exports = router;